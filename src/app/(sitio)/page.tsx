import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Boton } from "@/componentes/ui/Boton";
import { Caveat } from "next/font/google";
import { ArrowRight, MapPin } from "lucide-react";
import { Hero } from "@/componentes/sitio/Hero";
import { BotonEditorial } from "@/componentes/ui/BotonEditorial";
import { COBERTURA_PUBLICA, EMPRESA } from "@/contenido/empresa";
import styles from "@/componentes/sitio/Inicio.module.css";

const manuscrita = Caveat({ subsets: ["latin"], weight: "500", display: "swap" });
/* Sin `title`: hereda el `default` del layout raíz, que es exactamente el título
   de la portada. Declararlo acá además obligaba a `absolute` para saltarse la
   plantilla, y eso era lo que hacía que la portada se viera distinta al resto. */
export const metadata: Metadata = {
  description: EMPRESA.descripcionCorta,
};

const ventajas = [
  { titulo: "Trato directo", texto: "Conversa con nuestro equipo para revisar tu pedido y coordinar la entrega.", imagen: "trato-directo", alt: "Escena ilustrativa de atención entre un distribuidor y un comerciante" },
  { titulo: "Variedad de formatos", texto: "Bebidas, aguas, jugos, cervezas, vinos y destilados para tu negocio.", imagen: "formatos", alt: "Fotografía generada de cajas y botellas de bebidas en distintos formatos" },
  { titulo: "Reparto propio", texto: "Contamos con nuestro propio equipo de reparto en el sector poniente.", imagen: "reparto", alt: "Escena ilustrativa de un trabajador preparando cajas para reparto" },
];
const pasos = [
  { titulo: "Arma y revisa tu pedido", texto: "Elige productos, formatos y cantidades. Añade los datos de tu negocio y comprueba que esté todo." },
  { titulo: "Compártelo por WhatsApp", texto: "Envía el mensaje preparado a nuestro equipo. También puedes copiarlo para compartirlo con tu vendedor." },
  { titulo: "Lo coordinamos contigo", texto: "Nuestro equipo confirma precio, disponibilidad y día de entrega antes de cerrar el pedido." },
];

export default function Inicio() {
  return <>
    <Hero />
    <div className={styles.inicio}>
      <section className={styles.seccion} aria-labelledby="por-que">
        <div className={styles.intro}>
          <div><h2 id="por-que">El día a día de tu negocio,<br /><span className={styles.rojo}>acompañado.</span></h2></div>
          
        </div>
        <div className={styles.ventajas}>{ventajas.map((v) => <article key={v.titulo}>
          <div className={styles.fotoVentaja}><Image src={`/inicio/${v.imagen}.webp`} alt={v.alt} fill sizes="(min-width: 768px) 30vw, 100vw" draggable={false} /></div>
          <h3>{v.titulo === "Trato directo" ? <>Trato <span className={styles.termino}>directo</span></> : v.titulo === "Variedad de formatos" ? <><span className={styles.termino}>Variedad</span> de formatos</> : <>Reparto <span className={styles.termino}>propio</span></>}</h3><p>{v.texto}</p>
        </article>)}</div>
      </section>

      <section className={styles.bandaClara} aria-labelledby="bodega">
        <div className={`${styles.seccion} ${styles.bodega}`}>
          <div><h2 id="bodega">Una camioneta fue<br /><span className={styles.azul}>el comienzo.</span></h2><p>Partimos con Luis Jara y su camioneta. Hoy, desde nuestra bodega en Pudahuel, abastecemos a los negocios del sector poniente con reparto propio. La relación sigue siendo la misma: de persona a persona.</p><p className={`${styles.nota} ${manuscrita.className}`}>Mismos barrios.<br />Más historias.</p></div>
          <div className={styles.collage}>
            <div className={styles.fotoBodega}><Image src="/inicio/bodega.webp" alt="Imagen generada de una bodega de bebidas con pasillos y cajas apiladas" fill sizes="(min-width: 768px) 55vw, 100vw" draggable={false} /></div>
            <figure className={styles.polaroid}><div><Image src="/inicio/reparto.webp" alt="Detalle ilustrativo del trabajo de reparto" fill sizes="220px" draggable={false} /></div><figcaption className={manuscrita.className}>El mismo compromiso<br />de siempre</figcaption></figure>
          </div>
        </div>
      </section>

      <section className={`${styles.seccion} ${styles.cobertura}`} aria-labelledby="donde">
        <div className={styles.fotoBarrio}><Image src="/inicio/barrio.webp" alt="Imagen generada de un almacén de barrio en Santiago" fill sizes="(min-width: 768px) 45vw, 100vw" draggable={false} /></div>
        <div><h2 id="donde"><span className={styles.amarillo}>Desde Pudahuel.</span><br />Para el poniente.</h2><p>Abastecemos almacenes, botillerías y negocios de barrio del sector poniente de Santiago.</p>
          <div className={styles.zonas}><div><ul>{COBERTURA_PUBLICA.comunas.map((comuna) => <li key={comuna}><MapPin aria-hidden size={21} />{comuna}</li>)}</ul><div className={styles.consulta}><BotonEditorial href="/contacto" icono="ubicacion">Consulta otra ubicación</BotonEditorial></div></div><p className={`${styles.nota} ${styles.notaBarrio} ${manuscrita.className}`}>Los mismos<br />barrios,<br />las mismas<br />personas.</p></div>
          
        </div>
      </section>

      <section className={styles.bandaClara} aria-labelledby="como-pedir">
        <div className={`${styles.seccion} ${styles.pedir}`}>
          <div className={styles.pedidoVisual}>
            <div className={styles.fotoPedido}><Image src="/inicio/pedido.webp" alt="Escena ilustrativa de una persona anotando un pedido sobre una caja de bebidas" fill sizes="(min-width: 768px) 40vw, 100vw" draggable={false} /></div>
            <p className={`${styles.nota} ${manuscrita.className}`}>Tu pedido,<br />en buenas manos.</p>
          </div>
          <div>
            <h2 id="como-pedir">Tu próximo pedido,<br /><span className={styles.rojo}>así de simple.</span></h2>
            <ol className={styles.pasos}>{pasos.map((p, i) => <li key={p.titulo}><span className={styles.numero}>0{i + 1}</span><div><h3>{p.titulo}</h3><p>{p.texto}</p></div></li>)}</ol>
            <div className={styles.acciones}><Boton como={Link} href="/catalogo" tamano="sm">Armar mi pedido <ArrowRight aria-hidden size={18} /></Boton><BotonEditorial href="/contacto" icono="conversacion">Tengo una consulta</BotonEditorial></div>
          </div>
        </div>
      </section>
    </div>
  </>;
}
