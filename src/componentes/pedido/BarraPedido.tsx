"use client";

import { usePathname } from "next/navigation";
import { Boton } from "@/componentes/ui";
import { totalUnidades } from "@/lib/pedido";
import { usePanel } from "./usePanel";
import { usePedido } from "./usePedido";

/* Barra fija abajo, solo en celular y solo cuando hay algo en el pedido.
 *
 * En el catálogo un almacenero agrega productos con el pulgar y el encabezado le
 * queda lejos; sin esto tendría que subir hasta arriba para ver qué lleva. En
 * escritorio no aparece: ahí el contador del encabezado está siempre a la vista. */

export function BarraPedido() {
  const { lineas, resueltas, listo } = usePedido();
  const { abrir } = usePanel();
  const ruta = usePathname();

  // en la propia hoja del pedido la barra sobra y tapa contenido
  if (!listo || lineas.length === 0 || ruta === "/pedido") return null;

  const unidades = totalUnidades(resueltas);

  return (
    <>
      {/* una barra fija no empuja nada, así que el hueco se reserva aparte para
          que el pie no quede tapado. Va acá y no en el layout para que no sobre
          espacio cuando el pedido está vacío */}
      <div className="h-[calc(5rem+env(safe-area-inset-bottom))] md:hidden" aria-hidden />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-tinta bg-tinta md:hidden">
        <div className="flex items-center gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="min-w-0 grow leading-tight">
            <p className="font-black text-crema text-sm uppercase tabular-nums">
              {lineas.length} {lineas.length === 1 ? "producto" : "productos"}
            </p>
            {unidades !== null && (
              <p className="text-crema/70 text-xs tabular-nums">
                {unidades} {unidades === 1 ? "unidad" : "unidades"}
              </p>
            )}
          </div>

          {/* Abre el mismo panel que el botón del encabezado: en el teléfono es
              todavía más importante no perder la posición en la grilla. */}
          <Boton variante="secundario" tamano="sm" onClick={abrir}>
            Ver pedido
          </Boton>
        </div>
      </div>
    </>
  );
}
