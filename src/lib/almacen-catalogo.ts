"use client";

import { resolverProductos } from "@/lib/acciones-catalogo";
import type { ProductoSitio } from "@/lib/catalogo";

/* El catálogo, del lado del cliente.
 *
 * Existe por una sola razón: **el carrito resuelve sus líneas de forma
 * síncrona**. El pedido guarda ids, no productos —así un producto dado de baja
 * deja de resolver y su línea se descarta sola— y `resolverLineas()` necesita
 * una función `(id) => producto` que responda en el acto.
 *
 * La solución mantiene la regla del proyecto —**no hay proveedor ni contexto**—:
 * es un módulo, igual que `almacen-pedido`.
 *
 * ⚠️ Desde que el catálogo se pagina (2026-09-06) esto ya NO es una copia del
 * catálogo completo, y por eso ahora tiene suscriptores. Se llena de dos formas:
 *
 *   1. La página del catálogo siembra los productos que acaba de pintar, así
 *      agregar algo al pedido no espera ninguna consulta.
 *   2. Si el pedido guardado menciona un producto que no está sembrado —otra
 *      página, otra visita—, `asegurarProductos()` se lo pide al servidor y
 *      avisa a quien esté mirando.
 *
 * Sin (2), un carrito armado ayer aparecería vacío hoy hasta pasar por la página
 * donde está ese producto. */

let porId = new Map<string, ProductoSitio>();
const oyentes = new Set<() => void>();

/* El mapa ES el instantáneo de `useSyncExternalStore`, que compara por
 * identidad: por eso cada cambio estrena mapa en vez de mutar el que había. Con
 * un mapa mutado, React no vería nunca la diferencia; devolviendo uno nuevo en
 * cada lectura, entraría en un bucle de renders. Estrenarlo solo al cambiar es
 * lo único que cumple las dos condiciones. */
function avisar() {
  porId = new Map(porId);
  for (const oyente of oyentes) oyente();
}

export function suscribirCatalogo(oyente: () => void): () => void {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function leerCatalogo(): ReadonlyMap<string, ProductoSitio> {
  return porId;
}

/* En el servidor no hay catálogo sembrado y eso es correcto: el pedido vive en
 * `localStorage`, así que el primer pintado es vacío de todas formas. Tiene que
 * ser SIEMPRE el mismo objeto: uno nuevo en cada lectura hace que React crea que
 * el almacén cambió en cada render. */
const VACIO: ReadonlyMap<string, ProductoSitio> = new Map();

export function leerCatalogoServidor(): ReadonlyMap<string, ProductoSitio> {
  return VACIO;
}

/** Agrega productos al almacén sin borrar lo que ya había.
 *
 *  Antes reemplazaba el mapa entero, porque el mapa ERA el catálogo. Ahora llega
 *  de a páginas: reemplazar dejaría fuera del carrito lo agregado en la página
 *  anterior. */
export function sembrarCatalogo(productos: ProductoSitio[]) {
  const nuevos = productos.filter((p) => !porId.has(p.id));
  if (nuevos.length === 0) return;
  for (const p of nuevos) porId.set(p.id, p);
  avisar();
}

/* Qué se está pidiendo ahora mismo.
 *
 * `usePedido()` lo usan varios componentes a la vez —el botón del encabezado, la
 * barra de abajo, el panel—, así que todos pedirían los mismos ids en el mismo
 * render. Sin esta memoria serían tres consultas idénticas por carga. */
const enVuelo = new Set<string>();
/* Y los que ya se preguntaron y no volvieron: dejaron de estar publicados. Sin
 * esto se preguntarían otra vez en cada render, para siempre. */
const sinRespuesta = new Set<string>();

/** Trae del servidor los productos que faltan. No devuelve nada: cuando llegan,
 *  avisa a los suscriptores y el carrito se vuelve a resolver solo. */
export function asegurarProductos(ids: string[]): void {
  const faltan = ids.filter(
    (id) => !porId.has(id) && !enVuelo.has(id) && !sinRespuesta.has(id),
  );
  if (faltan.length === 0) return;

  for (const id of faltan) enVuelo.add(id);

  resolverProductos(faltan)
    .then((productos) => {
      for (const p of productos) porId.set(p.id, p);
      // Los que no volvieron no existen para el sitio. Se anotan para no
      // preguntar por ellos en bucle.
      const vinieron = new Set(productos.map((p) => p.id));
      for (const id of faltan) if (!vinieron.has(id)) sinRespuesta.add(id);
      avisar();
    })
    .catch((e) => {
      /* Si la consulta falla no se marca nada: el pedido se ve incompleto por un
       * rato, que es mejor que borrar líneas por un problema de red. Se vuelve a
       * intentar en la próxima carga. */
      console.error("[catalogo] no se pudieron resolver las líneas del pedido", e);
    })
    .finally(() => {
      for (const id of faltan) enVuelo.delete(id);
    });
}
