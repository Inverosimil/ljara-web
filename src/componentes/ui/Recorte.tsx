import type { ReactNode } from "react";
import { BORDE, cx } from "./base";

/* Recorte: el contenedor base del sitio. Una hoja pegada sobre otra, con borde
 * macizo, sombra dura y opcionalmente un trozo de cinta arriba.
 *
 * Todo lo que sea "una caja" en el sitio es un Recorte. Las tarjetas de producto,
 * las cifras, los bloques de texto: todos. Así no aparecen tres tipos de caja
 * distintos en la misma página. */

type Fondo = "papel" | "blanco" | "tinta" | "rojo" | "oro";

const FONDOS: Record<Fondo, string> = {
  papel: "bg-papel text-tinta",
  blanco: "bg-white text-tinta",
  tinta: "bg-tinta text-crema",
  rojo: "bg-rojo-500 text-crema",
  oro: "bg-oro text-tinta",
};

type Props = {
  children: ReactNode;
  fondo?: Fondo;
  /** Clase de rotación; usar `giro(i)` de base.ts para mantener el set cerrado. */
  giro?: string;
  /** Sombra: por defecto tinta. Pasar `shadow-dura-rojo` y compañía para acentuar. */
  sombra?: string;
  cinta?: boolean;
  /** Se endereza al pasar el mouse. Solo para piezas accionables. */
  interactivo?: boolean;
  className?: string;
};

export function Recorte({
  children,
  fondo = "blanco",
  giro,
  cinta = false,
  interactivo = false,
  className,
}: Props) {
  return (
    <div
      className={cx(
        "relative group/recorte",
        giro,
        interactivo &&
          "",
        className,
      )}
    >
      {cinta && <Cinta />}
      <div className={cx("h-full rounded-[20px]", interactivo && "transition-shadow group-hover/recorte:shadow-dura-sm", BORDE, FONDOS[fondo])}>{children}</div>
    </div>
  );
}

/** Trozo de cinta adhesiva. Se usa suelto solo cuando hay que pegar algo que no
 *  es un Recorte; en el resto de los casos va con `cinta` del propio Recorte. */
export function Cinta({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3",
        "bg-oro/55 shadow-[inset_0_0_0_1px_rgba(15,26,35,0.18)]",
        className,
      )}
      aria-hidden
    />
  );
}
