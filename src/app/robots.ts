import type { MetadataRoute } from "next";

/* Qué puede indexar un buscador.
 *
 * El sitio se indexa completo desde el lanzamiento. La excepción es
 * `/design-system`: es el registro interno de las cuatro propuestas evaluadas,
 * está fuera del menú a propósito y no tiene nada que hacer en una búsqueda de
 * «distribuidora de bebidas». Que no esté enlazado no basta —basta con que
 * alguien comparta la URL— así que se bloquea explícitamente.
 *
 * ⚠️ Esto NO es una medida de seguridad: un `disallow` es una petición que el
 * buscador respeta por convención, y la página sigue siendo pública para quien
 * tenga el enlace. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/design-system" },
    sitemap: "https://cdljara.cl/sitemap.xml",
  };
}
