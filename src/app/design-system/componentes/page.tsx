"use client";

import { useState } from "react";
import {
  Antetitulo,
  Banderines,
  Boton,
  Chapa,
  Destacado,
  FranjaChapas,
  MapaCobertura,
  MarcoFoto,
  Paso,
  Pilar,
  TarjetaCategoria,
  Campo,
  CampoLargo,
  Chip,
  Desplegable,
  ModalProducto,
  Paginacion,
  Cinta,
  ControlCantidad,
  Etiqueta,
  EtiquetaPegada,
  FichaProducto,
  Recorte,
  Rotulo,
  SelloOferta,
  TitularRecortado,
} from "@/componentes/ui";
import { AgregarAlPedido } from "@/componentes/pedido/AgregarAlPedido";
import { PRODUCTOS_MUESTRA } from "@/contenido/productos-muestra";

/* Catálogo de componentes del sitio. Cada pieza que usa la página final aparece
 * acá con sus variantes, para poder revisarla suelta antes de verla en contexto. */

function Bloque({
  titulo,
  nota,
  children,
}: {
  titulo: string;
  nota?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-neutro-200 py-10">
      <h2 className="font-archivo text-2xl font-bold text-neutro-900">{titulo}</h2>
      {nota && <p className="mt-2 max-w-2xl text-neutro-700">{nota}</p>}
      {/* el lienzo va en papel porque es el fondo real del sitio */}
      <div className="mt-6 rounded-xl border border-neutro-200 bg-papel p-6 font-editorial text-tinta">
        {children}
      </div>
    </section>
  );
}

export default function Componentes() {
  const [cat, setCat] = useState("todos");
  const [cantidad, setCantidad] = useState(3);
  const muestra = PRODUCTOS_MUESTRA.slice(0, 4);
  const [enFicha, setEnFicha] = useState<(typeof muestra)[number] | null>(null);
  const [ordenDemo, setOrdenDemo] = useState("nombre-asc");
  const [paginaDemo, setPaginaDemo] = useState(3);

  return (
    <main className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6">
      <header className="max-w-3xl">
        <p className="font-archivo text-sm font-semibold tracking-widest text-rojo-600 uppercase">
          Sistema del sitio
        </p>
        <h1 className="mt-2 font-archivo text-4xl font-bold text-neutro-900 sm:text-5xl">
          Componentes
        </h1>
        <p className="mt-4 text-lg text-neutro-700">
          Las piezas con las que está construida la página. Todo el sitio se dibuja
          con tres cosas: <strong>borde macizo de 3px</strong>,{" "}
          <strong>sombra dura sin difuminar</strong> y <strong>papel</strong>. Si
          algo necesita otro tratamiento, es señal de que el componente está mal
          planteado.
        </p>
        <p className="mt-4 rounded-lg border border-rojo-200 bg-rojo-50 p-4 text-sm text-neutro-800">
          <strong className="font-semibold">Una sola familia tipográfica por
          rol:</strong> Archivo Black para todo lo que sea título, etiqueta o
          botón; Georgia cursiva para el texto corrido. Se eliminó la tipografía de
          letrero que traía el catálogo de otra propuesta — era lo que hacía que
          hero y productos se vieran de diseños distintos.
        </p>
      </header>

      <Bloque
        titulo="La chapa"
        nota="El logo es una tapa de botella y es lo más distintivo de la marca, así que se usa en tres registros: isotipo, marca de agua gigante detrás del contenido, y separador repetido. También le presta su corona dentada al sello de oferta."
      >
        <div className="space-y-8">
          <div className="flex flex-wrap items-end gap-6">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((t) => (
              <div key={t} className="text-center">
                <Chapa tamano={t} />
                <p className="mt-2 text-xs uppercase">{t}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="bg-tinta p-4">
              <Chapa tamano="lg" variante="claro" />
            </div>
            <div className="bg-papel p-4">
              <Chapa tamano="lg" variante="mono" />
            </div>
            <p className="text-sm text-neutro-600">
              Sobre fondo oscuro va la variante clara: la corona azul desaparecería.
            </p>
          </div>
          <FranjaChapas cantidad={10} />
        </div>
      </Bloque>

      <Bloque
        titulo="Botones"
        nota="Un solo gesto en todo el sitio: al pulsar, la pieza se hunde sobre su propia sombra. Ninguna otra animación hace eso, así que el hundimiento siempre significa «esto es accionable»."
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Boton variante="primario">Primario</Boton>
            <Boton variante="secundario">Secundario</Boton>
            <Boton variante="papel">Papel</Boton>
            <Boton variante="tinta">Tinta</Boton>
            <Boton variante="texto">Enlace de texto</Boton>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Boton tamano="sm">Chico</Boton>
            <Boton tamano="md">Medio</Boton>
            <Boton tamano="lg">Grande</Boton>
          </div>
          <p className="text-sm text-neutro-600">
            En móvil los botones toman el ancho completo salvo que se indique lo
            contrario; con el mouse encima se hunden y pierden la sombra.
          </p>
        </div>
      </Bloque>

      <Bloque
        titulo="Recorte"
        nota="El contenedor base. Toda caja del sitio es un Recorte: fichas, cifras, bloques de texto y formularios. Evita que aparezcan tres tipos de tarjeta distintos en la misma página."
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Recorte cinta>
            <p className="p-5">Blanco, con cinta</p>
          </Recorte>
          <Recorte fondo="papel" giro="rotate-[1deg]" sombra="shadow-dura-rojo">
            <p className="p-5">Papel, sombra roja</p>
          </Recorte>
          <Recorte fondo="tinta" giro="-rotate-[1.5deg]" sombra="shadow-dura-oro">
            <p className="p-5">Tinta, sombra oro</p>
          </Recorte>
          <Recorte fondo="oro" interactivo>
            <p className="p-5">Oro, interactivo</p>
          </Recorte>
        </div>
      </Bloque>

      <Bloque
        titulo="Titulares"
        nota="El titular recortado arma el texto palabra por palabra, cada una sobre su bloque de color. Es el gesto que define la portada, y ahora también encabeza el catálogo."
      >
        <div className="space-y-8">
          <TitularRecortado texto="Titular recortado nivel uno" nivel={1} />
          <TitularRecortado texto="Nivel dos para secciones" nivel={2} />
          <div className="flex flex-wrap items-center gap-5">
            <Antetitulo>Antetítulo</Antetitulo>
            <Rotulo>Rótulo de sección</Rotulo>
          </div>
        </div>
      </Bloque>

      <Bloque
        titulo="Etiquetas y sellos"
        nota="Las piezas chicas de información. Antes eran tres cosas con tres tipografías: el formato en tipografía de letrero, la categoría en otra y la estrella de oferta en una tercera. Ahora las tres usan Archivo Black."
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Etiqueta tono="rojo">Cerveza</Etiqueta>
            <Etiqueta tono="oro">Oro</Etiqueta>
            <Etiqueta tono="tinta">Tinta</Etiqueta>
            <Etiqueta tono="cian">Cian</Etiqueta>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <EtiquetaPegada>1,5 L × 6</EtiquetaPegada>
            <EtiquetaPegada tono="cian">350 ml × 24</EtiquetaPegada>
            <SelloOferta />
            <SelloOferta>Nuevo</SelloOferta>
          </div>
          <div className="relative inline-block pt-4">
            <Cinta className="left-8 translate-x-0" />
            <span className="border-[3px] border-tinta bg-white px-4 py-2">
              Cinta suelta
            </span>
          </div>
        </div>
      </Bloque>

      <Bloque
        titulo="Controles"
        nota="Filtros y formularios comparten el borde macizo del resto del sitio, así un chip y una tarjeta se leen como piezas de la misma familia."
      >
        <div className="space-y-7">
          <div className="flex flex-wrap gap-2.5">
            {["todos", "cervezas", "vinos", "destilados"].map((c) => (
              <Chip key={c} activo={cat === c} onClick={() => setCat(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Desplegable
              etiqueta="Desplegable"
              valor={ordenDemo}
              opciones={[
                { id: "nombre-asc", etiqueta: "Nombre (A–Z)" },
                { id: "nombre-desc", etiqueta: "Nombre (Z–A)" },
                { id: "categoria", etiqueta: "Categoría" },
                { id: "contenido-asc", etiqueta: "Menor contenido" },
              ]}
              onCambiar={setOrdenDemo}
            />
            <Campo id="demo-campo" etiqueta="Campo de texto" placeholder="Escribe acá" />
            <Campo
              id="demo-buscar"
              etiqueta="Buscador"
              type="search"
              placeholder="Marca, producto o código"
            />
            <CampoLargo
              id="demo-largo"
              etiqueta="Campo largo"
              placeholder="Varias líneas…"
              className="sm:col-span-2"
            />
          </div>

          <div className="flex flex-wrap items-end gap-8">
            <div>
              <p className="mb-2 font-black text-xs tracking-[0.18em] uppercase">
                Cantidad — md
              </p>
              <ControlCantidad
                valor={cantidad}
                onCambiar={setCantidad}
                etiqueta="Cantidad de ejemplo"
              />
            </div>
            <div>
              <p className="mb-2 font-black text-xs tracking-[0.18em] uppercase">
                Cantidad — sm, mínimo 0
              </p>
              <ControlCantidad
                tamano="sm"
                minimo={0}
                valor={cantidad}
                onCambiar={setCantidad}
                etiqueta="Cantidad de ejemplo, chica"
              />
            </div>
          </div>
        </div>
      </Bloque>

      <Bloque
        titulo="Ficha de producto"
        nota="Caja recta, borde macizo, la foto ocupando lo que antes ocupaba la decoración y un solo llamado: «Ver producto», que se ve como botón pero es un span — un botón dentro de otro botón no es HTML válido, y la tarjeta entera es el botón. Hasta el 2026-09-06 cada tarjeta traía giro propio, sombra de un color distinto según la posición, cinta una de cada tres y un sello de OFERTA una de cada siete: con cincuenta en pantalla eso tapaba justamente el producto. El sello además afirmaba algo falso — salía por posición en la grilla, no porque hubiera oferta. Sin foto se dibuja la silueta del envase, que no es un relleno temporal: de 955 productos hay 354 con imagen apta."
      >
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {muestra.map((p) => (
            <li key={p.id}>
              <FichaProducto producto={p} onAbrir={() => setEnFicha(p)} />
            </li>
          ))}
        </ul>
      </Bloque>

      <Bloque
        titulo="Ficha ampliada"
        nota="Se abre al hacer clic en una tarjeta. Es un <dialog> del navegador y no un div flotante: el foco queda atrapado dentro, Esc cierra, el fondo queda inerte para el lector de pantalla y el velo lo pinta ::backdrop. La galería admite hasta diez fotos por producto y la primera es la principal; sin fotos cae a la silueta. La descripción se muestra solo si alguien la escribió en la plataforma interna — no hay texto de relleno."
      >
        <ul className="flex flex-wrap gap-3">
          {muestra.slice(0, 4).map((p) => (
            <li key={p.id}>
              <Boton tamano="sm" variante="secundario" onClick={() => setEnFicha(p)}>
                Abrir {p.nombre}
              </Boton>
            </li>
          ))}
        </ul>
      </Bloque>

      <Bloque
        titulo="Agregar al pedido"
        nota="Los controles de pedido. Hasta el 2026-09-06 vivían dentro de cada tarjeta: cuatro controles por producto, cien por pantalla, para una decisión que casi nadie toma sin mirar antes el producto. Ahora viven solo en la ficha ampliada. El selector de formato aparece únicamente cuando sabemos de cuántas unidades es la caja: si el dato no está, la única opción es la unidad — no se inventa el factor (ADR-0007). Ojo: estos controles tocan el pedido de verdad, es el mismo almacén que usa el sitio."
      >
        <div className="max-w-sm">
          <AgregarAlPedido producto={muestra[0]} />
        </div>
      </Bloque>

      <Bloque
        titulo="Paginación"
        nota="El catálogo se pide a la base de a 24 y la página vive en la URL. Números y no «cargar más»: con «cargar más» no se puede volver a una página ni compartir un enlace a ella, y el navegador pierde la posición al volver atrás. Con muchas páginas se muestran la primera, la última, la actual y sus vecinas — una tira de cuarenta números es una barra de desplazamiento disfrazada."
      >
        <Paginacion pagina={paginaDemo} paginas={12} onIr={setPaginaDemo} />
      </Bloque>

      <Bloque
        titulo="Fotos"
        nota="Las fotos entran al collage con tratamiento duotono: desaturadas, con la tinta multiplicada encima y trama de impresión. Eso las integra al lenguaje del sitio y deja claro que las actuales son de relleno. Cambiar `tratamiento` a «natural» las deja sin filtro."
      >
        <div className="grid gap-8 sm:grid-cols-3">
          <MarcoFoto
            src="/temporal/bodega-pasillo.jpg"
            alt="Ejemplo"
            proporcion="3/2"
            giro="-rotate-[1.5deg]"
            cinta
            pie="Duotono, con cinta"
          />
          <MarcoFoto
            src="/temporal/camion-reparto.jpg"
            alt="Ejemplo"
            proporcion="3/2"
            giro="rotate-[1deg]"
            sombra="shadow-dura-cian"
            tratamiento="natural"
            pie="Natural, sombra cian"
          />
          <MarcoFoto
            src="/temporal/detalle-producto.jpg"
            alt="Ejemplo"
            proporcion="4/5"
            sombra="shadow-dura-oro"
          />
        </div>
      </Bloque>

      <Bloque
        titulo="Piezas de contenido"
        nota="Bloques compuestos que se repiten entre páginas: pilares de marca con íconos propios, pasos numerados, accesos a categoría y datos destacados."
      >
        <div className="space-y-8">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            <Pilar icono="reparto" titulo="Reparto propio" giro="-rotate-[1.5deg]">
              Ícono dibujado a mano, sin librería externa.
            </Pilar>
            <Pilar icono="catalogo" titulo="Catálogo" giro="rotate-[1deg]" sombra="shadow-dura-rojo">
              Cuatro íconos, uno por pilar.
            </Pilar>
            <Pilar icono="trato" titulo="Trato directo" giro="-rotate-[0.6deg]" sombra="shadow-dura-oro">
              Trazo grueso, igual que el resto.
            </Pilar>
            <Pilar icono="stock" titulo="Stock" giro="rotate-[1.8deg]" sombra="shadow-dura-cian">
              Con un toque de color plano.
            </Pilar>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            <Paso numero={1} titulo="Paso numerado" giro="-rotate-[1deg]">
              Para explicar un proceso.
            </Paso>
            <Paso numero={2} titulo="Segundo paso" giro="rotate-[1deg]">
              El número va en un cuadro rojo.
            </Paso>
            <TarjetaCategoria etiqueta="Cervezas" cantidad={6} href="#" giro="-rotate-[0.6deg]" />
            <TarjetaCategoria etiqueta="Vinos" cantidad={6} href="#" giro="rotate-[1.2deg]" sombra="shadow-dura-cian" />
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <Destacado giro="-rotate-[1deg]" pie="Pie opcional">
              Dato destacado sobre tinta
            </Destacado>
            <Destacado giro="rotate-[1deg]">Sin pie</Destacado>
          </div>
        </div>
      </Bloque>

      <Bloque
        titulo="Mapa de cobertura"
        nota="Dibujado en SVG, sin Google Maps ni API key. Es un esquema de anillos centrado en la bodega: comunica lo que al cliente le importa, que no es la geografía exacta sino cada cuánto pasa el camión. Los radios salen de ZONAS_REPARTO en contenido/empresa.ts."
      >
        <MapaCobertura />
      </Bloque>

      <Bloque
        titulo="Banderines"
        nota="Separador entre secciones. Estuvo arriba del encabezado hasta el 2026-09-06: era lo primero que se veía en cada página y separaba el encabezado del borde de la ventana por un motivo decorativo."
      >
        <Banderines />
      </Bloque>

      <Bloque titulo="Cómo se usa">
        <div className="space-y-3 font-inter text-neutro-800">
          <p>
            Las secciones del sitio importan todo desde{" "}
            <code className="rounded bg-neutro-100 px-1.5 py-0.5">
              @/componentes/ui
            </code>{" "}
            y no escriben clases de borde, sombra ni tipografía a mano.
          </p>
          <p>
            Las reglas compartidas —grosor de borde, set de giros, sombras de
            acento— viven en{" "}
            <code className="rounded bg-neutro-100 px-1.5 py-0.5">
              componentes/ui/base.ts
            </code>
            . Cambiar el grosor del borde ahí lo cambia en todo el sitio.
          </p>
          <p>
            Los colores salen de{" "}
            <code className="rounded bg-neutro-100 px-1.5 py-0.5">@theme</code> en{" "}
            <code className="rounded bg-neutro-100 px-1.5 py-0.5">globals.css</code>
            , que replica <code>brand/tokens/tokens.json</code>.
          </p>
        </div>
      </Bloque>
      <ModalProducto
        producto={enFicha}
        onCerrar={() => setEnFicha(null)}
        acciones={enFicha ? <AgregarAlPedido producto={enFicha} /> : null}
      />
    </main>
  );
}
