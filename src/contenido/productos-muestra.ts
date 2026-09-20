// GENERADO por web/scripts/generar-muestra-diseno.py - no editar a mano.
//
// Muestra de productos REALES para maquetar /design-system.
// La `categoria` esta inferida por palabra clave SOLO para maquetar:
// la taxonomia real es una decision de negocio pendiente.
// Este archivo se reemplaza cuando exista data/processed/productos-formatos.csv.

export type Categoria =
  | "cerveza"
  | "vino"
  | "destilado"
  | "coctel"
  | "bebida"
  | "agua"
  | "jugo"
  | "energetica"

export type ProductoMuestra = {
  /** Clave unica y estable. NO usar `codigo`: el ERP lo repite. */
  id: string;
  codigo: string;
  nombre: string;
  nombreOriginal: string;
  categoria: Categoria;
  contenidoMl: number | null;
  pack: number | null;
  envase: string | null;
  unidadMedida: string | null;
};

export const CATEGORIAS: { id: Categoria; etiqueta: string }[] = [
  { id: "cerveza", etiqueta: "Cervezas" },
  { id: "vino", etiqueta: "Vinos" },
  { id: "destilado", etiqueta: "Destilados" },
  { id: "coctel", etiqueta: "Cocteles" },
  { id: "bebida", etiqueta: "Bebidas" },
  { id: "agua", etiqueta: "Aguas" },
  { id: "jugo", etiqueta: "Jugos" },
  { id: "energetica", etiqueta: "Energeticas" },
];

export const PRODUCTOS_MUESTRA: ProductoMuestra[] = [
  { id: "122977", codigo: "122977", nombre: "Benedictino Con Gas", nombreOriginal: "BENEDICTINO CON GAS 3000X6 PET 3.0", categoria: "agua", contenidoMl: 3000, pack: 6, envase: "pet", unidadMedida: "DSP" },
  { id: "122915", codigo: "122915", nombre: "Benedictino Sin Gas", nombreOriginal: "BENEDICTINO SIN GAS 3000X6 PET 3.0", categoria: "agua", contenidoMl: 3000, pack: 6, envase: "pet", unidadMedida: "DSP" },
  { id: "4714", codigo: "4714", nombre: "Cachantun Con Gas", nombreOriginal: "CACHANTUN CON GAS 1600X6", categoria: "agua", contenidoMl: 1600, pack: 6, envase: null, unidadMedida: "DSP" },
  { id: "4976", codigo: "4976", nombre: "Cachantun Low Gas", nombreOriginal: "CACHANTUN LOW GAS 1600X6", categoria: "agua", contenidoMl: 1600, pack: 6, envase: null, unidadMedida: "DSP" },
  { id: "4715", codigo: "4715", nombre: "Cachantun Sin Gas", nombreOriginal: "CACHANTUN SIN GAS 1600X6", categoria: "agua", contenidoMl: 1600, pack: 6, envase: null, unidadMedida: "DSP" },
  { id: "871498", codigo: "871498", nombre: "Cachantun Strong Con Gas", nombreOriginal: "CACHANTUN STRONG CON GAS 1600X6", categoria: "agua", contenidoMl: 1600, pack: 6, envase: null, unidadMedida: "DSP" },
  { id: "1018", codigo: "1018", nombre: "Agua Tonica Ccu", nombreOriginal: "AGUA TONICA CCU 1500X6 PET 1,5", categoria: "bebida", contenidoMl: 1500, pack: 6, envase: "pet", unidadMedida: "DSP" },
  { id: "870717", codigo: "870717", nombre: "Agua Tonica Zero Ccu", nombreOriginal: "AGUA TONICA ZERO CCU 1500x6", categoria: "bebida", contenidoMl: 1500, pack: 6, envase: null, unidadMedida: "DSP" },
  { id: "871173", codigo: "871173", nombre: "Bilz", nombreOriginal: "BILZ 600X12 PET M", categoria: "bebida", contenidoMl: 600, pack: 12, envase: "pet", unidadMedida: "DSP" },
  { id: "8700190", codigo: "8700190", nombre: "Bilz Express", nombreOriginal: "BILZ EXPRESS 330X30", categoria: "bebida", contenidoMl: 330, pack: 30, envase: null, unidadMedida: "CAJA" },
  { id: "870856", codigo: "870856", nombre: "Bilz Grb", nombreOriginal: "BILZ GRB 1250X10", categoria: "bebida", contenidoMl: 1250, pack: 10, envase: null, unidadMedida: "CAJA" },
  { id: "870375", codigo: "870375", nombre: "Bilz Zero", nombreOriginal: "BILZ ZERO DESECHABLE 2000X6 PET2.0", categoria: "bebida", contenidoMl: 2000, pack: 6, envase: "pet", unidadMedida: "DSP" },
  { id: "604581", codigo: "604581", nombre: "Austral Calafate", nombreOriginal: "AUSTRAL CALAFATE 330X24", categoria: "cerveza", contenidoMl: 330, pack: 24, envase: null, unidadMedida: "CAJA" },
  { id: "450112", codigo: "450112", nombre: "Austral Lager", nombreOriginal: "AUSTRAL LAGER 330X24", categoria: "cerveza", contenidoMl: 330, pack: 24, envase: null, unidadMedida: "CAJA" },
  { id: "451225", codigo: "451225", nombre: "Austral Sin Filtrar", nombreOriginal: "AUSTRAL SIN FILTRAR 330X12", categoria: "cerveza", contenidoMl: 330, pack: 12, envase: null, unidadMedida: "CAJA" },
  { id: "450402", codigo: "450402", nombre: "Austral Torres Del Paine", nombreOriginal: "AUSTRAL TORRES DEL PAINE 500X12", categoria: "cerveza", contenidoMl: 500, pack: 12, envase: null, unidadMedida: "CAJA" },
  { id: "1824", codigo: "1824", nombre: "Becker", nombreOriginal: "BECKER LATA 473X24", categoria: "cerveza", contenidoMl: 473, pack: 24, envase: "lata", unidadMedida: "CAJA" },
  { id: "127347", codigo: "127347", nombre: "Corona", nombreOriginal: "CORONA 330X24", categoria: "cerveza", contenidoMl: 330, pack: 24, envase: null, unidadMedida: "CAJA" },
  { id: "445879", codigo: "445879", nombre: "Andino Mango 12", nombreOriginal: "ANDINO MANGO 12 1000X6 x1", categoria: "coctel", contenidoMl: 1000, pack: 6, envase: null, unidadMedida: "CAJA" },
  { id: "445882", codigo: "445882", nombre: "Andino Sour 14", nombreOriginal: "ANDINO SOUR 14 1000X6 X1", categoria: "coctel", contenidoMl: 1000, pack: 6, envase: null, unidadMedida: "CAJA" },
  { id: "126212", codigo: "126212", nombre: "Coctel Capel Mocca", nombreOriginal: "COCTEL CAPEL MOCCA 700x1", categoria: "coctel", contenidoMl: 700, pack: 1, envase: null, unidadMedida: "UND" },
  { id: "125648", codigo: "125648", nombre: "Coctel Myla", nombreOriginal: "COCTEL MYLA 350x12", categoria: "coctel", contenidoMl: 350, pack: 12, envase: null, unidadMedida: "CAJA" },
  { id: "442202", codigo: "442202", nombre: "100 Pipers 40", nombreOriginal: "100 PIPERS 40 CAJA 1000X6", categoria: "destilado", contenidoMl: 1000, pack: 6, envase: "caja", unidadMedida: "CAJA" },
  { id: "445727", codigo: "445727", nombre: "3R 35", nombreOriginal: "3R 35 CAJA 1000X6 Caja Naranja", categoria: "destilado", contenidoMl: 1000, pack: 6, envase: "caja", unidadMedida: "CAJA" },
  { id: "447060", codigo: "447060", nombre: "3R Berries", nombreOriginal: "3R BERRIES 275X12", categoria: "destilado", contenidoMl: 275, pack: 12, envase: null, unidadMedida: "CAJA" },
  { id: "447076", codigo: "447076", nombre: "3R Berries 5gl", nombreOriginal: "3R BERRIES 5GL 275X24", categoria: "destilado", contenidoMl: 275, pack: 24, envase: null, unidadMedida: "CAJA" },
  { id: "447059", codigo: "447059", nombre: "3R Citrus", nombreOriginal: "3R CITRUS 275X12", categoria: "destilado", contenidoMl: 275, pack: 12, envase: null, unidadMedida: "CAJA" },
  { id: "447075", codigo: "447075", nombre: "3R Citrus 5gl", nombreOriginal: "3R CITRUS 5GL 275X24", categoria: "destilado", contenidoMl: 275, pack: 24, envase: null, unidadMedida: "CAJA" },
  { id: "870657", codigo: "870657", nombre: "Red Bull", nombreOriginal: "RED BULL 250X12", categoria: "energetica", contenidoMl: 250, pack: 12, envase: null, unidadMedida: "DSP" },
  { id: "870405", codigo: "870405", nombre: "Red Bull Blue", nombreOriginal: "RED BULL BLUE 250X12", categoria: "energetica", contenidoMl: 250, pack: 12, envase: null, unidadMedida: "DSP" },
  { id: "871342", codigo: "871342", nombre: "Red Bull Green", nombreOriginal: "RED BULL GREEN 250X12", categoria: "energetica", contenidoMl: 250, pack: 12, envase: null, unidadMedida: "CAJA" },
  { id: "871037", codigo: "871037", nombre: "Red Bull Purple", nombreOriginal: "RED BULL PURPLE 250X12. ACAI", categoria: "energetica", contenidoMl: 250, pack: 12, envase: null, unidadMedida: "DSP" },
  { id: "871078", codigo: "871078", nombre: "Red Bull Red", nombreOriginal: "RED BULL RED 250X12", categoria: "energetica", contenidoMl: 250, pack: 12, envase: null, unidadMedida: "DSP" },
  { id: "871539", codigo: "871539", nombre: "Red Bull Spring Pomelo", nombreOriginal: "RED BULL SPRING POMELO 250X12", categoria: "energetica", contenidoMl: 250, pack: 12, envase: null, unidadMedida: "DSP" },
  { id: "124423", codigo: "124423", nombre: "Kapo Frambuesa", nombreOriginal: "KAPO FRAMBUESA CAJA 252X24", categoria: "jugo", contenidoMl: 252, pack: 24, envase: "caja", unidadMedida: "DSP" },
  { id: "124428", codigo: "124428", nombre: "Kapo Manzana", nombreOriginal: "KAPO MANZANA CAJA 252X24", categoria: "jugo", contenidoMl: 252, pack: 24, envase: "caja", unidadMedida: "DSP" },
  { id: "124424", codigo: "124424", nombre: "Kapo Naranja", nombreOriginal: "KAPO NARANJA CAJA 252X24", categoria: "jugo", contenidoMl: 252, pack: 24, envase: "caja", unidadMedida: "DSP" },
  { id: "124426", codigo: "124426", nombre: "Kapo Pina", nombreOriginal: "KAPO PINA CAJA 252X24", categoria: "jugo", contenidoMl: 252, pack: 24, envase: "caja", unidadMedida: "DSP" },
  { id: "870653", codigo: "870653", nombre: "Mas Citrus", nombreOriginal: "MAS CITRUS 1600X6", categoria: "jugo", contenidoMl: 1600, pack: 6, envase: null, unidadMedida: "DSP" },
  { id: "871532", codigo: "871532", nombre: "Mas Frutos Del Bosque", nombreOriginal: "MAS FRUTOS DEL BOSQUE 1600X6", categoria: "jugo", contenidoMl: 1600, pack: 6, envase: null, unidadMedida: "DSP" },
  { id: "127895", codigo: "127895", nombre: "120 3 Medallas Merlot 13", nombreOriginal: "120 3 MEDALLAS MERLOT 13 700X12", categoria: "vino", contenidoMl: 700, pack: 12, envase: null, unidadMedida: "DSP" },
  { id: "127803", codigo: "127803", nombre: "120 Blanco", nombreOriginal: "120 BLANCO 1500X6 VD 1.5", categoria: "vino", contenidoMl: 1500, pack: 6, envase: "vidrio", unidadMedida: "DSP" },
  { id: "128118", codigo: "128118", nombre: "120 Blue Blend 12", nombreOriginal: "120 BLUE BLEND 12 1500X6 VD 1.5", categoria: "vino", contenidoMl: 1500, pack: 6, envase: "vidrio", unidadMedida: "CAJA" },
  { id: "127802", codigo: "127802", nombre: "120 Cabernet Sauvignon", nombreOriginal: "120 CABERNET SAUVIGNON 1500X6 VD 1.5", categoria: "vino", contenidoMl: 1500, pack: 6, envase: "vidrio", unidadMedida: "DSP" },
  { id: "127912", codigo: "127912", nombre: "120 Carmenere", nombreOriginal: "120 CARMENERE 1500X6 VD 1.5", categoria: "vino", contenidoMl: 1500, pack: 6, envase: "vidrio", unidadMedida: "DSP" },
  { id: "128049", codigo: "128049", nombre: "120 Dulce", nombreOriginal: "120 DULCE 1500X6 VD 1.5", categoria: "vino", contenidoMl: 1500, pack: 6, envase: "vidrio", unidadMedida: "DSP" },
];
