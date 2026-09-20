"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  actualizarDatos,
  agregar,
  cambiar,
  leerEstado,
  leerEstadoServidor,
  quitar,
  suscribir,
  vaciar,
} from "@/lib/almacen-pedido";
import {
  asegurarProductos,
  leerCatalogo,
  leerCatalogoServidor,
  suscribirCatalogo,
} from "@/lib/almacen-catalogo";
import { resolverLineas } from "@/lib/pedido";

/* Enganche de React con el almacén del pedido.
 *
 * El nombre va en inglés y no en español: la convención del proyecto es que el
 * dominio se nombra en español pero lo puramente técnico mantiene el idioma de su
 * ecosistema, y un hook lo es. Además React exige el prefijo `use` para poder
 * verificar las reglas de hooks.
 *
 * No hay proveedor ni contexto: el almacén es un módulo, así que esto funciona en
 * cualquier parte del árbol, incluido /design-system.
 *
 * ⚠️ Se suscribe a DOS almacenes. El del pedido dice qué ids hay guardados; el
 * del catálogo, a qué producto corresponde cada id. Desde que el catálogo se
 * pagina el segundo se llena por partes, así que sin suscribirse a él una línea
 * guardada ayer quedaría invisible hasta que algo más provocara un render. */

export function usePedido() {
  const estado = useSyncExternalStore(
    suscribir,
    leerEstado,
    leerEstadoServidor,
  );

  const catalogo = useSyncExternalStore(
    suscribirCatalogo,
    leerCatalogo,
    leerCatalogoServidor,
  );

  /* Lo que el pedido menciona y el catálogo todavía no conoce se le pide al
   * servidor. Va en un efecto y no durante el render porque dispara una
   * consulta; `asegurarProductos` ya evita pedir dos veces lo mismo, así que
   * que varios componentes usen este hook a la vez no multiplica nada. */
  const ids = estado.lineas.map((l) => l.id).join(",");
  useEffect(() => {
    if (!estado.hidratado || ids === "") return;
    asegurarProductos(ids.split(","));
  }, [ids, estado.hidratado]);

  const resueltas = useMemo(
    () => resolverLineas(estado.lineas, (id) => catalogo.get(id)),
    [estado.lineas, catalogo],
  );

  return {
    lineas: estado.lineas,
    datos: estado.datos,
    listo: estado.hidratado,
    resueltas,
    agregar,
    cambiar,
    quitar,
    vaciar,
    actualizarDatos,
  };
}
