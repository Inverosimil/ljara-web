"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
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
    <header className="sticky top-0 z-50" onKeyDown={(e) => { if (e.key === "Escape" && abierto) { setAbierto(false); botonMenu.current?.focus(); } }}>
      <div className="bg-tinta">
        <div className="mx-auto flex h-[var(--alto-encabezado)] max-w-6xl items-center gap-4 px-4 sm:px-6">
          {/* La chapa entera, dentro de la barra. Hasta el 2026-10-30 asomaba
              recortada arriba y abajo y se revelaba al pasar el mouse: en el
              teléfono no hay mouse, así que quedaba cortada para siempre y se
              leía como un error. */}
          <Link href="/" className={styles.marca} aria-label="L. Jara — Inicio">
            <Chapa tamano="lg" variante="claro" className={styles.logo} />
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
            <ul className="mx-auto max-w-6xl space-y-1 px-4 pb-4 pt-3 sm:px-6">
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
