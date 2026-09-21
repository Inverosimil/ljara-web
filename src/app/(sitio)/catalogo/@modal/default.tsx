/* Sin modal abierto no se pinta nada.
 *
 * Un slot paralelo necesita `default` para las cargas directas: sin este
 * archivo, entrar a /catalogo desde fuera daría 404 porque Next no sabría qué
 * poner en el hueco del slot. */
export default function SinModal() {
  return null;
}
