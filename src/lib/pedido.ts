import { EMPRESA } from "@/contenido/empresa";
import type { ProductoMuestra } from "@/contenido/productos-muestra";
import { formatoCompleto } from "./formato";

/* Lógica del pedido. Sin React y sin `localStorage`: solo funciones puras, para
 * poder razonarlas y probarlas sueltas.
 *
 * Reglas de negocio que aplican acá, todas del ADR-0005:
 *   - No hay pedido mínimo.
 *   - No hay tope de cantidad.
 *   - Ningún producto está deshabilitado.
 * El sitio no sabe nada del stock y no debe fingir que sí. */

/** Formatos en los que se puede pedir. Por el ADR-0007 la unidad es la base y la
 *  caja es un multiplicador: no son productos distintos. */
export type Formato = "unidad" | "caja";

/** Lo que se guarda en el navegador. Deliberadamente mínimo: solo el id y lo que
 *  el cliente eligió. El resto se resuelve contra el catálogo al renderizar, así
 *  un producto que cambió de nombre no queda congelado en el pedido. */
export type LineaPedido = {
  id: string;
  formato: Formato;
  cantidad: number;
};

/** Línea ya resuelta contra el catálogo, lista para mostrar. */
export type LineaResuelta = LineaPedido & {
  producto: ProductoMuestra;
  unidades: number | null;
};

export type DatosPedido = {
  nombre: string;
  /** ISO `AAAA-MM-DD` tal como lo entrega `<input type="date">`, o vacío. */
  fechaEntrega: string;
};

// ---------------------------------------------------------------------------
// El punto de decisión
// ---------------------------------------------------------------------------

/** ¿Se puede pedir este producto?
 *
 * **Hoy devuelve siempre `true` y eso es intencional.** Está aislado en una
 * función justamente para que el día que el inventario sea confiable se pueda
 * activar acá sin tocar el carrito (ADR-0005).
 *
 * No conectar esto al stock de Autoventa: ese dato no coincide con el físico, y
 * bloquear con él le mostraría al cliente un error interno de la empresa. */
export function sePuedePedir(_producto: ProductoMuestra): boolean {
  return true;
}

// ---------------------------------------------------------------------------
// Formatos
// ---------------------------------------------------------------------------

/** Cuántas unidades trae un formato.
 *
 * `null` significa «no se sabe», y hay que tratarlo como tal en la interfaz en
 * vez de asumir un número: un factor inventado descuadra el stock en silencio,
 * que es exactamente el problema que la empresa está tratando de resolver. */
export function unidadesPorFormato(
  producto: ProductoMuestra,
  formato: Formato,
): number | null {
  if (formato === "unidad") return 1;
  return producto.pack && producto.pack > 1 ? producto.pack : null;
}

/** La caja solo se ofrece cuando se sabe de cuántas unidades es. */
export function formatosDisponibles(producto: ProductoMuestra): Formato[] {
  return producto.pack && producto.pack > 1
    ? ["unidad", "caja"]
    : ["unidad"];
}

export function nombreFormato(formato: Formato, cantidad: number): string {
  if (formato === "caja") return cantidad === 1 ? "caja" : "cajas";
  return cantidad === 1 ? "unidad" : "unidades";
}

// ---------------------------------------------------------------------------
// Operaciones sobre el pedido
// ---------------------------------------------------------------------------

/** Dos líneas son la misma solo si coinciden producto y formato: pedir 2 cajas y
 *  3 unidades del mismo producto es legítimo y no se debe fusionar. */
function esLaMisma(a: LineaPedido, b: { id: string; formato: Formato }): boolean {
  return a.id === b.id && a.formato === b.formato;
}

export function agregarLinea(
  lineas: LineaPedido[],
  nueva: LineaPedido,
): LineaPedido[] {
  const cantidad = normalizarCantidad(nueva.cantidad);
  if (cantidad === 0) return lineas;

  const existente = lineas.find((l) => esLaMisma(l, nueva));
  if (!existente) return [...lineas, { ...nueva, cantidad }];

  return lineas.map((l) =>
    esLaMisma(l, nueva) ? { ...l, cantidad: l.cantidad + cantidad } : l,
  );
}

export function cambiarCantidad(
  lineas: LineaPedido[],
  clave: { id: string; formato: Formato },
  cantidad: number,
): LineaPedido[] {
  const valor = normalizarCantidad(cantidad);
  if (valor === 0) return quitarLinea(lineas, clave);
  return lineas.map((l) => (esLaMisma(l, clave) ? { ...l, cantidad: valor } : l));
}

export function quitarLinea(
  lineas: LineaPedido[],
  clave: { id: string; formato: Formato },
): LineaPedido[] {
  return lineas.filter((l) => !esLaMisma(l, clave));
}

/** Entero positivo. No hay tope: el ADR-0005 dice que se puede pedir cualquier
 *  cantidad. Esto solo descarta basura (texto, negativos, decimales). */
export function normalizarCantidad(valor: number): number {
  if (!Number.isFinite(valor)) return 0;
  return Math.max(0, Math.floor(valor));
}

// ---------------------------------------------------------------------------
// Totales
// ---------------------------------------------------------------------------

/** Cuántas líneas distintas tiene el pedido. Es el número del contador del
 *  encabezado: cuenta productos, no unidades, que es como la gente lee un
 *  carrito. */
export function totalLineas(lineas: LineaPedido[]): number {
  return lineas.length;
}

/** Total en unidades, o `null` si alguna línea tiene un formato sin factor
 *  conocido. Preferimos no mostrar total antes que mostrar uno incompleto. */
export function totalUnidades(lineas: LineaResuelta[]): number | null {
  let suma = 0;
  for (const l of lineas) {
    if (l.unidades === null) return null;
    suma += l.unidades;
  }
  return suma;
}

export function resolverLineas(
  lineas: LineaPedido[],
  buscar: (id: string) => ProductoMuestra | undefined,
): LineaResuelta[] {
  const resueltas: LineaResuelta[] = [];
  for (const linea of lineas) {
    const producto = buscar(linea.id);
    // producto dado de baja del catálogo: la línea se descarta en silencio
    if (!producto) continue;
    const factor = unidadesPorFormato(producto, linea.formato);
    resueltas.push({
      ...linea,
      producto,
      unidades: factor === null ? null : factor * linea.cantidad,
    });
  }
  return resueltas;
}

// ---------------------------------------------------------------------------
// El mensaje de WhatsApp
// ---------------------------------------------------------------------------

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** `2026-08-19` → `19 de agosto de 2026`.
 *
 * Se parsea a mano a propósito: `new Date("2026-08-19")` interpreta la fecha como
 * UTC y en Chile eso la corre un día hacia atrás. */
export function fechaLegible(iso: string): string | null {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!partes) return null;
  const [, anio, mes, dia] = partes;
  const indice = Number(mes) - 1;
  if (indice < 0 || indice > 11) return null;
  return `${Number(dia)} de ${MESES[indice]} de ${anio}`;
}

/** Arma el texto del pedido.
 *
 * Se usa igual para el botón de WhatsApp y para el de copiar: un solo texto, así
 * el vendedor recibe siempre lo mismo llegue por donde llegue. El formato usa
 * `*negrita*` de WhatsApp, que en un pegado a otro lado se lee igual de bien. */
export function armarMensaje(
  lineas: LineaResuelta[],
  datos: DatosPedido,
): string {
  const partes: string[] = [`*PEDIDO — ${EMPRESA.nombre}*`, ""];

  const nombre = datos.nombre.trim();
  if (nombre) partes.push(`Cliente: ${nombre}`);

  const fecha = fechaLegible(datos.fechaEntrega);
  if (fecha) partes.push(`Entrega deseada: ${fecha}`);

  if (nombre || fecha) partes.push("");

  for (const l of lineas) {
    partes.push(`• ${l.producto.nombre} — ${formatoCompleto(l.producto)}`);

    const unidad = nombreFormato(l.formato, l.cantidad);
    const detalle =
      l.unidades !== null && l.formato === "caja"
        ? `${l.cantidad} ${unidad} (${l.unidades} unidades)`
        : `${l.cantidad} ${unidad}`;

    partes.push(`  ${detalle} · código ${l.producto.codigo}`);
  }

  partes.push("");

  const unidades = totalUnidades(lineas);
  const cuenta = `${lineas.length} ${lineas.length === 1 ? "producto" : "productos"}`;
  partes.push(
    unidades === null ? `Total: ${cuenta}` : `Total: ${cuenta}, ${unidades} ${unidades === 1 ? "unidad" : "unidades"}`,
  );

  return partes.join("\n");
}

/** Enlace `wa.me`. Devuelve `null` si el número todavía es el placeholder, para
 *  que la interfaz muestre el botón de copiar en vez de un enlace roto. */
export function enlaceWhatsApp(mensaje: string): string | null {
  const numero = soloDigitos(EMPRESA.contacto.whatsapp);
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/** `+56 9 1234 5678` → `56912345678`. Un placeholder tipo `[+56 9 XXXX XXXX]` no
 *  deja dígitos suficientes y devuelve vacío. */
function soloDigitos(valor: string): string {
  const digitos = valor.replace(/\D/g, "");
  return digitos.length >= 8 ? digitos : "";
}

/** ¿Ya está configurado el número de la empresa? El sitio no puede lanzarse sin
 *  esto, y mientras tanto conviene que la interfaz lo diga en vez de fallar. */
export function hayWhatsApp(): boolean {
  return soloDigitos(EMPRESA.contacto.whatsapp) !== "";
}
