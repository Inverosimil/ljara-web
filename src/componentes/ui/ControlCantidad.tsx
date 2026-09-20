"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { BORDE, BORDE_BOTON, cx } from "./base";

/** Permite escribir una cantidad sin que borrar el campo quite el producto. */
export function ControlCantidad({ valor, onCambiar, etiqueta, tamano = "md", minimo = 1, className }: {
  valor: number;
  onCambiar: (nuevo: number) => void;
  etiqueta: string;
  tamano?: "sm" | "md";
  minimo?: 0 | 1;
  className?: string;
}) {
  const [borrador, setBorrador] = useState(String(valor));
  const [anterior, setAnterior] = useState(valor);
  if (valor !== anterior) { setAnterior(valor); setBorrador(String(valor)); }
  const boton = cx(BORDE_BOTON, "rounded-[20px]", "grid size-11 shrink-0 place-items-center bg-white text-tinta transition-colors hover:bg-oro disabled:cursor-not-allowed disabled:bg-neutro-200 disabled:text-neutro-500");
  return (
    <div className={cx("inline-flex items-center gap-1", className)}>
      <button type="button" className={boton} onClick={() => onCambiar(valor - 1)} disabled={valor <= minimo} aria-label={`Quitar uno — ${etiqueta}`}><Minus aria-hidden className="size-4" /></button>
      <input type="number" inputMode="numeric" min={minimo} step={1} value={borrador} aria-label={etiqueta}
        onChange={(e) => {
          const texto = e.target.value;
          setBorrador(texto);
          const n = Number(texto);
          if (/^\d+$/.test(texto) && Number.isSafeInteger(n) && n >= minimo) onCambiar(n);
        }}
        onBlur={() => setBorrador(String(valor))}
        onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
        className={cx(BORDE, "rounded-[20px]", "h-11 min-w-0 bg-white text-center font-black text-base text-tinta tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none", tamano === "sm" ? "w-12" : "w-16")}
      />
      <button type="button" className={boton} onClick={() => onCambiar(valor + 1)} aria-label={`Agregar uno — ${etiqueta}`}><Plus aria-hidden className="size-4" /></button>
    </div>
  );
}
