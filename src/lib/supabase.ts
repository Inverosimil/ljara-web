import "server-only";
import { Pool, types } from "pg";
import { conexionLjara } from "@/compartido/conexion-ljara";
import { clienteLjara } from "@/compartido/consulta-ljara";
types.setTypeParser(20, v => { const n=Number(v); if (!Number.isSafeInteger(n)) throw new Error("Identificador fuera de rango"); return n; });
types.setTypeParser(1700, Number);
let pool: Pool | undefined;
/** Conexión de solo lectura: RLS permite únicamente el catálogo publicado de L.Jara. */
export function clienteSitio() {
  if (!process.env.LJARA_PUBLIC_DATABASE_URL) throw new Error("Falta LJARA_PUBLIC_DATABASE_URL.");
  pool ??= new Pool({ ...conexionLjara(process.env.LJARA_PUBLIC_DATABASE_URL), max: 3,
    idleTimeoutMillis: 20000, connectionTimeoutMillis: 10000,
    options: "-c search_path=ljara -c default_transaction_read_only=on -c statement_timeout=15000" });
  const conexion = pool;
  return clienteLjara((sql, valores) => conexion.query(sql, valores));
}
