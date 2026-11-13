/* eslint-disable @typescript-eslint/no-explicit-any */
/** Adaptador privado, limitado al esquema de L.Jara (catálogo y finanzas). No acepta SQL del navegador.
 * Los valores siempre viajan como parámetros; tablas y relaciones tienen lista cerrada. */
export type Ejecutar = (sql: string, valores: unknown[]) => Promise<{ rows: any[]; rowCount: number | null }>;
/** Tablas y vistas que el adaptador acepta, con el esquema de cada una (ADR-0019, `db/scripts/esquemas-por-dominio.py`).
 * Una tabla nueva que se consulte desde las apps se agrega aquí con su esquema. */
const ESQUEMA_DE: Record<string, string> = {
  // nucleo
  adjunto: "nucleo",
  // identidad
  perfil: "identidad",
  // auditoria
  importacion: "auditoria", rechazo: "auditoria",
  // catalogo
  producto: "catalogo", marca: "catalogo", categoria: "catalogo", formato: "catalogo", codigo_barra: "catalogo", imagen: "catalogo", sello: "catalogo", tasa_ila: "catalogo", conteo_categoria: "catalogo", distribuidor: "catalogo", fabricante: "catalogo", impuesto_adicional: "catalogo",
  // inventario
  ubicacion: "inventario", movimiento: "inventario", existencia: "inventario", conteo: "inventario", conteo_linea: "inventario", operacion_stock: "inventario", stock_producto: "inventario", stock_autoventa: "inventario", calendario_vencimiento: "inventario",
  // comercial
  costo: "comercial", precio: "comercial", contraparte: "comercial", documento: "comercial", lista_precio: "comercial", precio_lista: "comercial", contraparte_codigo: "comercial", contraparte_direccion: "comercial", contraparte_bloqueo: "comercial", facturacion_mensual: "comercial", documento_linea: "comercial", nota_credito: "comercial", nota_credito_linea: "comercial", venta_linea: "comercial", cliente_resumen: "comercial", documento_estado: "comercial", cuenta_corriente: "comercial",
  // finanzas
  cuenta_dinero: "finanzas", movimiento_dinero: "finanzas", aplicacion: "finanzas", cheque: "finanzas", movimiento_estado: "finanzas", saldo_cuenta: "finanzas", flujo_mensual: "finanzas", categoria_gasto: "finanzas", gasto_mensual: "finanzas",
};
const esTabla = (t: string) => Object.hasOwn(ESQUEMA_DE, t);
/** `esquema."tabla"`, listo para el SQL. */
const tablaSql = (t: string) => { if (!esTabla(t)) throw new Error("Tabla fuera de L.Jara"); return `${ESQUEMA_DE[t]}.${ident(t)}`; };
/** `.schema("ljara")` nombra a L.Jara entera, no un esquema de la base: el esquema real sale de ESQUEMA_DE. */
const ESQUEMAS = new Set(["ljara"]);
const ident = (s: string) => { if (!/^[a-z_][a-z0-9_]*$/.test(s)) throw new Error("Identificador no permitido"); return `"${s}"`; };
type Relacion = { tabla: string; local: string; remota: string; lista: boolean };
const RELACIONES: Record<string, Record<string, Relacion>> = {
  producto: {
    marca: { tabla: "marca", local: "marca_id", remota: "id", lista: false },
    categoria: { tabla: "categoria", local: "categoria_id", remota: "id", lista: false },
    distribuidor: { tabla: "distribuidor", local: "distribuidor_id", remota: "id", lista: false },
    fabricante: { tabla: "fabricante", local: "fabricante_id", remota: "id", lista: false },
    ubicacion: { tabla: "ubicacion", local: "ubicacion_id", remota: "id", lista: false },
    impuesto: { tabla: "impuesto_adicional", local: "impuesto_codigo", remota: "codigo", lista: false },
    formato: { tabla: "formato", local: "id", remota: "producto_id", lista: true },
    imagen: { tabla: "imagen", local: "id", remota: "producto_id", lista: true },
    sello: { tabla: "sello", local: "id", remota: "producto_id", lista: true },
  },
  formato: { codigo_barra: { tabla: "codigo_barra", local: "id", remota: "formato_id", lista: true },
    producto: { tabla: "producto", local: "producto_id", remota: "id", lista: false } },
  // Inventario (0033).
  movimiento: {
    producto: { tabla: "producto", local: "producto_id", remota: "id", lista: false },
    ubicacion: { tabla: "ubicacion", local: "ubicacion_id", remota: "id", lista: false },
    operacion: { tabla: "operacion_stock", local: "operacion_id", remota: "id", lista: false },
  },
  operacion_stock: {
    ubicacion: { tabla: "ubicacion", local: "ubicacion_id", remota: "id", lista: false },
    destino: { tabla: "ubicacion", local: "ubicacion_destino_id", remota: "id", lista: false },
    distribuidor: { tabla: "distribuidor", local: "distribuidor_id", remota: "id", lista: false },
    movimiento: { tabla: "movimiento", local: "id", remota: "operacion_id", lista: true },
  },
  existencia: {
    producto: { tabla: "producto", local: "producto_id", remota: "id", lista: false },
    ubicacion: { tabla: "ubicacion", local: "ubicacion_id", remota: "id", lista: false },
  },
  stock_producto: { producto: { tabla: "producto", local: "producto_id", remota: "id", lista: false } },
  conteo: {
    ubicacion: { tabla: "ubicacion", local: "ubicacion_id", remota: "id", lista: false },
    conteo_linea: { tabla: "conteo_linea", local: "id", remota: "conteo_id", lista: true },
  },
  conteo_linea: { producto: { tabla: "producto", local: "producto_id", remota: "id", lista: false } },
  // Finanzas (0028). Las vistas *_estado llevan las mismas relaciones que su tabla.
  documento: {
    contraparte: { tabla: "contraparte", local: "contraparte_id", remota: "id", lista: false },
    categoria_gasto: { tabla: "categoria_gasto", local: "categoria_gasto_id", remota: "id", lista: false },
    aplicacion: { tabla: "aplicacion", local: "id", remota: "documento_id", lista: true },
    linea: { tabla: "documento_linea", local: "id", remota: "documento_id", lista: true },
    nota_credito: { tabla: "nota_credito", local: "id", remota: "documento_id", lista: true },
  },
  documento_estado: {
    contraparte: { tabla: "contraparte", local: "contraparte_id", remota: "id", lista: false },
    aplicacion: { tabla: "aplicacion", local: "id", remota: "documento_id", lista: true },
    linea: { tabla: "documento_linea", local: "id", remota: "documento_id", lista: true },
    nota_credito: { tabla: "nota_credito", local: "id", remota: "documento_id", lista: true },
  },
  // Lo comercial (0037).
  contraparte: {
    lista: { tabla: "lista_precio", local: "lista_precio_id", remota: "id", lista: false },
    direccion: { tabla: "contraparte_direccion", local: "id", remota: "contraparte_id", lista: true },
    codigo: { tabla: "contraparte_codigo", local: "id", remota: "contraparte_id", lista: true },
    bloqueo: { tabla: "contraparte_bloqueo", local: "id", remota: "contraparte_id", lista: true },
  },
  precio_lista: {
    lista: { tabla: "lista_precio", local: "lista_id", remota: "id", lista: false },
    producto: { tabla: "producto", local: "producto_id", remota: "id", lista: false },
  },
  documento_linea: {
    producto: { tabla: "producto", local: "producto_id", remota: "id", lista: false },
    documento: { tabla: "documento", local: "documento_id", remota: "id", lista: false },
  },
  venta_linea: {
    producto: { tabla: "producto", local: "producto_id", remota: "id", lista: false },
    contraparte: { tabla: "contraparte", local: "contraparte_id", remota: "id", lista: false },
  },
  nota_credito: {
    contraparte: { tabla: "contraparte", local: "contraparte_id", remota: "id", lista: false },
    documento: { tabla: "documento", local: "documento_id", remota: "id", lista: false },
    linea: { tabla: "nota_credito_linea", local: "id", remota: "nota_credito_id", lista: true },
  },
  nota_credito_linea: {
    producto: { tabla: "producto", local: "producto_id", remota: "id", lista: false },
  },
  cheque: { contraparte: { tabla: "contraparte", local: "contraparte_id", remota: "id", lista: false } },
  stock_autoventa: { producto: { tabla: "producto", local: "producto_id", remota: "id", lista: false } },
  movimiento_dinero: {
    cuenta: { tabla: "cuenta_dinero", local: "cuenta_id", remota: "id", lista: false },
    categoria_gasto: { tabla: "categoria_gasto", local: "categoria_gasto_id", remota: "id", lista: false },
    contraparte: { tabla: "contraparte", local: "contraparte_id", remota: "id", lista: false },
    aplicacion: { tabla: "aplicacion", local: "id", remota: "movimiento_id", lista: true },
  },
  movimiento_estado: {
    cuenta: { tabla: "cuenta_dinero", local: "cuenta_id", remota: "id", lista: false },
    contraparte: { tabla: "contraparte", local: "contraparte_id", remota: "id", lista: false },
    aplicacion: { tabla: "aplicacion", local: "id", remota: "movimiento_id", lista: true },
  },
  aplicacion: {
    documento: { tabla: "documento", local: "documento_id", remota: "id", lista: false },
    movimiento: { tabla: "movimiento_dinero", local: "movimiento_id", remota: "id", lista: false },
  },
};
function partes(s: string): string[] {
  let nivel = 0, inicio = 0; const salida: string[] = [];
  for (let i = 0; i < s.length; i++) { if (s[i] === "(") nivel++; if (s[i] === ")") nivel--; if (s[i] === "," && nivel === 0) { salida.push(s.slice(inicio, i).trim()); inicio = i + 1; } }
  salida.push(s.slice(inicio).trim()); return salida.filter(Boolean);
}
function seleccion(tabla: string, campos: string, alias: string): { columnas: string; condiciones: string[] } {
  const condiciones: string[] = [];
  const columnas = partes(campos).map(c => {
    if (c === "*") return `${alias}.*`;
    const m = c.match(/^([a-z_]+)(?::[a-z_]+)?\s*(!inner)?\s*\(([\s\S]*)\)$/);
    if (!m) return `${alias}.${ident(c)}`;
    const [, nombre, inner, camposRelacion] = m;
    const r = RELACIONES[tabla]?.[nombre]; if (!r) throw new Error("Relación no permitida");
    const subAlias = `${alias}_${nombre}`;
    const sub = seleccion(r.tabla, camposRelacion, subAlias);
    const enlace = `${subAlias}.${ident(r.remota)} = ${alias}.${ident(r.local)}`;
    const where = [enlace, ...sub.condiciones].join(" AND ");
    const sql = `SELECT ${sub.columnas} FROM ${tablaSql(r.tabla)} ${subAlias} WHERE ${where}`;
    if (inner) condiciones.push(`EXISTS (SELECT 1 FROM ${tablaSql(r.tabla)} ${subAlias} WHERE ${where})`);
    return (r.lista ? `COALESCE((SELECT json_agg(x) FROM (${sql}) x), '[]'::json)` : `(SELECT row_to_json(x) FROM (${sql}) x)`) + ` AS ${ident(nombre)}`;
  }).join(", ");
  return { columnas, condiciones };
}
type Resultado<U extends boolean> = { data: (U extends true ? any : any[]) | null; error: { message: string; code?: string } | null; count: number | null };
export class ConsultaLjara<U extends boolean = false> implements PromiseLike<Resultado<U>> {
  private campos = "*"; private filtros: string[] = []; private valores: unknown[] = [];
  private ordenes: string[] = []; private offset = 0; private limite?: number;
  private contar = false; private cabecera = false; private singular = false; private opcional = false;
  private modo = "select"; private datos: Record<string, unknown>[] = []; private devolver = false;
  constructor(private tabla: string, private ejecutar: Ejecutar) { if (!esTabla(tabla)) throw new Error("Tabla fuera de L.Jara"); }
  private valor(v: unknown) { this.valores.push(v); return `$${this.valores.length}`; }
  private columna(c: string) {
    const [rel, campo] = c.split(".");
    if (!campo) return `t.${ident(c)}`;
    const r = RELACIONES[this.tabla]?.[rel]; if (!r || r.lista) throw new Error("Filtro de relación no permitido");
    return `(SELECT r.${ident(campo)} FROM ${tablaSql(r.tabla)} r WHERE r.${ident(r.remota)} = t.${ident(r.local)})`;
  }
  select(campos = "*", opciones?: { count?: string; head?: boolean }) { this.campos = campos; this.contar = opciones?.count === "exact"; this.cabecera = !!opciones?.head; this.devolver = true; return this; }
  eq(c: string, v: unknown) { this.filtros.push(`${this.columna(c)} = ${this.valor(v)}`); return this; }
  is(c: string, v: null | boolean) { this.filtros.push(`${this.columna(c)} IS ${v === null ? "NULL" : v ? "TRUE" : "FALSE"}`); return this; }
  in(c: string, v: unknown[]) { this.filtros.push(v.length ? `${this.columna(c)} IN (${v.map(x => this.valor(x)).join(",")})` : "FALSE"); return this; }
  neq(c: string, v: unknown) { this.filtros.push(`${this.columna(c)} <> ${this.valor(v)}`); return this; }
  gt(c: string, v: unknown) { this.filtros.push(`${this.columna(c)} > ${this.valor(v)}`); return this; }
  gte(c: string, v: unknown) { this.filtros.push(`${this.columna(c)} >= ${this.valor(v)}`); return this; }
  lt(c: string, v: unknown) { this.filtros.push(`${this.columna(c)} < ${this.valor(v)}`); return this; }
  lte(c: string, v: unknown) { this.filtros.push(`${this.columna(c)} <= ${this.valor(v)}`); return this; }
  ilike(c: string, v: string) { this.filtros.push(`${this.columna(c)} ILIKE ${this.valor(v)}`); return this; }
  buscar(columnas: string[], texto: string) { const v = this.valor(`%${texto.replace(/[\\%_]/g, "\\$&")}%`); this.filtros.push(`(${columnas.map(c => `${this.columna(c)} ILIKE ${v}`).join(" OR ")})`); return this; }
  order(c: string, o?: { ascending?: boolean; nullsFirst?: boolean; referencedTable?: string }) { this.ordenes.push(`${this.columna(o?.referencedTable ? `${o.referencedTable}.${c}` : c)} ${o?.ascending === false ? "DESC" : "ASC"} NULLS ${o?.nullsFirst ? "FIRST" : "LAST"}`); return this; }
  range(desde: number, hasta: number) { this.offset = Math.max(0, Math.floor(desde)); this.limite = Math.max(0, Math.floor(hasta - desde + 1)); return this; }
  limit(n: number) { this.limite = Math.max(0, Math.floor(n)); return this; }
  single() { this.singular = true; return this as unknown as ConsultaLjara<true>; }
  maybeSingle() { this.singular = true; this.opcional = true; return this as unknown as ConsultaLjara<true>; }
  insert(d: Record<string, unknown> | Record<string, unknown>[]) { this.modo = "insert"; this.datos = Array.isArray(d) ? d : [d]; return this; }
  update(d: Record<string, unknown>, o?: { count?: string }) { this.modo = "update"; this.datos = [d]; this.contar = o?.count === "exact"; return this; }
  delete() { this.modo = "delete"; return this; }
  async resultado() {
    try {
      const s = seleccion(this.tabla, this.campos, "t");
      const condiciones = [...this.filtros, ...s.condiciones];
      const where = condiciones.length ? ` WHERE ${condiciones.join(" AND ")}` : "";
      let count: number | null = null; let rows: any[] = [];
      if (this.modo === "select") {
        // El total y la página van EN PARALELO: cada consulta es un viaje a la base (~65 ms) y
        // en serie toda lista paginada pagaba dos. La página se valida contra el total después.
        const valoresConteo = [...this.valores];
        const sqlConteo = `SELECT count(*)::int AS total FROM ${tablaSql(this.tabla)} t${where}`;
        let sqlFilas: string | null = null;
        if (!this.cabecera) {
          const orden = this.ordenes.length ? ` ORDER BY ${this.ordenes.join(", ")}` : "";
          const limite = this.limite !== undefined ? ` LIMIT ${this.valor(this.limite)} OFFSET ${this.valor(this.offset)}` : "";
          sqlFilas = `SELECT ${s.columnas} FROM ${tablaSql(this.tabla)} t${where}${orden}${limite}`;
        }
        const [rConteo, rFilas] = await Promise.all([
          this.contar ? this.ejecutar(sqlConteo, valoresConteo) : null,
          sqlFilas ? this.ejecutar(sqlFilas, this.valores) : null,
        ]);
        if (rConteo) count = rConteo.rows[0].total;
        if (this.offset > 0 && count !== null && this.offset >= count) return { data: null, error: { code: "PGRST103", message: "Página fuera de rango" }, count };
        rows = rFilas?.rows ?? [];
      } else {
        let sql: string;
        const retorno = " RETURNING *";
        if (this.modo === "insert") {
          if (!this.datos.length) return { data: [], error: null, count: 0 };
          const keys = Object.keys(this.datos[0]);
          const values = this.datos.map(d => `(${keys.map(k => this.valor(d[k] ?? null)).join(",")})`).join(",");
          sql = `INSERT INTO ${tablaSql(this.tabla)} (${keys.map(ident).join(",")}) VALUES ${values}${retorno}`;
        } else {
          if (!this.filtros.length) throw new Error("Se requiere un filtro para modificar filas");
          if (this.modo === "delete") sql = `DELETE FROM ${tablaSql(this.tabla)} t${where}${retorno}`;
          else sql = `UPDATE ${tablaSql(this.tabla)} t SET ${Object.entries(this.datos[0]).map(([k,v]) => `${ident(k)} = ${this.valor(v)}`).join(",")}${where}${retorno}`;
        }
        const r = await this.ejecutar(sql, this.valores); rows = this.devolver ? r.rows : []; if (this.contar) count = r.rowCount;
      }
      if (this.singular && (rows.length > 1 || (!this.opcional && rows.length !== 1))) return { data: null, error: { code: "PGRST116", message: "La consulta no devolvió una fila" }, count };
      return { data: this.singular ? rows[0] ?? null : rows, error: null, count };
    } catch (e) { const x = e as { message: string; code?: string }; return { data: null, count: null, error: { message: x.message, code: x.code } }; }
  }
  then<TResult1 = Resultado<U>, TResult2 = never>(ok?: ((value: Resultado<U>) => TResult1 | PromiseLike<TResult1>) | null, fail?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): PromiseLike<TResult1 | TResult2> { return (this.resultado() as Promise<Resultado<U>>).then(ok, fail); }
}
export function clienteLjara(ejecutar: Ejecutar) {
  const cliente = {
    schema(nombre: string) { if (!ESQUEMAS.has(nombre)) throw new Error("Esquema no permitido"); return cliente; },
    from(tabla: string) { return new ConsultaLjara(tabla, ejecutar); },
    async rpc(nombre: string, parametros: { p_imagen_id: number }) {
      if (nombre !== "definir_imagen_principal") throw new Error("Función no permitida");
      try { await ejecutar("SELECT catalogo.definir_imagen_principal($1)", [parametros.p_imagen_id]); return { error: null }; }
      catch (e) { return { error: { message: (e as Error).message } }; }
    },
    /** Quién editó por última vez cada fila y cuándo (0030). Es lo único del historial que ve la
     * plataforma: el registro completo de `cambio` es interno. */
    async ultimaEdicion(tabla: string, ids: number[]): Promise<{ data: { fila_id: number; ocurrido_en: string; usuario: string }[] | null; error: { message: string } | null }> {
      if (!esTabla(tabla)) return { data: null, error: { message: "Tabla fuera de L.Jara" } };
      try { const r = await ejecutar("SELECT fila_id, ocurrido_en, usuario FROM auditoria.ultima_edicion($1, $2::bigint[])", [tabla, ids]); return { data: r.rows.map((x) => ({ fila_id: Number(x.fila_id), ocurrido_en: new Date(x.ocurrido_en).toISOString(), usuario: String(x.usuario) })), error: null }; }
      catch (e) { return { data: null, error: { message: (e as Error).message } }; }
    },
    /** Registra un movimiento de dinero con sus aplicaciones en una sola transacción (0028). */
    async registrarMovimiento(p: Record<string, unknown>): Promise<{ data: number | null; error: { message: string } | null }> {
      try { const r = await ejecutar("SELECT finanzas.registrar_movimiento($1::jsonb) AS id", [JSON.stringify(p)]); return { data: Number(r.rows[0].id), error: null }; }
      catch (e) { return { data: null, error: { message: (e as Error).message } }; }
    },
    /** Crea una venta con sus líneas y, si se pide, su salida de stock, en una sola transacción (0047). */
    async registrarVenta(p: Record<string, unknown>): Promise<{ data: { id: number; tipo: string; folio: string; neto: number; iva: number; impuesto_adicional: number; total: number; fecha_vencimiento: string; operacion_stock_id: number | null } | null; error: { message: string } | null }> {
      try { const r = await ejecutar("SELECT comercial.registrar_venta($1::jsonb) AS venta", [JSON.stringify(p)]); return { data: r.rows[0].venta, error: null }; }
      catch (e) { return { data: null, error: { message: (e as Error).message } }; }
    },
    /** Anula una venta creada en la plataforma y deshace su salida de stock si la tuvo (0047). */
    async anularVenta(id: number, motivo?: string | null): Promise<{ data: { id: number; operacion_reversa_id: number | null } | null; error: { message: string } | null }> {
      try { const r = await ejecutar("SELECT comercial.anular_venta($1::bigint, $2::text) AS venta", [id, motivo ?? null]); return { data: r.rows[0].venta, error: null }; }
      catch (e) { return { data: null, error: { message: (e as Error).message } }; }
    },
  }; return cliente;
}
