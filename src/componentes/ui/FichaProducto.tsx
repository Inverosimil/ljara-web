"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EnvaseSilueta } from "@/componentes/EnvaseSilueta";
import { IndicadorPedido } from "@/componentes/pedido/IndicadorPedido";
import type { ProductoMuestra } from "@/contenido/productos-muestra";
import type { FotoProducto } from "@/lib/catalogo";
import { contenido, categoriaEtiqueta } from "@/lib/formato";
import { Boton } from "./Boton";
import styles from "./FichaProducto.module.css";

export type ProductoTarjeta = ProductoMuestra & { imagenes?: FotoProducto[]; categoriaNombre?: string | null };

/* La zona de clic es UNA sola y cubre la tarjeta entera: el `.abrir` que va
 * encima de todo. La flecha de abajo a la derecha es la señal visual de que la
 * tarjeta se puede abrir, no un segundo control —dos destinos idénticos obligan
 * a apuntar y le repiten el mismo enlace a quien usa lector de pantalla—.
 *
 * `href` navega y `onAbrir` solo avisa. El catálogo usa `href`, porque cada
 * producto tiene su dirección y así se puede compartir; `/design-system` usa
 * `onAbrir`, porque ahí las tarjetas son muestras y no llevan a ninguna parte. */
export function FichaProducto({ producto, href, onAbrir, prioridad = false }: { producto: ProductoTarjeta; href?: string; onAbrir?: () => void; prioridad?: boolean }) {
  const foto = producto.imagenes?.[0];
  const etiqueta = `Ver producto: ${producto.nombre}`;
  const accionable = Boolean(href || onAbrir);
  return (
    <article className={styles.ficha}>
      <IndicadorPedido id={producto.id} />
      {href
        ? <Link className={styles.abrir} href={href} aria-label={etiqueta} />
        : onAbrir && <button className={styles.abrir} type="button" onClick={onAbrir} aria-label={etiqueta} />}
      <div className={styles.foto}>
        {foto ? <Image src={foto.url} alt={foto.alt} fill loading={prioridad ? "eager" : "lazy"} sizes="(min-width: 1000px) 28vw, (min-width: 768px) 35vw, 50vw" draggable={false} /> : <EnvaseSilueta categoria={producto.categoria} envase={producto.envase} className="h-28 w-auto" />}
        {producto.contenidoMl != null && <span className={styles.litraje}>{contenido(producto.contenidoMl)}</span>}
      </div>
      <div className={styles.info}>
        <div><h3>{producto.nombre}</h3><p>{producto.categoriaNombre || categoriaEtiqueta(producto.categoria)}</p></div>
        {accionable && (
          href
            /* Decorativa: el enlace que cubre la tarjeta ya recoge el clic, y
               `.accion` va por encima de él —z-index 3 contra 2—, así que sin
               `pointer-events: none` esta esquina sería un agujero muerto. */
            ? <div className={`${styles.accion} ${styles.decorativa}`} aria-hidden><Boton como="span" className={styles.flecha}><ArrowRight size={20} /></Boton></div>
            : <div className={styles.accion}><Boton className={styles.flecha} type="button" onClick={onAbrir} aria-label={`Abrir detalles de ${producto.nombre}`}><ArrowRight size={20} aria-hidden /></Boton></div>
        )}
      </div>
    </article>
  );
}
