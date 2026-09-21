import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AgregarAlPedido } from "@/componentes/pedido/AgregarAlPedido";
import { SembrarCatalogo } from "@/componentes/pedido/SembrarCatalogo";
import { PieDePagina } from "@/componentes/sitio/Bloques";
import { FichaAmpliada } from "@/componentes/ui/FichaAmpliada";
import { Seccion } from "@/componentes/ui";
import { EMPRESA } from "@/contenido/empresa";
import { productoPorId } from "@/lib/catalogo";
import { categoriaEtiqueta, contenido } from "@/lib/formato";
import { idDesdeSlug, slugProducto } from "@/lib/producto-url";
import estilos from "./pagina.module.css";

/* La página propia de un producto.
 *
 * Existe por dos razones y las dos importan igual: es lo que se comparte por
 * WhatsApp —con la foto del producto, no con el logo— y es lo que ve un
 * buscador. Desde la grilla del catálogo esta misma dirección se intercepta y
 * se muestra como ficha superpuesta; acá se dibuja entera.
 *
 * ⚠️ El contenido lo pinta `FichaAmpliada`, la misma pieza que usa el modal. No
 * hay dos versiones de la ficha que puedan separarse con el tiempo. */

type Ruta = { params: Promise<{ slug: string }> };

/* Una línea con lo que consta del producto. No se inventa nada: si no hay
 * descripción escrita, se arma con los atributos que sí están —contenido,
 * envase, categoría— y si tampoco los hay, se cae a la descripción del sitio. */
function resumen(producto: {
  nombre: string;
  descripcion?: string | null;
  contenidoMl: number | null;
  categoria: string;
  categoriaNombre?: string | null;
}): string {
  if (producto.descripcion) return producto.descripcion;
  const partes = [
    producto.categoriaNombre || categoriaEtiqueta(producto.categoria as never),
    producto.contenidoMl != null ? contenido(producto.contenidoMl) : null,
  ].filter(Boolean);
  return partes.length
    ? `${producto.nombre} — ${partes.join(" · ")}. Consulta precio y disponibilidad con ${EMPRESA.nombre}.`
    : `${producto.nombre}. Consulta precio y disponibilidad con ${EMPRESA.nombre}.`;
}

export async function generateMetadata({ params }: Ruta): Promise<Metadata> {
  const { slug } = await params;
  const id = idDesdeSlug(slug);
  const producto = id ? await productoPorId(id) : null;

  /* Un producto que no existe no se anuncia: la página responderá 404 y una
     metadata inventada la haría parecer válida al compartirla. */
  if (!producto) return { title: "Producto no encontrado" };

  const foto = producto.imagenes?.[0];
  const descripcion = resumen(producto);

  return {
    title: producto.nombre,
    description: descripcion,
    /* La dirección canónica lleva el nombre actual. Si alguien comparte un slug
       viejo —el id manda, el nombre es decorativo— el buscador sabe cuál es la
       buena y no indexa dos direcciones con el mismo contenido. */
    alternates: { canonical: `/catalogo/${slugProducto(producto)}` },
    openGraph: {
      type: "website",
      title: producto.nombre,
      description: descripcion,
      url: `/catalogo/${slugProducto(producto)}`,
      /* ⚠️ La foto del producto, si la tiene. De 955 productos hay 354 con
         imagen apta, así que lo normal es que muchos NO la tengan: sin `images`
         aquí, hereda la del sitio, que es la chapa. Es el comportamiento
         correcto —una imagen genérica es mejor que ninguna—, no un pendiente. */
      images: foto ? [{ url: foto.url, alt: foto.alt || producto.nombre }] : undefined,
    },
  };
}

export default async function PaginaProducto({ params }: Ruta) {
  const { slug } = await params;
  const id = idDesdeSlug(slug);
  const producto = id ? await productoPorId(id) : null;
  if (!producto) notFound();

  return (
    <>
      {/* Para que agregarlo al pedido no tenga que ir a preguntarle al servidor
          quién es este producto. */}
      <SembrarCatalogo productos={[producto]} />

      <Seccion fondo="papel" aire="normal">
        <Link href="/catalogo" className={estilos.volver}>
          <ArrowLeft size={18} aria-hidden />
          Volver al catálogo
        </Link>

        <div className={estilos.marco}>
          <FichaAmpliada
            producto={producto}
            comoTitulo="h1"
            acciones={<AgregarAlPedido producto={producto} />}
          />
        </div>
      </Seccion>

      <PieDePagina />
    </>
  );
}
