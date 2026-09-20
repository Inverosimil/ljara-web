"use client";

/* Si el panel del pedido está abierto.
 *
 * Es un módulo y no un contexto, por la misma razón que el pedido: quien lo abre
 * —el botón del encabezado, la barra de abajo— y quien lo pinta —el panel, que
 * vive en el layout— están en ramas distintas del árbol, y envolver la
 * aplicación en un proveedor para un booleano es mucho envoltorio para poco.
 *
 * El instantáneo es el booleano mismo: es un primitivo, así que
 * `useSyncExternalStore` lo compara por valor y no hay riesgo de bucle. */

let abierto = false;
const oyentes = new Set<() => void>();

function avisar() {
  for (const o of oyentes) o();
}

export function suscribirPanel(oyente: () => void): () => void {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function leerPanel(): boolean {
  return abierto;
}

/** En el servidor el panel siempre está cerrado, y tiene que estarlo: si el
 *  primer pintado lo abriera, se vería abierto un instante antes de hidratar. */
export function leerPanelServidor(): boolean {
  return false;
}

export function abrirPanel() {
  if (abierto) return;
  abierto = true;
  avisar();
}

export function cerrarPanel() {
  if (!abierto) return;
  abierto = false;
  avisar();
}
