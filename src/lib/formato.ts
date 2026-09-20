import type { ProductoMuestra } from "@/contenido/productos-muestra";

/** "1,5 L" / "350 ml" — coma decimal, como se escribe en Chile. */
export function contenido(ml: number | null): string {
  if (ml == null || !Number.isFinite(ml) || ml <= 0) return "—";
  if (ml >= 1000) {
    const litros = ml / 1000;
    const texto = Number.isInteger(litros)
      ? String(litros)
      : String(litros).replace(".", ",");
    return `${texto} L`;
  }
  return `${ml} ml`;
}

/** "1,5 L × 6" — contenido por unidad y unidades por pack. */
export function formatoCompleto(p: ProductoMuestra): string {
  const base = contenido(p.contenidoMl);
  return p.pack && p.pack > 1 ? `${base} × ${p.pack}` : base;
}

const ENVASE_ETIQUETA: Record<string, string> = {
  lata: "Lata",
  pet: "PET",
  vidrio: "Vidrio",
  retornable: "Retornable",
  caja: "Caja",
};

export function envaseEtiqueta(envase: string | null): string | null {
  return envase ? (ENVASE_ETIQUETA[envase] ?? envase) : null;
}

/** Respaldo para las muestras; los productos reales traen el nombre de gestión. */
export function categoriaEtiqueta(slug: string): string {
  return ({ cerveza: "Cervezas", vino: "Vinos", destilado: "Destilados", coctel: "Cócteles", bebida: "Bebidas", agua: "Aguas", jugo: "Jugos", energetica: "Energéticas", otro: "Otros productos" } as Record<string, string>)[slug] ?? slug.replaceAll("-", " ");
}
