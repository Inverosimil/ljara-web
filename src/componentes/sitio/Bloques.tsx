import styles from "./PieDePagina.module.css";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, Phone, Mail } from "lucide-react";
import { textoConfirmado } from "@/lib/contenido-publico";
import {
  Boton,
  Chapa,
  Rotulo,
  Seccion,
} from "@/componentes/ui";
import { enlaceWhatsApp } from "@/lib/pedido";
import { EMPRESA, MARCAS_DESTACADAS } from "@/contenido/empresa";

/* Bloques que se repiten entre páginas. */

export function Cifras({ publicados }: { publicados?: number }) {
  const datos = [
    { k: publicados == null ? "4 vehículos" : String(publicados), v: publicados == null ? "reparto propio" : "productos en línea" },
    { k: "Sin mínimo", v: "pide lo que necesitas" },
    { k: "Trato directo", v: "con nuestro equipo" },
  ];
  return (
    <Seccion fondo="tinta" aire="chico">
      <dl className="grid gap-6 divide-crema/20 sm:grid-cols-3 sm:divide-x">
        {datos.map((d) => (
          <div key={d.v} className="text-center">
            <dt className="text-xs tracking-[0.12em] text-crema/75 uppercase">{d.v}</dt>
            <dd className="mt-2 font-black text-xl text-crema uppercase sm:text-2xl">{d.k}</dd>
          </div>
        ))}
      </dl>
    </Seccion>
  );
}

export function Marcas() {
  return (
    /* Sobre papel, no sobre la trama de toldo: la lista ya son doce cajas con
       borde, y ponerlas encima de rayas de colores hacía que no se leyera
       ninguna. */
    <section
      aria-labelledby="titulo-marcas"
      className="border-b-[3px] border-tinta bg-papel py-8"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="titulo-marcas" className="sr-only">
          Marcas que distribuimos
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-2.5">
          {MARCAS_DESTACADAS.map((m) => (
            <li
              key={m}
              className="border-[3px] border-tinta bg-white px-2.5 py-0.5 text-sm uppercase"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Cierre de página: empuja al pedido desde cualquier sección.
 *
 *  Los dos caminos son los dos que existen: armar el pedido en el sitio, o
 *  escribir. Antes el segundo botón llevaba al catálogo, que en el pie del
 *  propio catálogo era un enlace a donde ya estabas.
 *
 *  ⚠️ WhatsApp es el único canal (ADR-0004) y **su número todavía no está**: es
 *  un placeholder en `contenido/empresa.ts` y bloquea el lanzamiento. Mientras
 *  no esté, el botón lleva a `/contacto`, que explica el canal, en vez de a un
 *  `wa.me` roto. `enlaceWhatsApp()` devuelve null cuando el número no tiene
 *  dígitos suficientes, así que esto se arregla solo el día que se cargue. */
export function LlamadoFinal({
  titulo = "¿Armamos tu pedido?",
  texto = "Elige los productos para tu negocio. Nuestro equipo te confirma precio, disponibilidad y entrega.",
  mostrarCatalogo = true,
}: {
  titulo?: string;
  texto?: string;
  mostrarCatalogo?: boolean;
}) {
  const saludo = enlaceWhatsApp(
    "Hola, los encontré en la página. Quiero hacer una consulta.",
  );

  return (
    <Seccion fondo="rojo" aire="grande" etiquetadaPor="titulo-cierre">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <Rotulo id="titulo-cierre" className="text-crema">
            {titulo}
          </Rotulo>
          <p className="mt-5 max-w-xl text-lg text-crema">{texto}</p>
        </div>
        <div className="flex flex-wrap gap-4 lg:justify-end">
          {mostrarCatalogo && <Boton como={Link} href="/catalogo" variante="secundario" tamano="lg" ancho="movil">
            Explorar el catálogo <ArrowRight aria-hidden className="size-4" />
          </Boton>}
          {saludo ? (
            <Boton
              como="a"
              href={saludo}
              target="_blank"
              rel="noopener noreferrer"
              variante="papel"
              tamano="lg"
              ancho="movil"
            >
              Escribir por WhatsApp
            </Boton>
          ) : (
            <Boton como={Link} href="/contacto" variante="papel" tamano="lg" ancho="movil">
              Contacto <MessageCircle aria-hidden className="size-4" />
            </Boton>
          )}
        </div>
      </div>
    </Seccion>
  );
}

export function PieDePagina() {
  const enlaces = [
    { href: "/", texto: "Inicio" },
    { href: "/catalogo", texto: "Catálogo" },
    { href: "/nosotros", texto: "Nosotros" },
    { href: "/contacto", texto: "Contacto" },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.contenido}>
        <Link href="/" className={styles.marca} aria-label="L. Jara — Inicio"><Chapa tamano="lg" /><span>Distribuidora de bebidas<br />con y sin alcohol.<br />Sector poniente de Santiago.</span></Link>
        <nav aria-label="Pie de página"><ul className={styles.enlaces}>{enlaces.map((e) => <li key={e.href}><Link href={e.href}>{e.texto}</Link></li>)}</ul></nav>
        <div className={styles.contacto}>
          {textoConfirmado(EMPRESA.contacto.telefono) && <a href={`tel:${EMPRESA.contacto.telefono.replace(/[^+0-9]/g, "")}`}><Phone aria-hidden size={15} />{EMPRESA.contacto.telefono}</a>}
          {textoConfirmado(EMPRESA.contacto.email) && <a href={`mailto:${EMPRESA.contacto.email}`}><Mail aria-hidden size={15} />{EMPRESA.contacto.email}</a>}
          <Link href="/contacto"><MessageCircle aria-hidden size={15} />Pedidos y consultas</Link>
          <span><MapPin aria-hidden size={15} />Pudahuel, Santiago</span>
        </div>
        <div className={styles.credito}><p>desarrollado por <a href="https://scarrasco.com" target="_blank" rel="noopener noreferrer">scarrasco</a></p></div>
      </div>
      <div className={styles.legal}><span>© {new Date().getFullYear()} {EMPRESA.nombre}. Venta de alcoholes solo a mayores de 18 años.</span><span>Imágenes ilustrativas generadas con IA.</span></div>
    </footer>
  );
}
