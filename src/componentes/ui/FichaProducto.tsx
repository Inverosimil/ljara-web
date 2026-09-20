"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { EnvaseSilueta } from "@/componentes/EnvaseSilueta";
import { IndicadorPedido } from "@/componentes/pedido/IndicadorPedido";
import type { ProductoMuestra } from "@/contenido/productos-muestra";
import type { FotoProducto } from "@/lib/catalogo";
import { contenido, categoriaEtiqueta } from "@/lib/formato";
import { Boton } from "./Boton";
import styles from "./FichaProducto.module.css";

export type ProductoTarjeta = ProductoMuestra & { imagenes?: FotoProducto[]; categoriaNombre?: string | null };
export function FichaProducto({ producto, onAbrir, prioridad = false }: { producto: ProductoTarjeta; onAbrir?: () => void; prioridad?: boolean }) {
  const foto = producto.imagenes?.[0];
  return (
    <article className={styles.ficha}>
      <IndicadorPedido id={producto.id} />
      {onAbrir && <button className={styles.abrir} type="button" onClick={onAbrir} aria-label={`Ver producto: ${producto.nombre}`} />}
      <div className={styles.foto}>
        {foto ? <Image src={foto.url} alt={foto.alt} fill loading={prioridad ? "eager" : "lazy"} sizes="(min-width: 1000px) 28vw, (min-width: 768px) 35vw, 50vw" draggable={false} /> : <EnvaseSilueta categoria={producto.categoria} envase={producto.envase} className="h-28 w-auto" />}
        {producto.contenidoMl != null && <span className={styles.litraje}>{contenido(producto.contenidoMl)}</span>}
      </div>
      <div className={styles.info}>
        <div><h3>{producto.nombre}</h3><p>{producto.categoriaNombre || categoriaEtiqueta(producto.categoria)}</p></div>
        {onAbrir && <div className={styles.accion}><Boton className={styles.flecha} type="button" onClick={onAbrir} aria-label={`Abrir detalles de ${producto.nombre}`}><ArrowRight size={20} aria-hidden /></Boton></div>}
      </div>
    </article>
  );
}
