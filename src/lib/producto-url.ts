/* La dirección de un producto.
 *
 * Vive aparte de `lib/catalogo.ts` porque ese módulo lleva `server-only` —abre
 * una conexión a la base— y la tarjeta del catálogo, que es un componente de
 * cliente, necesita saber armar el enlace.
 *
 * ⚠️ Un producto NO es una página aparte: es el catálogo con un parámetro. Se
 * probó con ruta propia y ruta interceptada, y se volvió atrás: el modal tiene
 * que abrirse sobre el catálogo, no navegar a otro sitio.
 *
 * ⚠️ Y es un parámetro de consulta, no un `#`. El navegador no envía el `#` al
 * servidor, así que con un ancla no habría forma de responder con el nombre y
 * la foto del producto al compartir el enlace: WhatsApp mostraría la imagen
 * genérica del catálogo.
 *
 * ⚠️ El identificador es el id interno, no `codigo_autoventa`: el export trae 26
 * códigos repetidos, así que ese no identifica una fila.
 */

export const PARAM_PRODUCTO = "producto";

/** El catálogo con un producto abierto, conservando los filtros que haya. */
export function rutaProducto(id: string, actuales?: URLSearchParams | null): string {
  const params = new URLSearchParams(actuales?.toString() ?? "");
  params.set(PARAM_PRODUCTO, id);
  return `/catalogo?${params.toString()}`;
}

/** El catálogo sin producto abierto, conservando el resto. */
export function rutaSinProducto(actuales?: URLSearchParams | null): string {
  const params = new URLSearchParams(actuales?.toString() ?? "");
  params.delete(PARAM_PRODUCTO);
  const cadena = params.toString();
  return cadena ? `/catalogo?${cadena}` : "/catalogo";
}

/** El id que pide la URL, o `null`. Solo dígitos: cualquier otra cosa es una
 *  dirección escrita a mano y el catálogo se abre sin ficha. */
export function idDeProducto(valor: string | null | undefined): string | null {
  return valor && /^\d+$/.test(valor) ? valor : null;
}
