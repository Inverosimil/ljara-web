import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/* Lo que comparten las imágenes de Open Graph: la tipografía, el logo y la
 * paleta. Es lo que se ve al pegar un enlace en un WhatsApp.
 *
 * ⚠️ La tipografía se lee del disco y no de `next/font`. `next/font` entrega
 * `woff2` y el generador de imágenes no lee ese formato —quiere `ttf`, `otf` o
 * `woff`—, así que Archivo Black vive aparte en `assets/`. Ver su README.
 *
 * ⚠️ Los dos `readFile` van en el módulo, no dentro de la función: así se leen
 * una vez por proceso en vez de en cada imagen, y es además la forma en que Next
 * detecta los archivos para incluirlos en el despliegue. */

export const ARCHIVO_BLACK = await readFile(
  join(process.cwd(), "assets/ArchivoBlack-Regular.ttf"),
);

/* El logo como data URI: el generador de imágenes no resuelve rutas del sitio
 * —no hay servidor al que pedírselas mientras se construye la imagen—, así que
 * el archivo viaja incrustado. */
const logo = await readFile(join(process.cwd(), "public/marca/logo-ljara-256.png"), "base64");
export const LOGO_SRC = `data:image/png;base64,${logo}`;

/* Tomados de brand/tokens/tokens.json. No se referencian por variable CSS: el
 * generador de imágenes no tiene hoja de estilos ni `:root`. */
export const OG = {
  papel: "#f5f2ea",
  tinta: "#0f1a23",
  rojo: "#e1261c",
  blanco: "#ffffff",
} as const;

export const TAMANO_OG = { width: 1200, height: 630 };

/** Fuentes que recibe `ImageResponse`. */
export const FUENTES_OG = [
  { name: "Archivo Black", data: ARCHIVO_BLACK, style: "normal" as const, weight: 400 as const },
];

/** El tamaño de letra del título, según lo largo que sea.
 *
 *  Sin esto, un nombre como «VINO CARMEN TR.MGX CS 13g VD700 X12» se sale de la
 *  imagen o la llena entera. No es un ajuste fino: son tres escalones. */
export function cuerpoTitulo(texto: string): number {
  if (texto.length <= 22) return 76;
  if (texto.length <= 40) return 60;
  return 46;
}
