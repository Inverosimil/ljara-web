# Recursos de las imágenes generadas

Lo que necesitan las imágenes de Open Graph —las que se ven al compartir un
enlace por WhatsApp— y que **no** puede venir de `next/font`.

`next/font` descarga las tipografías como `woff2`, y el generador de imágenes de
Next no lee ese formato: necesita `ttf`, `otf` o `woff`. Por eso Archivo Black
vive acá como `ttf`, aparte de la que usa el sitio.

Va en `assets/` y no en `public/` a propósito: no tiene por qué servirse al
navegador, solo la lee el servidor al generar la imagen. La ruta la resuelve
`process.cwd()`, que es el patrón que documenta Next para que el archivo entre
en el trazado del despliegue.

- `ArchivoBlack-Regular.ttf` — descargada de github.com/google/fonts, licencia
  SIL Open Font License 1.1. La licencia va al lado, en `LICENSE-archivo-black.txt`.
