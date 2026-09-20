/** Los corchetes se usan en el levantamiento para datos aún no confirmados. */
export function textoConfirmado(valor: string | null | undefined): string | null {
  const texto = valor?.trim();
  return texto && !/[\[\]]/.test(texto) ? texto : null;
}
