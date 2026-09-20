"use client";

import { ShoppingBag } from "lucide-react";
import { Boton, cx } from "@/componentes/ui";
import { usePanel } from "./usePanel";
import { usePedido } from "./usePedido";

/* Acceso al pedido desde el encabezado, con el contador de productos.
 *
 * Reemplaza al viejo botón «¡Pedir!», que llevaba a /contacto. Ahora que existe
 * el carrito, el encabezado tiene que mostrar si hay algo dentro: un carrito sin
 * contador visible es un carrito que la gente olvida.
 *
 * ⚠️ Abre el panel lateral, no navega. Llevar a `/pedido` sacaba del catálogo
 * para responder «¿qué llevo?», y volver era otro clic. La página sigue estando
 * y el panel lleva hasta ella: lo que cambió es que mirar el pedido ya no
 * obliga a abandonar lo que se estaba haciendo. */

export function BotonPedido({ className }: { className?: string }) {
  const { lineas, listo } = usePedido();
  const { abrir } = usePanel();
  const cuenta = lineas.length;

  // hasta hidratar, el servidor no sabe el número: mostrar 0 y corregirlo
  // después se lee como un parpadeo
  const mostrarCuenta = listo && cuenta > 0;

  return (
    <Boton type="button" onClick={abrir} variante="secundario" sombra={false} tamano="sm" className={className}
    >
      <ShoppingBag aria-hidden className="size-5" strokeWidth={2.25} />
      <span className="hidden sm:inline">Pedido</span>

      {mostrarCuenta && (
        <span
          className={cx(
            "grid size-6 place-items-center rounded-full border-2 border-tinta",
            "bg-rojo-500 text-crema text-xs tabular-nums",
          )}
          aria-hidden
        >
          {cuenta}
        </span>
      )}

      <span className="sr-only">
        {mostrarCuenta
          ? `Ver el pedido, ${cuenta} ${cuenta === 1 ? "producto" : "productos"}`
          : "Ver el pedido"}
      </span>
    </Boton>
  );
}
