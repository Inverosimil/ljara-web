import type { MetadataRoute } from "next";
import { productosParaMapa } from "@/lib/catalogo";
import { rutaProducto } from "@/lib/producto-url";

/* El mapa que se le entrega a los buscadores.
 *
 * Hoy son las cinco páginas del sitio. `/design-system` queda fuera a
 * propósito: está bloqueado en `robots.ts` y anunciarlo acá sería contradecirse.
 *
 * Los productos se suman desde la base, no desde una lista fija. Su dirección
 * es el catálogo con el producto abierto —`/catalogo?producto=239`—, que es la
 * que se comparte. Solo entran los publicados, que es lo único que
 * `ljara_public` puede leer.
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

  /* ⚠️ Si la base no contesta, el sitemap sale con las cinco páginas y ya.
   *
   * Sin esto un hipo de conexión tumba el BUILD ENTERO: el sitemap se
   * prerenderiza, y una excepción acá aborta el despliegue completo. Pasó
   * durante el desarrollo, con un «Connection terminated due to connection
   * timeout». Un sitemap sin productos es un problema menor y se corrige en la
   * siguiente regeneración; un despliegue caído deja el sitio sin actualizar. */
  let productos: Awaited<ReturnType<typeof productosParaMapa>> = [];
  try {
    productos = await productosParaMapa();
  } catch (error) {
    console.error("[sitemap] no se pudieron leer los productos:", error);
  }

  for (const p of productos) {
    paginas.push({
      url: `${SITIO}${rutaProducto(p.id)}`,
      lastModified: p.actualizado ? new Date(p.actualizado) : ahora,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return paginas;
}
