import { PieGlobal } from "@/componentes/sitio/PieGlobal";
import { ScrollPagina } from "@/componentes/sitio/ScrollPagina";
import { BarraPedido } from "@/componentes/pedido/BarraPedido";
import { PanelPedido } from "@/componentes/pedido/PanelPedido";
import { PieDePagina } from "@/componentes/sitio/Bloques";
import { Encabezado } from "@/componentes/sitio/Encabezado";

/* Marco común de todas las páginas del sitio. Va en un grupo de rutas `(sitio)`
 * para que el encabezado y el pie no se apliquen a /design-system.
 *
 * El pedido no necesita proveedor: su almacén es un módulo (`lib/almacen-pedido`)
 * y los componentes se enganchan con `usePedido()` desde donde estén.
 *
 * ⚠️ El catálogo ya NO se trae acá. Hasta el 2026-09-06 el layout pedía el
 * catálogo publicado entero para que el carrito pudiera resolver sus líneas en
 * cualquier ruta; desde que el catálogo se pagina eso sería traer 955 productos
 * en `/contacto` para no pintar ninguno. Ahora la página del catálogo siembra lo
 * que muestra y `lib/almacen-catalogo` le pide al servidor lo que le falte. */

/* ⚠️ Cada cuánto se vuelve a mirar la base.
 *
 * Sin esto, Next prerenderiza estas páginas en el build y el catálogo queda
 * congelado en el momento en que se compiló: publicar un producto desde la
 * plataforma no se vería en el sitio hasta el próximo despliegue, y nadie
 * entendería por qué. Con esto, la página se regenera como mucho cada cinco
 * minutos y sigue sirviéndose estática entre medio.
 *
 * Cinco minutos es un punto de partida, no una decisión del negocio: el catálogo
 * cambia varias veces al día como mucho. */
export const revalidate = 300;

export default function LayoutSitio({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sitio-publico bg-papel font-editorial text-tinta">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:border-[3px] focus:border-tinta focus:bg-oro focus:px-4 focus:py-2 focus:font-black focus:uppercase"
      >
        Saltar al contenido
      </a>

      <ScrollPagina />
      <Encabezado />
      <main id="contenido">{children}</main>
      <PieGlobal><PieDePagina /></PieGlobal>
      <BarraPedido />
      <PanelPedido />
    </div>
  );
}
