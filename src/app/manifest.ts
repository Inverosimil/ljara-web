import type { MetadataRoute } from "next";
import { EMPRESA } from "@/contenido/empresa";

/* Para «agregar a la pantalla de inicio» en el teléfono.
 *
 * `short_name` es lo que cabe bajo el icono: unos 12 caracteres antes de que el
 * sistema lo corte. Por eso va el nombre corto y no la razón social.
 *
 * `display: "standalone"` abre el sitio sin barra de direcciones, como una app.
 * El color de fondo es el papel de la marca —es lo que se ve en el instante
 * entre tocar el icono y que la página pinte— y el del tema es la tinta, que es
 * el fondo del encabezado. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${EMPRESA.nombre} — ${EMPRESA.bajada}`,
    short_name: EMPRESA.nombre,
    description: EMPRESA.descripcionCorta,
    start_url: "/",
    display: "standalone",
    background_color: "#f5f2ea",
    theme_color: "#0f1a23",
    lang: "es-CL",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
