/* Reglas del sistema, en un solo lugar.
 *
 * Todo el sitio se dibuja con tres piezas: borde macizo, sombra dura sin
 * difuminar y papel. Los componentes de ui/ consumen estas constantes en vez de
 * escribir clases sueltas, para que un cambio de grosor o de sombra se aplique
 * en todas partes de una sola vez. */

/** Borde macizo estándar. El sitio entero usa 3px; nada de 1px ni 2px sueltos. */
export const BORDE = "border-[3px] border-tinta";

/** Conserva la geometría del botón sin dibujar un contorno. */
export const BORDE_BOTON = "border-[3px] border-transparent";

/** Rotaciones permitidas. Un set cerrado evita que cada componente invente la
 *  suya y que el collage se vea aleatorio en vez de compuesto.
 *
 *  Los ángulos están calibrados por el ADR-0006: son la mitad de los originales.
 *  El giro sigue ahí —la página no es una cuadrícula— pero deja de ser lo primero
 *  que se ve. Este es el punto único donde se ajusta: subir estos cuatro números
 *  devuelve el registro anterior en todo el sitio de una sola vez.
 *
 *  Ojo: los acentos deliberados (el sello de oferta a 8°, la chapa a 18°, la
 *  franja a 12°) NO salen de acá. Esos son gestos, no ruido, y se quedan. */
export const GIROS = [
  "-rotate-[0.8deg]",
  "rotate-[0.5deg]",
  "-rotate-[0.35deg]",
  "rotate-[0.9deg]",
] as const;

/** Giro estable a partir de un índice: el mismo elemento siempre se inclina
 *  igual entre renders (nada de Math.random, que además rompería el SSR). */
export function giro(indice: number): string {
  return GIROS[indice % GIROS.length];
}

/** Sombras de acento que rotan en las grillas, para dar ritmo sin desorden. */
export const SOMBRAS_ACENTO = [
  "shadow-dura-cian",
  "shadow-dura-rojo",
  "shadow-dura-oro",
] as const;

export function sombraAcento(indice: number): string {
  return SOMBRAS_ACENTO[indice % SOMBRAS_ACENTO.length];
}

/** Une clases ignorando vacíos. */
export function cx(...partes: (string | false | null | undefined)[]): string {
  return partes.filter(Boolean).join(" ");
}
