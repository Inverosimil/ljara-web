import Link from "next/link";
import { Tipografias } from "./Tipografias";
import { Consultas } from "./Consultas";
import { Boton } from "@/componentes/ui/Boton";

const propuestas = [
  ["01", "Redondeado suave", "La opción más equilibrada: conserva la personalidad de L.Jara, pero se siente más amable y actual.", "Radio de 10px, borde fino y sombra fija de 3px al pasar el cursor."],
  ["02", "Píldora directa", "La alternativa más liviana y cercana para acciones frecuentes, especialmente en móvil.", "Botones completamente redondeados y presión hacia la sombra al pulsar."],
  ["03", "Tarjeta limpia", "Un punto intermedio: botones redondeados dentro de bloques muy simples y ordenados.", "Radio de 14px, superficies planas y sombra corta que aparece en hover."],
  ["04", "Orgánico de barrio", "Una versión más cálida y cercana, con curvas amplias que suavizan toda la interfaz.", "Radio de 20px y presión de 3px hacia una sombra con la misma forma."],
  ["05", "Referencia anterior", "La referencia recta previa a aplicar la propuesta 4.", "Borde macizo de 3px, sin sombra en reposo y sombra dura al pasar el cursor."],
];

function Estados({ i }: { i: number }) {
  const shape = i === 1 ? "rounded-full" : i === 3 ? "rounded-[20px]" : i === 2 ? "rounded-[14px]" : i === 0 ? "rounded-[10px]" : "rounded-none";
  return <div className="flex flex-wrap items-center gap-5 pb-1"><Boton className={shape} variante="primario">Ver el catálogo</Boton><Boton className={shape} variante={i === 1 || i === 2 ? "papel" : "secundario"}>Consultar pedido</Boton><Boton variante="texto">Ver el pedido →</Boton><Boton className={shape} disabled variante="papel">No disponible</Boton></div>;
}

export default function Propuestas() {
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><header className="max-w-3xl"><p className="font-archivo text-sm font-bold tracking-[0.2em] text-rojo-600 uppercase">L.Jara · Design system</p><h1 className="mt-3 font-archivo text-4xl font-black text-tinta sm:text-6xl">Propuesta 4 aplicada</h1><p className="mt-4 text-lg text-neutro-700">Orgánico de barrio es ahora el estilo del sitio público. Conservamos las alternativas para comparar. La diferencia principal está en cuánto redondeamos y cuánto borde dejamos.</p><div className="mt-6 flex gap-4"><Link href="/" className="font-archivo text-sm font-bold text-rojo-600 underline">Volver al sitio →</Link><Link href="/design-system/componentes" className="font-archivo text-sm font-bold text-tinta underline">Ver componentes actuales →</Link></div></header><Tipografias /><Consultas /><div className="mt-12 space-y-8">{propuestas.map((p, i) => <article key={p[0]} className="rounded-2xl border border-neutro-200 bg-papel p-6 sm:p-8"><div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><p className="font-archivo text-sm font-black tracking-widest text-rojo-600">PROPUESTA {p[0]}</p><h2 className="mt-2 font-archivo text-3xl font-black text-tinta">{p[1]}</h2><p className="mt-3 text-neutro-800">{p[2]}</p><p className="mt-3 text-sm text-neutro-600">{p[3]}</p></div><div className="rounded-xl border border-neutro-200 bg-white/70 p-5 sm:p-7"><p className="mb-4 font-archivo text-xs font-black tracking-widest text-neutro-600 uppercase">Prueba el hover, mantén pulsado o navega con Tab</p><Estados i={i} /><div className="mt-6 flex gap-3 text-xs text-neutro-600"><span>Reposo: plano · Hover: sombra fija · Click: superficie hacia la sombra</span></div></div></div></article>)}</div></main>;
}
