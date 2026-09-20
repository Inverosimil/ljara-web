import { MapPin, MessageCircle, Truck } from "lucide-react";
import { COBERTURA_PUBLICA, EMPRESA } from "@/contenido/empresa";
import { Recorte, cx } from "@/componentes/ui";

/** Comunas confirmadas. No representa radios ni frecuencias aún sin validar. */
export function Cobertura({ className }: { className?: string }) {
  return (
    <div className={cx("grid gap-7 lg:grid-cols-[0.8fr_1.2fr]", className)}>
      <Recorte fondo="tinta" sombra="shadow-dura-oro" className="h-full">
        <div className="p-6 sm:p-8">
          <Truck className="size-9 text-oro" strokeWidth={2} aria-hidden />
          <h3 className="mt-5 font-black text-xl uppercase">Salimos desde Pudahuel</h3>
          <p className="mt-3 text-sm text-crema/85">{EMPRESA.ubicacion}. Coordinamos cada entrega con nuestro equipo de reparto.</p>
        </div>
      </Recorte>
      <div className="py-1">
        <p className="font-black text-sm uppercase">Nuestra zona de reparto</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {COBERTURA_PUBLICA.comunas.map((comuna) => (
            <li key={comuna} className="flex items-center gap-2 border-b-2 border-tinta/20 py-3 text-sm"><MapPin aria-hidden className="size-4 shrink-0 text-rojo-600" />{comuna}</li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-neutro-700">{COBERTURA_PUBLICA.consulta}</p>
        <p className="mt-4 flex items-start gap-2 text-sm"><MessageCircle aria-hidden className="mt-0.5 size-4 shrink-0" />Te confirmamos el día de entrega al revisar tu pedido.</p>
      </div>
    </div>
  );
}
