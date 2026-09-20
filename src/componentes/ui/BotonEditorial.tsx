"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./BotonEditorial.module.css";

gsap.registerPlugin(useGSAP);

export function BotonEditorial({ children, icono = "flecha", onClick, href }: {
  children: ReactNode;
  icono?: "flecha" | "whatsapp" | "conversacion" | "ubicacion";
  onClick?: () => void;
  href?: string;
}) {
  const simbolo = useRef<HTMLSpanElement>(null);
  const animacion = useRef<gsap.core.Timeline | null>(null);
  const { contextSafe } = useGSAP();
  const animar = () => contextSafe(() => {
    if (icono === "flecha" || !simbolo.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (animacion.current?.isActive()) return;
    const elemento = simbolo.current;
    const secuencia = gsap.timeline().timeScale(1.7);
    animacion.current = secuencia;
    if (icono === "ubicacion") {
      secuencia.timeScale(1)
        .to(elemento, { y: -3, duration: .14, ease: "power2.out" })
        .to(elemento, { y: 0, duration: .22, ease: "power2.inOut" });
      return;
    }
    // Shake breve y suave: una oscilación con amplitud decreciente.
    secuencia.to(elemento, { rotation: -8, duration: .16, ease: "sine.inOut" })
      .to(elemento, { rotation: 8, duration: .24, ease: "sine.inOut" })
      .to(elemento, { rotation: -4, duration: .2, ease: "sine.inOut" })
      .to(elemento, { rotation: 0, duration: .18, ease: "sine.out" });
  })();

  const contenido = (
    <>
      {children}
      <span ref={simbolo} className={`${styles.icono} ${icono === "flecha" ? styles.crecer : ""}`} aria-hidden="true">
        {icono === "flecha" ? <ArrowRight size={20} /> : icono === "conversacion" ? <MessageCircle size={21} /> : icono === "ubicacion" ? <MapPin size={21} /> : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.8A8.5 8.5 0 1 1 20.5 11.7Z" />
            <path d="M8.3 7.5c-.5 0-1.1.8-1.1 1.7 0 2.3 3.6 5.9 6.2 6.2.9.1 2-.6 2.1-1.3l.1-.8-2.1-1-.8 1c-1.4-.6-2.4-1.6-3-2.9l.8-.8-.9-2.1Z" />
          </svg>
        )}
      </span>
    </>
  );
  if (href) return (
    <Link href={href} className={styles.boton}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") animar(); }}
      onFocus={animar} onClick={() => { animar(); onClick?.(); }}>
      {contenido}
    </Link>
  );
  return (
    <button type="button" className={styles.boton}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") animar(); }}
      onFocus={animar} onClick={() => { animar(); onClick?.(); }}>
      {contenido}
    </button>
  );
}
