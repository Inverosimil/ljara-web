import Image from "next/image";
import { EnvaseSilueta } from "@/componentes/EnvaseSilueta";
import { Estrella } from "@/componentes/feria/Estrella";
import { EMPRESA, MARCAS_DESTACADAS } from "@/contenido/empresa";
import { CATEGORIAS, PRODUCTOS_MUESTRA } from "@/contenido/productos-muestra";
import { envaseEtiqueta, formatoCompleto } from "@/lib/formato";

/* PROPUESTA 2 · FANZINE
 * Collage impreso: recortes pegados con cinta, giros, grano de fotocopia y el
 * titular armado palabra por palabra. La version de tres tintas quedaba demasiado
 * quieta, asi que lleva la paleta completa —oro y cian ademas del rojo— y la
 * mecanica pop en el catalogo.
 *
 * Es la mas artesanal y de contracultura de las cuatro: hecha a mano, a proposito. */

export const metadata = { title: "2 · Fanzine — L.Jara" };

const PAPEL = "#EFEBE3";

/** Recorte pegado con un trozo de cinta. El gesto base de toda la propuesta. */
function Recorte({
  children,
  giro = "rotate-[-1deg]",
  className = "",
  conCinta = true,
  cintaGiro = "rotate-[-4deg]",
}: {
  children: React.ReactNode;
  giro?: string;
  className?: string;
  conCinta?: boolean;
  cintaGiro?: string;
}) {
  return (
    <div className={`relative ${giro} ${className}`}>
      {conCinta && (
        <span
          className={`cinta absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 ${cintaGiro}`}
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}

/** Sombras duras que alternan: el ritmo pop, heredado de la ganadora. */
const SOMBRAS = [
  "var(--color-pop-cian)",
  "var(--color-rojo-500)",
  "var(--color-oro)",
];
const GIROS = [
  "rotate-[-1.5deg]",
  "rotate-[1.2deg]",
  "rotate-[-0.6deg]",
  "rotate-[1.8deg]",
];

/** Fondos que rotan en el titular: acá entra el oro que Fanzine no tenía. */
const FONDOS_TITULAR = [
  "rotate-[-1deg] bg-neutro-900 px-2 text-crema",
  "rotate-[1deg] bg-rojo-500 px-2 text-crema",
  "rotate-[-0.5deg] px-1",
  "rotate-[0.8deg] bg-oro px-2 text-neutro-900",
];

export default function PropuestaFanzine() {
  return (
    <div className="font-maquina text-neutro-900" style={{ background: PAPEL }}>
      {/* ---------- banderines recortados ---------- */}
      <div
        className="franjas-toldo h-3"
        style={{
          maskImage:
            "repeating-linear-gradient(90deg, #000 0 18px, transparent 18px 24px)",
          WebkitMaskImage:
            "repeating-linear-gradient(90deg, #000 0 18px, transparent 18px 24px)",
        }}
        aria-hidden
      />

      {/* ---------- header ---------- */}
      <header className="border-b-[3px] border-neutro-900 bg-neutro-900">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Image src="/marca/logo-ljara.svg" alt="L.Jara" width={46} height={46} />
          <p className="font-black text-2xl tracking-tight text-crema uppercase">
            L.Jara
          </p>

          <nav className="ml-auto hidden items-center gap-3 text-sm text-crema uppercase md:flex">
            <span className="rotate-[-1.5deg] bg-rojo-500 px-2 py-0.5">Catálogo</span>
            <span className="opacity-70">Nosotros</span>
            <span className="opacity-70">Contacto</span>
          </nav>

          <button className="ml-auto rotate-[-2deg] border-[3px] border-crema bg-oro px-4 py-1.5 font-black text-sm uppercase transition-transform hover:rotate-0 md:ml-0">
            ¡Pedir!
          </button>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <section className="fotocopia relative overflow-hidden border-b-[3px] border-neutro-900">
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="inline-block rotate-[-1.5deg] bg-neutro-900 px-4 py-1">
            <p className="text-sm tracking-[0.3em] text-crema uppercase">
              {EMPRESA.bajada}
            </p>
          </div>

          <h1 className="mt-8 max-w-4xl font-black text-[1.9rem] leading-[1] tracking-tight break-words uppercase sm:text-5xl lg:text-7xl">
            {EMPRESA.claim.split(" ").map((palabra, i) => (
              <span
                key={`${palabra}-${i}`}
                className={`mr-2 inline-block ${FONDOS_TITULAR[i % FONDOS_TITULAR.length]}`}
              >
                {palabra}
              </span>
            ))}
          </h1>

          <div className="mt-12 flex flex-wrap items-end gap-8">
            <Recorte giro="rotate-[1deg]" className="max-w-md">
              <p className="border-[3px] border-neutro-900 bg-white p-5 text-lg">
                {EMPRESA.descripcionCorta}
              </p>
            </Recorte>

            {/* la chapa, recortada y pegada como una calcomanía */}
            <Recorte
              giro="rotate-[-6deg]"
              cintaGiro="rotate-[8deg]"
              className="hidden sm:block"
            >
              <div className="border-[3px] border-neutro-900 bg-crema p-3">
                <Image src="/marca/logo-ljara.svg" alt="" width={76} height={76} aria-hidden />
              </div>
            </Recorte>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <button className="w-full rotate-0 border-[3px] sm:rotate-[-1.5deg] border-neutro-900 bg-rojo-500 px-5 py-3 font-black text-sm text-crema uppercase shadow-[6px_6px_0_0_#0f1a23] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none sm:w-auto sm:px-7 sm:text-base">
              Ver el catálogo
            </button>
            <button className="w-full rotate-0 border-[3px] sm:rotate-[1deg] border-neutro-900 bg-oro px-5 py-3 font-black text-sm uppercase shadow-[6px_6px_0_0_#0f1a23] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none sm:w-auto sm:px-7 sm:text-base">
              Hablar con alguien
            </button>
            <span className="rotate-[-8deg]">
              <Estrella>NUEVO</Estrella>
            </span>
          </div>
        </div>
      </section>

      {/* ---------- cifras: recortes pegados sobre tinta ---------- */}
      <section className="border-b-[3px] border-neutro-900 bg-neutro-900 py-11">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {[
            {
              k: EMPRESA.cantidadProductos,
              v: "productos",
              giro: "rotate-[-2deg]",
              tinta: "text-rojo-600",
            },
            {
              k: EMPRESA.cobertura,
              v: "cobertura",
              giro: "rotate-[1.5deg]",
              tinta: "text-neutro-900",
            },
            {
              k: EMPRESA.fundacion,
              v: "desde",
              giro: "rotate-[-1deg]",
              tinta: "text-rojo-600",
            },
          ].map((s) => (
            <Recorte key={s.v} giro={s.giro}>
              <div
                className="border-[3px] border-neutro-900 px-4 py-6 text-center shadow-[5px_5px_0_0_#f2b705]"
                style={{ background: PAPEL }}
              >
                <p className={`font-black text-xl break-words uppercase sm:text-2xl ${s.tinta}`}>{s.k}</p>
                <p className="mt-1.5 text-sm tracking-[0.2em] uppercase">{s.v}</p>
              </div>
            </Recorte>
          ))}
        </div>
      </section>

      {/* ---------- catálogo: mecánica pop sobre papel de fanzine ---------- */}
      <section className="halftone">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="rotate-[-1deg] bg-neutro-900 px-3 py-1 font-bungee text-2xl text-crema sm:text-3xl lg:text-4xl">
              EL CATÁLOGO
            </h2>
            <span className="rotate-[2deg] border-[3px] border-neutro-900 bg-oro px-3 py-1 font-bungee text-sm shadow-[4px_4px_0_0_#0f1a23]">
              {PRODUCTOS_MUESTRA.length} PRODUCTOS
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <button className="border-[3px] border-neutro-900 bg-neutro-900 px-3 py-1 text-sm text-crema uppercase">
              Todos
            </button>
            {CATEGORIAS.map((c, i) => (
              <button
                key={c.id}
                className={`border-[3px] border-neutro-900 bg-white px-3 py-1 text-sm uppercase transition-transform hover:bg-oro ${
                  i % 2 ? "rotate-[1deg]" : "rotate-[-1deg]"
                }`}
              >
                {c.etiqueta}
              </button>
            ))}
          </div>

          <div className="mt-11 grid grid-cols-2 gap-7 sm:grid-cols-3 lg:grid-cols-4">
            {PRODUCTOS_MUESTRA.map((p, i) => (
              <Recorte
                key={p.id}
                giro={GIROS[i % GIROS.length]}
                // cinta y estrella nunca juntas: la esquina se amontona
                conCinta={i % 3 === 0 && i % 7 !== 3}
                className="transition-transform hover:rotate-0 hover:scale-[1.03]"
              >
                <article
                  className="flex h-full flex-col border-[3px] border-neutro-900 bg-white"
                  style={{ boxShadow: `6px 6px 0 0 ${SOMBRAS[i % SOMBRAS.length]}` }}
                >
                  <div className="fotocopia relative flex h-36 items-center justify-center border-b-[3px] border-neutro-900">
                    <EnvaseSilueta
                      categoria={p.categoria}
                      envase={p.envase}
                      className="h-28 w-auto"
                    />
                    <span className="absolute -top-2.5 -right-2.5 rotate-[8deg] border-[3px] border-neutro-900 bg-oro px-1.5 py-0.5 font-bungee text-[10px]">
                      {formatoCompleto(p)}
                    </span>
                    {i % 7 === 3 && (
                      <span className="absolute -top-4 -left-4 rotate-[-12deg]">
                        <Estrella>OFERTA</Estrella>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3">
                    <span className="self-start bg-rojo-500 px-1.5 text-[11px] text-crema uppercase">
                      {p.categoria}
                    </span>
                    <h3 className="mt-2 font-black text-sm leading-tight uppercase">
                      {p.nombre}
                    </h3>
                    {envaseEtiqueta(p.envase) && (
                      <p className="mt-1 text-sm text-neutro-600">
                        {envaseEtiqueta(p.envase)}
                      </p>
                    )}
                    <p className="mt-auto pt-3 text-sm underline decoration-rojo-500 decoration-[3px] underline-offset-2 uppercase">
                      Consultar precio
                    </p>
                  </div>
                </article>
              </Recorte>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- presentación ---------- */}
      <section className="fotocopia border-y-[3px] border-neutro-900">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <Recorte giro="rotate-[-1deg]" conCinta={false}>
            <div className="border-[3px] border-neutro-900 bg-white p-7 shadow-[8px_8px_0_0_#e1261c]">
              <Image src="/marca/logo-ljara.svg" alt="" width={78} height={78} aria-hidden />
              <h2 className="mt-6 font-black text-2xl leading-tight break-words uppercase sm:text-3xl">
                {EMPRESA.nombreLargo}
              </h2>
              <p className="mt-5 leading-relaxed">{EMPRESA.descripcionLarga}</p>
            </div>
          </Recorte>

          <ul className="space-y-7">
            {EMPRESA.diferenciales.map((d, i) => (
              <li key={d.titulo}>
                <Recorte giro={i % 2 ? "rotate-[1.2deg]" : "rotate-[-1.2deg]"}>
                  <div
                    className="border-[3px] border-neutro-900 bg-neutro-900 p-5 text-crema"
                    style={{
                      boxShadow: `6px 6px 0 0 ${SOMBRAS[i % SOMBRAS.length]}`,
                    }}
                  >
                    <h3 className="font-bungee text-lg text-oro">{d.titulo}</h3>
                    <p className="mt-2 text-crema/80">{d.detalle}</p>
                  </div>
                </Recorte>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- marcas ---------- */}
      <section className="franjas-toldo border-b-[3px] border-neutro-900 py-6">
        <ul className="flex flex-wrap items-center justify-center gap-3 px-4">
          {MARCAS_DESTACADAS.map((m, i) => (
            <li
              key={m}
              className={`border-2 border-neutro-900 bg-crema px-2.5 py-0.5 text-sm uppercase ${
                i % 2 ? "rotate-[1.5deg]" : "rotate-[-1.5deg]"
              }`}
            >
              {m}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- footer ---------- */}
      <footer>
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <Image src="/marca/logo-ljara.svg" alt="L.Jara" width={58} height={58} />
            <p className="mt-4 max-w-xs text-sm">{EMPRESA.descripcionCorta}</p>
          </div>
          <div>
            <h3 className="font-bungee text-base">CONTACTO</h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li>{EMPRESA.contacto.telefono}</li>
              <li>{EMPRESA.contacto.email}</li>
              <li>{EMPRESA.contacto.direccion}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bungee text-base">HORARIO</h3>
            <p className="mt-3 text-sm">{EMPRESA.contacto.horario}</p>
          </div>
        </div>
        <div className="border-t-[3px] border-neutro-900">
          <p className="mx-auto max-w-6xl px-4 py-4 text-xs uppercase sm:px-6">
            © {EMPRESA.fundacion} {EMPRESA.nombreLargo}. Venta de alcoholes solo a
            mayores de 18 años.
          </p>
        </div>
      </footer>
    </div>
  );
}
