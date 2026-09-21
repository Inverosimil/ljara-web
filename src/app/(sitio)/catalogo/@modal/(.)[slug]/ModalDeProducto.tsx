"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AgregarAlPedido } from "@/componentes/pedido/AgregarAlPedido";
import { SembrarCatalogo } from "@/componentes/pedido/SembrarCatalogo";
import { ModalProducto } from "@/componentes/ui";
import type { ProductoSitio } from "@/lib/catalogo";

/* El puente entre la ruta y el diálogo.
 *
 * ⚠️ Cerrar NO es volver atrás de inmediato. `router.back()` desmontaría el
 * diálogo en el acto y la animación de salida no llegaría a verse; peor, el
 * `<dialog>` desaparecería sin pasar por `close()`. Así que cerrar solo pone el
 * producto en `null` —que es lo que dispara la animación— y la vuelta atrás
 * ocurre en `onCerrado`, cuando esa animación terminó de verdad.
 *
 * Si alguien pulsa el botón de atrás del navegador, este componente se desmonta
 * sin animarse. Es correcto: el gesto ya fue la navegación. */
export function ModalDeProducto({ producto }: { producto: ProductoSitio }) {
  const router = useRouter();
  const [mostrado, setMostrado] = useState<ProductoSitio | null>(producto);

  return (
    <>
      <SembrarCatalogo productos={[producto]} />
      <ModalProducto
        producto={mostrado}
        onCerrar={() => setMostrado(null)}
        onCerrado={() => router.back()}
        acciones={<AgregarAlPedido key={producto.id} producto={producto} />}
      />
    </>
  );
}
