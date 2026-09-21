import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogo } from "@/componentes/sitio/Catalogo";
import { PieDePagina } from "@/componentes/sitio/Bloques";
import { Seccion } from "@/componentes/ui";
import { EMPRESA } from "@/contenido/empresa";
import {
  ORDEN_POR_DEFECTO,
  esOrden,
  listarCategorias,
  listarProductos,
  productoPorId,
} from "@/lib/catalogo";
import { categoriaEtiqueta, contenido } from "@/lib/formato";
import { idDeProducto, rutaProducto } from "@/lib/producto-url";

/* La metadata depende de si hay una ficha abierta.
 *
 * ⚠️ Esta es la razón por la que el producto va en un parámetro y no en un `#`:
 * el navegador no envía el `#` al servidor, así que con un ancla esta función
 * no tendría forma de saber qué producto responder y compartir un producto
 * mostraría siempre la imagen del catálogo. */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Parametros;
}): Promise<Metadata> {
  const { producto: pedido } = await searchParams;
  const id = idDeProducto(pedido);
  const producto = id ? await productoPorId(id) : null;

  if (!producto) {
    return {
      title: "Catálogo",
      description: `Catálogo de bebidas con y sin alcohol de ${EMPRESA.nombre}.`,
    };
  }

  const detalle = [
    producto.categoriaNombre || categoriaEtiqueta(producto.categoria),
    producto.contenidoMl != null ? contenido(producto.contenidoMl) : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const descripcion =
    producto.descripcion ||
    `${producto.nombre}${detalle ? ` — ${detalle}` : ""}. Consulta precio y disponibilidad con ${EMPRESA.nombre}.`;

  return {
    title: producto.nombre,
    description: descripcion,
    /* La canónica lleva SOLO el producto: `?producto=239&categoria=vino&p=2` y
       `?producto=239` muestran la misma ficha, y sin esto un buscador vería una
       dirección distinta por cada combinación de filtros desde la que alguien
       compartió el enlace. */
    alternates: { canonical: rutaProducto(producto.id) },
    openGraph: {
      type: "website",
      title: producto.nombre,
      description: descripcion,
      url: rutaProducto(producto.id),
      /* La imagen la compone una ruta aparte: `opengraph-image` solo recibe los
         segmentos de la dirección, nunca los parámetros, así que no puede saber
         qué producto dibujar. */
      images: [{ url: `/og/producto/${producto.id}`, width: 1200, height: 630, alt: producto.nombre }],
    },
  };
}

/* ⚠️ Esta página ya no tiene portada.
 *
 * Tenía una: rótulo «El catálogo», contador de productos y un párrafo
 * explicando que se filtra por categoría. Ocupaba la primera pantalla entera
 * para decir lo que la barra de filtros muestra por sí sola, así que quien
 * entraba al catálogo tenía que desplazarse para ver el primer producto. Lo que
 * la página hace es mostrar productos; ahora empieza mostrándolos.
 *
 * El título sigue existiendo para el lector de pantalla y para la pestaña del
 * navegador: lo que se quitó es el cartel, no el encabezado.
 *
 * ⚠️ Los filtros llegan por la URL y **la base hace el trabajo**: filtra, ordena
 * y devuelve una página de 24. Antes se traía el catálogo publicado entero y el
 * navegador lo filtraba; con 50 productos daba igual, con 955 sería traer el
 * maestro completo para pintar dos docenas de tarjetas.
 *
 * Nada de esto se valida a medias: un `orden` que no existe cae al de siempre y
 * una `categoria` inventada no encuentra nada, que es la respuesta correcta a
 * una URL escrita a mano. */

type Parametros = Promise<{
  categoria?: string;
  orden?: string;
  q?: string;
  p?: string;
  producto?: string;
}>;

export default async function PaginaCatalogo({
  searchParams,
}: {
  searchParams: Parametros;
}) {
  const { categoria, orden, q, p, producto: pedido } = await searchParams;

  const paginaPedida = Number(p);
  const consulta = {
    categoria: categoria ?? null,
    orden: esOrden(orden) ? orden : ORDEN_POR_DEFECTO,
    busqueda: q ?? "",
    pagina: Number.isInteger(paginaPedida) && paginaPedida > 0 ? paginaPedida : 1,
  };

  /* El producto de la URL se resuelve acá y no en el cliente: si alguien llega
     por un enlace compartido, la ficha tiene que estar abierta en la primera
     pintada, aunque ese producto no caiga en la página del listado que se está
     mostrando. */
  const idPedido = idDeProducto(pedido);

  const [resultado, categorias, productoPedido] = await Promise.all([
    listarProductos(consulta),
    listarCategorias(),
    idPedido ? productoPorId(idPedido) : Promise.resolve(null),
  ]);

  return (
    <>
      <h1 className="sr-only">Catálogo</h1>

      {/* useSearchParams necesita un límite de Suspense para poder prerenderizar */}
      <Suspense fallback={<EsqueletoCatalogo />}>
        <Catalogo
          productos={resultado.productos}
          categorias={categorias}
          total={resultado.total}
          pagina={resultado.pagina}
          paginas={resultado.paginas}
          categoria={consulta.categoria ?? "todos"}
          orden={consulta.orden}
          busqueda={consulta.busqueda}
          productoPedido={productoPedido}
          pie={<PieDePagina />}
        />
      </Suspense>


    </>
  );
}

function EsqueletoCatalogo() {
  return (
    <Seccion fondo="papel" aire="grande">
      <p className="font-black uppercase">Cargando catálogo…</p>
    </Seccion>
  );
}
