"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Check, Copy, ShoppingBag, Trash2, ArrowLeft, MessageCircle, ArrowRight } from "lucide-react";
import { Boton, ControlCantidad } from "@/componentes/ui";
import { BotonEditorial } from "@/componentes/ui/BotonEditorial";
import { EnvaseSilueta } from "@/componentes/EnvaseSilueta";
import { armarMensaje, enlaceWhatsApp, nombreFormato, totalUnidades, unidadesPorFormato } from "@/lib/pedido";
import { formatoCompleto } from "@/lib/formato";
import type { FotoProducto } from "@/lib/catalogo";
import { usePedido } from "./usePedido";
import styles from "./HojaPedido.module.css";

function hoyISO() {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;
}

export function HojaPedido() {
  const { resueltas, datos, listo, cambiar, quitar, vaciar, actualizarDatos } = usePedido();
  const [copiado, setCopiado] = useState(false);
  const [errorCopia, setErrorCopia] = useState(false);
  const [confirmarVaciado, setConfirmarVaciado] = useState(false);
  const mensaje = armarMensaje(resueltas, datos);
  const enlace = enlaceWhatsApp(mensaje);
  const unidades = totalUnidades(resueltas);
  const productos = new Set(resueltas.map((linea) => linea.id)).size;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(mensaje);
      setCopiado(true);
      setErrorCopia(false);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      setCopiado(false);
      setErrorCopia(true);
    }
  }

  return (
    <section className={styles.pagina} aria-labelledby="titulo-pedido">
      <header className={styles.cabecera}>
        <Link href="/catalogo" className={styles.volver}><ArrowLeft size={17} aria-hidden />Volver al catálogo</Link>
        <div className={styles.presentacion}>
          <h1 id="titulo-pedido">Tu próximo pedido,<br /><span>lo vemos contigo.</span></h1>
          <p>Revisa lo que elegiste y comparte tu pedido.<br />Nosotros confirmamos precio, disponibilidad y entrega.</p>
        </div>
      </header>

      {!listo ? <p className={styles.cargando} role="status">Cargando tu pedido…</p> : resueltas.length === 0 ? (
        <div className={styles.vacio}>
          <div className={styles.bolsa}><ShoppingBag size={48} strokeWidth={1.5} aria-hidden /></div>
          <h2>¿Qué necesita tu negocio?</h2>
          <p>Tu pedido está vacío. Explora el catálogo y agrega los productos que necesitas, a tu ritmo.</p>
          <Boton como={Link} href="/catalogo">Explorar catálogo <ArrowRight size={19} aria-hidden /></Boton>
          <span className={styles.sinMinimo}>Sin pedido mínimo. Sin crear una cuenta.</span>
        </div>
      ) : (
        <div className={styles.columnas}>
          <div className={styles.productos}>
            <div className={styles.tituloLista}><h2>Lo que elegiste</h2><span>{productos} {productos === 1 ? "producto" : "productos"}</span></div>
            <ul className={styles.lista}>
              {resueltas.map((l) => {
                const factor = unidadesPorFormato(l.producto, l.formato);
                const foto = (l.producto as typeof l.producto & { imagenes?: FotoProducto[] }).imagenes?.[0];
                return <li key={`${l.id}-${l.formato}`} className={styles.fila}>
                  <div className={styles.foto}>{foto ? <Image src={foto.url} alt={foto.alt} fill sizes="110px" draggable={false} /> : <EnvaseSilueta categoria={l.producto.categoria} envase={l.producto.envase} className="h-20 w-auto" />}</div>
                  <div className={styles.detalle}>
                    <span className={styles.formato}>{l.formato === "caja" && factor ? `Caja × ${factor}` : "Unidad"}</span>
                    <h3>{l.producto.nombre}</h3>
                    <p>{formatoCompleto(l.producto)}</p>
                    {l.formato === "caja" && l.unidades !== null && <p>{l.unidades} unidades en total</p>}
                  </div>
                  <div className={styles.controles}>
                    <ControlCantidad className={styles.cantidad} valor={l.cantidad} minimo={1} onCambiar={(n) => cambiar(l.id, l.formato, n)} etiqueta={`Cantidad de ${l.producto.nombre}`} />
                    <div className={styles.pieControl}><span>{nombreFormato(l.formato, l.cantidad)}</span><button type="button" onClick={() => quitar(l.id, l.formato)} aria-label={`Quitar ${l.producto.nombre}`}><Trash2 size={17} aria-hidden /></button></div>
                  </div>
                </li>;
              })}
            </ul>
            <div className={styles.accionesLista}>
              <BotonEditorial href="/catalogo">Seguir agregando</BotonEditorial>
              {confirmarVaciado ? <div className={styles.confirmacion} role="group" aria-label="Confirmar vaciado"><span>¿Quitar todo?</span><button onClick={() => { vaciar(); setConfirmarVaciado(false); }}>Sí, vaciar</button><button onClick={() => setConfirmarVaciado(false)}>Cancelar</button></div> : <button className={styles.vaciar} onClick={() => setConfirmarVaciado(true)}>Vaciar pedido</button>}
            </div>
          </div>

          <aside className={styles.resumen} aria-label="Preparar y compartir el pedido">
            <div className={styles.datos}>
              <h2>Lo coordinamos contigo.</h2>
              <p>Estos datos nos ayudan a preparar la conversación.</p>
              <label htmlFor="pedido-nombre">Nombre o local <span>(opcional)</span></label>
              <input id="pedido-nombre" placeholder="¿Cómo se llama tu negocio?" autoComplete="organization" maxLength={120} value={datos.nombre} onChange={(e) => actualizarDatos({ nombre: e.target.value })} />
              <label htmlFor="pedido-fecha">Entrega deseada <span>(opcional)</span></label>
              <input id="pedido-fecha" type="date" min={hoyISO()} value={datos.fechaEntrega} onChange={(e) => actualizarDatos({ fechaEntrega: e.target.value })} />
              <small>La fecha es referencial. Confirmamos la entrega al conversar.</small>
            </div>
            <div className={styles.enviar}>
              <div className={styles.total}><span>Tu pedido</span><strong>{productos} {productos === 1 ? "producto" : "productos"}</strong></div>
              {unidades !== null && <p className={styles.unidades}>{unidades} {unidades === 1 ? "unidad" : "unidades"} en total</p>}
              <p className={styles.aviso}>Precio y disponibilidad por confirmar.<br />Sin pedido mínimo.</p>
              {enlace && <Boton como="a" href={enlace} target="_blank" rel="noopener noreferrer" ancho="completo" className={styles.principal}><MessageCircle size={20} aria-hidden />Compartir por WhatsApp</Boton>}
              <Boton variante={enlace ? "papel" : "primario"} ancho="completo" className={styles.principal} onClick={copiar}>{copiado ? <Check size={19} aria-hidden /> : <Copy size={19} aria-hidden />}{copiado ? "Pedido copiado" : "Copiar pedido"}</Boton>
              <p className={styles.estado} role="status">{errorCopia ? "No pudimos copiarlo. Abre el texto de abajo para seleccionarlo manualmente." : copiado ? "Listo para compartir con tu vendedor." : !enlace ? "WhatsApp aún no está disponible. Copia el pedido y compártelo con tu vendedor habitual." : "Se abrirá WhatsApp para que revises y envíes el mensaje."}</p>
              <details className={styles.mensaje} open={errorCopia || undefined}><summary>Ver texto del pedido</summary><textarea readOnly value={mensaje} rows={10} aria-label="Texto del pedido" /></details>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
