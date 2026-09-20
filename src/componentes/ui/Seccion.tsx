import type { ReactNode } from "react";
import { cx } from "./base";

/* Envoltorio de sección. Fija el ancho máximo, el aire vertical y el fondo, para
 * que todas las secciones del sitio respiren igual.
 *
 * El aire subió un escalón por el ADR-0006: apretar el contenido es lo que más
 * lee como informal, más que el color o el giro. Es la palanca más barata para
 * subir el registro sin tocar el sistema. */

/* ⚠️ Había cinco fondos y dos eran tramas —grano de fotocopia y semitono—, que
 * se alternaban sección por sección. Alternar tramas no da ritmo: da una página
 * donde ningún tramo está en silencio y las fotos de producto compiten contra
 * puntos. Las tramas siguen existiendo en `globals.css` y se usan donde
 * significan algo —el reverso de `MarcoFoto`, el fondo de la silueta de envase—;
 * lo que se retiró es usarlas como papel tapiz.
 *
 * Quedan tres, y el ritmo lo dan ellos: papel casi siempre, tinta y rojo como
 * cortes. */
type Fondo = "papel" | "tinta" | "rojo";

const FONDOS: Record<Fondo, string> = {
  papel: "bg-papel text-tinta",
  tinta: "bg-tinta text-crema",
  rojo: "bg-rojo-600 text-crema",
};

export function Seccion({
  children,
  fondo = "papel",
  ancho = "normal",
  aire = "normal",
  id,
  className,
  etiquetadaPor,
}: {
  children: ReactNode;
  fondo?: Fondo;
  ancho?: "normal" | "angosto";
  aire?: "normal" | "chico" | "grande";
  id?: string;
  className?: string;
  /** id del encabezado que nombra la sección, para lectores de pantalla */
  etiquetadaPor?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={etiquetadaPor}
      className={cx("border-b-[3px] border-tinta", FONDOS[fondo], className)}
    >
      <div
        className={cx(
          "mx-auto px-4 sm:px-6",
          ancho === "angosto" ? "max-w-4xl" : "max-w-6xl",
          aire === "chico"
            ? "py-7 sm:py-8"
            : aire === "grande"
              ? "py-12 sm:py-20"
              : "py-10 sm:py-14",
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Tira de banderines. Separa secciones cuando hace falta un respiro visual. */
export function Banderines({ className }: { className?: string }) {
  return (
    <div
      className={cx("franjas-toldo h-3", className)}
      style={{
        maskImage:
          "repeating-linear-gradient(90deg, #000 0 18px, transparent 18px 24px)",
        WebkitMaskImage:
          "repeating-linear-gradient(90deg, #000 0 18px, transparent 18px 24px)",
      }}
      aria-hidden
    />
  );
}
