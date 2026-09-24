import Image from "next/image";
import { EnvaseSilueta } from "@/componentes/EnvaseSilueta";
import { EMPRESA, MARCAS_DESTACADAS } from "@/contenido/empresa";
import { CATEGORIAS, PRODUCTOS_MUESTRA } from "@/contenido/productos-muestra";
import { envaseEtiqueta, formatoCompleto } from "@/lib/formato";

/* PROPUESTA 3 · ARCADE
 * Máquina de fichas de los 90: pantalla CRT con rejilla y scanlines, tipografía
 * pixelada, bordes escalonados y verde fósforo sobre el rojo de marca. El catálogo
 * se lee como una pantalla de selección de personaje. */

export const metadata = { title: "3 · Arcade — L.Jara" };

/** Marco escalonado: dos rectángulos desfasados imitan una esquina pixelada. */
function MarcoPixel({
  children,
  className = "",
  color = "var(--color-arcade-verde)",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ boxShadow: `0 -4px 0 0 ${color}, 0 4px 0 0 ${color}, -4px 0 0 0 ${color}, 4px 0 0 0 ${color}` }}
    >
      {children}
    </div>
  );
}

export default function PropuestaArcade() {
  return (
    <div className="scanlines bg-neutro-950 font-chakra text-crema">
      <div className="rejilla-crt">
        {/* ---------- header: barra de créditos ---------- */}
        <header className="sticky top-0 z-40 border-b-4 border-arcade-verde bg-neutro-950/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
            <Image src="/marca/logo-ljara.svg" alt="L.Jara" width={40} height={40} />
            <p className="font-pixel text-sm text-arcade-verde">L.JARA</p>

            <nav className="hidden items-center gap-5 font-pixel text-[10px] md:flex">
              <span className="text-oro">▸CATALOGO</span>
              <span className="text-crema/60">NOSOTROS</span>
              <span className="text-crema/60">CONTACTO</span>
            </nav>

            <p className="ml-auto font-pixel text-[10px] text-crema/70">
              CREDITS <span className="text-arcade-verde">{EMPRESA.cantidadProductos}</span>
            </p>

            <button className="border-4 border-rojo-500 bg-rojo-500 px-4 py-2 font-pixel text-[10px] text-crema transition-colors hover:border-oro hover:bg-oro hover:text-neutro-950">
              PEDIR
            </button>
          </div>
        </header>

        {/* ---------- hero: pantalla de título ---------- */}
        <section className="border-b-4 border-arcade-verde">
          <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
            <p className="font-pixel text-[10px] tracking-widest text-arcade-verde">
              ★ INSERT COIN ★
            </p>

            <h1 className="mx-auto mt-9 max-w-4xl font-pixel text-[0.95rem] leading-[1.9] break-words text-crema sm:text-2xl sm:leading-[1.7] lg:text-4xl lg:leading-[1.6]">
              <span className="sombra-arcade">{EMPRESA.claim}</span>
            </h1>

            <p className="mx-auto mt-12 max-w-xl text-lg text-crema/70">
              {EMPRESA.descripcionCorta}
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <button className="border-4 border-arcade-verde bg-arcade-verde px-8 py-4 font-pixel text-xs text-neutro-950 transition-transform hover:-translate-y-1">
                ▸ START
              </button>
              <button className="border-4 border-crema px-8 py-4 font-pixel text-xs text-crema transition-colors hover:border-oro hover:text-oro">
                ▸ HABLAR
              </button>
            </div>

            <p className="mt-12 font-pixel text-[9px] leading-[1.9] break-words text-crema/40">
              {EMPRESA.cobertura} · DESDE {EMPRESA.fundacion}
            </p>
          </div>
        </section>

        {/* ---------- marcador de cifras ---------- */}
        <section className="border-b-4 border-arcade-verde bg-neutro-900">
          <div className="mx-auto grid max-w-7xl gap-px sm:grid-cols-3">
            {[
              { k: EMPRESA.cantidadProductos, v: "PRODUCTOS", c: "text-arcade-verde" },
              { k: EMPRESA.cobertura, v: "ZONA", c: "text-oro" },
              { k: EMPRESA.fundacion, v: "HIGH SCORE", c: "text-rojo-400" },
            ].map((s) => (
              <div key={s.v} className="px-5 py-7 text-center">
                <p className={`font-pixel text-sm break-words sm:text-lg ${s.c}`}>{s.k}</p>
                <p className="mt-3 font-pixel text-[9px] text-crema/50">{s.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- catálogo: selección de personaje ---------- */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-pixel text-base break-words text-arcade-verde sm:text-xl lg:text-2xl">
              SELECT PRODUCT
            </h2>
            <p className="font-pixel text-[10px] text-crema/50">
              {PRODUCTOS_MUESTRA.length} EN PANTALLA
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="border-4 border-arcade-verde bg-arcade-verde px-3 py-1.5 font-pixel text-[9px] text-neutro-950">
              TODOS
            </button>
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                className="border-4 border-crema/30 px-3 py-1.5 font-pixel text-[9px] text-crema/70 transition-colors hover:border-oro hover:text-oro"
              >
                {c.etiqueta.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {PRODUCTOS_MUESTRA.map((p, i) => (
              <MarcoPixel
                key={p.id}
                color={
                  i % 3 === 0
                    ? "var(--color-arcade-verde)"
                    : i % 3 === 1
                      ? "var(--color-rojo-500)"
                      : "var(--color-oro)"
                }
                className="group flex flex-col bg-neutro-900 transition-transform hover:-translate-y-1.5"
              >
                <div className="relative flex h-40 items-center justify-center bg-neutro-950">
                  <EnvaseSilueta
                    categoria={p.categoria}
                    envase={p.envase}
                    sobreOscuro
                    className="h-32 w-auto"
                  />
                  <span className="absolute top-2 right-2 bg-rojo-500 px-1.5 py-1 font-pixel text-[8px] text-crema">
                    {formatoCompleto(p)}
                  </span>
                  <span className="absolute bottom-2 left-2 font-pixel text-[8px] text-crema/35">
                    #{p.codigo}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-3.5">
                  <p className="font-pixel text-[8px] text-oro">
                    {p.categoria.toUpperCase()}
                  </p>
                  <h3 className="font-pixel text-[11px] leading-[1.7]">{p.nombre}</h3>
                  {envaseEtiqueta(p.envase) && (
                    <p className="text-sm text-crema/50">{envaseEtiqueta(p.envase)}</p>
                  )}
                  <p className="mt-auto pt-2 font-pixel text-[9px] text-arcade-verde group-hover:text-oro">
                    ▸ PRECIO
                  </p>
                </div>
              </MarcoPixel>
            ))}
          </div>
        </section>

        {/* ---------- presentación: pantalla de historia ---------- */}
        <section className="border-y-4 border-arcade-verde bg-neutro-900">
          <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
            <p className="text-center font-pixel text-[10px] text-oro">
              ★ STAGE 01 · QUIENES SOMOS ★
            </p>

            <h2 className="mt-10 text-center font-pixel text-sm leading-[1.9] break-words text-crema sm:text-lg lg:text-xl">
              {EMPRESA.nombreLargo}
            </h2>

            <p className="mt-10 text-center leading-relaxed text-crema/70">
              {EMPRESA.descripcionLarga}
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {EMPRESA.diferenciales.map((d, i) => (
                <MarcoPixel
                  key={d.titulo}
                  color="var(--color-arcade-violeta)"
                  className="bg-neutro-950 p-5"
                >
                  <p className="font-pixel text-[9px] text-arcade-verde">
                    P{i + 1}
                  </p>
                  <h3 className="mt-3 font-pixel text-[11px] leading-[1.7]">
                    {d.titulo}
                  </h3>
                  <p className="mt-3 text-sm text-crema/60">{d.detalle}</p>
                </MarcoPixel>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- marcas ---------- */}
        <section className="overflow-hidden border-b-4 border-arcade-verde py-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 px-4">
            {MARCAS_DESTACADAS.map((m) => (
              <li key={m} className="font-pixel text-[10px] text-crema/45">
                {m.toUpperCase()}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- footer ---------- */}
        <footer className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div>
            <Image
              src="/marca/logo-ljara-fondo-oscuro.svg"
              alt="L.Jara"
              width={56}
              height={56}
            />
            <p className="mt-4 max-w-xs text-sm text-crema/60">
              {EMPRESA.descripcionCorta}
            </p>
          </div>
          <div>
            <h3 className="font-pixel text-[10px] text-arcade-verde">CONTACTO</h3>
            <ul className="mt-4 space-y-2 text-sm text-crema/60">
              <li>{EMPRESA.contacto.telefono}</li>
              <li>{EMPRESA.contacto.email}</li>
              <li>{EMPRESA.contacto.direccion}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-pixel text-[10px] text-arcade-verde">HORARIO</h3>
            <p className="mt-4 text-sm text-crema/60">{EMPRESA.contacto.horario}</p>
          </div>

          <p className="border-t-4 border-crema/10 pt-5 font-pixel text-[8px] leading-[1.9] text-crema/35 md:col-span-3">
            © {EMPRESA.fundacion} {EMPRESA.nombreLargo}. VENTA DE ALCOHOLES SOLO A
            MAYORES DE 18 AÑOS.
          </p>
        </footer>
      </div>
    </div>
  );
}
