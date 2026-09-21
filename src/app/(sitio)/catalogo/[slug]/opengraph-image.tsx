import { ImageResponse } from "next/og";
import { productoPorId } from "@/lib/catalogo";
import { categoriaEtiqueta, contenido } from "@/lib/formato";
import { idDesdeSlug } from "@/lib/producto-url";
import { cuerpoTitulo, FUENTES_OG, LOGO_SRC, OG, TAMANO_OG } from "@/lib/og";

/* La imagen que se ve al compartir un producto por WhatsApp.
 *
 * Lleva la foto y el nombre. El nombre también viaja como título del enlace,
 * debajo de la imagen, pero ahí va en letra chica y gris: dentro de la imagen es
 * lo primero que se lee en un grupo de pedidos.
 *
 * ⚠️ Esto se dibuja en el servidor con un motor que NO es un navegador: no hay
 * hoja de estilos, no hay variables CSS y cada contenedor con más de un hijo
 * necesita `display: flex` explícito. Por eso los colores están escritos y no
 * salen de los tokens. */

export const alt = "Producto de Distribuidora L. Jara";
export const size = TAMANO_OG;
export const contentType = "image/png";

export default async function ImagenProducto({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = idDesdeSlug(slug);
  const producto = id ? await productoPorId(id) : null;

  const nombre = producto?.nombre ?? "Catálogo";
  const foto = producto?.imagenes?.[0]?.url;
  const detalle = producto
    ? [
        producto.categoriaNombre || categoriaEtiqueta(producto.categoria),
        producto.contenidoMl != null ? contenido(producto.contenidoMl) : null,
      ]
        .filter(Boolean)
        .join("  ·  ")
    : "";

  return new ImageResponse(
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
            <img
              src={foto}
              alt=""
              width={380}
              height={480}
              style={{ objectFit: "contain" }}
            />
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
                fontSize: cuerpoTitulo(nombre),
                lineHeight: 1.05,
                color: OG.tinta,
                letterSpacing: -1,
              }}
            >
              {nombre}
            </div>
          </div>

          {/* El pie: la marca y el dominio, para que la imagen se sostenga sola
              cuando se reenvía sin el enlace visible. */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
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
    { ...size, fonts: FUENTES_OG },
  );
}
