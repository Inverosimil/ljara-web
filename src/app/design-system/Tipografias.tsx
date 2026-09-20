import { DM_Sans, Nunito_Sans, Source_Sans_3, Alegreya_Sans, Lato, Cabin, Literata } from "next/font/google";
import { EMPRESA } from "@/contenido/empresa";

const dm = DM_Sans({ subsets: ["latin"], weight: "400", display: "swap" });
const nunito = Nunito_Sans({ subsets: ["latin"], weight: "400", display: "swap" });
const source = Source_Sans_3({ subsets: ["latin"], weight: "400", display: "swap" });
const alegreya = Alegreya_Sans({ subsets: ["latin"], weight: "400", display: "swap" });
const lato = Lato({ subsets: ["latin"], weight: "400", display: "swap" });
const cabin = Cabin({ subsets: ["latin"], weight: "400", display: "swap" });
const literata = Literata({ subsets: ["latin"], weight: "400", display: "swap" });
const alegreyaCursiva = Alegreya_Sans({ subsets: ["latin"], weight: "400", style: "italic", display: "swap" });
const latoCursiva = Lato({ subsets: ["latin"], weight: "400", style: "italic", display: "swap" });
const literataCursiva = Literata({ subsets: ["latin"], weight: "400", style: "italic", display: "swap" });

const opciones = [
  { nombre: "I · Alegreya Sans cursiva", clase: alegreyaCursiva.className, cursiva: true, detalle: "La más cercana a un gesto escrito a mano, sin convertirse en manuscrita. Ligera y sin serif." },
  { nombre: "J · Lato cursiva", clase: latoCursiva.className, cursiva: true, detalle: "Una inclinación más discreta: mantiene una lectura limpia y un tono formal." },
  { nombre: "K · Literata cursiva", clase: literataCursiva.className, cursiva: true, detalle: "Más editorial y expresiva. Con serif y trazos fluidos, para darle personalidad al párrafo." },
  { nombre: "E · Alegreya Sans", clase: alegreya.className, detalle: "Mi primera candidata: tiene un ritmo cercano a la escritura a mano, pero conserva claridad y sobriedad. Sin cursiva." },
  { nombre: "F · Cabin", clase: cabin.className, detalle: "Curvas suaves y un aspecto cálido. Un punto intermedio entre una letra orgánica y una de interfaz." },
  { nombre: "G · Lato", clase: lato.className, detalle: "Más discreta y formal, con formas amables. Para suavizar el párrafo sin darle demasiado protagonismo." },
  { nombre: "H · Literata", clase: literata.className, detalle: "La alternativa con serif: un aire de libro, con más detalle en los trazos y menos sensación de letra geométrica." },
  { nombre: "A · DM Sans", clase: dm.className, detalle: "Mi primera candidata: limpia, con curvas suaves y un carácter menos rígido." },
  { nombre: "B · Nunito Sans", clase: nunito.className, detalle: "La más amable: formas redondeadas que acompañan los botones sin parecer manuscritas." },
  { nombre: "C · Source Sans 3", clase: source.className, detalle: "Más ligera y abierta. Pensada para que el párrafo se lea con facilidad y tenga menos protagonismo." },
  { nombre: "D · Archivo actual", clase: "font-archivo", detalle: "Referencia actual, con el mismo tamaño, peso e interlineado que las alternativas." },
];

export function Tipografias() {
  return (
    <section aria-labelledby="tipografias-hero" className="mt-12 font-archivo text-tinta">
      <p className="text-sm font-semibold text-rojo-600">Comparación · Texto del hero</p>
      <h2 id="tipografias-hero" className="mt-2 text-3xl font-bold">Opciones naturales y cursivas</h2>
      <p className="mt-3 max-w-2xl text-neutro-700">Las nuevas cursivas I–K están primero; debajo siguen las opciones anteriores. El mismo texto, en peso regular, a 22px y con interlineado de 1,7. La portada conserva su tipografía mientras eliges.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {opciones.map((opcion) => (
          <article key={opcion.nombre} className="rounded-[20px] bg-papel p-6 sm:p-8">
            <h3 className="text-lg font-bold">{opcion.nombre}</h3>
            <p className="mt-2 min-h-12 text-sm text-neutro-700">{opcion.detalle}</p>
            <div className="mt-7 border-t border-tinta/10 pt-6">
              <p className="font-black text-2xl not-italic uppercase">Tu proveedor de siempre</p>
              <p style={{ fontStyle: opcion.cursiva ? "italic" : "normal" }} className={`${opcion.clase} mt-5 max-w-lg text-[22px] font-normal leading-[1.7]`}>{EMPRESA.descripcionCorta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
