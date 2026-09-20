import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";
import { BotonEditorial } from "@/componentes/ui/BotonEditorial";
import { Boton } from "@/componentes/ui/Boton";
import styles from "./Consultas.module.css";

const opciones = [
  { id: "H", titulo: "Conversación", descripcion: "Icono de diálogo rojo y texto ligero. En hover el icono se eleva apenas; al pulsar vuelve a su sitio.", estilo: "conversacion" },
  { id: "I", titulo: "Editorial", descripcion: "Letra serif en cursiva, sin textura de máquina de escribir. La flecha acompaña con un avance corto.", estilo: "editorial" },
  { id: "J", titulo: "Flecha emergente", descripcion: "Texto solo en reposo. La flecha se desliza al entrar con el cursor o el teclado, sin mover los elementos vecinos.", estilo: "emergente" },
  { id: "K", titulo: "Solo palabras", descripcion: "Sin iconos: el peso está en «Consultar». Cambia a rojo en hover y se desplaza 1px al pulsar.", estilo: "palabras" },
  { id: "E", titulo: "Texto limpio", descripcion: "Archivo semibold, en minúsculas. Solo la flecha avanza un poco al pasar el cursor.", estilo: "limpio" },
  { id: "F", titulo: "Acento rojo", descripcion: "Flecha diagonal antes del texto. El color identifica la acción sin necesitar un fondo.", estilo: "acento" },
  { id: "G", titulo: "Rótulo discreto", descripcion: "Mayúsculas pequeñas y más espaciadas. Conserva el carácter de los titulares con menos peso.", estilo: "rotulo" },
];

export function Consultas() {
  return (
    <section className={styles.seccion} aria-labelledby="propuestas-consulta">
      <p className="text-sm font-semibold text-rojo-600">Nueva comparación · Botón secundario</p>
      <h2 id="propuestas-consulta" className="mt-2 text-3xl font-bold">Consultar por un pedido</h2>
      <p className="mt-3 max-w-2xl text-neutro-700">Las cuatro opciones nuevas están primero (H–K); debajo siguen E–G. Todas sin caja, círculo ni subrayado. Prueba el hover, mantén pulsado y usa Tab. Son demostraciones: no envían pedidos.</p>
      <div className={styles.lista}>
        <article className={styles.tarjeta}>
          <h3 className="text-xl font-bold">Editorial · Iconos y movimiento</h3>
          <p className="mt-2 text-sm text-neutro-700">Flecha con avance corto, WhatsApp y conversación con un pequeño balanceo. Prueba con el cursor, Tab o un toque.</p>
          <div className={styles.muestra}><BotonEditorial>Consultar por un pedido</BotonEditorial></div>
          <div className={styles.muestra}><BotonEditorial icono="whatsapp">Consultar por un pedido</BotonEditorial></div>
          <div className={styles.muestra}><BotonEditorial icono="conversacion">Consultar por un pedido</BotonEditorial></div>
        </article>
        {opciones.map((opcion) => (
          <article key={opcion.id} className={styles.tarjeta}>
            <div>
              <h3 className="text-xl font-bold">{opcion.id} · {opcion.titulo}</h3>
              <p className="mt-2 text-sm text-neutro-700">{opcion.descripcion}</p>
            </div>
            <div className={styles.muestra}>
              <Boton type="button">Ver el catálogo <ArrowRight size={16} aria-hidden /></Boton>
              <button type="button" className={`${styles.enlace} ${styles[opcion.estilo]}`}>
                {opcion.estilo === "acento" && <ArrowUpRight size={18} aria-hidden />}
                {opcion.estilo === "conversacion" && <MessageCircle size={19} aria-hidden />}
                {opcion.estilo === "palabras" ? <span><strong>Consultar</strong> por un pedido</span> : "Consultar por un pedido"}
                {!["acento", "conversacion", "palabras"].includes(opcion.estilo) && <ArrowRight size={18} aria-hidden />}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
