import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Caveat, Lato } from "next/font/google";
import { Boton, TitularRecortado } from "@/componentes/ui";
import { BotonEditorial } from "@/componentes/ui/BotonEditorial";
import { EMPRESA } from "@/contenido/empresa";
import styles from "./Hero.module.css";
import { SombraLogo } from "./SombraLogo";

const manuscrita = Caveat({ subsets: ["latin"], weight: "600" });
const lectura = Lato({ subsets: ["latin"], weight: "400", style: "italic", display: "swap" });

// Curva amplia del desgarro. El detalle se genera con ruido fractal, no con dientes.
const contorno = "M -30 -30 H 69 C 78 42 44 103 54 166 S 37 241 43 295 S 21 371 29 433 S 46 493 25 557 S 32 632 22 691 S 41 771 29 824 S 20 928 32 1030 H -30 Z";

function BordeRasgado({ movil = false }: { movil?: boolean }) {
  const id = movil ? "rasgado-movil" : "rasgado-escritorio";
  return (
    <svg className={movil ? styles.bordeMovil : styles.borde}
      viewBox={movil ? "0 0 1000 100" : "0 0 100 1000"}
      preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <defs>
        {/* Dos escalas: roturas pequeñas y fibras finas. Región limitada al borde. */}
        <filter id={id} x="-40%" y="-5%" width="180%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.055" numOctaves="3" seed="17" result="roturas" />
          <feDisplacementMap in="SourceGraphic" in2="roturas" scale="19" xChannelSelector="R" yChannelSelector="G" result="borde" />
          <feTurbulence type="fractalNoise" baseFrequency="0.65 0.4" numOctaves="3" seed="8" result="fibras" />
          <feDisplacementMap in="borde" in2="fibras" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g transform={movil ? "matrix(0 1 1 0 0 0)" : undefined}>
        <g filter={`url(#${id})`}>
          <path d={contorno} fill="currentColor" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Hero de la portada pública.
 *
 * La composición mantiene el gesto editorial de L.Jara, pero pone el trabajo
 * de reparto al frente: texto y acción en papel, fotografía de bodega al lado.
 * La imagen es un recurso visual de esta propuesta y queda lista para cambiarse
 * por una foto real cuando la empresa la confirme.
 */
const HERO_FOTO = {
  src: "/hero-bodega-ljara.png",
  alt: "Persona del equipo de reparto trasladando cajas en una bodega",
};

export function Hero() {
  return (
    <section
      aria-labelledby="titulo-hero"
      className="relative overflow-hidden bg-papel"
    >
      <div className="grid w-full lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className={styles.papel}>
          <BordeRasgado />
          <BordeRasgado movil />
          <div className="relative flex h-full min-h-[34rem] items-stretch px-4 py-20 sm:px-6 sm:py-24 lg:min-h-[calc(100svh-var(--alto-encabezado))] lg:py-28 lg:pr-10 lg:pl-[clamp(2.5rem,6vw,7rem)]">
            <div className={`relative z-10 w-full max-w-xl ${styles.contenido}`}>
              <div className={styles.tituloConLogo}>
              <Image
                src="/marca/logo-ljara.svg"
                alt=""
                aria-hidden="true"
                width={240}
                height={240}
                className={styles.logoAsomado}
                draggable={false}
              />
              <SombraLogo />
              <TitularRecortado
                id="titulo-hero"
                texto={EMPRESA.claim}
                nivel={1}
                className="mt-6 text-[2.85rem] sm:text-[4rem] lg:text-[5.65rem] [&>span:nth-child(1)]:rounded-t-[10px] [&>span:nth-child(2)]:rounded-tr-[10px] [&>span:nth-child(2)]:rounded-b-[10px] [&>span:nth-child(4)]:rounded-b-[10px]"
              />

              </div>
              <div className={styles.descripcion}>
                <p className={`${lectura.className} max-w-lg text-xl font-normal leading-[1.7] sm:text-[1.4rem]`}>
                  {EMPRESA.descripcionCorta}
                </p>
              </div>

              <div className={styles.acciones}>
                <Boton como={Link} href="/catalogo" tamano="md" ancho="completo">
                  Ver el catálogo <ArrowRight aria-hidden className="size-4" />
                </Boton>
                <BotonEditorial href="/contacto" icono="conversacion">
                  Consultar por un pedido
                </BotonEditorial>
              </div>


            </div>
          </div>
        </div>

        <div className="relative min-h-[30rem] overflow-hidden bg-tinta sm:min-h-[38rem] lg:min-h-[calc(100svh-var(--alto-encabezado))]">
          <Image
            src={HERO_FOTO.src}
            alt={HERO_FOTO.alt}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 58vw"
            className={`${styles.foto} object-cover object-[52%_center]`}
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-tinta/85 to-transparent" aria-hidden="true" />
          <div className={styles.ubicacion}>
            <a className={lectura.className} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EMPRESA.ubicacion + ", Chile")}`} target="_blank" rel="noopener noreferrer" aria-label="Buscar Bodega San Francisco, Pudahuel en Google Maps (nueva pestaña)">
              <MapPin aria-hidden className="size-4 shrink-0" />
              Desde Pudahuel, para el sector poniente.
            </a>
          </div>
          <aside className={`${styles.nota} ${manuscrita.className}`}>
              <p>
                {EMPRESA.bajada}
              </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
