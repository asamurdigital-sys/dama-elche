# Traspaso: dominio, Analytics y Search Console — Dama de Elche

Última actualización: 2026-10-11

## Contexto
- Repo `asamurdigital-sys/dama-elche`; la web está en `dama-elche-web 2/` (base de Netlify).
  Push a `main` = despliegue en producción (unos 20 s).
- Sitio Netlify `grupodamadeelche` (equipo `asamurdigital`). Dominio principal
  `grupodamadeelche.com` con DNS en Netlify. Dominio antiguo `granadasdamadeelche.com`
  con DNS en un proveedor externo (dnsexterno.com / guellcom); el correo `info@` sigue
  en Outlook (no tocar MX).
- Cuenta de Google usada: `josemaria@mrsocial.es`.

## Hecho y en producción
1. **Certificado SSL** del alias renovado por el usuario en Netlify (cubre apex + www).
2. **Redirecciones 301** `granadasdamadeelche.com` → `grupodamadeelche.com` —
   commit `e345741`, fichero `dama-elche-web 2/_redirects`. 60 URLs antiguas
   (sacadas de web.archive.org) a su equivalente; el resto conserva la ruta. Verificado.
3. **GA4** — cuenta "Dama de Elche" (a411541765), propiedad `grupodamadeelche.com`
   (p558410077), flujo web 16105546302, **ID `G-VH5R9WRC7J`**. España, euro.
   - Conservación de datos: 14 meses (guardado). Google Signals: desactivado.
   - Código: commit `f8f8190` — `GA_ID` en `build.js`, Consent Mode v2 (analytics
     granted, ads denied) y evento `generate_lead` en `gracias.html` / `en/thank-you.html`.
     Solo carga si el visitante acepta cookies.
   - Verificado en producción: sin aceptar no hay peticiones a Google; al aceptar,
     `gcs=G101` y el informe Tiempo real recibió page_view, session_start y generate_lead.
4. **Search Console** — propiedades de dominio creadas (sin verificar aún):
   - `grupodamadeelche.com` → TXT `google-site-verification=ikVwfB94kwBbBX4qWtMs8ytVyWztcwg-vIQpIxnr45c`
   - `granadasdamadeelche.com` → TXT `google-site-verification=548eORORAwb4ToARubXzzn-EED_AtGYFehZaXW_L3i8`

## Pendiente (en orden)
1. Usuario: añadir el TXT de `grupodamadeelche.com` en Netlify DNS (a Claude le bloquea
   el permiso de cambios DNS). Luego pulsar "Verificar" en Search Console.
2. Usuario: pedir al proveedor del dominio antiguo el TXT de `granadasdamadeelche.com`
   (en la raíz, sin tocar los registros A, CNAME ni MX). Luego "Verificar".
3. Con las dos verificadas: Search Console → propiedad antigua → Ajustes → **Cambio de
   dirección** a `grupodamadeelche.com`. Enviar `https://grupodamadeelche.com/sitemap.xml`.
4. Vincular Search Console con GA4 (GA → Administrar → Vinculaciones → Search Console).
5. **A partir del 2026-10-12**: GA → Administrar → Eventos → Eventos recientes → marcar
   la estrella de `generate_lead` (evento clave). GA no deja marcarlo antes de que aparezca.
6. Opcional: añadir al cliente como administrador de la cuenta de GA4.

## Trampas aprendidas
- Netlify solo incluye en el certificado los alias que ya apuntaban al emitirlo: tras
  cambiar DNS hay que pulsar Renew certificate.
- Los alias de Netlify no redirigen solos; las reglas van en `_redirects`, solo https
  (Netlify fuerza https antes).
- `main.min.js` se genera con `npx terser@5 js/main.js -c -m` (sin salto de línea final).
- En el navegador de la app, con vista emulada ampliada los clics no aciertan; usar el
  tamaño nativo, o el teclado (foco + Intro). El panel de etiqueta de GA va en un
  iframe de tagmanager que no se puede leer: el ID está en Flujos de datos.
