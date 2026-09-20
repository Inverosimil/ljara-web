#!/usr/bin/env python3
"""Genera datos de muestra para maquetar /design-system.

NO es ETL de produccion. Solo produce un subconjunto legible de productos reales
para que las propuestas de diseno se vean con contenido verdadero en vez de lorem.
La categoria se infiere por palabra clave y es SOLO para maquetar: la taxonomia
real es una decision de negocio pendiente.

Cuando exista data/processed/productos-formatos.csv, este script se reemplaza por
una lectura de esa salida.

Uso:  python3 web/scripts/generar-muestra-diseno.py
"""
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

import openpyxl

RAIZ = Path(__file__).resolve().parents[2]
ORIGEN = RAIZ / "data/raw/unidades_de_medida.xlsx"
DESTINO = RAIZ / "web/src/contenido/productos-muestra.ts"

# Solo para maquetar. No es la taxonomia del negocio.
CATEGORIAS = {
    "cerveza": ["KUNSTMAN", "ESCUDO", "AUSTRAL", "CRISTAL", "BECKER", "HEINEKEN",
                "CORONA", "ODISSEA", "ROYAL", "STELLA", "SOL "],
    "vino": ["120 ", "GATO", "MISIONES", "SANTA ", "MEDALLA", "UNDURRAGA", "CARMEN",
             "1865", "BOUCHON", "CASILLERO", "RESERVA", "ESPUMANTE", "CABERNET",
             "MERLOT", "CARMENERE", "SAUVIGNON", "SUAVIGNON"],
    "destilado": ["MISTRAL", "ALTO DEL CARMEN", "JOHNNIE", "JOHNIE", "BALLANTINES",
                  "JACK", "BACARDI", "BARCELO", "CAMPANARIO", "RON ", "100 PIPERS",
                  "BEEFEATER", "3R ", "SIERRA", "PISCO", "WHISKY", "BUCHANAS",
                  "AGUARDIENTE", "BAILEYS", "APEROL"],
    "coctel": ["COCTEL", "ANDINO SOUR", "ANDINO", "MYLA"],
    "bebida": ["COCA", "PEPSI", "SPRITE", "FANTA", "BILZ", "PAP", "KEM", "CRUSH",
               "GINGER", "TONICA", "SEVEN", "CANADA DRY"],
    "agua": ["CACHANTUN", "BENEDICTINO", "MANANTIAL", "VITAL", "PURA"],
    "jugo": ["WATTS", "KAPO", "MAS ", "ANDINA JUGO", "NECTAR"],
    "energetica": ["RED BULL", "MR BIG", "ENERGETICA", "SCORE"],
}

ENVASES = [
    ("lata", ["LATON", "LATA"]),
    ("pet", ["PET"]),
    ("vidrio", ["VD", "VNR", "VIDRIO", "BOTELLA"]),
    ("retornable", ["RETORNABLE", " RP"]),
    ("caja", ["CAJA", "TETRA"]),
]

RUIDO = re.compile(r"PENDIENTE|NOTA DE CREDITO|MIX_|PRUEBA", re.I)


def categorizar(nombre: str) -> str:
    u = f" {nombre.upper()} "
    for cat, claves in CATEGORIAS.items():
        if any(k in u for k in claves):
            return cat
    return "otros"


def envase_de(nombre: str) -> str | None:
    u = nombre.upper()
    for etiqueta, claves in ENVASES:
        if any(k in u for k in claves):
            return etiqueta
    return None


def formato_de(nombre: str) -> tuple[int | None, int | None]:
    """Extrae (contenido_ml, unidades_por_pack) del patron `1000X6`."""
    m = re.search(r"(\d{2,4})\s*[xX]\s*(\d{1,3})\b", nombre)
    if not m:
        return None, None
    contenido, pack = int(m.group(1)), int(m.group(2))
    return (contenido if 100 <= contenido <= 5000 else None,
            pack if 1 <= pack <= 48 else None)


def titular(nombre: str) -> str:
    """Nombre presentable: quita el codigo de formato y normaliza mayusculas."""
    limpio = re.sub(r"\s+", " ", nombre).strip()
    # fuera la cola de formato: "1000X6 PET 3.0", "750 X 1", "VD700 X12"
    limpio = re.sub(
        r"\s+(VD|VNR|RP)?\s*\d{2,4}\s*(CC|ML)?\s*[xX]\s*\d{1,3}.*$", "", limpio)
    limpio = re.sub(
        r"\s+(PET|LATA|LATON|VD|VNR|DESECHABLE|RETORNABLE|CAJA|BOTELLA)\b.*$",
        "", limpio, flags=re.I)
    limpio = limpio.strip(" -,")
    if not limpio:
        limpio = nombre
    # Title Case respetando siglas y grados
    palabras = []
    for p in limpio.split():
        if re.fullmatch(r"\d+°?", p) or len(p) <= 2:
            palabras.append(p.upper())
        else:
            palabras.append(p.capitalize())
    return " ".join(palabras)


def sin_tildes(s: str) -> str:
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()


def main() -> None:
    wb = openpyxl.load_workbook(ORIGEN, data_only=True)
    filas = list(wb["Worksheet"].iter_rows(min_row=2, values_only=True))

    por_cat: dict[str, list[dict]] = defaultdict(list)
    vistos: set[str] = set()

    for codigo, nombre, unidad, *_ in filas:
        if not nombre or RUIDO.search(nombre):
            continue
        cat = categorizar(nombre)
        if cat == "otros":
            continue
        contenido, pack = formato_de(nombre)
        if not contenido:
            continue
        display = titular(nombre)
        clave = display.upper()
        if clave in vistos or len(display) > 34:
            continue
        vistos.add(clave)
        por_cat[cat].append({
            # `id` y no `codigo` es la clave de React: el ERP trae 26 codigos
            # repetidos, asi que el codigo no sirve como identificador unico.
            "id": "",  # se completa mas abajo, cuando ya esta la seleccion final
            "codigo": str(codigo),
            "nombre": display,
            "nombreOriginal": re.sub(r"\s+", " ", nombre).strip(),
            "categoria": cat,
            "contenidoMl": contenido,
            "pack": pack,
            "envase": envase_de(nombre),
            "unidadMedida": unidad,
        })

    # Seleccion balanceada: hasta 6 por categoria, orden estable.
    muestra = []
    for cat in CATEGORIAS:
        items = sorted(por_cat.get(cat, []), key=lambda d: d["nombre"])
        muestra.extend(items[:6])
    muestra.sort(key=lambda d: (d["categoria"], d["nombre"]))

    # id unico: el codigo, y un correlativo si ese codigo ya salio antes
    usados: dict[str, int] = {}
    for item in muestra:
        base = item["codigo"]
        usados[base] = usados.get(base, 0) + 1
        item["id"] = base if usados[base] == 1 else f"{base}-{usados[base]}"

    def ts(valor) -> str:
        if valor is None:
            return "null"
        if isinstance(valor, int):
            return str(valor)
        return '"' + sin_tildes(str(valor)).replace('"', '\\"') + '"'

    lineas = [
        "// GENERADO por web/scripts/generar-muestra-diseno.py - no editar a mano.",
        "//",
        "// Muestra de productos REALES para maquetar /design-system.",
        "// La `categoria` esta inferida por palabra clave SOLO para maquetar:",
        "// la taxonomia real es una decision de negocio pendiente.",
        "// Este archivo se reemplaza cuando exista data/processed/productos-formatos.csv.",
        "",
        "export type Categoria =",
        "  | " + "\n  | ".join(f'"{c}"' for c in CATEGORIAS),
        "",
        "export type ProductoMuestra = {",
        "  /** Clave unica y estable. NO usar `codigo`: el ERP lo repite. */",
        "  id: string;",
        "  codigo: string;",
        "  nombre: string;",
        "  nombreOriginal: string;",
        "  categoria: Categoria;",
        "  contenidoMl: number | null;",
        "  pack: number | null;",
        "  envase: string | null;",
        "  unidadMedida: string | null;",
        "};",
        "",
        "export const CATEGORIAS: { id: Categoria; etiqueta: string }[] = [",
    ]
    etiquetas = {
        "cerveza": "Cervezas", "vino": "Vinos", "destilado": "Destilados",
        "coctel": "Cocteles", "bebida": "Bebidas", "agua": "Aguas",
        "jugo": "Jugos", "energetica": "Energeticas",
    }
    for c in CATEGORIAS:
        lineas.append(f'  {{ id: "{c}", etiqueta: "{etiquetas[c]}" }},')
    lineas += ["];", "", "export const PRODUCTOS_MUESTRA: ProductoMuestra[] = ["]
    for p in muestra:
        campos = ", ".join(f"{k}: {ts(v)}" for k, v in p.items())
        lineas.append(f"  {{ {campos} }},")
    lineas += ["];", ""]

    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text("\n".join(lineas))
    print(f"{len(muestra)} productos -> {DESTINO.relative_to(RAIZ)}")
    for cat in CATEGORIAS:
        print(f"  {cat:12s} {sum(1 for m in muestra if m['categoria'] == cat)}")


if __name__ == "__main__":
    main()
