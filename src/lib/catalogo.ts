import "server-only";
import { ORDEN_POR_DEFECTO, POR_PAGINA, type Orden } from "./catalogo-opciones";
export { ORDENES, ORDEN_POR_DEFECTO, POR_PAGINA, esOrden, type Orden } from "./catalogo-opciones";
import { clienteSitio } from "@/lib/supabase";
import type { ProductoMuestra } from "@/contenido/productos-muestra";

/* Acceso al catálogo. **Este es el único lugar que sabe de dónde salen los
 * productos**, y desde el 2026-09-05 salen de la base de datos.
 *
 * El tipo se sigue llamando `ProductoMuestra` por historia: nació como la forma
 * de la maqueta y hoy es el contrato de producto del sitio. Lo que cambió es de
 * dónde se llena, no qué contiene, así que la ficha, el catálogo y el carrito no
 * se enteraron.
 *
 * ⚠️ Estas funciones corren en el SERVIDOR. El carrito no puede esperar a una
 * promesa mientras resuelve sus líneas, así que lo que necesita se le entrega a
 * `lib/almacen-catalogo`, que es lo que consulta el cliente.
 *
 * ⚠️ Desde el 2026-09-06 **la base filtra, ordena y pagina**. Antes se traía el
 * catálogo publicado entero y el trabajo lo hacía el navegador: con 50 productos
 * daba igual y con 955 sería traer todo el maestro para pintar veinticuatro
 * tarjetas. */

/* Qué ve `anon`, y por qué puede venir vacío.
 *
 * Las políticas de la migración `0005` solo dejan leer `producto` con
 * `publicado = true` y `estado = 'activo'`. De los 922 activos hay 50
 * publicados —los que recibieron foto de prueba el 2026-09-05—; el resto espera
 * a que el negocio decida el criterio (PEND-004). Si un día vuelve a devolver
 * cero filas, no es un fallo: el sitio lo dice y no inventa productos. */
const CAMPOS = `
  id, codigo_autoventa, nombre, nombre_original, contenido_ml, envase,
  retornable, grado_alcoholico, descripcion,
  categoria:categoria_id CRUCE ( slug, nombre ),
  formato ( tipo, unidades, confianza ),
  imagen ( ruta, alt, orden )
`;

type FilaProducto = {
  id: number;
  codigo_autoventa: string | null;
  nombre: string;
  nombre_original: string | null;
  contenido_ml: number | null;
  envase: string | null;
  retornable: boolean | null;
  grado_alcoholico: number | null;
  descripcion: string | null;
  categoria: { slug: string; nombre: string } | null;
  formato: { tipo: string; unidades: number | null; confianza: string }[];
  imagen: { ruta: string; alt: string | null; orden: number }[];
};

/** Una foto del producto, ya resuelta a URL pública. */
export type FotoProducto = {
  url: string;
  /** Vacío si nadie la describió. No se inventa: ver `aProducto`. */
  alt: string;
};

/** Un producto del sitio, con su galería si la tiene.
 *
 *  `imagenes` y `descripcion` van aparte de `ProductoMuestra` y no dentro: ese
 *  tipo lo genera el script de la maqueta y `/design-system` lo sigue usando sin
 *  fotos ni texto. Por eso la tarjeta y la ficha ampliada los declaran
 *  opcionales.
 *
 *  **La primera de `imagenes` es la principal.** No hay campo que lo diga: la
 *  base ordena por `orden` y la de menor orden manda (migración 0022). Una
 *  segunda fuente para el mismo hecho podría contradecir a la primera. */
export type ProductoSitio = ProductoMuestra & {
  categoriaNombre: string | null;
  imagenes: FotoProducto[];
  descripcion: string | null;
  /* ⚠️ `retornable` admite NULL y eso es deliberado: 225 productos del export no
   * declaran si el envase vuelve. NULL es «no consta», no «no». La ficha no
   * pinta esa fila cuando es nulo — decir «No» sería afirmar algo que no está. */
  retornable: boolean | null;
  gradoAlcoholico: number | null;
};

/* La URL pública del bucket. Se arma acá y no se guarda en la base: la fila
 * tiene la ruta, y el dominio del proyecto no tiene por qué estar escrito 922
 * veces. */
function urlPublica(ruta: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/ljara-productos/${ruta}`;
}

/* El factor de caja que se le ofrece a un cliente.
 *
 * ⚠️ Solo el CONFIRMADO. Un factor `derivado_del_nombre` salió del patrón
 * `<volumen>X<unidades>` del nombre del ERP y nadie lo verificó: ofrecer una
 * caja con ese número haría que alguien pidiera una cantidad distinta de la que
 * cree. ADR-0007 dice que la caja solo se ofrece cuando se SABE de cuántas
 * unidades es, y deducido no es saber.
 *
 * La consecuencia visible es que muchos productos se ofrecen solo por unidad
 * hasta que alguien confirme su factor en la plataforma interna. Es el
 * comportamiento correcto: `formatosDisponibles()` en `lib/pedido.ts` ya cae a
 * «solo unidad» cuando esto viene nulo. */
function factorDeCaja(formatos: FilaProducto["formato"]): number | null {
  const caja = formatos.find(
    (f) => f.tipo === "caja" && f.confianza === "confirmado" && f.unidades,
  );
  return caja?.unidades ?? null;
}

function aProducto(f: FilaProducto): ProductoSitio {
  /* Ordenadas acá y no en la consulta: PostgREST admite `order` dentro del embed,
   * pero entonces el orden de la galería quedaría escrito en la cadena de campos
   * y no en el único sitio que lo explica. La primera es la principal. */
  const fotos = [...(f.imagen ?? [])].sort((a, b) => a.orden - b.orden);
  return {
    // El id del sitio es texto porque el pedido lo guarda en localStorage.
    id: String(f.id),
    codigo: f.codigo_autoventa ?? "",
    nombre: f.nombre,
    nombreOriginal: f.nombre_original ?? f.nombre,
    // El slug de la categoría es la clave del filtro. Sin categoría, «otro».
    categoria: (f.categoria?.slug ?? "otro") as ProductoMuestra["categoria"],
    categoriaNombre: f.categoria?.nombre ?? null,
    contenidoMl: f.contenido_ml,
    pack: factorDeCaja(f.formato),
    envase: f.envase,
    // El ERP traía una «unidad de medida» que el modelo no guarda: la unidad es
    // la base y las agrupaciones son formatos (ADR-0007).
    unidadMedida: null,
    /* Sin alt inventado: si nadie describió la foto, el `alt` va vacío y el
     * lector de pantalla la salta. Anunciar «imagen de <nombre>» no aporta nada
     * que el título de al lado no diga ya. */
    imagenes: fotos.map((i) => ({ url: urlPublica(i.ruta), alt: i.alt ?? "" })),
    descripcion: f.descripcion,
    retornable: f.retornable,
    gradoAlcoholico: f.grado_alcoholico,
  };
}

// ---------------------------------------------------------------------------
// La consulta
// ---------------------------------------------------------------------------

export type ConsultaCatalogo = {
  pagina?: number;
  categoria?: string | null;
  busqueda?: string;
  orden?: Orden;
};

export type PaginaCatalogo = {
  productos: ProductoSitio[];
  /** Cuántos hay en total con estos filtros, no cuántos vinieron. */
  total: number;
  pagina: number;
  paginas: number;
};

/* El término, como lo guarda la base.
 *
 * `nombre_busqueda` es el nombre y el código en minúsculas y sin diacríticos
 * (migración 0024), así que el término hay que dejarlo igual antes de comparar.
 * Y `%` y `_` son comodines de LIKE: sin escapar, buscar «100%» traería todo. */
function terminoIlike(bruto: string): string {
  const plano = bruto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[%_\\]/g, (c) => `\\${c}`);
  return `%${plano}%`;
}

export async function listarProductos(
  consulta: ConsultaCatalogo = {},
): Promise<PaginaCatalogo> {
  const supabase = clienteSitio();

  const categoria = consulta.categoria || null;
  const busqueda = consulta.busqueda?.trim() ?? "";
  const orden = consulta.orden ?? ORDEN_POR_DEFECTO;

  /* `!inner` solo cuando se filtra por categoría. Dejarlo siempre convertiría el
   * embed en un JOIN interno y los productos sin categoría desaparecerían del
   * catálogo sin que nadie lo hubiera pedido. */
  const campos = CAMPOS.replace("CRUCE", categoria ? "!inner" : "");

  let q = supabase
    .schema("ljara")
    .from("producto")
    .select(campos, { count: "exact" });

  if (categoria) q = q.eq("categoria.slug", categoria);
  if (busqueda) q = q.ilike("nombre_busqueda", terminoIlike(busqueda));

  switch (orden) {
    case "nombre-desc":
      q = q.order("nombre", { ascending: false });
      break;
    case "categoria":
      // PostgREST sí ordena el padre por una columna de la relación uno-a-uno.
      // El nombre queda de desempate para que dentro de cada categoría no salga
      // en un orden distinto en cada carga.
      q = q.order("categoria.nombre").order("nombre");
      break;
    case "contenido-asc":
    case "contenido-desc":
      /* Sin contenido conocido va al final, ordene como ordene: un producto sin
       * dato no es «el más chico». */
      q = q
        .order("contenido_ml", {
          ascending: orden === "contenido-asc",
          nullsFirst: false,
        })
        .order("nombre");
      break;
    default:
      q = q.order("nombre");
  }

  const pagina = Math.max(1, Math.floor(consulta.pagina ?? 1));
  const desde = (pagina - 1) * POR_PAGINA;
  const { data, error, count } = await q.range(desde, desde + POR_PAGINA - 1);

  // Un catálogo que no se pudo leer no es un catálogo vacío. Se propaga para que
  // la página falle a la vista en vez de mostrar cero productos como si fuera el
  // dato real.
  if (error) throw error;

  const total = count ?? 0;
  return {
    productos: ((data ?? []) as unknown as FilaProducto[]).map(aProducto),
    total,
    pagina,
    paginas: Math.max(1, Math.ceil(total / POR_PAGINA)),
  };
}

/** Los productos que el pedido tiene guardados, por id.
 *
 *  Existe porque el carrito guarda ids y el catálogo ya no viene entero: una
 *  línea puede apuntar a un producto que no está en la página que se está
 *  mirando. Los que no vuelven es que dejaron de estar publicados, y esa línea
 *  se descarta sola. */
export async function productosPorId(ids: string[]): Promise<ProductoSitio[]> {
  const numeros = ids.map(Number).filter((n) => Number.isInteger(n) && n > 0);
  if (numeros.length === 0) return [];

  const supabase = clienteSitio();
  const { data, error } = await supabase
    .schema("ljara")
    .from("producto")
    .select(CAMPOS.replace("CRUCE", ""))
    .in("id", numeros);

  if (error) throw error;
  return ((data ?? []) as unknown as FilaProducto[]).map(aProducto);
}

/** Cuántos productos publicados hay en total, sin traer ninguno. */
export async function contarPublicados(): Promise<number> {
  const supabase = clienteSitio();
  const { count, error } = await supabase
    .schema("ljara")
    .from("producto")
    .select("id", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}

/** Cuántos publicados tiene cada categoría, por slug.
 *
 *  Sale de la vista `conteo_categoria` (migración 0025) y no de contar en el
 *  navegador: contar acá exigiría traer el catálogo entero para pintar nueve
 *  números. La vista es `security_invoker`, así que `anon` cuenta exactamente lo
 *  que puede ver — si contara lo no publicado, el inicio anunciaría un surtido
 *  que al entrar no está. */
export async function contarPorCategoria(): Promise<Record<string, number>> {
  const supabase = clienteSitio();
  const { data, error } = await supabase
    .schema("ljara")
    .from("conteo_categoria")
    .select("slug, total");

  if (error) throw error;
  return Object.fromEntries((data ?? []).map((c) => [c.slug, c.total]));
}

export type CategoriaSitio = { id: string; etiqueta: string };

/** Las categorías tal como las nombró el negocio, en su propio orden. */
export async function listarCategorias(): Promise<CategoriaSitio[]> {
  const supabase = clienteSitio();
  const { data, error } = await supabase
    .schema("ljara")
    .from("categoria")
    .select("slug, nombre, orden")
    .order("orden")
    .order("nombre");

  if (error) throw error;

  return (data ?? []).map((c) => ({ id: c.slug, etiqueta: c.nombre }));
}

/** Vista pequeña de portada: solo productos e imágenes que puede leer el público.
 * No implica oferta, recomendación ni disponibilidad. Nunca trae el maestro completo. */
export async function productosPortada(): Promise<ProductoSitio[]> {
  const { data, error } = await clienteSitio()
    .schema("ljara")
    .from("producto")
    .select(CAMPOS.replace("CRUCE", "").replace("imagen (", "imagen!inner ("))
    .order("id")
    .limit(3);
  if (error) throw error;
  return ((data ?? []) as unknown as FilaProducto[]).map(aProducto);
}
