import type { ReactNode } from "react";

/* Este layout existe solo para sostener el slot del modal.
 *
 * Cada producto tiene su propia dirección —`/catalogo/1234-nombre`— para poder
 * compartirla por WhatsApp con su foto y su texto. Pero abrir un producto desde
 * la grilla no debería sacar a nadie del catálogo ni perderle los filtros, así
 * que esa misma ruta se INTERCEPTA y se pinta como ficha superpuesta.
 *
 * Quien llega por un enlace compartido o recarga la página ve la página
 * completa; quien toca una tarjeta ve el modal. Es la misma dirección y el
 * mismo contenido.
 *
 * ⚠️ `@modal` es un slot, no un segmento de ruta: por eso el interceptor es
 * `(.)[slug]` y no `(..)[slug]`, aunque en el árbol de archivos esté un nivel
 * más abajo. */
export default function LayoutCatalogo({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
