"use client";

import { Lato } from "next/font/google";
import { BotonEditorial } from "@/componentes/ui/BotonEditorial";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { SembrarCatalogo } from "@/componentes/pedido/SembrarCatalogo";
import {
  Boton,
  FichaProducto,
  Paginacion,
  Recorte,
  cx,
} from "@/componentes/ui";
import { enlaceWhatsApp } from "@/lib/pedido";
import { rutaProducto } from "@/lib/producto-url";
import { ORDENES } from "@/lib/catalogo-opciones";
import {
  type CategoriaSitio,
  type Orden,
  type ProductoSitio,
} from "@/lib/catalogo";

/* El catálogo: barra de filtros, grilla y ficha ampliada.
 *
 * ⚠️ **El filtro vive en la URL, no en el estado.** Filtrar, ordenar y paginar
 * son ahora consultas a la base (`lib/catalogo.ts`), así que quien decide qué se
 * pide es el servidor y lo único que este componente hace es cambiar la
 * dirección. A cambio, un catálogo filtrado se puede compartir por WhatsApp, el
 * botón de volver hace lo que se espera, y recargar no pierde el filtro.
 *
 * El buscador es la excepción parcial: escribe en su propio estado y espera a
 * que la persona deje de teclear antes de tocar la URL. Sin eso, cada letra
 * sería una consulta y una entrada en el historial. */

import { Search, LayoutGrid, Wine, Beer, Droplets, Milk, ChevronDown, Check } from "lucide-react";
import styles from "./Catalogo.module.css";

const lectura = Lato({ subsets: ["latin"], weight: "400", style: "italic", display: "swap" });
const ESPERA_BUSQUEDA = 350;

export function Catalogo({
  productos,
  categorias,
  total,
  pagina,
  paginas,
  categoria,
  orden,
  busqueda,
  pie,
}: {
  productos: ProductoSitio[];
  categorias: CategoriaSitio[];
  total: number;
  pagina: number;
  paginas: number;
  categoria: string;
  orden: Orden;
  busqueda: string;
  pie?: ReactNode;
}) {
  const resultados = useRef<HTMLDivElement>(null);
  const selector = useRef<HTMLDivElement>(null);
  const [ordenAbierto, setOrdenAbierto] = useState(false);
  useEffect(() => {
    if (!ordenAbierto) return;
    const cerrarFuera = (e: PointerEvent) => { if (!selector.current?.contains(e.target as Node)) setOrdenAbierto(false); };
    document.addEventListener("pointerdown", cerrarFuera);
    return () => document.removeEventListener("pointerdown", cerrarFuera);
  }, [ordenAbierto]);
  const router = useRouter();
  const params = useSearchParams();
  const [pendiente, iniciar] = useTransition();

  const [texto, setTexto] = useState(busqueda);

  /* Si la URL cambia por fuera —el botón de volver, un enlace del inicio— el
   * campo tiene que seguirla. Compara contra el valor que vino del servidor
   * justamente para no pisar lo que la persona está tecleando. */
  const ultimaBusqueda = useRef(busqueda);
  useEffect(() => {
    if (busqueda !== ultimaBusqueda.current) {
      ultimaBusqueda.current = busqueda;
      setTexto(busqueda);
    }
  }, [busqueda]);

  // Repetir al llegar el resultado evita que el navegador restaure el scroll
  // anterior durante el cambio de altura de la grilla.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    resultados.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [categoria, orden, busqueda, pagina]);

  function irA(cambios: Record<string, string | null>, opciones?: { arriba?: boolean }) {
    const siguiente = new URLSearchParams(params.toString());
    for (const [clave, valor] of Object.entries(cambios)) {
      if (valor === null || valor === "") siguiente.delete(clave);
      else siguiente.set(clave, valor);
    }
    const cadena = siguiente.toString();
    iniciar(() => {
      // El scroll se controla para el documento y la columna de productos.
      router.push(cadena ? `/catalogo?${cadena}` : "/catalogo", { scroll: false });
      if (opciones?.arriba) {
        /* `instant` y no `smooth`: el sitio tiene `scroll-behavior: smooth` en
         * `html` para los anclas, y desde el final de una grilla larga eso es un
         * viaje de varios segundos mirando pasar productos que ya no son los que
         * se pidieron. Al cambiar de página se salta y punto. */
        window.scrollTo({ top: 0, behavior: "instant" });
        resultados.current?.scrollTo({ top: 0, behavior: "instant" });
      }
    });
  }

  // Cambiar cualquier filtro devuelve a la página 1: quedarse en la 4 de un
  // listado que ahora tiene 2 muestra una grilla vacía sin explicación.
  function filtrar(cambios: Record<string, string | null>) {
    irA({ ...cambios, p: null }, { arriba: true });
  }

  useEffect(() => {
    if (texto === ultimaBusqueda.current) return;
    const t = window.setTimeout(() => {
      ultimaBusqueda.current = texto;
      filtrar({ q: texto.trim() || null });
    }, ESPERA_BUSQUEDA);
    return () => window.clearTimeout(t);
    // `filtrar` se rearma en cada render y no tiene estado propio; incluirlo
    // reiniciaría el temporizador en cada tecla, que es lo contrario de esperar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto]);

  const opcionesCategoria = [
    // «Todas» y no «Todas las categorías»: el rótulo del campo ya dice
    // «Categoría», y el texto largo se cortaba con puntos suspensivos.
    { id: "todos", etiqueta: "Todas" },
    ...categorias.map((c) => ({ id: c.id, etiqueta: c.etiqueta })),
  ];

  const whatsapp = enlaceWhatsApp("Hola, estoy buscando un producto y quisiera consultarles.");
  const filtrando = categoria !== "todos" || busqueda !== "";

  return (
    <section id="catalogo" aria-labelledby="titulo-catalogo" className={styles.catalogo}>
      <h2 id="titulo-catalogo" className="sr-only">
        Catálogo de productos
      </h2>

      <SembrarCatalogo productos={productos} />

      <aside className={styles.filtros} aria-label="Filtros del catálogo">
        <label className={styles.buscar}><span className="sr-only">Buscar producto o código</span><Search size={21} aria-hidden /><input type="search" placeholder="Producto o código" value={texto} onChange={(e) => setTexto(e.target.value)} /></label>
        <div ref={selector} className={styles.orden} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOrdenAbierto(false); }} onKeyDown={(e) => {
          if (e.key === "Escape") { setOrdenAbierto(false); selector.current?.querySelector<HTMLButtonElement>("button")?.focus(); }
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key) && ordenAbierto) {
            e.preventDefault();
            const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
            const i = items.indexOf(document.activeElement as HTMLButtonElement);
            const n = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : (i + (e.key === "ArrowUp" ? -1 : 1) + items.length) % items.length;
            items[n]?.focus();
          }
        }}>
          <button type="button" className={styles.selector} aria-label="Ordenar por" aria-haspopup="menu" aria-expanded={ordenAbierto} aria-controls="opciones-orden" onClick={() => setOrdenAbierto(!ordenAbierto)}><span>{params.has("orden") ? `Ordenar por: ${ORDENES.find((o) => o.id === orden)?.etiqueta ?? orden}` : "Ordenar por…"}</span><ChevronDown size={18} aria-hidden /></button>
          {ordenAbierto && <div id="opciones-orden" role="menu" aria-label="Ordenar productos" className={styles.opciones}>{ORDENES.map((o) => <button key={o.id} type="button" role="menuitemradio" aria-checked={orden === o.id} onClick={() => { filtrar({ orden: o.id }); setOrdenAbierto(false); selector.current?.querySelector<HTMLButtonElement>("button")?.focus(); }}>{o.etiqueta}{orden === o.id && <Check size={16} aria-hidden />}</button>)}</div>}
        </div>

        <div className={styles.grupos}>
          <h3 className="sr-only">Categorías</h3>
          <div className={styles.categorias}>
            {opcionesCategoria.map((c) => {
              const etiqueta = c.etiqueta.toLowerCase();
              const Icono = c.id === "todos" ? LayoutGrid : etiqueta.includes("cerve") ? Beer : etiqueta.includes("vino") ? Wine : etiqueta.includes("agua") ? Droplets : Milk;
              return <button key={c.id} type="button" aria-pressed={categoria === c.id} onClick={() => filtrar({ categoria: c.id === "todos" ? null : c.id })}><Icono size={22} aria-hidden />{c.etiqueta}</button>;
            })}
          </div>
        </div>
        <div className={styles.ayuda}>
          <h3><span>¿Buscas</span><span>algo más?</span></h3>
          <div className={`${styles.contactoAyuda} ${lectura.className}`}>
            <BotonEditorial href={whatsapp ?? "/contacto"} icono="conversacion">Háblanos</BotonEditorial>
          </div>
        </div>

            <Paginacion
              pagina={pagina}
              paginas={paginas}
              onIr={(n) => irA({ p: n === 1 ? null : String(n) }, { arriba: true })}
              className={styles.paginacion}
            />
      </aside>
      <div ref={resultados} data-scroll-principal className={styles.resultados} aria-busy={pendiente} tabIndex={0} aria-label="Productos del catálogo">
        
        {/* El contador visible se sacó a propósito —era un cartel amarillo
            girado que competía con los productos—, pero quien navega con lector
            de pantalla no ve la grilla cambiar de tamaño: esto se lo dice. */}
        <p aria-live="polite" className="sr-only">
          {total === 1 ? "1 producto" : `${total} productos`}
        </p>

        {productos.length > 0 ? (
          <>
            <ul
              className={cx(
                styles.grilla,
                // Mientras el servidor trae la página siguiente, la actual se
                // atenúa: sin esto la grilla se queda quieta y parece que el
                // clic no hizo nada.
                pendiente && "opacity-50",
              )}
            >
              {productos.map((p, indice) => (
                <li key={p.id}>
                  <FichaProducto producto={p} prioridad={indice < 4} href={rutaProducto(p)} />
                </li>
              ))}
            </ul>



          </>
        ) : (
          <Recorte className="mx-auto max-w-md">
            <div className="p-8 text-center">
              <p className="font-black text-xl uppercase">
                {filtrando ? "Sin resultados" : "Estamos preparando el catálogo"}
              </p>
              <p className="mt-3">
                {filtrando
                  ? "No encontramos productos con esos filtros. Prueba con otro nombre o código, o revisa todas las categorías."
                  : "Estamos preparando el catálogo. Escríbenos y te mandamos la lista vigente."}
              </p>
              {filtrando && (
                <Boton
                  variante="papel"
                  tamano="sm"
                  className="mt-6"
                  onClick={() => {
                    setTexto("");
                    ultimaBusqueda.current = "";
                    filtrar({ q: null, categoria: null });
                  }}
                >
                  Limpiar filtros
                </Boton>
              )}
            </div>
          </Recorte>
        )}
            <Paginacion
              pagina={pagina}
              paginas={paginas}
              onIr={(n) => irA({ p: n === 1 ? null : String(n) }, { arriba: true })}
              className={styles.paginacionFinal}
            />
        <div className={styles.pieCatalogo}>{pie}</div>
      </div>

    </section>
  );
}
