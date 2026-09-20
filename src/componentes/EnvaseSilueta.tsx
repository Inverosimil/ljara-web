import type { Categoria } from "@/contenido/productos-muestra";

/** Placeholder para cuando el producto no tiene foto.
 *
 * Todavía no hay imágenes de producto (ver assets/productos/README.md) y con ~955
 * productos la cobertura no va a llegar de una vez: el catálogo necesita un
 * placeholder digno desde el día uno. Dibuja la silueta del envase y la tiñe
 * según la categoría, así la grilla se lee aunque falten fotos. */

/* Las categorías salen de la base y el negocio puede agregar una cualquier día
 * —«otro» ya existe—. El mapa es parcial y hay un tinte de reserva: sin eso, una
 * categoría nueva dejaba la silueta sin relleno y no se veía nada. */
const RESERVA = "#6F767B";
const RESERVA_CLARO = "#ABAFB2";

const TINTE: Partial<Record<Categoria, string>> = {
  cerveza: "#C9922B",
  vino: "#7A1F3D",
  destilado: "#8A5A2B",
  coctel: "#D4573F",
  bebida: "#2B6CA3",
  agua: "#3FA8C4",
  jugo: "#E08A2B",
  energetica: "#4B7A3F",
};

/** Los tintes normales se hunden contra un fondo oscuro: sobre negro hace falta
 *  subir luminosidad y saturación o la silueta desaparece. */
const TINTE_CLARO: Partial<Record<Categoria, string>> = {
  cerveza: "#F0BE5C",
  vino: "#E8637F",
  destilado: "#D9A066",
  coctel: "#FF8A6B",
  bebida: "#6BB6F0",
  agua: "#5FD4E8",
  jugo: "#FFB454",
  energetica: "#8FD46F",
};

type Props = {
  categoria: Categoria;
  envase: string | null;
  className?: string;
  /** Usa la paleta clara, para fondos oscuros. */
  sobreOscuro?: boolean;
};

export function EnvaseSilueta({
  categoria,
  envase,
  className = "",
  sobreOscuro = false,
}: Props) {
  const paleta = sobreOscuro ? TINTE_CLARO : TINTE;
  const color = paleta[categoria] ?? (sobreOscuro ? RESERVA_CLARO : RESERVA);
  const esLata = envase === "lata";
  const esCaja = envase === "caja";

  return (
    <svg
      viewBox="0 0 64 96"
      className={className}
      role="img"
      aria-label={`Imagen no disponible — ${categoria}`}
      fill="none"
    >
      {esLata ? (
        <>
          <rect x="18" y="14" width="28" height="70" rx="4" fill={color} opacity="0.16" />
          <rect x="18" y="14" width="28" height="70" rx="4" stroke={color} strokeWidth="2" />
          <rect x="18" y="14" width="28" height="9" rx="4" fill={color} opacity="0.4" />
          <rect x="18" y="46" width="28" height="16" fill={color} opacity="0.28" />
        </>
      ) : esCaja ? (
        <>
          <path d="M16 24h32v60H16z" fill={color} opacity="0.16" />
          <path d="M16 24h32v60H16z" stroke={color} strokeWidth="2" />
          <path d="M16 24l16-12 16 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <rect x="16" y="48" width="32" height="14" fill={color} opacity="0.28" />
        </>
      ) : (
        <>
          <path
            d="M28 10h8v14c0 4 8 8 8 18v38a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V42c0-10 8-14 8-18V10z"
            fill={color}
            opacity="0.16"
          />
          <path
            d="M28 10h8v14c0 4 8 8 8 18v38a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V42c0-10 8-14 8-18V10z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect x="26" y="6" width="12" height="6" rx="2" fill={color} opacity="0.5" />
          <rect x="20" y="52" width="24" height="18" fill={color} opacity="0.28" />
        </>
      )}
    </svg>
  );
}
