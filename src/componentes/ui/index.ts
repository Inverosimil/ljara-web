/* Punto único de importación del sistema. Las secciones del sitio importan
 * desde acá y nunca escriben clases de borde, sombra o tipografía a mano. */

export { BORDE, GIROS, cx, giro, sombraAcento } from "./base";
export { Boton } from "./Boton";
export { Campo, CampoLargo, Chip } from "./Controles";
export { Desplegable, type Opcion } from "./Desplegable";
export { Paginacion } from "./Paginacion";
export { ControlCantidad } from "./ControlCantidad";
export { Chapa, ChapaDeFondo, FranjaChapas, rutaCorona } from "./Chapa";
export { Etiqueta, EtiquetaPegada, SelloOferta } from "./Etiqueta";
export { FichaProducto, type ProductoTarjeta } from "./FichaProducto";
export { FichaAmpliada } from "./FichaAmpliada";
export { ModalProducto, type ProductoDetalle } from "./ModalProducto";
export { MapaCobertura } from "./MapaCobertura";
export { MarcoFoto } from "./MarcoFoto";
export { Destacado, Paso, Pilar, TarjetaCategoria } from "./Piezas";
export { Cinta, Recorte } from "./Recorte";
export { Banderines, Seccion } from "./Seccion";
export { Antetitulo, Rotulo, TitularRecortado } from "./Titular";
