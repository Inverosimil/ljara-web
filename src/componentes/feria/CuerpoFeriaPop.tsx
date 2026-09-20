import Image from "next/image";
import { EnvaseSilueta } from "@/componentes/EnvaseSilueta";
import { Estrella } from "@/componentes/feria/Estrella";
import { EMPRESA, MARCAS_DESTACADAS } from "@/contenido/empresa";
import { CATEGORIAS, PRODUCTOS_MUESTRA } from "@/contenido/productos-muestra";
import { envaseEtiqueta, formatoCompleto } from "@/lib/formato";

/* Todo lo que va DEBAJO del hero en la propuesta 1 · Feria: cifras, catálogo con
 * la mecánica pop, presentación, marcas y footer.
 *
 * Sigue extraído porque la mecánica de catálogo —trama de puntos, fichas rotadas,
 * sombras duras que alternan— es la parte validada del diseño y conviene tener un
 * solo lugar donde tocarla. */

/** Sombras duras que alternan: es lo que le da el ritmo pop a la grilla. */
const SOMBRAS = [
  "var(--color-pop-cian)",
  "var(--color-rojo-500)",
  "var(--color-oro)",
];
const GIROS = [
  "rotate-[-1.5deg]",
  "rotate-[1deg]",
  "rotate-[0.5deg]",
  "rotate-[-0.75deg]",
];

export function CuerpoFeriaPop() {
  return (
    <>
      {/* ---------- cifras ---------- */}
      <section className="border-b-4 border-neutro-900 bg-neutro-900">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-3">
          {[
            { k: EMPRESA.cantidadProductos, v: "productos" },
            { k: EMPRESA.cobertura, v: "cobertura" },
            { k: EMPRESA.fundacion, v: "desde" },
          ].map((s, i) => (
            <div
              key={s.v}
              className={`px-5 py-7 text-center ${
                i < 2 ? "sm:border-r-4 sm:border-crema/25" : ""
              }`}
            >
              <p className="font-bungee text-xl break-words text-oro sm:text-2xl">{s.k}</p>
              <p className="mt-1.5 text-xs font-bold tracking-[0.22em] text-crema/70 uppercase">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- catálogo: acá manda Pop ---------- */}
      <section className="halftone">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-bungee text-3xl sm:text-4xl">EL CATÁLOGO</h2>
            <span className="rotate-[2deg] border-4 border-neutro-900 bg-oro px-4 py-1.5 font-bungee text-sm shadow-[4px_4px_0_0_#0f1a23]">
              {PRODUCTOS_MUESTRA.length} PRODUCTOS
            </span>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <button className="border-4 border-neutro-900 bg-neutro-900 px-4 py-1.5 text-sm font-bold tracking-wide text-crema uppercase">
              Todos
            </button>
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                className="border-4 border-neutro-900 bg-crema px-4 py-1.5 text-sm font-bold tracking-wide uppercase transition-transform hover:-rotate-3 hover:bg-oro"
              >
                {c.etiqueta}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {PRODUCTOS_MUESTRA.map((p, i) => (
              <article
                key={p.id}
                className={`${GIROS[i % GIROS.length]} flex flex-col border-4 border-neutro-900 bg-white transition-transform hover:rotate-0 hover:scale-[1.03]`}
                style={{ boxShadow: `6px 6px 0 0 ${SOMBRAS[i % SOMBRAS.length]}` }}
              >
                <div className="relative flex h-40 items-center justify-center border-b-4 border-neutro-900 bg-crema">
                  <EnvaseSilueta
                    categoria={p.categoria}
                    envase={p.envase}
                    className="h-32 w-auto"
                  />
                  <span className="absolute -top-3 -right-3 rotate-[8deg] border-[3px] border-neutro-900 bg-oro px-2 py-0.5 font-bungee text-[10px]">
                    {formatoCompleto(p)}
                  </span>
                  {i % 7 === 3 && (
                    <span className="absolute -top-4 -left-4 rotate-[-12deg]">
                      <Estrella>OFERTA</Estrella>
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-3.5">
                  <span className="self-start bg-rojo-500 px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] text-white uppercase">
                    {p.categoria}
                  </span>
                  <h3 className="mt-2 font-bungee text-base leading-tight">
                    {p.nombre}
                  </h3>
                  {envaseEtiqueta(p.envase) && (
                    <p className="mt-1 text-sm font-semibold text-neutro-600">
                      {envaseEtiqueta(p.envase)}
                    </p>
                  )}
                  <button className="mt-auto self-start pt-3 text-sm font-bold tracking-wide text-rojo-600 uppercase underline decoration-[3px] underline-offset-4">
                    Consultar precio
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- presentación ---------- */}
      <section className="border-y-4 border-neutro-900 bg-neutro-900 text-crema">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <Image
              src="/marca/logo-ljara-fondo-oscuro.svg"
              alt=""
              width={90}
              height={90}
              aria-hidden
            />
            <h2 className="mt-6 font-bungee text-2xl leading-snug break-words text-oro sm:text-3xl lg:text-4xl">
              {EMPRESA.nombreLargo}
            </h2>
            <p className="mt-5 text-crema/80">{EMPRESA.descripcionLarga}</p>
          </div>

          <ul className="space-y-4">
            {EMPRESA.diferenciales.map((d) => (
              <li
                key={d.titulo}
                className="border-4 border-crema bg-neutro-950 p-5 shadow-[6px_6px_0_0_#f2b705]"
              >
                <h3 className="font-bungee text-lg text-oro">{d.titulo}</h3>
                <p className="mt-1.5 text-crema/75">{d.detalle}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- marcas ---------- */}
      <section className="franjas-toldo border-b-4 border-neutro-900 py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4">
          {MARCAS_DESTACADAS.map((m) => (
            <li
              key={m}
              className="border-2 border-neutro-900 bg-crema px-3 py-1 text-sm font-bold uppercase"
            >
              {m}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="bg-crema">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <Image src="/marca/logo-ljara.svg" alt="L.Jara" width={64} height={64} />
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
        <div className="border-t-4 border-neutro-900">
          <p className="mx-auto max-w-7xl px-4 py-4 text-xs sm:px-6">
            © {EMPRESA.fundacion} {EMPRESA.nombreLargo}. Venta de alcoholes solo a
            mayores de 18 años.
          </p>
        </div>
      </footer>
    </>
  );
}
