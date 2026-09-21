"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cx } from "./base";
import { FichaAmpliada, type ProductoDetalle } from "./FichaAmpliada";

import styles from "./ModalProducto.module.css";

gsap.registerPlugin(useGSAP);

/* La ficha ampliada: el producto en grande, con su galería.
 *
 * Es un `<dialog>` del navegador y no un div con `position: fixed`. Lo que se
 * gana no es código sino comportamiento que habría que reescribir a mano y casi
 * siempre queda a medias: el foco queda atrapado dentro mientras está abierto,
 * Esc cierra y el resto de la página queda inerte para el lector de pantalla.
 *
 * ⚠️ El `<dialog>` ocupa toda la ventana y es transparente; el velo y el panel
 * son hijos suyos. Se hace así porque `::backdrop` es un pseudoelemento y **GSAP
 * no puede animar pseudoelementos**: para que el fondo se funda con el panel hay
 * que tener un nodo real que animar.
 *
 * ⚠️ La salida obliga a llevar una copia del producto. `close()` no se puede
 * llamar al empezar la animación —el diálogo desaparecería de golpe— y para
 * cuando termina, el padre ya puso `producto` en null. Por eso `mostrado` se
 * queda con el último producto hasta que la animación termina de verdad. */

export type { ProductoDetalle };

export function ModalProducto({
  producto,
  onCerrar,
  onCerrado,
  acciones,
}: {
  /** `null` es cerrado. */
  producto: ProductoDetalle | null;
  onCerrar: () => void;
  /** Se llama cuando la animación de salida TERMINÓ y el diálogo ya se cerró.
   *
   *  Lo necesita la ficha que se abre como ruta interceptada: ahí cerrar
   *  significa volver atrás en el historial, y hacerlo en `onCerrar` desmontaría
   *  el diálogo a mitad de la animación. */
  onCerrado?: () => void;
  /** Controles de pedido. Slot, para que esta pieza siga siendo presentacional. */
  acciones?: ReactNode;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const velo = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  /* ⚠️ La línea de tiempo anterior se mata antes de crear la nueva.
   *
   * Sin esto, abrir y cerrar rápido deja dos líneas peleando por las mismas
   * propiedades, y —peor— el `onComplete` de un cierre viejo llama a `close()`
   * cuando la ficha ya se estaba abriendo otra vez. Acá no se puede usar el
   * truco del panel del pedido —una sola línea que se reproduce y se invierte—
   * porque el contenido se desmonta al cerrar: cada producto trae el suyo. */
  const linea = useRef<gsap.core.Timeline | null>(null);
  /* Por ref y no capturada: `useGSAP` solo rearma la línea cuando cambia
   * `producto`, así que una función capturada ahí se quedaría congelada. */
  const onCerradoRef = useRef(onCerrado);
  useEffect(() => {
    onCerradoRef.current = onCerrado;
  }, [onCerrado]);

  const [mostrado, setMostrado] = useState<ProductoDetalle | null>(producto);

  /* Ajuste de estado durante el render, no en un efecto.
   *
   * Es el patrón que React documenta para «cuando cambia una prop»: llamar a
   * `setState` acá hace que React descarte este render y vuelva a empezar antes
   * de pintar nada. Con un efecto se pintaría un fotograma con el producto
   * anterior —la ficha se abriría mostrando el que se cerró— y encima el
   * `useGSAP` de abajo ya habría empezado la animación de entrada. */
  if (producto && producto !== mostrado) {
    setMostrado(producto);
  }

  useGSAP(
    () => {
      const d = dialogo.current;
      if (!d) return;

      /* Con «reducir movimiento» activado no se quita la animación: se pone en
       * duración cero. Así el `onComplete` que cierra el diálogo sigue
       * corriendo, que es de lo que depende que la ficha se cierre de verdad. */
      const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const t = (segundos: number) => (quieto ? 0 : segundos);

      linea.current?.kill();

      if (producto) {
        if (!d.open) d.showModal();
        linea.current = gsap
          .timeline()
          .fromTo(velo.current, { opacity: 0 }, { opacity: 1, duration: t(0.2), ease: "power1.out" })
          .fromTo(
            panel.current,
            { opacity: 0, y: 28, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: t(0.34), ease: "back.out(1.5)" },
            t(0.08),
          );
        return;
      }

      if (!d.open) return;
      linea.current = gsap
        .timeline({
          onComplete: () => {
            d.close();
            setMostrado(null);
            onCerradoRef.current?.();
          },
        })
        .to(panel.current, { opacity: 0, y: 14, scale: 0.98, duration: t(0.18), ease: "power2.in" })
        .to(velo.current, { opacity: 0, duration: t(0.18) }, "<");
    },
    { scope: dialogo, dependencies: [producto] },
  );

  /* El navegador deja el fondo inerte pero lo sigue dejando desplazar: al cerrar,
   * la grilla habría quedado en otra posición y el producto que se estaba
   * mirando ya no estaría donde uno lo dejó. */
  useEffect(() => {
    if (!producto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [producto]);

  return (
    <dialog
      ref={dialogo}
      /* Esc no cierra solo: si lo hiciera, el diálogo desaparecería sin animarse
         y el estado del padre seguiría creyéndolo abierto. Se intercepta y se
         pide el cierre por el mismo camino que el botón. */
      onCancel={(e) => {
        e.preventDefault();
        onCerrar();
      }}
      aria-labelledby="titulo-ficha"
      className={cx(
        "fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none",
        "bg-transparent p-0 text-tinta backdrop:bg-transparent",
      )}
    >
      <div
        ref={velo}
        onClick={onCerrar}
        className="absolute inset-0 bg-tinta/70"
        aria-hidden
      />

      {mostrado && (
        <div className="relative flex h-full items-center justify-center p-3 sm:p-6" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
          <div
            ref={panel}
            className={styles.panel}
          >
            <div className="sticky top-0 z-20 flex h-0 justify-end pr-3">
            <button
              type="button"
              onClick={onCerrar}
              className={styles.cerrar}
            >
              <X aria-hidden className="size-5" />
              <span className="sr-only">Cerrar</span>
            </button>
            </div>

            {/* `key` reinicia la galería al cambiar de producto: sin eso la
                ficha se abriría mostrando la miniatura que se eligió en la
                anterior. */}
            <FichaAmpliada
              key={mostrado.id}
              producto={mostrado}
              acciones={acciones}
              idTitulo="titulo-ficha"
            />
          </div>
        </div>
      )}
    </dialog>
  );
}
