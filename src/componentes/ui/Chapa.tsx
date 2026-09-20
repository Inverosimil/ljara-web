import Image from "next/image";
import { cx } from "./base";

/* La chapa como pieza del sistema.
 *
 * El logo es una tapa de botella y eso es lo más distintivo que tiene la marca,
 * así que se usa en tres registros: como isotipo (Chapa), como marca de agua
 * gigante detrás del contenido (ChapaDeFondo) y como separador repetido
 * (FranjaChapas). También presta su corona dentada al sello de oferta. */

const TAMANOS = {
  xs: 28,
  sm: 40,
  md: 56,
  lg: 88,
  xl: 128,
} as const;

type Tamano = keyof typeof TAMANOS;

const ARCHIVOS = {
  color: "/marca/logo-ljara.svg",
  claro: "/marca/logo-ljara-fondo-oscuro.svg",
  mono: "/marca/logo-ljara-mono.svg",
} as const;

export function Chapa({
  tamano = "md",
  variante = "color",
  giraAlPasar = false,
  className,
}: {
  tamano?: Tamano;
  /** `claro` es para fondos oscuros: la corona pasa a crema */
  variante?: keyof typeof ARCHIVOS;
  giraAlPasar?: boolean;
  className?: string;
}) {
  const px = TAMANOS[tamano];
  return (
    <Image
      src={ARCHIVOS[variante]}
      alt=""
      width={px}
      height={px}
      loading="eager"
      aria-hidden
      className={cx(
        "shrink-0",
        giraAlPasar &&
          "transition-transform duration-500 group-hover:rotate-[18deg] motion-reduce:transition-none",
        className,
      )}
    />
  );
}

/** Chapa gigante detrás del contenido. No ocupa espacio ni se lee: es textura.
 *  Va dentro de un contenedor `relative overflow-hidden`.
 *
 *  Dibuja solo la corona, no el logo completo: al recortarse contra el borde, el
 *  lettering quedaba cortado a media palabra y se leía como un error de maqueta.
 *  La corona dentada sola sigue siendo inconfundiblemente una chapa. */
export function ChapaDeFondo({
  opacidad = "opacity-[0.07]",
  tamano = 620,
  className,
}: {
  opacidad?: string;
  tamano?: number;
  className?: string;
}) {
  const r = 46;
  return (
    <div
      className={cx("pointer-events-none absolute select-none", opacidad, className)}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" width={tamano} height={tamano}>
        <path
          d={rutaCorona(50, 50, r)}
          fill="none"
          stroke="var(--color-tinta)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="none"
          stroke="var(--color-tinta)"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r="25"
          fill="none"
          stroke="var(--color-tinta)"
          strokeWidth="2"
          strokeDasharray="5 4"
        />
      </svg>
    </div>
  );
}

/** Separador: una hilera de chapas, como tapas alineadas sobre el mesón. */
export function FranjaChapas({
  cantidad = 14,
  className,
}: {
  cantidad?: number;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex items-center justify-center gap-4 overflow-hidden border-y-[3px] border-tinta bg-tinta py-3",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: cantidad }, (_, i) => (
        <Image
          key={i}
          src={ARCHIVOS.claro}
          alt=""
          width={30}
          height={30}
          className={cx("shrink-0 opacity-80", i % 2 ? "rotate-[12deg]" : "-rotate-[10deg]")}
        />
      ))}
    </div>
  );
}

/** Contorno de corona dentada, el borde de la chapa.
 *
 * Se genera con arcos: N puntos sobre una circunferencia y, entre cada par, un
 * arco que sobresale. Es la silueta real de una tapa, no una estrella genérica,
 * y por eso ata el sello de oferta al logo en vez de ser un adorno cualquiera. */
export function rutaCorona(cx0: number, cy0: number, radio: number, dientes = 18) {
  const paso = (Math.PI * 2) / dientes;
  const cuerda = 2 * radio * Math.sin(paso / 2);
  const rArco = cuerda / 2;

  const punto = (i: number) => [
    cx0 + Math.cos(i * paso - Math.PI / 2) * radio,
    cy0 + Math.sin(i * paso - Math.PI / 2) * radio,
  ];

  const [x0, y0] = punto(0);
  let d = `M ${x0.toFixed(2)} ${y0.toFixed(2)}`;
  for (let i = 1; i <= dientes; i++) {
    const [x, y] = punto(i);
    d += ` A ${rArco.toFixed(2)} ${rArco.toFixed(2)} 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d} Z`;
}
