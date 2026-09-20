import type { ReactNode } from "react";
import { cx } from "./base";

/* Titulares del sitio.
 *
 * `TitularRecortado` arma el texto palabra por palabra, cada una sobre su propio
 * bloque de color y con su propio giro: es el gesto que define la portada. Antes
 * el hero usaba esto y el catálogo usaba otra tipografía de letrero, y por eso se
 * notaba que venían de propuestas distintas. Ahora ambos salen de acá. */

const BLOQUES = [
  "-rotate-[0.5deg] bg-tinta px-2 text-crema",
  "rotate-[0.5deg] bg-rojo-500 px-2 text-crema",
  "-rotate-[0.3deg] px-1",
  "rotate-[0.4deg] bg-oro px-2 text-tinta",
];

const NIVELES = {
  1: "text-[1.9rem] leading-[1] sm:text-5xl lg:text-7xl",
  2: "text-2xl leading-[1.05] sm:text-3xl lg:text-5xl",
  3: "text-xl leading-tight sm:text-2xl",
} as const;

export function TitularRecortado({
  texto,
  nivel = 1,
  className,
  id,
}: {
  texto: string;
  nivel?: 1 | 2 | 3;
  className?: string;
  id?: string;
}) {
  const Etiqueta = `h${nivel}` as "h1" | "h2" | "h3";
  return (
    <Etiqueta
      id={id}
      className={cx(
        "font-black tracking-tight break-words uppercase",
        NIVELES[nivel],
        className,
      )}
    >
      {texto.split(" ").map((palabra, i) => (
        <span
          key={`${palabra}-${i}`}
          className={cx("mr-2 inline-block", BLOQUES[i % BLOQUES.length])}
        >
          {palabra}
        </span>
      ))}
    </Etiqueta>
  );
}

/* ⚠️ El rótulo y el antetítulo eran dos bloques de tinta apilados, cada uno con
 * su giro. En una página con cinco secciones eso son diez rectángulos negros
 * torcidos que compiten con el contenido: el gesto del hero, repetido tantas
 * veces, dejaba de ser un gesto y pasaba a ser el ruido de fondo. Ahora el peso
 * lo pone la tipografía —que ya es Archivo Black en mayúsculas— y el color lo
 * pone el antetítulo, que es la línea chica.
 *
 * El bloque de tinta no desapareció del sitio: sigue en `TitularRecortado`, que
 * es donde nació y donde se lee como decisión y no como plantilla. */

/** Rótulo de sección. La versión corta del titular recortado. */
export function Rotulo({
  nivel = 2,
  children,
  className,
  id,
}: {
  children: ReactNode;
  nivel?: 1 | 2 | 3;
  className?: string;
  id?: string;
}) {
  const Encabezado = `h${nivel}` as "h1" | "h2" | "h3";
  return (
    <Encabezado
      id={id}
      className={cx(
        "font-black text-2xl leading-tight tracking-tight text-balance uppercase sm:text-3xl lg:text-4xl",
        className,
      )}
    >
      {children}
    </Encabezado>
  );
}

/** Antetítulo: la línea chica que va sobre un rótulo. Es el único color de la
 *  cabecera de sección, y por eso alcanza. */
export function Antetitulo({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "font-black text-xs tracking-[0.3em] text-rojo-600 uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}
