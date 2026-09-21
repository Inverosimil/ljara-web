"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import { EnvaseSilueta } from "@/componentes/EnvaseSilueta";
import { IndicadorPedido } from "@/componentes/pedido/IndicadorPedido";
import type { ProductoMuestra } from "@/contenido/productos-muestra";
import type { FotoProducto } from "@/lib/catalogo";
import { categoriaEtiqueta, contenido, envaseEtiqueta } from "@/lib/formato";
import { cx } from "./base";
import styles from "./FichaAmpliada.module.css";

/* El contenido de la ficha ampliada: la galería, los datos y los controles de
 * pedido. Vive aparte del modal porque ahora hay DOS sitios donde se muestra lo
 * mismo: el modal que se abre desde la grilla y la página propia del producto,
 * que es la que se comparte por WhatsApp. Duplicarlo habría significado que un
 * arreglo en uno no llegara al otro.
 *
 * No sabe nada del contenedor: ni panel, ni botón de cerrar, ni animación. */

export type ProductoDetalle = ProductoMuestra & {
  categoriaNombre?: string | null;
  imagenes?: FotoProducto[];
  descripcion?: string | null;
  retornable?: boolean | null;
  gradoAlcoholico?: number | null;
};

export function FichaAmpliada({
  producto,
  acciones,
  idTitulo,
  comoTitulo: Titulo = "h2",
}: {
  producto: ProductoDetalle;
  /** Controles de pedido. Slot, para que esta pieza siga siendo presentacional. */
  acciones?: ReactNode;
  idTitulo?: string;
  /** `h1` en la página propia del producto, `h2` dentro del modal, donde el
   *  encabezado de la página sigue siendo el del catálogo. */
  comoTitulo?: "h1" | "h2";
}) {
  /* ⚠️ Qué foto se está mirando. Se reinicia sola al cambiar de producto porque
   * quien monta este componente le pasa `key={producto.id}`: es más simple que
   * ajustar el estado al vuelo y no deja ningún caso sin cubrir. */
  const [mirando, setMirando] = useState(0);

  const fotos = producto.imagenes ?? [];
  const foto = fotos[mirando];
  const envase = envaseEtiqueta(producto.envase);

  return (
    /* `minmax(0,1fr)` y no `1fr`: el mínimo automático de una pista deja que un
       nombre largo empuje su columna, y la ficha quedaba con la foto y los
       datos de anchos distintos. */
    <div className={styles.columnas}>
      {/* ---------- la galería ---------- */}
      <div className={styles.galeria}>
        <div className={styles.foto}>
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
              categoria={producto.categoria}
              envase={producto.envase}
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
          Columna en flex y no un bloque suelto: las características se quedan
          arriba y los controles de pedido bajan hasta el fondo con `mt-auto`.
          Así la acción está siempre en el mismo sitio —abajo del todo, a la
          altura del pie de la foto— y no salta según cuánto texto traiga cada
          producto. */}
      <div className={styles.datos}>
        <p className="text-[11px] tracking-[0.18em] text-neutro-600 uppercase">
          {producto.categoriaNombre || categoriaEtiqueta(producto.categoria)}
        </p>
        <div className={styles.tituloConIndicador}>
          <Titulo id={idTitulo} className={styles.titulo}>
            {producto.nombre}
          </Titulo>
          <IndicadorPedido id={producto.id} />
        </div>

        <dl className={styles.detalles}>
          {producto.contenidoMl != null && (
            <Dato etiqueta="Contenido">{contenido(producto.contenidoMl)}</Dato>
          )}
          {/* Material y retorno en una sola fila: son el mismo dato para quien
              compra —«de qué es el envase y si vuelve»— y dos filas tituladas
              «Envase» se leerían como un error.
              ⚠️ `retornable` admite NULL a propósito: 225 productos del export
              no declaran si el envase vuelve, y pintar «No» sería afirmar algo
              que no está en ningún lado. */}
          {(envase || producto.retornable != null) && (
            <Dato etiqueta="Envase">
              {[
                envase,
                producto.retornable == null
                  ? null
                  : producto.retornable
                    ? "retornable"
                    : "no retornable",
              ]
                .filter(Boolean)
                .join(" · ")}
            </Dato>
          )}
          {/* La caja solo se nombra cuando se sabe de cuántas unidades es
              (ADR-0007). Si el factor no está confirmado, `pack` viene nulo y
              acá no aparece ninguna línea: inventarlo haría que alguien pidiera
              una cantidad distinta de la que cree. */}
          {producto.pack && producto.pack > 1 && (
            <Dato etiqueta="Caja">{producto.pack} unidades</Dato>
          )}
          {producto.gradoAlcoholico != null && (
            <Dato etiqueta="Alcohol">
              <span className="tabular-nums">{grados(producto.gradoAlcoholico)}</span>
            </Dato>
          )}
          {producto.codigo && (
            <Dato etiqueta="Código">
              <span className="tabular-nums">{producto.codigo}</span>
            </Dato>
          )}
        </dl>

        {/* Se muestra solo si alguien la escribió. No hay texto de relleno: una
            descripción generada desde el nombre del ERP sería inventada sobre un
            producto real (migración 0023). */}
        {producto.descripcion && (
          <p className="mt-5 whitespace-pre-wrap break-words text-base leading-relaxed">
            {producto.descripcion}
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
  );
}

/** `6` / `13,5` — sin el cero de más y con coma decimal, como se escribe en Chile.
 *
 *  El cero se muestra: un producto con 0° es un producto sin alcohol, y eso es
 *  un dato. Que la fila no aparezca significa otra cosa —que nadie lo midió— y
 *  las dos no se pueden confundir. */
function grados(valor: number): string {
  const texto = Number.isInteger(valor) ? String(valor) : String(valor).replace(".", ",");
  return `${texto}°`;
}

function Dato({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-neutro-600">{etiqueta}</dt>
      <dd>{children}</dd>
    </>
  );
}
