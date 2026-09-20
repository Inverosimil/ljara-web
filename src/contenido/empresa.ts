// Contenido del sitio.
//
// Tres estados posibles en este archivo:
//
//   ✅ confirmado   — dato entregado por la empresa. Se puede publicar.
//   ✏️ borrador     — redactado a partir del levantamiento. Falta que la empresa lo apruebe,
//                     pero se puede mostrar: no afirma nada que no esté en `perfil-empresa.md`.
//   [entre corchetes] — PLACEHOLDER. Dato que todavía no existe. No debe salir a producción.
//
// Fuente de los datos confirmados: `docs/negocio/perfil-empresa.md`.

export const EMPRESA = {
  /* ✅ Decidido el 2026-09-06 (cuestionario, pregunta 11): **«L.Jara» manda**, en el logo y
     también en los textos. En el día a día la empresa es «Distribuidora Luis Jara», así que
     el nombre corto es una decisión de marca, no un descuido. */
  nombre: "L.Jara",
  /* ⚠️ RAZÓN SOCIAL, no nombre de marca. Orden por confirmar: la empresa recordó
     «Comercializadora y Distribuidora Luis Jara y Compañía SpA», que invierte las dos
     primeras palabras respecto a esto. Hay que copiarlo de una factura antes de publicar.

     Desde la decisión de arriba **no se usa en los textos**: su lugar es el bloque legal
     —facturas, términos, el pie cuando exista— y ahí sí tiene que ser la exacta. */
  nombreLargo: "Distribuidora y Comercializadora Luis Jara y Compañía",
  bajada: "Bebidas con y sin alcohol",

  /* ✅ Elegida el 2026-09-06. Antes era un placeholder, y era lo primero que se leía.
   *
   * ⚠️ No promete nada que la empresa no pueda sostener, y eso es deliberado: la entrega el
   * mismo día es lo que más valoran los clientes **y** lo que el propio levantamiento
   * describe como no sostenible hoy —reparto atrasado, jornadas hasta las diez—. Una portada
   * que prometiera rapidez pondría al sitio a vender justo lo que está en revisión.
   *
   * Lo que sí afirma —que son el proveedor de siempre— se apoya en dos cosas del
   * levantamiento: la relación histórica es una de las razones por las que le compran, y el
   * foco de la empresa hoy es retener, no captar. */
  claim: "Tu proveedor de siempre",

  // ✏️ borrador
  descripcionCorta:
    "Distribuidora de bebidas con y sin alcohol en el sector poniente de Santiago. " +
    "Abastecemos almacenes, botillerías y negocios de barrio.",
  // ✏️ borrador
  descripcionLarga:
    "Empezamos con Luis Jara y su camioneta. Hoy trabajamos desde Pudahuel, con bodega " +
    "y reparto propio, para abastecer a los negocios del sector poniente de Santiago. " +
    "La relación con nuestros clientes sigue siendo directa: de persona a persona.",

  fundacion: "[año]", // ≈ 2016–2019 según la empresa; falta el año exacto
  ubicacion: "Bodega San Francisco, Pudahuel", // ✅ sector confirmado; dirección exacta pendiente
  cobertura: "Sector poniente de Santiago", // ✅
  cantidadProductos: "900+", // dato real: 955 registros en el export

  // ✏️ borrador. Los tres salen del levantamiento: rapidez (lo que más valoran los
  // clientes), variedad y trato directo.
  //
  // ⚠️ Al reescribir estos textos: la cercanía se comunica como trato directo, NUNCA como
  // promesa de condiciones especiales. Hay clientes con condiciones particulares y no todos
  // las justifican. Ver `perfil-empresa.md`, bloque 5.
  diferenciales: [
    {
      titulo: "Entrega rápida",
      detalle:
        "Reparto propio con cuatro vehículos. Es lo que más valoran los clientes que " +
        "llevan años con nosotros.",
    },
    {
      titulo: "Catálogo amplio",
      detalle:
        "Más de 900 productos entre bebidas, cervezas, vinos y destilados. Un solo " +
        "proveedor para todo el mostrador.",
    },
    {
      titulo: "Trato directo",
      detalle:
        "Hablas con quien despacha. Sin ejecutivo de cuenta ni central telefónica: el " +
        "pedido lo toma alguien que conoce tu local.",
    },
  ],

  contacto: {
    telefono: "[+56 9 XXXX XXXX]",
    email: "[contacto@ejemplo.cl]", // hay dominio comprado; los correos no están estandarizados
    direccion: "[Calle Número], Bodega San Francisco, Pudahuel, Región Metropolitana",
    horario: "[Lun a Vie, 09:00–18:00]",
    // 🔴 BLOQUEA EL LANZAMIENTO. Es el único canal de contacto del sitio: sin este número
    // el botón de pedido no lleva a ninguna parte.
    whatsapp: "[+56 9 XXXX XXXX]",
  },
} as const;

/** Historia de la empresa, para la página Nosotros.
 *
 *  ✏️ Textos en borrador, redactados desde el levantamiento. Los años siguen pendientes:
 *  la empresa sitúa la fundación hace 7 a 10 años, sin precisar. */
export const HISTORIA = [
  {
    ano: "El comienzo",
    titulo: "Una camioneta y las ganas",
    texto: "Luis Jara comenzó comprando bebidas y recorriendo los negocios con su propia camioneta. Así nacieron las primeras relaciones con los clientes.",
  },
  {
    ano: "El crecimiento",
    titulo: "Más espacio, la misma cercanía",
    texto: "Con el tiempo llegaron la bodega, los vehículos de reparto y la compra directa a grandes proveedores del rubro.",
  },
  {
    ano: "Hoy",
    titulo: "Seguimos en tu barrio",
    texto: "Desde Pudahuel, abastecemos a almacenes, botillerías y pequeños comercios del sector poniente de Santiago.",
  },
] as const;

/** Textos editoriales basados en el perfil de empresa, sin prometer plazos ni stock. */
export const PILARES = [
  { icono: "reparto", titulo: "Reparto propio", texto: "Cuatro vehículos y una bodega en Pudahuel para coordinar el reparto de tus pedidos." },
  { icono: "catalogo", titulo: "Variedad para tu negocio", texto: "Bebidas, aguas, jugos, cervezas, vinos y destilados. Revisa los productos y sus formatos en un solo lugar." },
  { icono: "trato", titulo: "Trato directo", texto: "Conversa con nuestro equipo para consultar productos, revisar tu pedido y coordinar la entrega." },
  { icono: "stock", titulo: "Cerca de tu local", texto: "Trabajamos en Pudahuel, Lo Prado, Estación Central y sectores cercanos del poniente de Santiago." },
] as const;

/** Cobertura confirmada; frecuencia y día se coordinan con el vendedor. */
export const COBERTURA_PUBLICA = {
  comunas: ["Pudahuel", "Lo Prado", "Estación Central"],
  consulta: "Para Maipú y otros sectores cercanos, consulta la cobertura al coordinar tu pedido.",
} as const;

/** Zonas de reparto, para el mapa de cobertura.
 *  El radio está en km desde la bodega y define el anillo que se dibuja.
 *
 *  ✅ Las comunas son las reales: sector poniente de Santiago.
 *  🔴 Las FRECUENCIAS siguen pendientes — es el dato que le da sentido al mapa, porque al
 *     cliente le importa qué día pasa el camión, no la distancia.
 *
 *  ⚠️ El agrupamiento en tres anillos es provisorio. Lo único que la empresa precisó es que
 *     Maipú se atiende «en menor medida» que el resto; que Pudahuel, Lo Prado y Estación
 *     Central compartan frecuencia es un supuesto que hay que confirmar. */
export const ZONAS_REPARTO = [
  {
    id: "diaria",
    radioKm: 15,
    etiqueta: "[Frecuencia]",
    frecuencia: "[Cada cuánto pasa el camión]",
    comunas: ["Pudahuel", "Lo Prado", "Estación Central"],
  },
  {
    id: "frecuente",
    radioKm: 40,
    etiqueta: "[Frecuencia]",
    frecuencia: "[Cada cuánto pasa el camión]",
    comunas: ["Maipú"],
  },
  {
    id: "semanal",
    radioKm: 80,
    etiqueta: "[Frecuencia]",
    frecuencia: "[Cada cuánto pasa el camión]",
    comunas: ["[Otras comunas del sector poniente]"],
  },
] as const;

/** Pasos para hacer un pedido.
 *  Refleja el flujo del ADR-0004 y ADR-0005: carrito local → WhatsApp → el vendedor
 *  confirma disponibilidad. El sitio no confirma stock ni precio: no los conoce. */
export const COMO_PEDIR = [
  { titulo: "Elige tus productos", texto: "Explora el catálogo, abre cada ficha y selecciona el formato y la cantidad que necesitas." },
  { titulo: "Revisa tu pedido", texto: "Comprueba las cantidades e indica tu nombre o local y la fecha de entrega que prefieres." },
  { titulo: "Compártelo por WhatsApp", texto: "Abre el mensaje preparado y envíalo a nuestro equipo. También puedes copiarlo para compartirlo." },
  { titulo: "Coordinamos contigo", texto: "Te confirmamos precio, disponibilidad y día de entrega por el mismo canal." },
] as const;

/** Fotos del sitio. Hoy apuntan a `public/temporal/`, que son imágenes de relleno.
 *  El `alt` describe qué foto real debe ir en cada lugar. */
export const FOTOS_CONFIRMADAS = false;

export const FOTOS = {
  banner: {
    src: "/temporal/banner-hero.jpg",
    alt: "[Plano amplio de la bodega o del frente con los camiones]",
  },
  bodegaPasillo: {
    src: "/temporal/bodega-pasillo.jpg",
    alt: "[Pasillo entre racks con cajas apiladas]",
  },
  bodegaCarga: {
    src: "/temporal/bodega-carga.jpg",
    alt: "[Andén de carga con pallets y transpaleta]",
  },
  camion: {
    src: "/temporal/camion-reparto.jpg",
    alt: "[Camión de reparto con el logo]",
  },
  equipo: {
    src: "/temporal/equipo.jpg",
    alt: "[El equipo trabajando en bodega o en ruta]",
  },
  fachada: {
    src: "/temporal/fachada.jpg",
    alt: "[Frente del local con la dirección visible]",
  },
  mostrador: {
    src: "/temporal/mostrador.jpg",
    alt: "[Atención a cliente en el mesón]",
  },
  detalle: {
    src: "/temporal/detalle-producto.jpg",
    alt: "[Detalle cercano de cajas, botellas o chapas]",
  },
} as const;

/** Marcas que aparecen en el catálogo. Inferidas del export: son las que más se repiten,
 *  no una lista oficial de representaciones.
 *
 *  🔴 NO PUBLICAR SIN CONFIRMAR. La empresa confirmó que le compra a Coca-Cola, CCU y otras
 *  grandes, pero comprarle a una marca no da derecho a exhibir su nombre ni su logo. Hay que
 *  chequear cuáles se pueden mostrar antes de que el sitio salga a producción. */
export const MARCAS_DESTACADAS = [
  "Coca-Cola",
  "Pepsi",
  "CCU",
  "Watts",
  "Cachantún",
  "Kunstmann",
  "Escudo",
  "Mistral",
  "Gato",
  "Misiones de Rengo",
  "Johnnie Walker",
  "Bilz y Pap",
] as const;
