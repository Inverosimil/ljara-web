import { ZONAS_REPARTO } from "@/contenido/empresa";
import { cx } from "./base";
import { rutaCorona } from "./Chapa";

/* Mapa de cobertura, dibujado a mano en SVG.
 *
 * No usa Google Maps ni una imagen satelital: es un esquema de anillos de reparto
 * centrado en la bodega. Se eligió así por tres razones —encaja con el lenguaje de
 * trazo grueso del sitio, no depende de un servicio externo ni de una API key, y
 * comunica lo que de verdad le importa al cliente, que no es la geografía exacta
 * sino cada cuánto pasa el camión por su zona.
 *
 * Los radios salen de ZONAS_REPARTO en km y se dibujan a escala relativa. */

const COLORES = ["var(--color-rojo-500)", "var(--color-oro)", "var(--color-pop-cian)"];

/** Ángulo del rótulo de cada anillo, en grados. Repartidos para que los tres
 *  no se apilen en la misma vertical. */
const ANGULO_ROTULO = [200, 320, 250];

/** Posiciones de las etiquetas de comuna en cada anillo, en grados.
 *  Fijas y no aleatorias, para que el dibujo sea idéntico en cada render. */
const ANGULOS: Record<number, number[]> = {
  // no deben coincidir con ANGULO_ROTULO: un punto y un rótulo en el mismo
  // ángulo terminan uno encima del otro
  0: [45, 160, 280],
  1: [20, 105, 165, 345],
  2: [70, 185, 300],
};

export function MapaCobertura({
  className,
  soloMapa = false,
}: {
  className?: string;
  /** Solo el dibujo, sin la leyenda. Para contextos con poco alto, como una
   *  lámina de presentación, donde la leyenda se compone aparte. */
  soloMapa?: boolean;
}) {
  const zonas = [...ZONAS_REPARTO];
  const radioMaximo = Math.max(...zonas.map((z) => z.radioKm));
  const LIENZO = 420;
  const centro = LIENZO / 2;
  // margen para que el anillo exterior y sus marcas no toquen el borde
  const escala = (centro - 46) / radioMaximo;

  return (
    <div
      className={cx(
        soloMapa
          ? "flex justify-center"
          : "grid gap-10 lg:grid-cols-[minmax(20rem,26rem)_1fr] lg:items-center",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${LIENZO} ${LIENZO}`}
        className="mx-auto w-full max-w-[26rem] lg:max-w-none"
        role="img"
        aria-label="Esquema de las zonas de reparto en anillos alrededor de la bodega"
      >
        {/* cuadrícula de fondo, como un plano */}
        <defs>
          <pattern id="cuadricula" width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M24 0H0v24"
              fill="none"
              stroke="var(--color-tinta)"
              strokeWidth="1"
              opacity="0.12"
            />
          </pattern>
        </defs>
        <rect width={LIENZO} height={LIENZO} fill="url(#cuadricula)" />

        {/* anillos, del más lejano al más cercano para que se superpongan bien */}
        {[...zonas].reverse().map((z, iRev) => {
          const i = zonas.length - 1 - iRev;
          const r = z.radioKm * escala;
          return (
            <g key={z.id}>
              <circle
                cx={centro}
                cy={centro}
                r={r}
                fill={COLORES[i % COLORES.length]}
                fillOpacity="0.13"
                stroke="var(--color-tinta)"
                strokeWidth="3"
                strokeDasharray={i === 0 ? undefined : "10 7"}
              />
              {/* Rótulo del anillo, sobre su borde y en su propio ángulo. El
                  anillo interior es tan chico que su rótulo se montaba sobre el
                  marcador de la bodega, así que se empuja hacia afuera. */}
              <g
                transform={(() => {
                  const rRotulo = r < 70 ? r + 30 : r;
                  const rad = (ANGULO_ROTULO[i] * Math.PI) / 180;
                  return `translate(${centro + Math.cos(rad) * rRotulo}, ${
                    centro + Math.sin(rad) * rRotulo
                  })`;
                })()}
              >
                <rect
                  x="-34"
                  y="-11"
                  width="68"
                  height="22"
                  fill={COLORES[i % COLORES.length]}
                  stroke="var(--color-tinta)"
                  strokeWidth="3"
                />
                <text
                  y="5"
                  textAnchor="middle"
                  className="font-black"
                  fontSize="11"
                  fill="var(--color-tinta)"
                >
                  {z.radioKm} km
                </text>
              </g>
            </g>
          );
        })}

        {/* comunas: un punto por comuna, repartido en su anillo */}
        {zonas.map((z, i) => {
          const r = z.radioKm * escala;
          const angulos = ANGULOS[i] ?? [];
          return z.comunas.map((comuna, j) => {
            const grados = angulos[j % angulos.length] ?? 0;
            const rad = (grados * Math.PI) / 180;
            // A media distancia entre este anillo y el anterior. Para el más
            // interior el "anterior" es el marcador de la bodega, no el centro:
            // si no, los puntos caen encima de la chapa.
            const RADIO_MARCADOR = 17;
            const rInterior =
              i === 0 ? RADIO_MARCADOR : zonas[i - 1].radioKm * escala;
            const rPunto = (r + rInterior) / 2;
            const x = centro + Math.cos(rad) * rPunto;
            const y = centro + Math.sin(rad) * rPunto;
            return (
              <g key={`${z.id}-${comuna}-${j}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="var(--color-tinta)"
                  stroke="var(--color-papel)"
                  strokeWidth="2"
                />
              </g>
            );
          });
        })}

        {/* la bodega, al centro: la propia chapa dibujada como marcador */}
        <g transform={`translate(${centro}, ${centro})`}>
          <path
            d={rutaCorona(0, 0, 15)}
            fill="var(--color-tinta)"
            stroke="var(--color-tinta)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle r="9.5" fill="var(--color-rojo-500)" />
          <circle r="4" fill="var(--color-oro)" />
          <rect
            x="-38"
            y="19"
            width="76"
            height="22"
            fill="var(--color-tinta)"
          />
          <text
            y="34"
            textAnchor="middle"
            className="font-black"
            fontSize="11"
            fill="var(--color-crema)"
          >
            BODEGA
          </text>
        </g>
      </svg>

      {/* leyenda: lo que el cliente realmente viene a buscar */}
      <ul className={cx("space-y-4", soloMapa && "hidden")}>
        {zonas.map((z, i) => (
          <li
            key={z.id}
            className="border-[3px] border-tinta bg-papel p-4 shadow-dura-sm"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="size-5 shrink-0 border-[3px] border-tinta"
                style={{ background: COLORES[i % COLORES.length] }}
                aria-hidden
              />
              <p className="font-black text-base uppercase">{z.etiqueta}</p>
              <span className="ml-auto text-sm">hasta {z.radioKm} km</span>
            </div>
            <p className="mt-2 text-sm">{z.frecuencia}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {z.comunas.map((c, j) => (
                <li
                  key={`${z.id}-${c}-${j}`}
                  className="border-2 border-tinta bg-white px-2 py-0.5 text-xs uppercase"
                >
                  {c}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
