import type { Metadata } from "next";
import Image from "next/image";
import { Caveat } from "next/font/google";
import { MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { Boton } from "@/componentes/ui";
import { BotonEditorial } from "@/componentes/ui/BotonEditorial";
import { EMPRESA } from "@/contenido/empresa";
import { enlaceWhatsApp } from "@/lib/pedido";
import styles from "@/componentes/sitio/Contacto.module.css";

const manuscrita = Caveat({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });
export const metadata: Metadata = { title: "Contacto", description: `Pedidos, consultas y cobertura de reparto de ${EMPRESA.nombre}.` };

export default function PaginaContacto() {
  const saludo = enlaceWhatsApp("Hola, los encontré en la página. Quiero consultar por un pedido.");
  const cobertura = enlaceWhatsApp("Hola, quisiera consultar si tienen reparto para la ubicación de mi negocio.");
  return (
    <div className={styles.pagina}>
      <section className={styles.hero} aria-labelledby="titulo-contacto">
        <div className={`${styles.retrato} ${styles.retratoIzquierdo}`}><Image src="/contacto/repartidor.webp" alt="Imagen ilustrativa de un trabajador de reparto en una bodega" fill priority sizes="(max-width: 767px) 50vw, 28vw" draggable={false} /></div>
        <div className={styles.texto}>
          <h1 id="titulo-contacto">¿En qué<br />te ayudamos?</h1>
          <p className={styles.bajada}>Cuéntanos qué necesitas.<br />Lo vemos contigo.</p>
          <div className={styles.acciones}>
            {saludo ? <Boton como="a" href={saludo} target="_blank" rel="noopener noreferrer" tamano="lg"><MessageCircle size={25} aria-hidden />Hablemos por WhatsApp</Boton> : <><Boton disabled aria-describedby="canal-pendiente" tamano="lg"><MessageCircle size={25} aria-hidden />Hablemos por WhatsApp</Boton><p id="canal-pendiente" className={styles.pendiente}>Canal por confirmar. Mientras tanto, prepara tu pedido y compártelo con tu vendedor habitual.</p></>}
            <BotonEditorial href="/catalogo">Preparar mi pedido</BotonEditorial>
          </div>
          <p className={`${styles.firmaHero} ${manuscrita.className}`}>De persona<br />a persona.</p>
        </div>
        <div className={`${styles.retrato} ${styles.retratoDerecho}`}><Image src="/contacto/almacenera.webp" alt="Imagen ilustrativa de una almacenera abriendo su negocio" fill priority sizes="(max-width: 767px) 50vw, 28vw" draggable={false} /></div>
      </section>
      <section className={styles.cobertura} aria-labelledby="titulo-cobertura">
        <div>
          <h2 id="titulo-cobertura">¿Llegamos<br />a tu <span className={styles.amarillo}>barrio?</span></h2>
          <p className={styles.comunas}>Pudahuel · Lo Prado · Estación Central</p>
          <p>Estamos cerca de los negocios de barrio: almacenes, minimarkets y botillerías. Si tu negocio está en otra ubicación, cuéntanos y revisamos la cobertura contigo.</p>
          {cobertura ? <BotonEditorial href={cobertura} icono="ubicacion">Consulta por otra ubicación</BotonEditorial> : <details className={styles.consulta}><summary>Consulta por otra ubicación <ArrowRight size={20} aria-hidden /></summary><p>Indica la comuna y dirección de tu negocio a tu vendedor habitual para confirmar la cobertura y coordinar la entrega. El canal directo del sitio estará disponible cuando confirmemos el número.</p></details>}
          <div className={styles.firma}><MapPin size={48} strokeWidth={1.4} aria-hidden /><p className={manuscrita.className}>Mismas personas.<br />Más barrios.</p></div>
        </div>
        <div className={styles.fotoBarrio}><Image src="/inicio/barrio.webp" alt="Imagen ilustrativa de un almacén de barrio en Santiago" fill sizes="(max-width: 767px) 100vw, 58vw" draggable={false} /></div>
      </section>
    </div>
  );
}
