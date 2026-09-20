"use client";

import type { InputHTMLAttributes } from "react";
import { BORDE, BORDE_BOTON, cx } from "./base";

/* Controles de formulario y filtro. Mismo borde macizo que el resto del sitio,
 * para que un filtro y una tarjeta se lean como piezas de la misma familia. */

/** Chip de filtro. Es un botón que además comunica si está activo. */
export function Chip({
  children,
  activo = false,
  onClick,
  className,
}: {
  children: React.ReactNode;
  activo?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={cx(
        BORDE_BOTON,
        "rounded-[20px]",
        "min-h-11 px-3 py-2 font-black text-xs tracking-tight uppercase",
        "transition-colors",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rojo-500",
        activo ? "bg-tinta text-crema" : "bg-white text-tinta hover:bg-oro",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Campo de texto. El buscador del catálogo y el formulario de contacto usan el
 *  mismo, para que no aparezcan dos estilos de input en el sitio. */
export function Campo({
  etiqueta,
  id,
  className,
  ...resto
}: {
  etiqueta: string;
  id: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="font-black text-xs tracking-[0.18em] uppercase"
      >
        {etiqueta}
      </label>
      <input
        id={id}
        className={cx(
          BORDE,
          "rounded-[20px]",
          "min-h-12 min-w-0 w-full bg-white px-3 py-2.5 text-base text-tinta",
          "placeholder:text-neutro-500",
          "focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rojo-500",
        )}
        {...resto}
      />
    </div>
  );
}

/** Área de texto, misma familia que Campo. */
export function CampoLargo({
  etiqueta,
  id,
  filas = 4,
  className,
  ...resto
}: {
  etiqueta: string;
  id: string;
  filas?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="font-black text-xs tracking-[0.18em] uppercase"
      >
        {etiqueta}
      </label>
      <textarea
        id={id}
        rows={filas}
        className={cx(
          BORDE,
          "rounded-[20px]",
          "resize-y bg-white px-3 py-2.5 text-base text-tinta",
          "placeholder:text-neutro-500",
          "focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rojo-500",
        )}
        {...resto}
      />
    </div>
  );
}
