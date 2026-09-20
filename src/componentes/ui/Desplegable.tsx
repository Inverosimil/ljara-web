"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BORDE, cx } from "./base";

/* Desplegable propio, con el borde y la sombra del resto del sitio.
 *
 * ⚠️ Reemplaza al `<select>` nativo, y eso tiene un costo que conviene tener
 * presente: el nativo trae gratis el teclado, la búsqueda por letra, el lector
 * de pantalla y —en el teléfono— la rueda del sistema operativo. Nada de eso se
 * puede estilar, que es justo por lo que se reemplazó. Todo lo que el navegador
 * hacía solo está escrito acá abajo; si algo falla, es porque falta un caso.
 *
 * El patrón es `button` + `listbox`, no un `div` con clics: el botón anuncia que
 * despliega una lista, la lista se nombra con `aria-activedescendant` en vez de
 * mover el foco opción por opción, y el foco nunca sale del botón. Es menos
 * código y menos formas de romperlo que manejar `tabindex` en cada opción. */

export type Opcion = { id: string; etiqueta: string };

export function Desplegable({
  etiqueta,
  valor,
  opciones,
  onCambiar,
  className,
  etiquetaVacia,
}: {
  etiqueta: string;
  valor: string;
  opciones: Opcion[];
  onCambiar: (id: string) => void;
  className?: string;
  /** Qué decir cuando el valor no está entre las opciones. */
  etiquetaVacia?: string;
}) {
  const idBase = useId();
  const idLista = `${idBase}-lista`;
  const idEtiqueta = `${idBase}-etiqueta`;

  const [abierto, setAbierto] = useState(false);
  const [marcada, setMarcada] = useState(0);
  const caja = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLUListElement>(null);

  const elegida = opciones.findIndex((o) => o.id === valor);
  const textoActual = opciones[elegida]?.etiqueta ?? etiquetaVacia ?? "—";

  function abrir() {
    // La lista se abre siempre sobre la opción vigente, no sobre la primera:
    // así bajar una vez lleva a la siguiente y no al principio.
    setMarcada(elegida >= 0 ? elegida : 0);
    setAbierto(true);
  }

  function elegir(indice: number) {
    const opcion = opciones[indice];
    if (opcion) onCambiar(opcion.id);
    setAbierto(false);
    boton.current?.focus();
  }

  /* Cerrar al tocar fuera. `pointerdown` y no `click`: si el clic cae sobre otro
   * botón, con `click` la lista todavía estaría abierta cuando ese botón actúa y
   * el orden de los efectos decide qué gana. */
  useEffect(() => {
    if (!abierto) return;
    function fuera(e: PointerEvent) {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [abierto]);

  // La marcada tiene que verse aunque la lista tenga que desplazarse.
  useEffect(() => {
    if (!abierto) return;
    lista.current
      ?.querySelector(`[data-indice="${marcada}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [abierto, marcada]);

  function teclas(e: React.KeyboardEvent) {
    if (!abierto) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrir();
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setAbierto(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setMarcada((i) => Math.min(i + 1, opciones.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setMarcada((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setMarcada(0);
        break;
      case "End":
        e.preventDefault();
        setMarcada(opciones.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        elegir(marcada);
        break;
      case "Tab":
        // Tab confirma y sigue de largo, como el nativo.
        setAbierto(false);
        break;
      default: {
        /* Búsqueda por letra: lo único del `<select>` nativo que la gente usa sin
         * darse cuenta. Salta a la siguiente opción que empiece por esa letra. */
        if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
        const letra = e.key.toLowerCase();
        const desde = marcada + 1;
        const orden = [...opciones.slice(desde), ...opciones.slice(0, desde)];
        const encontrada = orden.find((o) => o.etiqueta.toLowerCase().startsWith(letra));
        if (encontrada) setMarcada(opciones.indexOf(encontrada));
      }
    }
  }

  return (
    <div className={cx("flex flex-col gap-1.5", className)} ref={caja}>
      <span id={idEtiqueta} className="font-black text-xs tracking-[0.18em] uppercase">
        {etiqueta}
      </span>

      <div className="relative">
        <button
          ref={boton}
          type="button"
          role="combobox"
          aria-expanded={abierto}
          aria-controls={idLista}
          aria-haspopup="listbox"
          aria-labelledby={`${idEtiqueta} ${idBase}-valor`}
          aria-activedescendant={abierto ? `${idBase}-op-${marcada}` : undefined}
          onClick={() => (abierto ? setAbierto(false) : abrir())}
          onKeyDown={teclas}
          className={cx(
            BORDE,
          "rounded-[20px]",
        "rounded-[20px]",
            "flex min-h-12 w-full items-center gap-2 bg-white px-3 py-2.5 text-left text-base text-tinta",
            "focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-rojo-500",
          )}
        >
          <span id={`${idBase}-valor`} className="grow truncate">
            {textoActual}
          </span>
          <span
            aria-hidden
            className={cx(
              "shrink-0 transition-transform",
              abierto && "rotate-180 motion-reduce:transform-none",
            )}
          >
            <ChevronDown className="size-4" />
          </span>
        </button>

        {abierto && (
          <ul
            ref={lista}
            id={idLista}
            role="listbox"
            aria-labelledby={idEtiqueta}
            className={cx(
              BORDE,
          "rounded-[20px]",
        "rounded-[20px]",
              // -mt-[3px] para que el borde del panel se coma el del botón en vez
              // de sumar seis píxeles de línea.
              "absolute right-0 left-0 z-50 mt-2 rounded-[20px] max-h-72 overflow-y-auto bg-white shadow-dura-sm",
            )}
          >
            {opciones.map((o, i) => {
              const esElegida = o.id === valor;
              return (
                <li
                  key={o.id}
                  id={`${idBase}-op-${i}`}
                  data-indice={i}
                  role="option"
                  aria-selected={esElegida}
                  /* El puntero marca la opción de paso; el clic elige. Se usa
                     `mousedown` y no `click` porque el botón conserva el foco y
                     un `click` con el foco fuera de la lista llega tarde. */
                  onMouseEnter={() => setMarcada(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    elegir(i);
                  }}
                  className={cx(
                    "flex min-h-11 cursor-pointer items-center px-3 py-2 text-base",
                    i === marcada && "bg-oro",
                    esElegida && "font-black",
                  )}
                >
                  {o.etiqueta}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
