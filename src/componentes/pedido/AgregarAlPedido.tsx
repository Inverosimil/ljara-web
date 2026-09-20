"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Boton, Chip, ControlCantidad } from "@/componentes/ui";
import type { ProductoMuestra } from "@/contenido/productos-muestra";
import {
  formatosDisponibles,
  sePuedePedir,
  unidadesPorFormato,
  type Formato,
} from "@/lib/pedido";
import { usePedido } from "./usePedido";

/* Controles de «agregar al pedido» dentro de una ficha de producto.
 *
 * El selector de formato solo aparece cuando el producto se puede pedir por caja,
 * y eso solo ocurre cuando sabemos de cuántas unidades es la caja (ADR-0007). Si
 * el factor no está en los datos, la única opción es la unidad: no inventamos un
 * número de unidades por caja.
 *
 * La cantidad refleja la línea existente y sus cambios se guardan directamente.
 * Antes de agregar, el selector es un borrador. Quitar elimina el producto en
 * todos sus formatos. */

import styles from "./AgregarAlPedido.module.css";

export function AgregarAlPedido({ producto }: { producto: ProductoMuestra }) {
  const { agregar, cambiar, quitar, lineas } = usePedido();
  const delProducto = lineas.filter((linea) => linea.id === producto.id);
  const enPedido = delProducto.length > 0;
  const formatos = formatosDisponibles(producto);

  const [formato, setFormato] = useState<Formato>(delProducto[0]?.formato ?? formatos[0]);
  const [cantidad, setCantidad] = useState(1);
  const lineaActual = delProducto.find((linea) => linea.formato === formato);
  const cantidadVisible = lineaActual?.cantidad ?? cantidad;

  // el ADR-0005 dice que hoy siempre se puede pedir; el guard existe para el día
  // que eso cambie, no porque hoy haga algo
  if (!sePuedePedir(producto)) return null;

  return (
    <div className={styles.contenedor}>
      <p className="mb-3 text-sm">{formato === "caja" ? `Cantidad de cajas (${unidadesPorFormato(producto, formato)} unidades por caja)` : "Cantidad de unidades"}</p>
      {formatos.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {formatos.map((f) => {
            const unidades = unidadesPorFormato(producto, f);
            return (
              <Chip
                key={f}
                activo={formato === f}
                onClick={() => {
                  setFormato(f);
                  setCantidad(1);
                }}
                className="px-2 py-0.5 text-xs"
              >
                {f === "caja" && unidades ? `Caja ×${unidades}` : "Unidad"}
              </Chip>
            );
          })}
        </div>
      )}

      <div className={styles.controles}>
        <ControlCantidad
          className={styles.cantidad}
          tamano="sm"
          valor={cantidadVisible}
          minimo={1}
          onCambiar={(n) => {
            setCantidad(n);
            if (lineaActual) cambiar(producto.id, formato, n);
            else if (enPedido) agregar(producto.id, formato, n);
          }}
          etiqueta={`Cantidad de ${producto.nombre}`}
        />

        <Boton
          tamano="sm"
          variante="primario"
          className={styles.agregar}
          aria-live="polite"
          onClick={() => {
            if (enPedido) {
              for (const linea of delProducto) quitar(producto.id, linea.formato);
              setCantidad(cantidadVisible);
            } else agregar(producto.id, formato, cantidadVisible);
          }}
        >
          {enPedido ? <><Trash2 aria-hidden className="size-4" />Quitar del pedido</> : <><Plus aria-hidden className="size-4" />Agregar al pedido</>}
        </Boton>
      </div>

    </div>
  );
}
