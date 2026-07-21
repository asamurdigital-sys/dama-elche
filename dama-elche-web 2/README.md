# Granadas Dama de Elche — sitio web (estático, bilingüe ES/EN)

Sitio estático hecho a mano (HTML + CSS + JS). Sin build obligatorio, sin
dependencias. Listo para **Netlify** (arrastrar carpeta o conectar git).

## Estructura

```
dama-web/
├── index.html …………… Home (ES)          → 16 páginas ES en la raíz
├── granadas.html, pimientos.html, …
├── en/ ……………………… las mismas 16 páginas en inglés (/en/…)
├── css/styles.css …… sistema de diseño (colores, tipografías, componentes)
├── js/components.js … header, menú móvil, footer y cookies (bilingüe)
├── js/main.js ……………… animaciones, contador, menú, banner de cookies
├── build.js ………………… generador: `node build.js` reescribe todas las páginas
├── descargar-imagenes.sh … localiza las imágenes en /img (paso final)
└── img/ ……………………… imágenes locales (tras ejecutar el script)
```

Editar contenido: cambia el texto en `build.js` y ejecuta `node build.js`
(regenera ES + EN a la vez). O edita el HTML directamente.

## Idiomas y URLs
- ES en la raíz (`/granadas.html`), EN en `/en/` (`/en/pomegranates.html`).
- Selector ES|EN en el header + etiquetas `hreflang` en cada página.

## Desplegar en Netlify (3 pasos)
1. Sube esta carpeta a un repositorio de GitHub (o arrástrala en app.netlify.com → “Deploy manually”).
2. En Netlify: **New site → Import** → elige el repo. Build command: *(ninguno)*. Publish directory: `dama-web` (o la raíz si subes solo esta carpeta).
3. Deploy. Los **formularios** (contacto y boletín) funcionan solos con **Netlify Forms** (ya llevan `data-netlify="true"`).

## Imágenes y logos (ya locales — autocontenido)
Todo vive en `/img`: hero, fotos de producto, mapa de exportación, imágenes de
noticias, los 5 sellos de certificación y los **logos oficiales** (grupo + uno
por fruta). El sitio NO depende de la web antigua. `descargar-imagenes.sh` ya
no hace falta (queda como legado).

Logos:
- `img/logo-grupo.svg` — logo del GRUPO (header y footer).
- `img/logo-granadas.svg`, `logo-pimientos.svg`, `logo-coliflor.svg`, `logo-higos.svg` — por sección de producto.
- `img/logo-limon.svg` — cítrico (extra, sin usar aún).

## Qué queda / me hace falta de ti
- **Textos legales**: en la copia accesible (dev2) las páginas legales estaban vacías y no puedo entrar a producción, así que he dejado versiones estándar correctas. Pásame los textos oficiales (o pégalos) y los sustituyo.
- **Datos de contacto** (tel/email/dirección): ya puestos — solo confírmalos.
- (Opcional) si quieres cambiar alguna foto de producto/hero por otra de tu media, dímelo.
