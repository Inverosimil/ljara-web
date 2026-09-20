import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { BORDE_BOTON, cx } from "./base";
import styles from "./Boton.module.css";

/* Botón del sitio. Un solo gesto: al pulsar, la pieza se hunde sobre su propia
 * sombra dura. Ninguna otra animación en todo el sitio hace eso, así que el
 * hundimiento significa siempre "esto es accionable". */

type Variante = "primario" | "secundario" | "papel" | "tinta" | "texto";
type Tamano = "sm" | "md" | "lg";

const VARIANTES: Record<Variante, string> = {
  // rojo de marca — acción principal, una sola por pantalla
  primario: `${BORDE_BOTON} bg-rojo-600 text-crema hover:bg-rojo-700`,
  // oro — acción secundaria de igual peso visual
  secundario: `${BORDE_BOTON} bg-oro text-tinta`,
  // papel — terciaria, para cuando ya hay dos botones fuertes
  papel: `${BORDE_BOTON} bg-papel text-tinta`,
  // tinta — sobre fondos claros muy cargados, o dentro de bloques oscuros
  tinta: `${BORDE_BOTON} bg-tinta text-crema`,
  // sin caja: para acciones menores dentro de una ficha
  texto:
    "text-tinta underline decoration-rojo-500 decoration-[3px] underline-offset-4 hover:text-rojo-600",
};

const TAMANOS: Record<Tamano, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm sm:px-6 sm:text-base",
  lg: "px-6 py-3 text-base sm:px-8 sm:py-3.5 sm:text-lg",
};



/** `auto` no crece nunca (barras, filas densas); `movil` ocupa todo el ancho en
 *  pantallas chicas y se encoge desde sm; `completo` ocupa todo siempre. */
type Ancho = "auto" | "movil" | "completo";

const ANCHOS: Record<Ancho, string> = {
  auto: "w-auto",
  movil: "w-full sm:w-auto",
  completo: "w-full",
};

type Props<T extends ElementType> = {
  como?: T;
  variante?: Variante;
  tamano?: Tamano;
  ancho?: Ancho;
  sombra?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "children" | "className">;

export function Boton<T extends ElementType = "button">({
  como,
  variante = "primario",
  tamano = "md",
  ancho = "auto",
  sombra = true,
  children,
  className,
  ...resto
}: Props<T>) {
  const Etiqueta = (como ?? "button") as ElementType;
  const esTexto = variante === "texto";

  const radios = className?.split(/\s+/).filter((clase) => clase.startsWith("rounded")).join(" ") || "rounded-[14px]";
  const clases = cx(
    "inline-flex min-h-11 items-center justify-center gap-2 text-center font-black leading-snug tracking-tight uppercase",
    "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rojo-500",
    !esTexto && radios, VARIANTES[variante], !esTexto && TAMANOS[tamano], !esTexto && styles.superficie, className,
  );
  if (esTexto) return <Etiqueta className={cx(clases, ANCHOS[ancho])} {...resto}>{children}</Etiqueta>;
  // Solo la geometría se comparte: duplicar className también duplicaba movimientos y bordes.
  return (
    <span className={cx(styles.marco, !sombra && styles.sinSombra, ANCHOS[ancho], radios)}>
      <Etiqueta className={cx(clases, "w-full")} {...resto}>{children}</Etiqueta>
    </span>
  );
}
