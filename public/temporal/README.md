# Fotos temporales — REEMPLAZAR

⚠️ **Ninguna de estas fotos es de L.Jara.** Son imágenes de relleno descargadas de
[Lorem Picsum](https://picsum.photos) con semillas fijas, puestas acá solo para poder juzgar
la composición de las páginas mientras no existan las fotos reales.

Se muestran con tratamiento duotono, así que la foto concreta importa poco: lo que se está
evaluando es el encuadre y el peso que tiene la imagen dentro de la página.

## Qué foto va en cada archivo

| Archivo | Qué debería mostrar | Proporción |
|---|---|---|
| `banner-hero.jpg` | Plano amplio de la bodega o del frente con los camiones | 16:9 |
| `bodega-pasillo.jpg` | Pasillo entre racks, cajas apiladas | 3:2 |
| `bodega-carga.jpg` | Andén de carga, pallets, transpaleta | 3:2 |
| `camion-reparto.jpg` | Camión de reparto, idealmente con el logo | 3:2 |
| `equipo.jpg` | El equipo trabajando: bodega, ruta o atención | 3:2 |
| `fachada.jpg` | Frente del local o de la bodega, con dirección visible | 3:2 |
| `mostrador.jpg` | Atención a cliente, mesón o entrega de pedido | 3:2 |
| `detalle-producto.jpg` | Detalle cercano: cajas, botellas, chapas | 4:5 vertical |

## El encargo, para pasárselo a quien las tome

`docs/negocio/fotos-a-tomar.md` tiene el brief completo: encuadre, orientación y qué evitar en
cada una, con las cuatro de la portada marcadas como urgentes.

## Cómo reemplazarlas

Basta con dejar el archivo real con el mismo nombre y proporción parecida. El componente
`MarcoFoto` recorta con `object-cover`, así que no hace falta que calce exacto.

Cuando estén todas las reales, esta carpeta se borra y las fotos pasan a
`assets/productos/` o a una carpeta `public/fotos/` definitiva.
