export const ORDENES = [
  { id: "nombre-asc", etiqueta: "Nombre (A–Z)" },
  { id: "nombre-desc", etiqueta: "Nombre (Z–A)" },
  { id: "categoria", etiqueta: "Categoría" },
  // Cortos a propósito: el selector convive con el buscador en una sola fila en
  // el teléfono, y «Contenido (de menor a mayor)» ahí sale con puntos suspensivos.
  { id: "contenido-asc", etiqueta: "Menor contenido" },
  { id: "contenido-desc", etiqueta: "Mayor contenido" },
] as const;

export type Orden = (typeof ORDENES)[number]["id"];

export const ORDEN_POR_DEFECTO: Orden = "nombre-asc";

/** Cuántos productos por página.
 *
 *  Veinticuatro es divisible por 2, 3 y 4, que son las columnas de la grilla en
 *  teléfono, tablet y escritorio: así la última fila nunca queda coja. */
export const POR_PAGINA = 24;

export function esOrden(valor: string | undefined): valor is Orden {
  return ORDENES.some((o) => o.id === valor);
}

