"use client";

import { useSyncExternalStore } from "react";
import {
  abrirPanel,
  cerrarPanel,
  leerPanel,
  leerPanelServidor,
  suscribirPanel,
} from "@/lib/almacen-panel";

/** Enganche de React con el almacén del panel del pedido. */
export function usePanel() {
  const abierto = useSyncExternalStore(
    suscribirPanel,
    leerPanel,
    leerPanelServidor,
  );
  return { abierto, abrir: abrirPanel, cerrar: cerrarPanel };
}
