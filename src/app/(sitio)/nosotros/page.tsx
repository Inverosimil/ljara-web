import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Caveat } from "next/font/google";
import { Boton } from "@/componentes/ui";
import { EMPRESA } from "@/contenido/empresa";
import styles from "@/componentes/sitio/Nosotros.module.css";

const manuscrita = Caveat({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });
export const metadata: Metadata = { title: "Nosotros", description: EMPRESA.descripcionLarga };

function Nota({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`${styles.nota} ${manuscrita.className} ${className}`}>{children}</p>;
}

export default function PaginaNosotros() {
  return (
    <div className={styles.pagina}>
      <section className={styles.portada} aria-labelledby="titulo-nosotros">
        <div className={styles.presentacion}>
          <h1 id="titulo-nosotros">Una camioneta.<br /><span className={styles.rojo}>Muchas historias.</span></h1>
          <p>L.Jara nació del trabajo, la cercanía y las ganas de apoyar a los negocios de barrio. Lo que comenzó con una camioneta, hoy es una distribuidora de bebidas que sigue creyendo en las mismas cosas: las personas y sus barrios.</p>
        </div>
        <div className={styles.portadaVisual}>
          <div className={styles.fotoPortada}><Image src="/nosotros/portada.webp" alt="Imagen ilustrativa de una camioneta frente a una bodega de bebidas" fill priority sizes="(max-width: 767px) 100vw, 55vw" draggable={false} /></div>
          <Nota>El comienzo<br />de todo.</Nota>
        </div>
      </section>

      <section className={styles.historia} aria-label="Nuestra historia">
        <article className={styles.momento}>
          <div className={styles.foto}><Image src="/nosotros/comienzo.webp" alt="Imagen ilustrativa de un trabajador cargando bebidas en una camioneta" fill sizes="(max-width: 767px) 100vw, 33vw" draggable={false} /></div>
          <h2>El <span className={styles.amarillo}>comienzo</span></h2>
          <p>Todo partió con una camioneta y muchas ganas de trabajar. Luis Jara comenzó recorriendo los barrios, visitando almacenes y pequeños negocios, siempre con un trato cercano y la convicción de que el trabajo bien hecho abre puertas.</p>
          <Nota>Mismos barrios,<br />mismas ganas.</Nota>
        </article>
        <article className={styles.momento}>
          <div className={styles.collage}>
            <div className={styles.foto}><Image src="/inicio/bodega.webp" alt="Imagen ilustrativa del interior de una bodega de bebidas" fill sizes="(max-width: 767px) 100vw, 33vw" draggable={false} /></div>
            <figure className={styles.polaroid}><div><Image src="/nosotros/portada.webp" alt="" fill sizes="160px" draggable={false} /></div><figcaption className={manuscrita.className}>Nuestro punto<br />de partida</figcaption></figure>
          </div>
          <h2>Más espacio,<br /><span className={styles.rojo}>la misma cercanía</span></h2>
          <p>Con el tiempo, el negocio fue creciendo y hoy operamos desde Pudahuel, con una bodega que nos permite seguir abasteciendo a nuestros clientes con nuestra propia flota de reparto.</p>
        </article>
        <article className={styles.momento}>
          <div className={styles.foto}><Image src="/nosotros/barrio.webp" alt="Imagen ilustrativa de una entrega de bebidas a una almacenera de barrio" fill sizes="(max-width: 767px) 100vw, 33vw" draggable={false} /></div>
          <h2>Hoy, seguimos<br /><span className={styles.amarillo}>en tu barrio</span></h2>
          <p>Seguimos trabajando junto a almacenes, botillerías y negocios de barrio en el sector poniente de Santiago. Llegamos a Pudahuel, Lo Prado y Estación Central; otras ubicaciones las revisamos contigo.</p>
          <Nota>Gracias por ser<br />parte de esta historia.</Nota>
        </article>
      </section>

      <section className={styles.cierre} aria-labelledby="titulo-confianza">
        <div className={styles.fotoCierre}><Image src="/inicio/formatos.webp" alt="Cajas de bebidas, imagen ilustrativa" fill sizes="(max-width: 767px) 40vw, 22vw" draggable={false} /></div>
        <div className={styles.invitacion}>
          <h2 id="titulo-confianza">La confianza se construye<br /><span className={styles.azul}>pedido a pedido.</span></h2>
          <p>Estamos para acompañar el crecimiento de tu negocio, con un trato directo y la cercanía de siempre.</p>
          <Boton como={Link} href="/contacto" tamano="lg">Conversemos</Boton>
        </div>
        <div className={styles.cierreVisual}><div className={styles.fotoCierre}><Image src="/inicio/reparto.webp" alt="Preparación de un reparto, imagen ilustrativa" fill sizes="(max-width: 767px) 40vw, 22vw" draggable={false} /></div><Nota>Más negocios<br />para un mejor barrio.</Nota></div>
      </section>
    </div>
  );
}
