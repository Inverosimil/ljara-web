import { notFound } from "next/navigation";
import { productoPorId } from "@/lib/catalogo";
import { idDesdeSlug } from "@/lib/producto-url";
import { ModalDeProducto } from "./ModalDeProducto";

/* La misma dirección que `catalogo/[slug]`, interceptada.
 *
 * Se pinta cuando se llega navegando desde la grilla: el catálogo se queda
 * detrás con sus filtros intactos y el producto aparece superpuesto. Al recargar
 * o abrir el enlace de cero no pasa por acá y se dibuja la página completa.
 *
 * Los datos se piden igual que en la página: es el mismo producto y la misma
 * consulta. Lo que cambia es el envoltorio. */
export default async function ModalInterceptado({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = idDesdeSlug(slug);
  const producto = id ? await productoPorId(id) : null;
  if (!producto) notFound();

  return <ModalDeProducto producto={producto} />;
}
