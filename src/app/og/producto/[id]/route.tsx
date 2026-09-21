import { ImageResponse } from "next/og";
import { productoPorId } from "@/lib/catalogo";
import { categoriaEtiqueta, contenido } from "@/lib/formato";
import { idDeProducto } from "@/lib/producto-url";
import { cuerpoTitulo, FUENTES_OG, LOGO_SRC, OG, TAMANO_OG } from "@/lib/og";

/* La imagen que se ve al compartir un producto por WhatsApp.
 *
 * ⚠️ Es una ruta propia y no un `opengraph-image.tsx` porque un producto no
 * tiene página: es `/catalogo?producto=239`. El archivo `opengraph-image` solo
 * recibe los SEGMENTOS de la dirección, nunca los parámetros, así que no habría
 * forma de que supiera qué producto dibujar. Quien la enlaza es el
 * `generateMetadata` del catálogo.
 *
 * Lleva la foto y el nombre. El nombre también viaja como título del enlace,
 * debajo de la imagen, pero ahí va en letra chica y gris: dentro de la imagen es
 * lo primero que se lee en un grupo de pedidos.
 *
 * ⚠️ Esto se dibuja en el servidor con un motor que NO es un navegador: no hay
 * hoja de estilos, no hay variables CSS y cada contenedor con más de un hijo
 * necesita `display: flex` explícito. Por eso los colores están escritos y no
 * salen de los tokens. */

export async function GET(_peticion: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const producto = idDeProducto(id) ? await productoPorId(id) : null;

  /* Un producto que no existe no inventa una imagen: quien la pide es un
     robot de vista previa y un 404 lo hace caer en la imagen del sitio. */
  if (!producto) return new Response("No encontrado", { status: 404 });

  const foto = producto.imagenes?.[0]?.url;
  const detalle = [
    producto.categoriaNombre || categoriaEtiqueta(producto.categoria),
    producto.contenidoMl != null ? contenido(producto.contenidoMl) : null,
  ]
    .filter(Boolean)
    .join("  ·  ");

  const imagen = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: OG.papel,
          fontFamily: "Archivo Black",
        }}
      >
        {/* La foto, sobre blanco como en la ficha del sitio. Si el producto no
            tiene —de 955 hay 354 con imagen apta— este bloque no se dibuja y el
            nombre ocupa el ancho completo. */}
        {foto && (
          <div
            style={{
              display: "flex",
              width: 470,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: OG.blanco,
              borderRight: `6px solid ${OG.tinta}`,
            }}
          >
            {/* `next/image` no existe acá: esto no lo pinta un navegador, lo
                dibuja el generador de imágenes en el servidor. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={foto} alt="" width={380} height={480} style={{ objectFit: "contain" }} />
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "56px 56px 44px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {detalle && (
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: OG.rojo,
                  marginBottom: 22,
                }}
              >
                {detalle}
              </div>
            )}
            <div
              style={{
                display: "flex",
                fontSize: cuerpoTitulo(producto.nombre),
                lineHeight: 1.05,
                color: OG.tinta,
                letterSpacing: -1,
              }}
            >
              {producto.nombre}
            </div>
          </div>

          {/* El pie: la marca y el dominio, para que la imagen se sostenga sola
              cuando se reenvía sin el enlace visible. */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="" width={74} height={74} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 26, color: OG.tinta }}>
                Distribuidora L. Jara
              </div>
              <div style={{ display: "flex", fontSize: 20, color: "#6f767b", marginTop: 4 }}>
                cdljara.cl
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...TAMANO_OG, fonts: FUENTES_OG },
  );

  /* Se cachea una hora. Componer la imagen implica leer el producto y traer su
     foto, y los robots de vista previa la piden cada vez que alguien pega el
     enlace en un chat. */
  imagen.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
  return imagen;
}
