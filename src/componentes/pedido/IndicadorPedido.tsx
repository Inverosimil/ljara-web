"use client";

import { useSyncExternalStore } from "react";
import { leerEstado, leerEstadoServidor, suscribir } from "@/lib/almacen-pedido";
import { nombreFormato } from "@/lib/pedido";
import styles from "./IndicadorPedido.module.css";

/** Cuenta las cantidades seleccionadas; el detalle distingue cajas y unidades. */
export function IndicadorPedido({ id }: { id: string }) {
  const estado = useSyncExternalStore(suscribir, leerEstado, leerEstadoServidor);
  const lineas = estado.lineas.filter((linea) => linea.id === id);
  const cantidad = lineas.reduce((total, linea) => total + linea.cantidad, 0);
  const detalle = lineas.map((linea) => `${linea.cantidad} ${nombreFormato(linea.formato, linea.cantidad)}`).join(" y ");
  return <span className={styles.estado} role="status">{cantidad > 0 && <span key={cantidad} className={styles.bola} title={`${detalle} en tu pedido`}><span aria-hidden="true">{cantidad}</span><span className="sr-only">{detalle} en tu pedido</span></span>}</span>;
}
