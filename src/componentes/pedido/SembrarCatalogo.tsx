"use client";

import { useEffect } from "react";
import { sembrarCatalogo } from "@/lib/almacen-catalogo";
import type { ProductoSitio } from "@/lib/catalogo";

/* Pasa al almacén del cliente los productos que el servidor acaba de pintar.
 *
 * Así agregar algo al pedido desde el catálogo no espera ninguna consulta: el
 * producto ya está. Lo que el pedido mencione y no esté sembrado lo pide
 * `asegurarProductos()` por su cuenta.
 *
 * ⚠️ Siembra en un EFECTO, no durante el render. Antes lo hacía en el render
 * —para que el contador del pedido no parpadeara— y con el almacén de entonces
 * era seguro, porque solo llenaba un mapa. Desde que el almacén avisa a sus
 * suscriptores, sembrar en el render actualizaría otros componentes en mitad de
 * este, que es exactamente lo que React prohíbe. */

export function SembrarCatalogo({ productos }: { productos: ProductoSitio[] }) {
  useEffect(() => {
    sembrarCatalogo(productos);
  }, [productos]);

  return null;
}
