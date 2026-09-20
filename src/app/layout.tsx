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
  // TODO: cambiar por el dominio real al desplegar; sin esto las imágenes de
  // Open Graph se sirven con URL relativa y no las levanta ninguna red social.
  metadataBase: new URL("https://ljara.cl"),
  title: {
    default: "L.Jara Distribuidora — Bebidas con y sin alcohol",
    template: "%s · L.Jara",
  },
  description:
    "Distribuidora y Comercializadora Luis Jara y Compañía — bebidas con y sin alcohol.",
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "L.Jara Distribuidora",
  },
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
