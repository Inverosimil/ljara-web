"use client";

import { cx } from "./base";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Paginacion.module.css";

/* Paginación del catálogo.
 *
 * Números y no «cargar más»: con «cargar más» no se puede volver a una página ni
 * compartir un enlace a ella, y el navegador pierde la posición al volver atrás.
 * Acá la página vive en la URL.
 *
 * Con muchas páginas no se pintan todas: se muestran la primera, la última, la
 * actual y sus vecinas, y el resto se resume con puntos suspensivos. Una tira de
 * cuarenta números es una barra de desplazamiento disfrazada. */

/** Qué botones mostrar. `null` es un salto («…»). */
function ventana(actual: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const cerca = [actual - 1, actual, actual + 1].filter((n) => n > 1 && n < total);
  const paginas = [1, ...cerca, total];

  const salida: (number | null)[] = [];
  let anterior = 0;
  for (const p of paginas) {
    if (p - anterior > 1) salida.push(null);
    salida.push(p);
    anterior = p;
  }
  return salida;
}

export function Paginacion({
  pagina,
  paginas,
  onIr,
  className,
}: {
  pagina: number;
  paginas: number;
  onIr: (pagina: number) => void;
  className?: string;
}) {
  const sinPaginacion = paginas <= 1;

  return (
    <nav aria-label="Páginas del catálogo" className={cx("flex justify-center", className)}>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <Boton
            deshabilitado={sinPaginacion || pagina <= 1}
            onClick={() => onIr(pagina - 1)}
            etiqueta="Página anterior"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </Boton>
        </li>

        {ventana(pagina, Math.max(1, paginas)).map((p, i) =>
          p === null ? (
            <li key={`salto-${i}`} aria-hidden className="px-1 font-black">
              …
            </li>
          ) : (
            <li key={p}>
              <Boton
                deshabilitado={sinPaginacion}
                activo={p === pagina && !sinPaginacion}
                onClick={() => onIr(p)}
                etiqueta={`Página ${p}`}
                // `aria-current` es lo que le dice al lector de pantalla cuál es
                // la página en la que estás; el color solo lo dice a la vista.
                actual={p === pagina}
              >
                {p}
              </Boton>
            </li>
          ),
        )}

        <li>
          <Boton
            deshabilitado={sinPaginacion || pagina >= paginas}
            onClick={() => onIr(pagina + 1)}
            etiqueta="Página siguiente"
          >
            <ChevronRight aria-hidden className="size-5" />
          </Boton>
        </li>
      </ul>
    </nav>
  );
}

function Boton({
  children,
  onClick,
  etiqueta,
  activo = false,
  actual = false,
  deshabilitado = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  etiqueta: string;
  activo?: boolean;
  actual?: boolean;
  deshabilitado?: boolean;
}) {
  return (
    <span className={styles.marco}>
      <button
        type="button"
        onClick={onClick}
        disabled={deshabilitado}
        aria-label={etiqueta}
        aria-current={actual ? "page" : undefined}
        className={cx(styles.boton, activo && styles.activo)}
      >
        {children}
      </button>
    </span>
  );
}
