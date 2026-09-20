"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** El catálogo incluye su pie dentro de la columna desplazable. */
export function PieGlobal({ children }: { children: ReactNode }) {
  return usePathname() === "/catalogo" ? null : children;
}
