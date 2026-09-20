import Image from "next/image";
import { BORDE, cx } from "./base";

/* Marco de foto.
 *
 * Las fotos entran al collage con tratamiento duotono —desaturadas, con algo de
 * tinta encima y una trama de puntos— en vez de aparecer tal cual. Eso hace dos
 * cosas: las integra al lenguaje de fotocopia del resto del sitio, y deja claro
 * que las de hoy son de relleno sin que la página se vea rota.
 *
 * ⚠️ El duotono se aligeró el 2026-09-06. Eran cuatro capas apiladas —gris, más
 * contraste, tinta al 55% en multiplicar, papel al 12% en trama, y semitono al
 * 25%—: una foto quedaba casi negra, y la grilla de seis de «nosotros» era un
 * muro oscuro. Ahora son dos capas y la foto se ve. El tratamiento sigue
 * leyéndose como tratamiento, que es lo que tenía que conservar.
 *
 * Cuando lleguen las fotos reales basta con cambiar `tratamiento` a "natural" si se
 * prefiere verlas sin filtro. */

type Proporcion = "16/9" | "3/2" | "1/1" | "4/5";

const PROPORCIONES: Record<Proporcion, string> = {
  "16/9": "aspect-[16/9]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
};

type Props = {
  src: string;
  alt: string;
  proporcion?: Proporcion;
  /** duotono integra la foto al collage; natural la deja sin filtro */
  tratamiento?: "duotono" | "natural";
  /** texto al pie, dentro del marco */
  pie?: string;
  giro?: string;
  sombra?: string;
  cinta?: boolean;
  prioridad?: boolean;
  className?: string;
};

export function MarcoFoto({
  src,
  alt,
  proporcion = "3/2",
  tratamiento = "duotono",
  pie,
  giro,
  sombra = "shadow-dura",
  cinta = false,
  prioridad = false,
  className,
}: Props) {
  return (
    <figure className={cx("relative", giro, className)}>
      {cinta && (
        <span
          className="absolute -top-3 left-1/2 z-20 h-6 w-24 -translate-x-1/2 -rotate-3 bg-oro/55 shadow-[inset_0_0_0_1px_rgba(15,26,35,0.18)]"
          aria-hidden
        />
      )}

      <div className={cx(BORDE, "bg-tinta", sombra)}>
        <div className={cx("relative overflow-hidden", PROPORCIONES[proporcion])}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
            loading={prioridad ? "eager" : "lazy"}
            className={cx(
              "object-cover",
              tratamiento === "duotono" && "grayscale contrast-[1.15]",
            )}
          />

          {tratamiento === "duotono" && (
            <>
              {/* la tinta de marca tiñe las sombras, sin taparlas */}
              <span
                className="absolute inset-0 bg-tinta/25 mix-blend-multiply"
                aria-hidden
              />
              {/* trama de impresión */}
              <span
                className="halftone absolute inset-0 opacity-[0.12]"
                aria-hidden
              />
            </>
          )}
        </div>

        {pie && (
          <figcaption className="border-t-[3px] border-tinta bg-papel px-3 py-2 text-sm text-tinta">
            {pie}
          </figcaption>
        )}
      </div>
    </figure>
  );
}
