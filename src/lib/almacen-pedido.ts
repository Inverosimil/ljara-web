import {
  agregarLinea,
  cambiarCantidad,
  quitarLinea,
  type DatosPedido,
  type Formato,
  type LineaPedido,
} from "./pedido";

/* Almacén del pedido: un store fuera de React, sobre `localStorage`.
 *
 * Está fuera de React a propósito. El pedido vive en el navegador (ADR-0004), o
 * sea en un sistema externo, y para eso existe `useSyncExternalStore`: da el
 * comportamiento correcto en SSR —el servidor renderiza un pedido vacío, el
 * cliente hidrata después— sin tener que sincronizar estado dentro de un efecto.
 *
 * Nada de esto viaja a un servidor. El pedido sale del sitio solo cuando el
 * cliente aprieta el botón de WhatsApp. */

const CLAVE = "ljara.pedido.v1";

export type EstadoPedido = {
  lineas: LineaPedido[];
  datos: DatosPedido;
  /** `false` hasta que se leyó `localStorage`. Antes de eso no hay que pintar
   *  contadores: saldría un 0 que cambia solo y se lee como un parpadeo. */
  hidratado: boolean;
};

const VACIO: EstadoPedido = {
  lineas: [],
  datos: { nombre: "", fechaEntrega: "" },
  hidratado: false,
};

/* Snapshot único y estable. `useSyncExternalStore` compara por identidad, así que
 * cada cambio tiene que producir un objeto nuevo y ninguna lectura debe crear
 * uno: devolver `{...}` desde `leerEstado` provocaría un bucle de renders. */
let estado: EstadoPedido = VACIO;

const oyentes = new Set<() => void>();

function emitir(): void {
  for (const oyente of oyentes) oyente();
}

function fijar(siguiente: EstadoPedido): void {
  estado = siguiente;
  guardar();
  emitir();
}

// ---------------------------------------------------------------------------
// Persistencia
// ---------------------------------------------------------------------------

/** Lee lo guardado. Cualquier cosa rara se descarta: es preferible un pedido
 *  vacío a una página que revienta por un JSON viejo, truncado o manipulado. */
function leerGuardado(): Pick<EstadoPedido, "lineas" | "datos"> | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return null;

    const dato: unknown = JSON.parse(crudo);
    if (typeof dato !== "object" || dato === null) return null;

    const { lineas, datos } = dato as Partial<EstadoPedido>;
    if (!Array.isArray(lineas)) return null;

    return {
      lineas: lineas.filter(esLineaValida),
      datos: {
        nombre: typeof datos?.nombre === "string" ? datos.nombre : "",
        fechaEntrega:
          typeof datos?.fechaEntrega === "string" ? datos.fechaEntrega : "",
      },
    };
  } catch {
    return null;
  }
}

function esLineaValida(linea: unknown): linea is LineaPedido {
  if (typeof linea !== "object" || linea === null) return false;
  const l = linea as Partial<LineaPedido>;
  return (
    typeof l.id === "string" &&
    (l.formato === "unidad" || l.formato === "caja") &&
    typeof l.cantidad === "number" &&
    Number.isFinite(l.cantidad) &&
    l.cantidad > 0
  );
}

function guardar(): void {
  if (typeof window === "undefined" || !estado.hidratado) return;
  try {
    const { lineas, datos } = estado;
    window.localStorage.setItem(CLAVE, JSON.stringify({ lineas, datos }));
  } catch {
    // cuota llena o modo privado: el pedido sigue funcionando en memoria
  }
}

function hidratar(): void {
  if (estado.hidratado) return;
  const guardado = leerGuardado();
  estado = { ...(guardado ?? VACIO), hidratado: true };
  emitir();
}

// ---------------------------------------------------------------------------
// Interfaz para useSyncExternalStore
// ---------------------------------------------------------------------------

export function suscribir(oyente: () => void): () => void {
  // la primera suscripción ocurre después del primer render, que es justo cuando
  // corresponde hidratar: así el HTML del servidor y el del cliente coinciden
  hidratar();
  oyentes.add(oyente);

  // otra pestaña del mismo sitio tocó el pedido
  const alCambiarAlmacenamiento = (evento: StorageEvent) => {
    if (evento.key !== CLAVE) return;
    const guardado = leerGuardado();
    estado = { ...(guardado ?? VACIO), hidratado: true };
    emitir();
  };
  window.addEventListener("storage", alCambiarAlmacenamiento);

  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", alCambiarAlmacenamiento);
  };
}

export function leerEstado(): EstadoPedido {
  return estado;
}

/** En el servidor el pedido siempre está vacío: es información del navegador. */
export function leerEstadoServidor(): EstadoPedido {
  return VACIO;
}

// ---------------------------------------------------------------------------
// Acciones
// ---------------------------------------------------------------------------

export function agregar(id: string, formato: Formato, cantidad: number): void {
  fijar({ ...estado, lineas: agregarLinea(estado.lineas, { id, formato, cantidad }) });
}

export function cambiar(id: string, formato: Formato, cantidad: number): void {
  fijar({
    ...estado,
    lineas: cambiarCantidad(estado.lineas, { id, formato }, cantidad),
  });
}

export function quitar(id: string, formato: Formato): void {
  fijar({ ...estado, lineas: quitarLinea(estado.lineas, { id, formato }) });
}

export function vaciar(): void {
  fijar({ ...VACIO, hidratado: estado.hidratado });
}

export function actualizarDatos(parcial: Partial<DatosPedido>): void {
  fijar({ ...estado, datos: { ...estado.datos, ...parcial } });
}
