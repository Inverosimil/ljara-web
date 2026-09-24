import Image from "next/image";
import { CuerpoFeriaPop } from "@/componentes/feria/CuerpoFeriaPop";
import { Estrella } from "@/componentes/feria/Estrella";
import { EMPRESA } from "@/contenido/empresa";

/* PROPUESTA 1 · FERIA
 *
 * La dirección ganadora, ya consolidada. Header y hero se resolvieron con la
 * alfombra de chapas del propio logo en vez de las franjas diagonales, que era lo
 * que no convencía; el titular se apoya en un bloque crema del que cuelga la corona
 * dentada. El catálogo mantiene la mecánica pop (trama de puntos, fichas rotadas,
 * sombras duras que alternan) en <CuerpoFeriaPop />.
 *
 * Es la más popular y la más chilena de las cuatro: cartel de almacén de barrio. */

export const metadata = { title: "1 · Feria — L.Jara" };

export default function PropuestaFeria() {
  return (
    <div className="bg-crema font-archivo text-neutro-900">
      {/* ---------- header ---------- */}
      <header className="border-b-4 border-neutro-900 bg-neutro-900">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-4 sm:px-6">
          <Image src="/marca/logo-ljara.svg" alt="L.Jara" width={54} height={54} />
          <p className="font-bungee text-2xl text-crema">L.JARA</p>

          <nav className="ml-auto hidden items-center gap-6 text-sm font-bold tracking-wide text-crema uppercase md:flex">
            <span className="bg-oro px-2 py-0.5 text-neutro-900">Catálogo</span>
            <span>Nosotros</span>
            <span>Contacto</span>
          </nav>

          <button className="ml-auto border-4 border-crema bg-rojo-500 px-5 py-2 font-bungee text-sm text-crema transition-transform hover:-rotate-2 md:ml-0">
            ¡PEDIR!
          </button>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <section className="relative overflow-hidden border-b-4 border-neutro-900 bg-rojo-500">
        {/* alfombra de chapas en vez de franjas */}
        <div className="patron-chapas absolute inset-0 opacity-20" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="inline-flex items-center gap-3 border-4 border-neutro-900 bg-neutro-900 px-5 py-2">
            <span className="size-3 rounded-full bg-oro" aria-hidden />
            <p className="font-bungee text-sm tracking-wide text-crema">
              {EMPRESA.bajada}
            </p>
          </div>

          {/* bloque crema con la corona dentada abajo */}
          <div className="relative mt-8 max-w-4xl">
            <div className="border-4 border-neutro-900 bg-crema px-6 py-8 shadow-[10px_10px_0_0_#0f1a23] sm:px-10">
              <h1 className="font-bungee text-[1.9rem] leading-[1.1] break-words hyphens-auto sm:text-5xl lg:text-7xl">
                {EMPRESA.claim}
              </h1>
            </div>
            {/* dientes de la chapa colgando del bloque */}
            <div
              className="h-5 w-full bg-neutro-900"
              style={{
                maskImage:
                  "repeating-linear-gradient(90deg, #000 0 16px, transparent 16px 32px)",
                WebkitMaskImage:
                  "repeating-linear-gradient(90deg, #000 0 16px, transparent 16px 32px)",
              }}
              aria-hidden
            />
          </div>

          <p className="mt-8 max-w-xl text-lg font-semibold text-crema">
            {EMPRESA.descripcionCorta}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 sm:gap-5">
            <button className="w-full border-4 border-neutro-900 bg-oro px-5 py-3 font-bungee text-sm shadow-[6px_6px_0_0_#0f1a23] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none sm:w-auto sm:px-7 sm:text-base">
              VER EL CATÁLOGO
            </button>
            <button className="w-full border-4 border-neutro-900 bg-crema px-5 py-3 font-bungee text-sm shadow-[6px_6px_0_0_#0f1a23] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none sm:w-auto sm:px-7 sm:text-base">
              HABLAR CON UN VENDEDOR
            </button>
            <Estrella>NUEVO</Estrella>
          </div>
        </div>
      </section>

      <CuerpoFeriaPop />
    </div>
  );
}
