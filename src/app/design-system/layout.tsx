import Link from "next/link";
import Image from "next/image";

const PROPUESTAS = [
  { href: "/design-system", etiqueta: "Propuestas" },
  { href: "/design-system/componentes", etiqueta: "Componentes actuales" },
];

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutro-100">
      {/* Barra de la herramienta, no parte de las propuestas. */}
      <header className="sticky top-0 z-50 border-b border-neutro-800 bg-neutro-950/95 backdrop-blur">
        <nav className="mx-auto flex max-w-[90rem] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/design-system" className="flex shrink-0 items-center gap-2">
            <Image
              src="/marca/logo-ljara.svg"
              alt=""
              width={26}
              height={26}
              className="rounded-full"
            />
            <span className="font-archivo text-sm font-semibold text-white">
              Design System
            </span>
          </Link>

          <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
            {PROPUESTAS.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="rounded-md px-2.5 py-1.5 text-neutro-300 transition-colors hover:bg-neutro-800 hover:text-white"
                >
                  {p.etiqueta}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/"
            className="ml-auto hidden rounded-md bg-rojo-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rojo-600 lg:block"
          >
            Ver el sitio →
          </Link>
        </nav>
      </header>

      {children}
    </div>
  );
}
