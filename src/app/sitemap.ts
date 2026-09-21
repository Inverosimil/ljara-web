import type { MetadataRoute } from "next";
import { productosParaMapa } from "@/lib/catalogo";
import { slugProducto } from "@/lib/producto-url";

/* El mapa que se le entrega a los buscadores.
 *
 * Hoy son las cinco páginas del sitio. `/design-system` queda fuera a
 * propósito: está bloqueado en `robots.ts` y anunciarlo acá sería contradecirse.
 *
 * Los productos se suman desde la base, no desde una lista fija: cada uno tiene
 * su propia dirección y es la que se comparte. Solo entran los publicados, que
 * es lo único que `ljara_public` puede leer.
 *
 * ⚠️ `lastModified` de cada producto sale de `actualizado_en`, no de `new Date()`:
 * decirle a un buscador que las 955 fichas cambiaron hoy, todos los días, es
 * pedirle que deje de creer el dato. */
const SITIO = "https://cdljara.cl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ahora = new Date();
  const paginas: MetadataRoute.Sitemap = [
    { url: SITIO, lastModified: ahora, changeFrequency: "monthly", priority: 1 },
    { url: `${SITIO}/catalogo`, lastModified: ahora, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITIO}/nosotros`, lastModified: ahora, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITIO}/contacto`, lastModified: ahora, changeFrequency: "yearly", priority: 0.7 },
    /* `/pedido` no se indexa con prioridad: es el carrito de quien ya eligió, no
       una página a la que se llegue desde una búsqueda. */
    { url: `${SITIO}/pedido`, lastModified: ahora, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productos = await productosParaMapa();
  for (const p of productos) {
    paginas.push({
      url: `${SITIO}/catalogo/${slugProducto(p)}`,
      lastModified: p.actualizado ? new Date(p.actualizado) : ahora,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return paginas;
}
