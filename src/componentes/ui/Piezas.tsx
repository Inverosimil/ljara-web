import Link from "next/link";
import { ArrowRight, BookOpen, MapPin, MessageCircle, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { BORDE, cx } from "./base";
import { Recorte } from "./Recorte";

/* Piezas compuestas que se repiten entre páginas. */

/** Paso numerado, para explicar un proceso (cómo pedir). */
export function Paso({
  numero,
  titulo,
  children,
  giro,
}: {
  numero: number;
  titulo: string;
  children: ReactNode;
  giro?: string;
}) {
  return (
    <Recorte giro={giro} fondo="papel" sombra="rounded-[20px]" className="h-full">
      <div className="p-5">
        <span
          className={cx(
            BORDE,
            "inline-flex size-11 items-center justify-center bg-rojo-500",
            "font-black text-lg text-crema",
          )}
        >
          {numero}
        </span>
        <h3 className="mt-4 font-black text-base leading-snug tracking-tight uppercase">
          {titulo}
        </h3>
        <p className="mt-3 text-sm leading-relaxed">{children}</p>
      </div>
    </Recorte>
  );
}

/** Pilar de marca: bloque corto con un ícono dibujado. */
export function Pilar({
  icono,
  titulo,
  children,
  giro,
  sombra,
}: {
  icono: string;
  titulo: string;
  children: ReactNode;
  giro?: string;
  sombra?: string;
}) {
  return (
    <Recorte giro={giro} fondo="blanco" sombra={sombra} className="h-full">
      <div className="p-5">
        <IconoPilar nombre={icono} />
        <h3 className="mt-4 font-black text-base leading-snug tracking-tight uppercase">
          {titulo}
        </h3>
        <p className="mt-3 text-sm leading-relaxed">{children}</p>
      </div>
    </Recorte>
  );
}

function IconoPilar({ nombre }: { nombre: string }) {
  const Icono = { reparto: Truck, catalogo: BookOpen, trato: MessageCircle, stock: MapPin }[nombre] ?? BookOpen;
  return <Icono className="size-8 text-rojo-600" strokeWidth={2} aria-hidden />;
}

/** Tarjeta de categoría, para llevar del inicio al catálogo ya filtrado. */
export function TarjetaCategoria({
  etiqueta,
  cantidad,
  href,
  giro,
  sombra,
}: {
  etiqueta: string;
  cantidad: number;
  href: string;
  giro?: string;
  sombra?: string;
}) {
  return (
    <Link href={href} aria-label={`${etiqueta}: ${cantidad} ${cantidad === 1 ? "producto" : "productos"}`} className="group block">
      <Recorte giro={giro} fondo="blanco" sombra={sombra} interactivo>
        <div className="flex items-center gap-3 p-4">
          <span className="font-black text-base tracking-tight uppercase">
            {etiqueta}
          </span>
          <span className="ml-auto border-2 border-tinta bg-oro px-2 py-0.5 font-black text-xs tabular-nums">
            {cantidad}
          </span>
          <ArrowRight aria-hidden className="size-4 shrink-0 text-rojo-600 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
        </div>
      </Recorte>
    </Link>
  );
}

/** Cita o dato destacado, sobre tinta. */
export function Destacado({
  children,
  pie,
  giro,
}: {
  children: ReactNode;
  pie?: string;
  giro?: string;
}) {
  return (
    <Recorte giro={giro} fondo="tinta" sombra="shadow-dura-oro">
      <div className="p-6">
        <p className="font-black text-xl leading-snug tracking-tight text-crema uppercase sm:text-2xl">
          {children}
        </p>
        {pie && <p className="mt-3 text-sm text-crema/70">{pie}</p>}
      </div>
    </Recorte>
  );
}
