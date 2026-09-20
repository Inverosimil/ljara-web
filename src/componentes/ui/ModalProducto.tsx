"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { EnvaseSilueta } from "@/componentes/EnvaseSilueta";
import type { ProductoMuestra } from "@/contenido/productos-muestra";
import type { FotoProducto } from "@/lib/catalogo";
import { categoriaEtiqueta, contenido, envaseEtiqueta } from "@/lib/formato";
import { cx } from "./base";

import styles from "./ModalProducto.module.css";
import { IndicadorPedido } from "@/componentes/pedido/IndicadorPedido";

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

export type ProductoDetalle = ProductoMuestra & {
  categoriaNombre?: string | null;
  imagenes?: FotoProducto[];
  descripcion?: string | null;
  retornable?: boolean | null;
  gradoAlcoholico?: number | null;
};

export function ModalProducto({
  producto,
  onCerrar,
  acciones,
}: {
  /** `null` es cerrado. */
  producto: ProductoDetalle | null;
  onCerrar: () => void;
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

  const [mostrado, setMostrado] = useState<ProductoDetalle | null>(producto);
  const [mirando, setMirando] = useState(0);

  /* Ajuste de estado durante el render, no en un efecto.
   *
   * Es el patrón que React documenta para «cuando cambia una prop»: llamar a
   * `setState` acá hace que React descarte este render y vuelva a empezar antes
   * de pintar nada. Con un efecto se pintaría un fotograma con el producto
   * anterior —la ficha se abriría mostrando el que se cerró— y encima el
   * `useGSAP` de abajo ya habría empezado la animación de entrada. */
  if (producto && producto !== mostrado) {
    setMostrado(producto);
    setMirando(0);
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

  const fotos = mostrado?.imagenes ?? [];
  const foto = fotos[mirando];
  const envase = mostrado ? envaseEtiqueta(mostrado.envase) : null;

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

            {/* `minmax(0,1fr)` y no `1fr`: el mínimo automático de una pista deja
                que un nombre largo empuje su columna, y la ficha quedaba con la
                foto y los datos de anchos distintos. */}
            <div className={styles.columnas}>
              {/* ---------- la galería ---------- */}
              <div className={styles.galeria}>
                <div
                  className={styles.foto}
                >
                  {foto ? (
                    <Image
                      src={foto.url}
                      alt={foto.alt}
                      fill
                      className="object-contain p-8"
                      draggable={false}
                      sizes="(min-width: 768px) 29rem, 92vw"
                      loading="eager"
                    />
                  ) : (
                    <EnvaseSilueta
                      categoria={mostrado.categoria}
                      envase={mostrado.envase}
                      className="h-2/3 w-auto"
                    />
                  )}
                </div>

                {fotos.length > 1 && (
                  <ul className={styles.miniaturas}>
                    {fotos.map((f, i) => (
                      <li key={f.url}>
                        <button
                          type="button"
                          onClick={() => setMirando(i)}
                          aria-current={i === mirando}
                          className={cx(
                            styles.miniatura,
                            i === mirando
                              ? "border border-rojo-500"
                              : "border border-tinta/15 hover:border-tinta",
                            "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rojo-500",
                          )}
                        >
                          <Image src={f.url} alt="" fill className="object-contain p-1" sizes="56px" />
                          <span className="sr-only">Foto {i + 1}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ---------- los datos ----------
                  Columna en flex y no un bloque suelto: las características se
                  quedan arriba y los controles de pedido bajan hasta el fondo
                  con `mt-auto`. Así la acción está siempre en el mismo sitio
                  —abajo del todo, a la altura del pie de la foto— y no salta
                  según cuánto texto traiga cada producto. */}
              <div className={styles.datos}>
                <p className="text-[11px] tracking-[0.18em] text-neutro-600 uppercase">
                  {mostrado.categoriaNombre || categoriaEtiqueta(mostrado.categoria)}
                </p>
                <div className={styles.tituloConIndicador}>
                <h2
                  id="titulo-ficha"
                  className={styles.titulo}
                >
                  {mostrado.nombre}
                </h2>
                <IndicadorPedido id={mostrado.id} />
                </div>

                <dl className={styles.detalles}>
                  {mostrado.contenidoMl != null && <Dato etiqueta="Contenido">{contenido(mostrado.contenidoMl)}</Dato>}
                  {/* Material y retorno en una sola fila: son el mismo dato para
                      quien compra —«de qué es el envase y si vuelve»— y dos filas
                      tituladas «Envase» se leerían como un error.
                      ⚠️ `retornable` admite NULL a propósito: 225 productos del
                      export no declaran si el envase vuelve, y pintar «No» sería
                      afirmar algo que no está en ningún lado. */}
                  {(envase || mostrado.retornable != null) && (
                    <Dato etiqueta="Envase">
                      {[
                        envase,
                        mostrado.retornable == null
                          ? null
                          : mostrado.retornable
                            ? "retornable"
                            : "no retornable",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </Dato>
                  )}
                  {/* La caja solo se nombra cuando se sabe de cuántas unidades es
                      (ADR-0007). Si el factor no está confirmado, `pack` viene
                      nulo y acá no aparece ninguna línea: inventarlo haría que
                      alguien pidiera una cantidad distinta de la que cree. */}
                  {mostrado.pack && mostrado.pack > 1 && (
                    <Dato etiqueta="Caja">{mostrado.pack} unidades</Dato>
                  )}
                  {mostrado.gradoAlcoholico != null && (
                    <Dato etiqueta="Alcohol">
                      <span className="tabular-nums">{grados(mostrado.gradoAlcoholico)}</span>
                    </Dato>
                  )}
                  {mostrado.codigo && <Dato etiqueta="Código">
                    <span className="tabular-nums">{mostrado.codigo}</span>
                  </Dato>}
                </dl>

                {/* Se muestra solo si alguien la escribió. No hay texto de relleno:
                    una descripción generada desde el nombre del ERP sería inventada
                    sobre un producto real (migración 0023). */}
                {mostrado.descripcion && (
                  <p className="mt-5 whitespace-pre-wrap break-words text-base leading-relaxed">
                    {mostrado.descripcion}
                  </p>
                )}

                <div className={styles.acciones}>
                  <p className="text-sm text-neutro-600">
                    Te confirmamos precio y disponibilidad al revisar tu pedido.
                  </p>
                  {acciones}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

/** `6` / `13,5` — sin el cero de más y con coma decimal, como se escribe en Chile.
 *
 *  El cero se muestra: un producto con 0° es un producto sin alcohol, y eso es
 *  un dato. Que la fila no aparezca significa otra cosa —que nadie lo midió— y
 *  las dos no se pueden confundir. */
function grados(valor: number): string {
  const texto = Number.isInteger(valor)
    ? String(valor)
    : String(valor).replace(".", ",");
  return `${texto}°`;
}

function Dato({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-sm text-neutro-600">
        {etiqueta}
      </dt>
      <dd>{children}</dd>
    </>
  );
}
