import { CERTIFICADO_SUPABASE } from "./certificado-supabase";
/** TLS verificado para el destino elegido; nunca desactiva la validación de certificados remotos. */
export function conexionLjara(cadena: string) {
  const url = new URL(cadena);
  const local = ["127.0.0.1", "localhost"].includes(url.hostname);
  const personal = url.hostname === "db.hntuqbzdlopgfgzijcog.supabase.co" ||
    (url.hostname.endsWith(".pooler.supabase.com") && decodeURIComponent(url.username).endsWith(".hntuqbzdlopgfgzijcog"));
  if (!local && !personal) throw new Error("La conexión no apunta al proyecto autorizado de L.Jara.");
  for (const p of ["sslmode", "sslrootcert", "sslcert", "sslkey"]) url.searchParams.delete(p);
  return { connectionString: url.toString(), ssl: local ? false as const : { rejectUnauthorized: true, ca: CERTIFICADO_SUPABASE } };
}
