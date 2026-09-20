import type { Metadata } from "next";
import { HojaPedido } from "@/componentes/pedido/HojaPedido";

export const metadata: Metadata = {
  title: "Tu pedido",
  description: "Revisa tu pedido y prepara el mensaje para nuestro equipo.",
  robots: { index: false, follow: true },
};

export default function PaginaPedido() {
  return <HojaPedido />;
}
