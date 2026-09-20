/** Estrella de oferta, la que va en los carteles de almacén.
 *  Compartida por las tres variantes de Feria + catálogo Pop. */
export function Estrella({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex size-20 items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
        <path
          d="M50 2 60 22 82 18 76 40 96 50 76 60 82 82 60 78 50 98 40 78 18 82 24 60 4 50 24 40 18 18 40 22Z"
          fill="var(--color-oro)"
          stroke="var(--color-tinta)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
      {/* el texto se mantiene dentro del cuerpo de la estrella, sin invadir las puntas */}
      <span className="relative max-w-[62%] text-center font-bungee text-[9px] leading-none tracking-tight text-neutro-900">
        {children}
      </span>
    </span>
  );
}
