"use client";

import Link from "next/link";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { BotonPedido } from "@/componentes/pedido/BotonPedido";
import { Chapa, cx } from "@/componentes/ui";
import styles from "./Encabezado.module.css";

const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/contacto", texto: "Contacto" },
];

export function Encabezado() {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();
  const encabezado = useRef<HTMLElement>(null);
  const marca = useRef<HTMLAnchorElement>(null);
  const revelar = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    const enlace = marca.current;
    const logo = enlace?.firstElementChild;
    if (!enlace || !logo) return;
    const media = gsap.matchMedia();
    media.add({ grande: "(min-width: 640px)", pequeno: "(max-width: 639px)", quieto: "(prefers-reduced-motion: reduce)" }, (contexto) => {
      const alto = encabezado.current?.getBoundingClientRect().height ?? 72;
      const tamano = logo.getBoundingClientRect().height;
      const quieto = contexto.conditions?.quieto;
      const bajada = (tamano - alto) / 2 + 8;
      const recorte = `inset(${Math.max(0, (tamano - alto) / 2 + 4)}px -5px ${Math.max(0, (tamano - alto) / 2 - 4)}px -5px)`;
      // Preparar geometría y origen antes del primer frame evita el salto inicial.
      gsap.set(enlace, { clipPath: recorte });
      gsap.set(logo, { y: 0, scale: 1, transformOrigin: "top center", force3D: false });
      const ritmo = (p: number) => .3 * p + .7 * p * p * (3 - 2 * p);
      revelar.current = gsap.timeline({ paused: true })
        .to(logo, { y: (alto - tamano) / 2 + 2, duration: quieto ? 0 : .11, ease: ritmo })
        .to(enlace, { clipPath: `inset(-8px -12px ${-bajada - tamano * .08 - 5}px -12px)`, duration: quieto ? 0 : .20, ease: ritmo })
        .to(logo, { y: bajada, scale: 1.08, duration: quieto ? 0 : .20, ease: ritmo }, "<");
      return () => { if (revelar.current) gsap.killTweensOf(revelar.current); revelar.current = null; };
    });
    return () => media.revert();
  }, [ruta]);
  function animarMarca(entrando: boolean) {
    const linea = revelar.current;
    if (!linea) return;
    gsap.killTweensOf(linea);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      linea.progress(entrando ? 1 : 0).pause();
      return;
    }
    // Cambiar gradualmente la velocidad permite invertir sin un tirón.
    if (linea.progress() === 0 || linea.progress() === 1) {
      linea.timeScale(entrando ? 1 : -1).paused(false);
      return;
    }
    linea.paused(false);
    gsap.to(linea, { timeScale: entrando ? 1 : -1, duration: .10, ease: "sine.inOut", overwrite: true });
  }
  const botonMenu = useRef<HTMLButtonElement>(null);
  const [ultimaRuta, setUltimaRuta] = useState(ruta);
  if (ruta !== ultimaRuta) { setUltimaRuta(ruta); setAbierto(false); }



  const esActiva = (href: string) =>
    href === "/" ? ruta === "/" : ruta.startsWith(href);

  return (
    /* Sin nada encima. Antes iba una tira de banderines de toldo: era lo primero
       que se veía al entrar y lo primero que se veía al volver a cualquier
       página, y separaba el encabezado del borde de la ventana por un motivo
       decorativo. `Banderines` sigue en el sistema para separar secciones, que
       es donde tiene sentido. */
    <header ref={encabezado} className="sticky top-0 z-50" onKeyDown={(e) => { if (e.key === "Escape" && abierto) { setAbierto(false); botonMenu.current?.focus(); } }}>
      <div className="bg-tinta">
        <div className="mx-auto flex h-[var(--alto-encabezado)] max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link ref={marca} href="/"
            onPointerEnter={(e) => { if (e.pointerType === "mouse") animarMarca(true); }}
            onPointerLeave={(e) => { if (e.currentTarget !== document.activeElement) animarMarca(false); }}
            onFocus={() => animarMarca(true)}
            onBlur={() => animarMarca(false)}
            className={cx(styles.marca, styles.marcaRecortada)} aria-label="L.Jara — Inicio">
            <Chapa tamano="xl" className={styles.logo} />
          </Link>

          <nav aria-label="Principal" className="ml-auto hidden md:block">
            <ul className="flex items-center gap-2">
              {ENLACES.map((e) => (
                <li key={e.href}>
                  <Link
                    href={e.href}
                    aria-current={esActiva(e.href) ? "page" : undefined}
                    className={styles.enlace}
                  >
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto md:ml-3"><BotonPedido /></div>

          <button
            ref={botonMenu}
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            className={cx(styles.menu, "grid size-11 shrink-0 place-items-center text-crema md:hidden")}
          >
            <span className="sr-only">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
            {abierto ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>

        {abierto && (
          <nav
            id="menu-movil"
            aria-label="Principal"
            className={cx(styles.movil, "entrada-menu border-t border-crema/10 md:hidden")}
          >
            <ul className="mx-auto max-w-6xl space-y-1 px-4 pb-4 pt-9 sm:px-6">
              {ENLACES.map((e) => (
                <li key={e.href}>
                  <Link
                    href={e.href}
                    onClick={() => setAbierto(false)}
                    aria-current={esActiva(e.href) ? "page" : undefined}
                    className={styles.enlace}
                  >
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
