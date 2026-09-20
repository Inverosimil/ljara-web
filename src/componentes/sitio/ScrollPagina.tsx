"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** El indicador sigue al documento, o a la columna del catálogo en escritorio. */
export function ScrollPagina() {
  const thumb = useRef<HTMLDivElement>(null);
  const fuente = useRef<HTMLElement | null>(null);
  const medidas = useRef({ recorrido: 1, maxScroll: 0 });
  const arrastre = useRef<{ y: number; scroll: number } | null>(null);
  const ruta = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("scroll-superpuesto");
    let frame = 0;
    const actualizar = () => {
      frame = 0;
      const el = thumb.current;
      if (!el) return;
      const region = window.matchMedia("(min-width: 768px)").matches
        ? document.querySelector<HTMLElement>("[data-scroll-principal]") : null;
      fuente.current = region;
      const headerBottom = document.querySelector(".sitio-publico > header")?.getBoundingClientRect().bottom ?? 0;
      const inicio = Math.max(0, headerBottom, region?.getBoundingClientRect().top ?? 0);
      const altoVisible = region?.clientHeight ?? innerHeight;
      const altoPista = Math.max(0, innerHeight - inicio);
      const total = region?.scrollHeight ?? document.documentElement.scrollHeight;
      const posicion = region?.scrollTop ?? scrollY;
      const maxScroll = Math.max(0, total - altoVisible);
      const tamano = Math.min(altoPista, Math.max(40, altoPista * altoVisible / Math.max(1, total)));
      const recorrido = altoPista - tamano;
      medidas.current = { recorrido, maxScroll };
      el.style.top = `${inicio}px`;
      el.style.height = `${tamano}px`;
      el.style.display = maxScroll <= 1 || altoPista <= 0 ? "none" : "block";
      el.style.transform = `translateY(${Math.min(1, Math.max(0, posicion / Math.max(1, maxScroll))) * recorrido}px)`;
    };
    const programar = () => { if (!frame) frame = requestAnimationFrame(actualizar); };
    const observer = new ResizeObserver(programar);
    observer.observe(document.body);
    const header = document.querySelector(".sitio-publico > header");
    if (header) observer.observe(header);
    const observarRegion = () => {
      const region = document.querySelector<HTMLElement>("[data-scroll-principal]");
      if (region) {
        observer.observe(region);
        for (const hijo of region.children) observer.observe(hijo);
      }
      programar();
    };
    // Incluye cambios de filtros, fotos y el contenido que llega tras Suspense.
    const cambios = new MutationObserver(observarRegion);
    cambios.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true });
    document.addEventListener("scroll", programar, { passive: true, capture: true });
    window.addEventListener("resize", observarRegion);
    document.addEventListener("animationend", programar);
    observarRegion();
    return () => {
      document.documentElement.classList.remove("scroll-superpuesto");
      cancelAnimationFrame(frame);
      observer.disconnect();
      cambios.disconnect();
      document.removeEventListener("scroll", programar, true);
      window.removeEventListener("resize", observarRegion);
      document.removeEventListener("animationend", programar);
      arrastre.current = null;
    };
  }, [ruta]);

  return <div ref={thumb} className="scroll-pagina-thumb" aria-hidden="true"
    onPointerDown={(e) => { arrastre.current = { y: e.clientY, scroll: fuente.current?.scrollTop ?? scrollY }; e.currentTarget.setPointerCapture(e.pointerId); }}
    onPointerMove={(e) => {
      if (!arrastre.current) return;
      const region = fuente.current;
      const { recorrido, maxScroll } = medidas.current;
      const top = arrastre.current.scroll + (e.clientY - arrastre.current.y) * maxScroll / Math.max(1, recorrido);
      if (region) region.scrollTo({ top, behavior: "instant" });
      else window.scrollTo({ top, behavior: "instant" });
    }}
    onPointerUp={() => { arrastre.current = null; }}
    onLostPointerCapture={() => { arrastre.current = null; }}
  />;
}
