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
} from "@/lib/catalogo";

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Catálogo de bebidas con y sin alcohol de ${EMPRESA.nombre}.`,
};

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
}>;

export default async function PaginaCatalogo({
  searchParams,
}: {
  searchParams: Parametros;
}) {
  const { categoria, orden, q, p } = await searchParams;

  const paginaPedida = Number(p);
  const consulta = {
    categoria: categoria ?? null,
    orden: esOrden(orden) ? orden : ORDEN_POR_DEFECTO,
    busqueda: q ?? "",
    pagina: Number.isInteger(paginaPedida) && paginaPedida > 0 ? paginaPedida : 1,
  };

  const [resultado, categorias] = await Promise.all([
    listarProductos(consulta),
    listarCategorias(),
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
