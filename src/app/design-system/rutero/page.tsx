import Image from "next/image";
import { EnvaseSilueta } from "@/componentes/EnvaseSilueta";
import { EMPRESA, MARCAS_DESTACADAS } from "@/contenido/empresa";
import { CATEGORIAS, PRODUCTOS_MUESTRA } from "@/contenido/productos-muestra";
import { envaseEtiqueta, formatoCompleto } from "@/lib/formato";

/* PROPUESTA 4 · RUTERO
 * Rotulación de camión de reparto: placas metálicas remachadas, franjas
 * reflectantes naranja y negro, condensada de letrero y numeración grande. Es la
 * que más habla de lo que la empresa realmente hace — mover cajas por la ruta. */

export const metadata = { title: "4 · Rutero — L.Jara" };

/** Placa metálica con remaches en las esquinas. */
function Placa({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`placa-metal relative border-2 border-neutro-950/60 bg-neutro-800 ${className}`}
    >
      {[
        "top-1.5 left-1.5",
        "top-1.5 right-1.5",
        "bottom-1.5 left-1.5",
        "bottom-1.5 right-1.5",
      ].map((pos) => (
        <span
          key={pos}
          className={`absolute ${pos} size-1.5 rounded-full bg-neutro-950/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]`}
          aria-hidden
        />
      ))}
      {children}
    </div>
  );
}

export default function PropuestaRutero() {
  return (
    <div className="bg-neutro-100 font-condensada text-neutro-900">
      {/* ---------- franja reflectante superior ---------- */}
      <div className="franja-peligro h-4" aria-hidden />

      {/* ---------- header: costado del camión ---------- */}
      <header className="placa-metal border-b-4 border-neutro-950 bg-neutro-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4 sm:px-6">
          <Image src="/marca/logo-ljara.svg" alt="L.Jara" width={54} height={54} />
          <div className="leading-none">
            <p className="font-placa text-3xl tracking-wide text-crema">L.JARA</p>
            <p className="mt-1 text-xs tracking-[0.3em] text-ruta-naranja uppercase">
              Distribuidora
            </p>
          </div>

          <nav className="ml-auto hidden items-center gap-7 font-placa text-lg tracking-wide text-crema/80 md:flex">
            <span className="border-b-4 border-ruta-naranja pb-0.5 text-crema">
              Catálogo
            </span>
            <span>Nosotros</span>
            <span>Contacto</span>
          </nav>

          <button className="ml-auto bg-ruta-naranja px-6 py-2.5 font-placa text-lg tracking-wide text-neutro-950 transition-colors hover:bg-crema md:ml-0">
            Pedir carga
          </button>
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <section className="relative overflow-hidden border-b-4 border-neutro-950 bg-rojo-500">
        <div className="pointer-events-none absolute -right-24 -bottom-28 opacity-10 select-none">
          <Image
            src="/marca/logo-ljara-mono.svg"
            alt=""
            width={480}
            height={480}
            aria-hidden
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="inline-flex items-center gap-3 bg-neutro-950 px-4 py-1.5">
            <span className="size-2.5 rounded-full bg-ruta-naranja" aria-hidden />
            <p className="font-placa text-sm tracking-[0.2em] text-crema uppercase">
              {EMPRESA.bajada}
            </p>
          </div>

          <h1 className="mt-7 max-w-4xl font-placa text-[2.4rem] leading-[1] tracking-wide break-words text-crema uppercase sm:text-6xl lg:text-8xl">
            <span style={{ textShadow: "5px 5px 0 rgba(10,17,23,0.85)" }}>
              {EMPRESA.claim}
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-xl text-crema/95">
            {EMPRESA.descripcionCorta}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="w-full bg-ruta-naranja px-6 py-3.5 font-placa text-lg tracking-wide text-neutro-950 transition-transform hover:-translate-y-1 sm:w-auto sm:px-8 sm:text-xl">
              Ver el catálogo
            </button>
            <button className="w-full border-4 border-crema px-6 py-3.5 font-placa text-lg tracking-wide text-crema transition-colors hover:bg-crema hover:text-neutro-950 sm:w-auto sm:px-8 sm:text-xl">
              Hablar con un vendedor
            </button>
          </div>
        </div>

        <div className="franja-peligro h-4" aria-hidden />
      </section>

      {/* ---------- cifras: placas remachadas ---------- */}
      <section className="bg-neutro-900 py-8">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-3 sm:px-6">
          {[
            { k: EMPRESA.cantidadProductos, v: "productos en ruta" },
            { k: EMPRESA.cobertura, v: "zona de reparto" },
            { k: EMPRESA.fundacion, v: "en la carretera desde" },
          ].map((s) => (
            <Placa key={s.v} className="px-6 py-7 text-center">
              <p className="font-placa text-2xl tracking-wide break-words text-ruta-naranja sm:text-3xl">
                {s.k}
              </p>
              <p className="mt-1.5 text-sm tracking-[0.18em] text-crema/60 uppercase">
                {s.v}
              </p>
            </Placa>
          ))}
        </div>
      </section>

      {/* ---------- catálogo: manifiesto de carga ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-neutro-950 pb-4">
          <div>
            <p className="text-sm tracking-[0.24em] text-rojo-600 uppercase">
              Manifiesto de carga
            </p>
            <h2 className="font-placa text-3xl tracking-wide uppercase sm:text-5xl">
              El catálogo
            </h2>
          </div>
          <p className="font-placa text-2xl tracking-wide text-neutro-500">
            {String(PRODUCTOS_MUESTRA.length).padStart(3, "0")} ÍTEMS
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <button className="bg-neutro-950 px-4 py-1.5 font-placa text-base tracking-wide text-crema">
            Todos
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              className="border-2 border-neutro-950 px-4 py-1.5 font-placa text-base tracking-wide transition-colors hover:bg-ruta-naranja"
            >
              {c.etiqueta}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {PRODUCTOS_MUESTRA.map((p, i) => (
            <article
              key={p.id}
              className="group flex flex-col border-2 border-neutro-950 bg-white transition-transform hover:-translate-y-1"
            >
              {/* cinta de número de ítem, como en un manifiesto */}
              <div className="flex items-center justify-between border-b-2 border-neutro-950 bg-neutro-950 px-2.5 py-1">
                <span className="font-placa text-sm tracking-wider text-ruta-naranja">
                  {String(i + 1).padStart(3, "0")}
                </span>
                <span className="text-xs tracking-wider text-crema/60 tabular-nums">
                  #{p.codigo}
                </span>
              </div>

              <div className="relative flex h-36 items-center justify-center bg-neutro-100">
                <EnvaseSilueta
                  categoria={p.categoria}
                  envase={p.envase}
                  className="h-28 w-auto"
                />
                <span className="absolute right-2 bottom-2 bg-ruta-naranja px-1.5 py-0.5 font-placa text-xs tracking-wide">
                  {formatoCompleto(p)}
                </span>
              </div>

              <div className="flex flex-1 flex-col border-t-2 border-neutro-950 p-3">
                <span className="text-xs tracking-[0.16em] text-rojo-600 uppercase">
                  {p.categoria}
                </span>
                <h3 className="mt-1 font-placa text-xl leading-tight tracking-wide uppercase">
                  {p.nombre}
                </h3>
                {envaseEtiqueta(p.envase) && (
                  <p className="mt-0.5 text-base text-neutro-600">
                    {envaseEtiqueta(p.envase)}
                  </p>
                )}
                <button className="mt-auto self-start pt-3 font-placa text-base tracking-wide text-neutro-900 uppercase underline decoration-ruta-naranja decoration-[3px] underline-offset-4 group-hover:text-rojo-600">
                  Consultar precio
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- presentación ---------- */}
      <section className="border-y-4 border-neutro-950 bg-neutro-900 text-crema">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <Image
              src="/marca/logo-ljara-fondo-oscuro.svg"
              alt=""
              width={92}
              height={92}
              aria-hidden
            />
            <h2 className="mt-6 font-placa text-3xl leading-tight tracking-wide break-words uppercase sm:text-4xl lg:text-5xl">
              {EMPRESA.nombreLargo}
            </h2>
            <p className="mt-6 text-lg text-crema/75">{EMPRESA.descripcionLarga}</p>
          </div>

          <ul className="space-y-4">
            {EMPRESA.diferenciales.map((d, i) => (
              <li key={d.titulo}>
                <Placa className="flex gap-5 px-6 py-5">
                  <span className="font-placa text-4xl tracking-wide text-ruta-naranja">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-placa text-2xl tracking-wide uppercase">
                      {d.titulo}
                    </h3>
                    <p className="mt-1 text-crema/70">{d.detalle}</p>
                  </div>
                </Placa>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- marcas ---------- */}
      <section className="border-b-4 border-neutro-950 bg-neutro-100 py-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4">
          {MARCAS_DESTACADAS.map((m) => (
            <li
              key={m}
              className="font-placa text-2xl tracking-wide text-neutro-400 uppercase"
            >
              {m}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="bg-neutro-950 text-crema">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <Image
              src="/marca/logo-ljara-fondo-oscuro.svg"
              alt="L.Jara"
              width={60}
              height={60}
            />
            <p className="mt-4 max-w-xs text-crema/70">{EMPRESA.descripcionCorta}</p>
          </div>
          <div>
            <h3 className="font-placa text-xl tracking-wide text-ruta-naranja uppercase">
              Contacto
            </h3>
            <ul className="mt-3 space-y-1.5 text-crema/70">
              <li>{EMPRESA.contacto.telefono}</li>
              <li>{EMPRESA.contacto.email}</li>
              <li>{EMPRESA.contacto.direccion}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-placa text-xl tracking-wide text-ruta-naranja uppercase">
              Horario
            </h3>
            <p className="mt-3 text-crema/70">{EMPRESA.contacto.horario}</p>
          </div>
        </div>
        <div className="franja-peligro h-4" aria-hidden />
        <p className="mx-auto max-w-7xl px-4 py-4 text-sm text-crema/50 sm:px-6">
          © {EMPRESA.fundacion} {EMPRESA.nombreLargo}. Venta de alcoholes solo a
          mayores de 18 años.
        </p>
      </footer>
    </div>
  );
}
