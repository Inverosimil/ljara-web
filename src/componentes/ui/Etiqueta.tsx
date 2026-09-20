import type { ReactNode } from "react";
import { cx } from "./base";
import { rutaCorona } from "./Chapa";

/* Etiquetas y sellos: las piezas chicas de información.
 *
 * Antes había tres cosas distintas haciendo este trabajo —el badge de formato en
 * tipografía de letrero, la píldora de categoría y la estrella de oferta—, cada
 * una con su propia tipografía. Ahora las tres salen de acá y usan Archivo Black. */

type Tono = "rojo" | "oro" | "tinta" | "cian" | "papel";

const TONOS: Record<Tono, string> = {
  rojo: "bg-rojo-500 text-crema",
  oro: "bg-oro text-tinta",
  tinta: "bg-tinta text-crema",
  cian: "bg-pop-cian text-tinta",
  papel: "bg-papel text-tinta",
};

/** Etiqueta plana, sin borde. Para categoría dentro de una ficha. */
export function Etiqueta({
  children,
  tono = "rojo",
  className,
}: {
  children: ReactNode;
  tono?: Tono;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-block px-2 py-0.5 font-black text-[11px] tracking-wide uppercase",
        TONOS[tono],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Etiqueta con borde y giro, como pegada encima. Para el formato del producto. */
export function EtiquetaPegada({
  children,
  tono = "oro",
  className,
}: {
  children: ReactNode;
  tono?: Tono;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-block rotate-[8deg] border-[3px] border-tinta px-1.5 py-0.5",
        "font-black text-[10px] tracking-tight uppercase",
        TONOS[tono],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Sello de oferta, con la corona dentada de la chapa.
 *
 *  Antes era una estrella genérica de cartel de almacén. Ahora usa la silueta real
 *  de una tapa de botella, que es el logo: el sello queda atado a la marca en vez
 *  de ser un adorno intercambiable.
 *
 *  Trae `relative inline-flex` propios porque el SVG interno se posiciona contra
 *  él. Para moverlo o esconderlo, envolverlo en un span: pasarle `absolute` o
 *  `hidden` por className compite con esas reglas y el resultado depende del
 *  orden en la hoja de estilos. */
export function SelloOferta({
  children = "Oferta",
  tono = "oro",
  className,
}: {
  children?: ReactNode;
  tono?: "oro" | "rojo";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "relative inline-flex size-20 -rotate-[12deg] items-center justify-center",
        className,
      )}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
        <path
          d={rutaCorona(50, 50, 44)}
          fill={tono === "oro" ? "var(--color-oro)" : "var(--color-rojo-500)"}
          stroke="var(--color-tinta)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* el disco interior de la chapa */}
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="var(--color-tinta)"
          strokeWidth="2.5"
          strokeDasharray="4 3"
          opacity="0.55"
        />
      </svg>
      <span
        className={cx(
          "relative max-w-[64%] text-center font-black text-[10px] leading-none tracking-tight uppercase",
          tono === "oro" ? "text-tinta" : "text-crema",
        )}
      >
        {children}
      </span>
    </span>
  );
}
