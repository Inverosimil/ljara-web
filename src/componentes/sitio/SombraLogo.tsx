"use client";

import { useEffect, useRef, useState, useId } from "react";
import gsap from "gsap";

/** Proyecta el recorte rojo solo sobre los píxeles del logo. */
export function SombraLogo() {
  const ref = useRef<SVGSVGElement>(null);
  const id = useId().replaceAll(":", "");
  const [medidas, setMedidas] = useState<number[] | null>(null);
  useEffect(() => {
    const logo = ref.current?.parentElement?.querySelector("img");
    const mascara = ref.current?.querySelector("mask image");
    if (!logo || !mascara || !medidas) return;
    const preferencia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const giro = { angulo: 12, escala: 1 };
    const cx = medidas[0] + medidas[2] / 2;
    const cy = medidas[1] + medidas[3] / 2;
    const dibujar = () => {
      logo.style.transform = `rotate(${giro.angulo}deg) scale(${giro.escala})`;
      mascara.setAttribute("transform", `translate(${cx} ${cy}) rotate(${giro.angulo}) scale(${giro.escala}) translate(${-cx} ${-cy})`);
    };
    let movimiento: gsap.core.Tween | undefined;
    const mover = (angulo: number, escala: number, duracion: number) => {
      movimiento?.kill();
      movimiento = gsap.to(giro, { angulo, escala, duration: duracion, ease: "power3.out", onUpdate: dibujar });
    };
    const activar = () => {
      if (!preferencia.matches) mover(17, 1.07, .65);
    };
    const salir = () => {
      if (!preferencia.matches) mover(12, 1, .4);
    };
    const reducir = () => {
      if (preferencia.matches) { movimiento?.kill(); giro.angulo = 12; giro.escala = 1; dibujar(); }
    };
    logo.addEventListener("pointerenter", activar);
    logo.addEventListener("pointerleave", salir);
    preferencia.addEventListener("change", reducir);
    return () => {
      logo.removeEventListener("pointerenter", activar);
      logo.removeEventListener("pointerleave", salir);
      preferencia.removeEventListener("change", reducir);
      movimiento?.kill();
      logo.style.removeProperty("transform");
    };
  }, [medidas]);
  useEffect(() => {
    const padre = ref.current?.parentElement;
    const logo = padre?.querySelector("img");
    const rojo = padre?.querySelector("h1 > span:nth-child(2)");
    if (!padre || !logo || !rojo) return;
    const medir = () => {
      const base = padre.getBoundingClientRect();
      const r = rojo.getBoundingClientRect();
      setMedidas([logo.offsetLeft, logo.offsetTop, logo.offsetWidth, logo.offsetHeight, r.left - base.left, r.top - base.top, r.width, r.height]);
    };
    const observer = new ResizeObserver(medir);
    observer.observe(padre); observer.observe(logo); observer.observe(rojo);
    medir();
    return () => observer.disconnect();
  }, []);
  return <svg ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
    {medidas && <>
      <defs>
        <mask id={`${id}-logo`} maskUnits="userSpaceOnUse" x="-500" y="-500" width="2000" height="2000" style={{ maskType: "alpha" }}>
          <image href="/marca/logo-ljara.svg" x={medidas[0]} y={medidas[1]} width={medidas[2]} height={medidas[3]} transform={`rotate(12 ${medidas[0] + medidas[2] / 2} ${medidas[1] + medidas[3] / 2})`} />
        </mask>
        <filter id={`${id}-blur`} x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <g mask={`url(#${id}-logo)`}>
        <rect x={medidas[4]} y={medidas[5] - 4} width={medidas[6]} height={medidas[7]} fill="black" opacity=".4" filter={`url(#${id}-blur)`} />
      </g>
    </>}
  </svg>;
}
