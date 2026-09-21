import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Archivo_Black,
  Barlow_Condensed,
  Bungee,
  Chakra_Petch,
  Inter,
  Press_Start_2P,
  Staatliches,
} from "next/font/google";
import { EMPRESA } from "@/contenido/empresa";
import "./globals.css";

// Una pareja de fuentes por familia de propuestas. Se cargan todas aquí porque
// /design-system muestra las seis en la misma sesión.

// interfaz del propio /design-system
const inter = Inter({ variable: "--fuente-inter", subsets: ["latin"], preload: false });

// 1, 1B, 1C · Feria + catálogo Pop
const bungee = Bungee({
  variable: "--fuente-bungee",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});
const archivo = Archivo({ variable: "--fuente-archivo", subsets: ["latin"], preload: false });

// 2 · Arcade
const pressStart = Press_Start_2P({
  variable: "--fuente-pixel",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});
const chakra = Chakra_Petch({
  variable: "--fuente-chakra",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

// 3 · Fanzine
const archivoBlack = Archivo_Black({
  variable: "--fuente-black",
  subsets: ["latin"],
  weight: "400",
});


// 4 · Rutero
const staatliches = Staatliches({
  variable: "--fuente-placa",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});
const barlowCond = Barlow_Condensed({
  variable: "--fuente-condensada",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const FUENTES = [
  inter,
  bungee,
  archivo,
  pressStart,
  chakra,
  archivoBlack,
  staatliches,
  barlowCond,
]
  .map((f) => f.variable)
  .join(" ");

export const metadata: Metadata = {
  /* El dominio real, confirmado el 2026-09-20. No es cosmético: sin una URL
     absoluta las imágenes de Open Graph se sirven con ruta relativa y no las
     levanta ninguna red social —WhatsApp incluido—. El sitio vive en la raíz;
     `www.cdljara.cl` debe redirigir acá o los buscadores indexan dos sitios. */
  metadataBase: new URL("https://cdljara.cl"),
  /* La portada NO declara título propio: usa este `default`, y así el formato de
     la pestaña es uno solo en todo el sitio. El resto de páginas pasa por la
     plantilla —«Catálogo · L. Jara»—. */
  title: {
    default: "L. Jara — Bebidas con y sin alcohol",
    template: "%s · L. Jara",
  },
  description:
    "Distribuidora y Comercializadora Luis Jara y Compañía — bebidas con y sin alcohol.",
  /* El sitio es de la empresa; quien lo construye es otra persona. */
  authors: [{ name: "Sebastián Carrasco" }],
  creator: "Sebastián Carrasco",
  publisher: EMPRESA.nombreLargo,
  openGraph: {
    type: "website",
    locale: "es_CL",
    /* Al compartir, el nombre se escribe completo: fuera de la pestaña no hay
       contexto que diga a qué se dedica. */
    siteName: "Distribuidora L. Jara",
  },
  /* Sin tarjeta de Twitter/X y sin cuentas de redes declaradas: la empresa
     todavía no tiene ninguna (levantamiento del 2026-08-17). Cuando existan,
     se agregan acá. */
};

export const viewport: Viewport = {
  themeColor: "#0f1a23",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Las variables de next/font van en <html>, no en <body>: el bloque @theme de
  // Tailwind declara `--font-*: var(--fuente-*)` sobre :root, y si `--fuente-*`
  // solo existe en <body> esa referencia queda invalida y toda la tipografia cae
  // silenciosamente al fallback del sistema.
  return (
    <html lang="es" className={FUENTES} data-scroll-behavior="smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
