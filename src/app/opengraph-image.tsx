import { ImageResponse } from "next/og";
import { EMPRESA } from "@/contenido/empresa";
import { FUENTES_OG, LOGO_SRC, OG, TAMANO_OG } from "@/lib/og";

/* La imagen del sitio al compartirlo, y la que heredan las páginas que no
 * tienen una propia.
 *
 * Reemplaza al PNG estático que había hasta el 2026-09-20. Ese llevaba la chapa
 * sola, sin una palabra, y conservaba las franjas de banderines que se habían
 * quitado del sitio en la vuelta de tuerca del 2026-09-06: era la única pieza
 * donde seguían vivos.
 *
 * ⚠️ El texto sale de `EMPRESA`, no escrito a mano: es el mismo sitio del que
 * salen el encabezado y el pie, así que cambiar el nombre o la bajada no deja
 * esta imagen diciendo otra cosa. */

export const alt = `${EMPRESA.nombre} — ${EMPRESA.bajada}`;
export const size = TAMANO_OG;
export const contentType = "image/png";

export default function ImagenDelSitio() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 90px",
          backgroundColor: OG.papel,
          fontFamily: "Archivo Black",
        }}
      >
        <img src={LOGO_SRC} alt="" width={330} height={330} />

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 68, lineHeight: 1.05, color: OG.tinta, letterSpacing: -1 }}>
            Distribuidora
          </div>
          <div style={{ display: "flex", fontSize: 68, lineHeight: 1.05, color: OG.rojo, letterSpacing: -1 }}>
            {EMPRESA.nombre}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: OG.tinta, marginTop: 26 }}>
            {EMPRESA.bajada}
          </div>
          {/* Una raya, del grosor del borde macizo que usa todo el sitio. */}
          <div style={{ display: "flex", width: 150, height: 6, backgroundColor: OG.tinta, margin: "28px 0" }} />
          <div style={{ display: "flex", fontSize: 24, color: "#6f767b" }}>
            {EMPRESA.cobertura}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: FUENTES_OG },
  );
}
