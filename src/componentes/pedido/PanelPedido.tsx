"use client";

import Link from "next/link";
import Image from "next/image";
import { EnvaseSilueta } from "@/componentes/EnvaseSilueta";
import styles from "./PanelPedido.module.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { X, Trash2, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Boton, ControlCantidad, cx } from "@/componentes/ui";
import { formatoCompleto } from "@/lib/formato";
import { nombreFormato, totalUnidades, unidadesPorFormato } from "@/lib/pedido";
import { usePanel } from "./usePanel";
import { usePedido } from "./usePedido";

gsap.registerPlugin(useGSAP);

/* El pedido, en un panel lateral.
 *
 * ⚠️ Antes el botón del encabezado llevaba directo a `/pedido`. Eso sacaba a la
 * persona del catálogo para responder «¿qué llevo?», y volver era otro clic: el
 * gesto más barato de la tienda costaba dos navegaciones. El panel responde esa
 * pregunta sin moverse de donde está, y deja el enlace a la página para lo que
 * la página hace de verdad —el nombre, la fecha y el mensaje de WhatsApp—.
 *
 * La página **no** desaparece: sigue siendo la que arma el pedido, y es adonde
 * lleva el botón principal de acá.
 *
 * Es un `<dialog>` por lo mismo que la ficha ampliada: foco atrapado, Esc, y el
 * resto de la página inerte para el lector de pantalla. Y por lo mismo lleva
 * velo propio en vez de `::backdrop`, que GSAP no puede animar. */

export function PanelPedido() {
  const { abierto, cerrar: cerrarPanel } = usePanel();
  const { resueltas, listo, cambiar, quitar, vaciar } = usePedido();
  const ruta = usePathname();
  const [confirmarVaciado, setConfirmarVaciado] = useState(false);

  const cerrar = () => { setConfirmarVaciado(false); cerrarPanel(); };

  const dialogo = useRef<HTMLDialogElement>(null);
  const velo = useRef<HTMLDivElement>(null);
  const hoja = useRef<HTMLDivElement>(null);

  /* En la página del pedido el panel sobra: mostraría lo mismo que hay debajo.
   * Se cierra al llegar, no se esconde — si no, el botón del encabezado dejaría
   * de responder sin explicación. */
  useEffect(() => {
    if (ruta === "/pedido") cerrarPanel();
  }, [ruta, cerrarPanel]);

  /* ⚠️ UNA sola línea de tiempo, creada una vez y en pausa. Abrir la reproduce,
   * cerrar la invierte.
   *
   * Antes se creaba una línea nueva en cada apertura y otra en cada cierre, y
   * ninguna mataba a la anterior. Eso fallaba de tres formas, todas las que se
   * vieron: cerrar y volver a abrir rápido dejaba dos líneas peleando por las
   * mismas propiedades; el `onComplete` de un cierre viejo llamaba a `close()`
   * cuando el panel ya se estaba abriendo otra vez; y las líneas se acumulaban
   * en el contexto sin revertirse, así que después de un rato el panel
   * simplemente aparecía sin animarse.
   *
   * Invertir una línea en curso es además lo que hace que el gesto sea fluido:
   * cerrar a mitad de la apertura sigue desde donde va, en vez de saltar al
   * final para empezar a volver. */
  const linea = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const d = dialogo.current;
      if (!d) return;

      /* Con «reducir movimiento» las duraciones van a cero, no se quita la
       * animación: el `onReverseComplete` que cierra el diálogo tiene que seguir
       * corriendo. */
      const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const t = (s: number) => (quieto ? 0 : s);

      linea.current = gsap
        .timeline({ paused: true, onReverseComplete: () => d.close() })
        .fromTo(velo.current, { opacity: 0 }, { opacity: 1, duration: t(0.25) }, 0)
        .fromTo(
          hoja.current,
          { xPercent: 100 },
          { xPercent: 0, duration: t(0.32), ease: "power3.out" },
          0,
        )
        /* El contenido entra detrás de la hoja, escalonado. Sin esto el panel es
         * un rectángulo que se desliza; con esto se lee que TRAE algo. Empieza
         * antes de que la hoja termine: encadenado del todo se sentiría lento.
         *
         * ⚠️ Los bloques que se escalonan existen SIEMPRE. El selector se
         * resuelve una sola vez —cuando se arma la línea— así que apuntar a algo
         * que aparece y desaparece, como el pie, dejaría tweens sobre nodos
         * desmontados. Por eso el pie va envuelto junto al cuerpo. */
        .from(
          "[data-anima]",
          { opacity: 0, x: 8, duration: t(0.18), stagger: t(0.03), ease: "power2.out" },
          t(0.08),
        );
    },
    { scope: dialogo },
  );

  useEffect(() => {
    const d = dialogo.current;
    const tl = linea.current;
    if (!d || !tl) return;

    if (abierto) {
      if (!d.open) d.showModal();
      tl.timeScale(1).play();
      return;
    }

    if (!d.open) return;
    /* Si nunca llegó a avanzar no hay nada que invertir, y `onReverseComplete`
     * no se dispararía: el diálogo quedaría abierto para siempre. */
    if (tl.progress() === 0) d.close();
    else tl.timeScale(1.35).reverse();
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  const unidades = totalUnidades(resueltas);

  return (
    <dialog
      ref={dialogo}
      onCancel={(e) => {
        e.preventDefault();
        cerrar();
      }}
      aria-labelledby="titulo-panel-pedido"
      className={cx(
        "fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none",
        "bg-transparent p-0 text-tinta backdrop:bg-transparent",
      )}
    >
      <div ref={velo} onClick={cerrar} className="absolute inset-0 bg-tinta/70" aria-hidden />

      <div
        ref={hoja}
        className={styles.panel}
      >
        <header
          data-anima
          className={styles.encabezado}
        >
          <div><h2 id="titulo-panel-pedido">Tu pedido</h2><p>Revisa las cantidades antes de continuar.</p></div>
          <button
            type="button"
            onClick={cerrar}
            className={styles.cerrar}
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">Cerrar el pedido</span>
          </button>
        </header>

        {/* Cuerpo y pie envueltos juntos: son un solo bloque para la animación.
            El pie aparece y desaparece según haya productos, y un selector que se
            resuelve una sola vez no puede seguirle el paso — pero este envoltorio
            está siempre, así que el escalonado es el mismo con el pedido vacío o
            lleno. */}
        <div data-anima className="flex min-h-0 grow flex-col">
          <div className={styles.lista}>
          {!listo ? (
            <p className="py-10 text-center text-neutro-600" aria-live="polite">
              Cargando tu pedido…
            </p>
          ) : resueltas.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-black text-lg uppercase">Tu pedido está vacío</p>
              <p className="mt-2 text-sm text-neutro-600">
                Explora el catálogo y agrega los productos que necesitas.
              </p>
              <Boton
                como={Link}
                href="/catalogo"
                variante="papel"
                tamano="sm"
                className="mt-6"
                onClick={cerrar}
              >
                Ir al catálogo
              </Boton>
            </div>
          ) : (
            <ul className={styles.productos}>
              {resueltas.map((l) => {
                const factor = unidadesPorFormato(l.producto, l.formato);
                return (
                  <li key={`${l.id}-${l.formato}`} className={styles.fila}>
                    <div className={styles.foto}>
                      {((l.producto as typeof l.producto & { imagenes?: { url: string; alt: string }[] }).imagenes?.[0]) ? <Image src={(l.producto as typeof l.producto & { imagenes: { url: string; alt: string }[] }).imagenes[0].url} alt="" fill sizes="64px" draggable={false} /> : <EnvaseSilueta categoria={l.producto.categoria} envase={l.producto.envase} className="h-16 w-auto" />}
                    </div>
                    <div className={styles.descripcion}><h3>{l.producto.nombre}</h3><p>{formatoCompleto(l.producto)}</p>{l.formato === "caja" && factor && <p>Caja ×{factor}</p>}</div>
                    <div className={styles.controles}>
                      <ControlCantidad className={styles.cantidad} tamano="sm" valor={l.cantidad} onCambiar={(n) => cambiar(l.id, l.formato, n)} etiqueta={`Cantidad de ${l.producto.nombre}`} minimo={1} />
                      <div className={styles.utilidades}><span>{nombreFormato(l.formato, l.cantidad)}</span><button type="button" className={styles.quitar} aria-label={`Quitar ${l.producto.nombre}`} onClick={() => quitar(l.id, l.formato)}><Trash2 size={18} aria-hidden /></button></div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          </div>

          {listo && resueltas.length > 0 && (
            <footer className={styles.pie}>
            <p className={styles.resumen}>
              {resueltas.length} {resueltas.length === 1 ? "producto" : "productos"}
              {/* Las unidades solo se suman cuando TODAS las líneas saben cuántas
                  trae su formato. Si alguna caja no tiene factor confirmado,
                  `totalUnidades` devuelve null y acá no se inventa un total. */}
              {unidades !== null &&
                ` · ${unidades} ${unidades === 1 ? "unidad" : "unidades"}`}
            </p>

            <p className={styles.aviso}>Precio y disponibilidad por confirmar.</p>
            <div className="mt-3 grid gap-2">
              <Boton
                como={Link}
                href="/pedido"
                variante="primario"
                tamano="md"
                className={styles.revisar}
                onClick={cerrar}
              >
                Revisar y compartir pedido <ArrowRight size={20} aria-hidden />
              </Boton>
              <div className="flex items-center justify-between">
                <Boton variante="texto" onClick={cerrar}>
                  Seguir viendo productos
                </Boton>
                <Boton variante="texto" onClick={() => setConfirmarVaciado(true)}>Vaciar</Boton>
              </div>
              {confirmarVaciado && <div className="border-t border-tinta/20 pt-3 text-sm" role="group" aria-label="Confirmar vaciado">
                <p>¿Quitar todos los productos?</p>
                <div className="flex gap-4"><Boton variante="texto" onClick={() => { vaciar(); setConfirmarVaciado(false); }}>Sí, vaciar</Boton><Boton variante="texto" onClick={() => setConfirmarVaciado(false)}>Cancelar</Boton></div>
              </div>}
              </div>
            </footer>
          )}
        </div>
      </div>
    </dialog>
  );
}
