/* La dirección de un producto.
 *
 * Vive aparte de `lib/catalogo.ts` porque ese módulo lleva `server-only` —abre
 * una conexión a la base— y la tarjeta del catálogo, que es un componente de
 * cliente, necesita saber armar el enlace.
 *
 * ⚠️ El slug lleva el id delante y **solo el id se lee**: `1234-coca-cola-15-l`
 * y `1234-lo-que-sea` llevan al mismo producto. El nombre está ahí para que la
 * dirección se entienda al pegarla en un WhatsApp y para que un buscador vea de
 * qué trata la página; no es la identidad. Si mañana alguien corrige el nombre
 * de un producto en la plataforma interna, los enlaces compartidos siguen
 * funcionando en vez de romperse en silencio.
 *
 * ⚠️ No se usa `codigo_autoventa`: el export trae 26 códigos repetidos, así que
 * no identifica una fila. El id interno sí.
 */

/** Pasa un texto a la forma que admite una URL: sin tildes, sin ñ y sin signos. */
function enGuiones(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function slugProducto(producto: { id: string; nombre: string }): string {
  const nombre = enGuiones(producto.nombre);
  return nombre ? `${producto.id}-${nombre}` : producto.id;
}

export function rutaProducto(producto: { id: string; nombre: string }): string {
  return `/catalogo/${slugProducto(producto)}`;
}

/** El id que lleva un slug, o `null` si no empieza por uno.
 *
 *  Devolver `null` en vez de lanzar es deliberado: una dirección escrita a mano
 *  termina en la página de «no encontrado», que es la respuesta correcta. */
export function idDesdeSlug(slug: string): string | null {
  const encontrado = /^(\d+)(?:-|$)/.exec(slug);
  return encontrado ? encontrado[1] : null;
}
