import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Turbopack detecta la raiz buscando un lockfile hacia arriba y encuentra uno
// suelto en el home del usuario, lo que dejaria la raiz en /Users/<usuario>.
// La raíz del repositorio incluye compartido/; cada app mantiene su propio build.
const raiz = path.dirname(fileURLToPath(import.meta.url));

/* Las fotos de producto viven en Supabase Storage, o sea en otro dominio.
 * `next/image` solo optimiza hosts declarados acá; sin esto lanza «hostname is
 * not configured». El host sale de la misma variable que usa el cliente, así
 * que apuntar a otro proyecto no obliga a tocar dos sitios. */
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(raiz, "..") },
  outputFileTracingRoot: path.resolve(raiz, ".."),
  images: supabase
    ? {
        remotePatterns: [
          {
            protocol: "https",
            hostname: new URL(supabase).hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ],
      }
    : undefined,
};

export default nextConfig;
