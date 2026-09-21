/* eslint-disable @typescript-eslint/no-explicit-any */
/** Adaptador privado, limitado al catálogo de L.Jara. No acepta SQL del navegador.
 * Los valores siempre viajan como parámetros; tablas y relaciones tienen lista cerrada. */
export type Ejecutar = (sql: string, valores: unknown[]) => Promise<{ rows: any[]; rowCount: number | null }>;
const TABLAS = new Set(["producto", "marca", "categoria", "formato", "codigo_barra", "imagen", "sello", "perfil", "cambio", "costo", "precio", "tasa_ila", "ubicacion", "movimiento", "existencia", "conteo", "conteo_linea", "importacion", "rechazo", "conteo_categoria"]);
const ESQUEMAS = new Set(["ljara"]);
const ident = (s: string) => { if (!/^[a-z_][a-z0-9_]*$/.test(s)) throw new Error("Identificador no permitido"); return `"${s}"`; };
type Relacion = { tabla: string; local: string; remota: string; lista: boolean };
const RELACIONES: Record<string, Record<string, Relacion>> = {
  producto: {
    marca: { tabla: "marca", local: "marca_id", remota: "id", lista: false },
    categoria: { tabla: "categoria", local: "categoria_id", remota: "id", lista: false },
    formato: { tabla: "formato", local: "id", remota: "producto_id", lista: true },
    imagen: { tabla: "imagen", local: "id", remota: "producto_id", lista: true },
  },
  formato: { codigo_barra: { tabla: "codigo_barra", local: "id", remota: "formato_id", lista: true },
    producto: { tabla: "producto", local: "producto_id", remota: "id", lista: false } },
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
    const sql = `SELECT ${sub.columnas} FROM ljara.${ident(r.tabla)} ${subAlias} WHERE ${where}`;
    if (inner) condiciones.push(`EXISTS (SELECT 1 FROM ljara.${ident(r.tabla)} ${subAlias} WHERE ${where})`);
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
  constructor(private tabla: string, private ejecutar: Ejecutar) { if (!TABLAS.has(tabla)) throw new Error("Tabla fuera de L.Jara"); }
  private valor(v: unknown) { this.valores.push(v); return `$${this.valores.length}`; }
  private columna(c: string) {
    const [rel, campo] = c.split(".");
    if (!campo) return `t.${ident(c)}`;
    const r = RELACIONES[this.tabla]?.[rel]; if (!r || r.lista) throw new Error("Filtro de relación no permitido");
    return `(SELECT r.${ident(campo)} FROM ljara.${ident(r.tabla)} r WHERE r.${ident(r.remota)} = t.${ident(r.local)})`;
  }
  select(campos = "*", opciones?: { count?: string; head?: boolean }) { this.campos = campos; this.contar = opciones?.count === "exact"; this.cabecera = !!opciones?.head; this.devolver = true; return this; }
  eq(c: string, v: unknown) { this.filtros.push(`${this.columna(c)} = ${this.valor(v)}`); return this; }
  is(c: string, v: null | boolean) { this.filtros.push(`${this.columna(c)} IS ${v === null ? "NULL" : v ? "TRUE" : "FALSE"}`); return this; }
  in(c: string, v: unknown[]) { this.filtros.push(v.length ? `${this.columna(c)} IN (${v.map(x => this.valor(x)).join(",")})` : "FALSE"); return this; }
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
        if (this.contar) { const r = await this.ejecutar(`SELECT count(*)::int AS total FROM ljara.${ident(this.tabla)} t${where}`, this.valores); count = r.rows[0].total; }
        if (this.offset > 0 && count !== null && this.offset >= count) return { data: null, error: { code: "PGRST103", message: "Página fuera de rango" }, count };
        if (!this.cabecera) {
          const orden = this.ordenes.length ? ` ORDER BY ${this.ordenes.join(", ")}` : "";
          const limite = this.limite !== undefined ? ` LIMIT ${this.valor(this.limite)} OFFSET ${this.valor(this.offset)}` : "";
          rows = (await this.ejecutar(`SELECT ${s.columnas} FROM ljara.${ident(this.tabla)} t${where}${orden}${limite}`, this.valores)).rows;
        }
      } else {
        let sql: string;
        const retorno = " RETURNING *";
        if (this.modo === "insert") {
          if (!this.datos.length) return { data: [], error: null, count: 0 };
          const keys = Object.keys(this.datos[0]);
          const values = this.datos.map(d => `(${keys.map(k => this.valor(d[k] ?? null)).join(",")})`).join(",");
          sql = `INSERT INTO ljara.${ident(this.tabla)} (${keys.map(ident).join(",")}) VALUES ${values}${retorno}`;
        } else {
          if (!this.filtros.length) throw new Error("Se requiere un filtro para modificar filas");
          if (this.modo === "delete") sql = `DELETE FROM ljara.${ident(this.tabla)} t${where}${retorno}`;
          else sql = `UPDATE ljara.${ident(this.tabla)} t SET ${Object.entries(this.datos[0]).map(([k,v]) => `${ident(k)} = ${this.valor(v)}`).join(",")}${where}${retorno}`;
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
      try { await ejecutar("SELECT ljara.definir_imagen_principal($1)", [parametros.p_imagen_id]); return { error: null }; }
      catch (e) { return { error: { message: (e as Error).message } }; }
    },
  }; return cliente;
}
