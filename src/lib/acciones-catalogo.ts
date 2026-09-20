"use server";

import { productosPorId, type ProductoSitio } from "@/lib/catalogo";

/* Lo único que el navegador le pide al servidor por su cuenta.
 *
 * El pedido guarda ids y el catálogo ya no viene entero: una línea guardada
 * puede apuntar a un producto que no está en la página que se está mirando —o a
 * uno que se guardó ayer—. Esto los resuelve.
 *
 * Va como Server Action y no como consulta desde el navegador con la clave
 * publicable —que también funcionaría— para que **`lib/catalogo.ts` siga siendo
 * el único lugar que sabe de dónde salen los productos**. El día que el catálogo
 * cambie de origen, se cambia ahí y nada más.
 *
 * No hace falta verificar nada: devuelve exactamente lo mismo que el catálogo
 * público, con las políticas de `anon`. Un id que no esté publicado no vuelve. */
export async function resolverProductos(ids: string[]): Promise<ProductoSitio[]> {
  // Un tope por si alguien llama al endpoint a mano: el carrito real no llega ni
  // cerca, y sin esto una lista de diez mil ids es una consulta gratis contra la
  // base.
  return productosPorId(ids.slice(0, 200));
}
