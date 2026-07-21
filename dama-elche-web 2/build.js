/* ==========================================================================
   DAMA · Generador estático del sitio (ES + EN)
   Uso:  node build.js
   Produce los .html de la raíz (ES) y de /en/ (EN). El header/footer/menú/
   cookies se inyectan en runtime con js/components.js (bilingüe).
   ========================================================================== */
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;
const A = "{{A}}"; // prefijo de assets; shell() lo sustituye por "" (raíz) o "../" (en/)
const IMG = {
  hero: A+"img/hero.png",
  granadas: A+"img/granadas.png",
  pimientos: A+"img/pimientos.png",
  coliflor: A+"img/coliflor.png",
  higos: A+"img/higos.png",
  map: A+"img/mapa.png",
  news1: A+"img/news1.webp",
  news2: A+"img/news2.webp",
  news3: A+"img/news3.png"
};
const LOGO = { granadas:A+"img/logo-granadas.png", pimientos:A+"img/logo-pimientos.png", coliflor:A+"img/logo-coliflor.png", higos:A+"img/logo-higos.png" };
const SITE = "https://pomegranatespain.com";

/* slugs por idioma (para hreflang y rutas) */
const SLUG = {
  home:{es:"index.html",en:"index.html",url:{es:"/",en:"/en/"}},
  fruits:{es:"frutas-y-verduras.html",en:"fruits-and-vegetables.html"},
  granadas:{es:"granadas.html",en:"pomegranates.html"},
  pimientos:{es:"pimientos.html",en:"peppers.html"},
  coliflor:{es:"coliflor.html",en:"cauliflower.html"},
  higos:{es:"higos-y-brevas.html",en:"figs.html"},
  about:{es:"mision-y-valores.html",en:"about.html"},
  sustain:{es:"sostenibilidad.html",en:"sustainability.html"},
  quality:{es:"calidad-y-frescura.html",en:"quality.html"},
  certs:{es:"certificaciones-de-calidad.html",en:"certifications.html"},
  news:{es:"noticias.html",en:"news.html"},
  contact:{es:"contacto.html",en:"contact.html"},
  privacy:{es:"politica-de-privacidad.html",en:"privacy-policy.html"},
  terms:{es:"terminos-de-servicio.html",en:"terms.html"},
  cookies:{es:"politica-de-cookies.html",en:"cookie-policy.html"},
  legal:{es:"aviso-legal.html",en:"legal-notice.html"}
};

/* ---------- Shell de página ---------- */
function shell(o){
  const isEN = o.lang === "en";
  const a = isEN ? "../" : "";          // prefijo a css/js
  const hrefEs = SITE + "/" + (SLUG[o.id] ? SLUG[o.id].es : "");
  const hrefEn = SITE + "/en/" + (SLUG[o.id] ? SLUG[o.id].en : "");
  return `<!DOCTYPE html>
<html lang="${o.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${o.title}</title>
<meta name="description" content="${o.desc}">
<link rel="alternate" hreflang="es" href="${o.id==="home"?SITE+"/":hrefEs}">
<link rel="alternate" hreflang="en" href="${o.id==="home"?SITE+"/en/":hrefEn}">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${a}css/styles.css">
</head>
<body${o.bodyClass?` class="${o.bodyClass}"`:""} data-page="${o.id}"${o.nav?` data-nav="${o.nav}"`:""} data-lang="${o.lang}">
<main>
${o.main.replace(/\{\{A\}\}/g, a)}
</main>
<script src="${a}js/components.js"></script>
<script src="${a}js/main.js"></script>
</body>
</html>
`;
}

/* ---------- Bloques reutilizables ---------- */
const t = (es,en,lang)=> lang==="en"?en:es;

function pageHero(img, crumbs, h1, lead, logo){
  const lg = logo ? `<img class="page-logo" src="${logo}" alt="" loading="lazy">` : "";
  return `<section class="page-hero">
  <div class="hero-bg" style="background-image:url('${img}')"></div>
  <div class="container">
    <div class="breadcrumb">${crumbs}</div>
    ${lg}<h1>${h1}</h1>
    <p class="lead">${lead}</p>
  </div>
</section>`;
}
function splitSection(img, alt, eyebrow, h2, lead, features){
  const f = features.map(x=>`<div class="feature"><h4>${x[0]}</h4><p>${x[1]}</p></div>`).join("");
  return `<section class="section bg-cream"><div class="container"><div class="split">
    <div class="split-media reveal"><img src="${img}" alt="${alt}" loading="lazy"></div>
    <div class="reveal d1"><span class="eyebrow">${eyebrow}</span><h2 class="h-sec">${h2}</h2>
    <p class="lead" style="margin-bottom:8px">${lead}</p>
    <div class="feature-grid">${f}</div></div>
  </div></div></section>`;
}
function pillsSection(eyebrow, h2, lead, pills){
  return `<section class="section bg-cream-soft"><div class="container center">
    <div class="sec-head center reveal"><span class="eyebrow">${eyebrow}</span><h2 class="h-sec">${h2}</h2><p class="lead">${lead}</p></div>
    <div class="country-pills reveal">${pills.map(p=>`<span>${p}</span>`).join("")}</div>
  </div></section>`;
}
function cta(eyebrow,h2,lead,btn){
  return `<section class="section bg-garnet cta-final"><div class="container"><div class="reveal">
    <span class="eyebrow light">${eyebrow}</span><h2 class="h-sec center">${h2}</h2>
    <p class="lead center">${lead}</p><a href="${cUrl(this)}" class="btn btn-light">${btn} <span class="arrow">&rarr;</span></a>
  </div></div></section>`;
}

/* ============================ CONTENIDO ============================ */
const CONTACT_HREF = { es:"contacto.html", en:"contact.html" };
function ctaBlock(lang, h2){
  const eyebrow=t("Hablemos","Let’s talk",lang);
  const lead=t("Cuéntanos volumen, formato y mercado. Te respondemos en menos de 24 horas con una propuesta a medida.","Tell us volume, format and market. We reply within 24 hours with a tailored proposal.",lang);
  const btn=t("Solicitar oferta","Request a quote",lang);
  return `<section class="section bg-garnet cta-final"><div class="container"><div class="reveal">
    <span class="eyebrow light">${eyebrow}</span><h2 class="h-sec center">${h2}</h2>
    <p class="lead center">${lead}</p><a href="${CONTACT_HREF[lang]}" class="btn btn-light">${btn} <span class="arrow">&rarr;</span></a>
  </div></div></section>`;
}

/* ---- Productos ---- */
const PRODUCTS = {
  granadas:{ img:IMG.granadas,
    es:{crumb:'<a href="index.html">Inicio</a> / <a href="frutas-y-verduras.html">Frutas y Verduras</a> / Granadas',
        h1:'Granadas de <em>alta calidad</em>',
        lead:'Selección de variedades —Mollar, Wonderful, Acco, Smith, Emek o Bigful— reconocidas por su sabor equilibrado, semillas comestibles y alto contenido en antioxidantes.',
        introH2:'Granadas de Elche con <em>calidad profesional</em>',
        introLead:'Variedades adaptadas a distintos mercados: desde la dulzura de la Mollar hasta la intensidad y el color de las Wonderful. Cultivadas en el entorno mediterráneo de Elche, con un perfil ideal para tiendas, chefs y distribuidores.',
        feats:[['Sabor equilibrado','Matices dulces con un punto justo de acidez.'],['Semillas comestibles','Arilos de textura tierna y jugosa.'],['Antioxidantes naturales','Fuente de polifenoles y vitamina C.'],['Cultivo sostenible','Producidas con técnicas responsables.']],
        varH2:'Una granada para <em>cada mercado</em>', varLead:'Un abanico de variedades para cubrir toda la campaña con la mejor calidad y calibre.',
        pills:['Mollar','Wonderful','Acco','Smith','Emek','Bigful'], ctaH2:'¿Necesitas granadas para tu <em>canal</em>?'},
    en:{crumb:'<a href="index.html">Home</a> / <a href="fruits-and-vegetables.html">Fruits &amp; Vegetables</a> / Pomegranates',
        h1:'Premium <em>pomegranates</em>',
        lead:'A selection of varieties —Mollar, Wonderful, Acco, Smith, Emek or Bigful— known for their balanced flavour, edible seeds and high antioxidant content.',
        introH2:'Pomegranates from Elche with <em>professional quality</em>',
        introLead:'Varieties for every market: from the sweetness of the Mollar to the intensity and colour of the Wonderful. Grown in the Mediterranean setting of Elche, with an ideal profile for retailers, chefs and distributors.',
        feats:[['Balanced flavour','Sweet notes with just the right acidity.'],['Edible seeds','Tender, juicy arils, easy to enjoy.'],['Natural antioxidants','A source of polyphenols and vitamin C.'],['Sustainable growing','Produced with responsible techniques.']],
        varH2:'A pomegranate for <em>every market</em>', varLead:'A range of varieties to cover the whole season with the best quality and calibre.',
        pills:['Mollar','Wonderful','Acco','Smith','Emek','Bigful'], ctaH2:'Need pomegranates for your <em>channel</em>?'} },
  pimientos:{ img:IMG.pimientos,
    es:{crumb:'<a href="index.html">Inicio</a> / <a href="frutas-y-verduras.html">Frutas y Verduras</a> / Pimientos',
        h1:'Pimientos de <em>alta gama</em>',
        lead:'Rojo, amarillo y verde con sello sostenible. Atractivo comercial, sabor equilibrado y un rendimiento pensado para el canal profesional.',
        introH2:'Pimientos con <em>sello sostenible</em>',
        introLead:'Calibre uniforme, color intenso y pared gruesa, ideales para lineal, transformación y HORECA. Cultivo controlado que garantiza constancia durante toda la campaña.',
        feats:[['Atractivo comercial','Color vivo y calibre uniforme.'],['Sabor equilibrado','Dulzor natural y textura crujiente.'],['Alto rendimiento','Pared gruesa y buena conservación.'],['Producción escalable','Volúmenes adaptados a cada cliente.']],
        varH2:'Tricolor para <em>cada uso</em>', varLead:'Rojo, amarillo y verde en distintos formatos y calibres según mercado.',
        pills:['California Rojo','California Amarillo','California Verde','Lamuyo','Snack'], ctaH2:'¿Necesitas pimientos para tu <em>canal</em>?'},
    en:{crumb:'<a href="index.html">Home</a> / <a href="fruits-and-vegetables.html">Fruits &amp; Vegetables</a> / Peppers',
        h1:'Premium <em>peppers</em>',
        lead:'Red, yellow and green with a sustainable seal. Shelf appeal, balanced flavour and yield designed for the professional channel.',
        introH2:'Peppers with a <em>sustainable seal</em>',
        introLead:'Uniform calibre, intense colour and thick flesh, ideal for retail, processing and HORECA. Controlled growing that guarantees consistency throughout the season.',
        feats:[['Shelf appeal','Vivid colour and uniform calibre.'],['Balanced flavour','Natural sweetness and crunchy texture.'],['High performance','Thick flesh and good shelf life.'],['Scalable production','Volumes tailored to each client.']],
        varH2:'Tricolour for <em>every use</em>', varLead:'Red, yellow and green in different formats and calibres by market.',
        pills:['California Red','California Yellow','California Green','Lamuyo','Snack'], ctaH2:'Need peppers for your <em>channel</em>?'} },
  coliflor:{ img:IMG.coliflor,
    es:{crumb:'<a href="index.html">Inicio</a> / <a href="frutas-y-verduras.html">Frutas y Verduras</a> / Coliflor',
        h1:'Coliflor de <em>alta calidad</em>',
        lead:'Recolectada en su punto justo de madurez para una textura tierna, sabor delicado y excelentes propiedades. Calibres 6/8 para el canal profesional.',
        introH2:'Coliflor para el <em>canal profesional</em>',
        introLead:'Piezas compactas, blancas y de calibre homogéneo. Frescura y presentación pensadas para lineal, mayoristas y HORECA, con trazabilidad completa.',
        feats:[['Variedades de confianza','Piezas compactas y blancas.'],['Presentación comercial','Calibre homogéneo y buen aspecto.'],['Cultivo responsable','Prácticas sostenibles en campo.'],['Aplicación profesional','Ideal para retail y transformación.']],
        varH2:'Coliflor para <em>cada formato</em>', varLead:'Distintos calibres y presentaciones según necesidad.',
        pills:['Blanca','Romanesco','Graffiti (morada)','Mini'], ctaH2:'¿Necesitas coliflor para tu <em>canal</em>?'},
    en:{crumb:'<a href="index.html">Home</a> / <a href="fruits-and-vegetables.html">Fruits &amp; Vegetables</a> / Cauliflower',
        h1:'High-quality <em>cauliflower</em>',
        lead:'Harvested at the right point of ripeness for a tender texture, delicate flavour and excellent properties. Calibres 6/8 for the professional channel.',
        introH2:'Cauliflower for the <em>professional channel</em>',
        introLead:'Compact, white heads with homogeneous calibre. Freshness and presentation designed for retail, wholesalers and HORECA, with full traceability.',
        feats:[['Trusted varieties','Compact, white heads.'],['Commercial presentation','Homogeneous calibre and great looks.'],['Responsible growing','Sustainable field practices.'],['Professional use','Ideal for retail and processing.']],
        varH2:'Cauliflower for <em>every format</em>', varLead:'Different calibres and presentations as needed.',
        pills:['White','Romanesco','Graffiti (purple)','Mini'], ctaH2:'Need cauliflower for your <em>channel</em>?'} },
  higos:{ img:IMG.higos,
    es:{crumb:'<a href="index.html">Inicio</a> / <a href="frutas-y-verduras.html">Frutas y Verduras</a> / Higos y Brevas',
        h1:'Higos y brevas con <em>sabor auténtico</em>',
        lead:'Dulzura natural y alto valor comercial. Seleccionados por su rendimiento y comportamiento en postcosecha, perfectos para retail y HORECA.',
        introH2:'Higos y brevas de <em>alto valor</em>',
        introLead:'Variedades de dulzura intensa, textura suave y aspecto atractivo, recolectadas a mano en su punto para una experiencia organoléptica única y una vida útil óptima.',
        feats:[['Dulzura natural','Sabor intenso sin añadidos.'],['Recolección a mano','En su punto justo de maduración.'],['Vida útil óptima','Buen comportamiento en distribución.'],['Formatos a medida','Disponibilidad escalonada en campaña.']],
        varH2:'Higos y brevas de <em>temporada</em>', varLead:'Variedades seleccionadas para cubrir la campaña con la mejor calidad.',
        pills:['Cuello de Dama','Colar','Breva','San Antonio'], ctaH2:'¿Necesitas higos o brevas para tu <em>canal</em>?'},
    en:{crumb:'<a href="index.html">Home</a> / <a href="fruits-and-vegetables.html">Fruits &amp; Vegetables</a> / Figs &amp; Brevas',
        h1:'Figs &amp; brevas with <em>authentic flavour</em>',
        lead:'Natural sweetness and high commercial value. Selected for their yield and post-harvest performance, perfect for retail and HORECA.',
        introH2:'High-value <em>figs &amp; brevas</em>',
        introLead:'Varieties with intense sweetness, soft texture and attractive appearance, hand-picked at their peak for a unique eating experience and optimal shelf life.',
        feats:[['Natural sweetness','Intense flavour, nothing added.'],['Hand-picked','At the right point of ripeness.'],['Optimal shelf life','Great performance in distribution.'],['Tailored formats','Staggered availability in season.']],
        varH2:'Seasonal <em>figs &amp; brevas</em>', varLead:'Selected varieties to cover the season with the best quality.',
        pills:['Cuello de Dama','Colar','Breva','San Antonio'], ctaH2:'Need figs or brevas for your <em>channel</em>?'} }
};

function productPage(key, lang){
  const p = PRODUCTS[key], d = p[lang];
  const alt = key;
  const main = pageHero(p.img, d.crumb, d.h1, d.lead, LOGO[key])
    + splitSection(p.img, alt, t("El producto","The product",lang), d.introH2, d.introLead, d.feats)
    + pillsSection(t("Variedades","Varieties",lang), d.varH2, d.varLead, d.pills)
    + ctaBlock(lang, d.ctaH2);
  return { id:key, nav:"fruits", bodyClass:"header-solid", lang, main,
    title: (lang==="en"? d.h1.replace(/<[^>]+>/g,"")+" · Dama de Elche" : d.h1.replace(/<[^>]+>/g,"")+" · Granadas Dama de Elche"),
    desc: d.lead.replace(/<[^>]+>/g,"").slice(0,155) };
}

/* ---- Frutas y Verduras (landing) ---- */
function fruitsPage(lang){
  const cards = [
    ["granadas",IMG.granadas,t("Estrella","Signature",lang),t("Granadas","Pomegranates",lang),t("Mollar, Wonderful, Acco y más.","Mollar, Wonderful, Acco and more.",lang)],
    ["pimientos",IMG.pimientos,t("Tricolor","Tricolour",lang),t("Pimientos","Peppers",lang),t("Rojo, amarillo y verde de alta gama.","Premium red, yellow and green.",lang)],
    ["coliflor",IMG.coliflor,t("Calibres 6/8","Calibres 6/8",lang),t("Coliflor","Cauliflower",lang),t("Textura tierna y sabor delicado.","Tender texture, delicate flavour.",lang)],
    ["higos",IMG.higos,t("Temporada","Season",lang),t("Higos y Brevas","Figs & Brevas",lang),t("Dulzura natural, recolección a mano.","Natural sweetness, hand-picked.",lang)]
  ].map(c=>`<a href="${SLUG[c[0]][lang]}" class="pcard reveal"><div class="pcard-img" style="background-image:url('${c[1]}')"></div><span class="tag">${c[2]}</span><div class="pcard-body"><h3>${c[3]}</h3><p>${c[4]}</p><span class="more">${t("Ver más","See more",lang)} <span class="arrow">&rarr;</span></span></div></a>`).join("");
  const h1=t('Frutas y verduras <em>del Mediterráneo</em>','Fruit &amp; vegetables <em>from the Mediterranean</em>',lang);
  const lead=t('Nuestra gama completa, seleccionada uno a uno para el canal profesional: granadas, pimientos, coliflor e higos y brevas.','Our full range, selected one by one for the professional channel: pomegranates, peppers, cauliflower and figs & brevas.',lang);
  const main = pageHero(IMG.hero, `<a href="index.html">${t("Inicio","Home",lang)}</a> / ${t("Frutas y Verduras","Fruits & Vegetables",lang)}`, h1, lead)
    + `<section class="section bg-cream"><div class="container"><div class="grid-cards">${cards}</div></div></section>`
    + ctaBlock(lang, t("¿Montamos tu <em>surtido</em>?","Shall we build your <em>assortment</em>?",lang));
  return { id:"fruits", nav:"fruits", bodyClass:"header-solid", lang, main,
    title:t("Frutas y Verduras premium · Granadas Dama de Elche","Premium Fruits & Vegetables · Dama de Elche",lang),
    desc:lead.replace(/<[^>]+>/g,"") };
}

/* ---- Páginas de contenido (split) ---- */
const CONTENT = {
  about:{ id:"about", img:IMG.granadas, nav:"about",
    es:{h1:'Nuestra <em>misión</em>', lead:'Cultivamos algo más que frutas: cultivamos confianza, salud y legado.',
        eyebrow:'Quiénes somos', h2:'Familia, tierra y <em>excelencia</em>',
        body:'Somos la segunda generación de una empresa familiar con más de 25 años cultivando y exportando frutas y verduras frescas desde Elche. Nuestra misión es ofrecer productos hortofrutícolas de la más alta calidad, que superen las expectativas del mercado internacional. Apostamos por una agricultura responsable, donde la sostenibilidad no es una tendencia, sino una forma de trabajar cada día.',
        feats:[['Cuidar la tierra','Agricultura responsable y sostenible.'],['Impulsar el campo','Compromiso con nuestra gente y entorno.'],['Calidad sin concesiones','Control en cada etapa del proceso.'],['Mirada internacional','Llevamos Elche a más de 15 países.']]},
    en:{h1:'Our <em>mission</em>', lead:'We grow more than fruit: we grow trust, health and legacy.',
        eyebrow:'Who we are', h2:'Family, land and <em>excellence</em>',
        body:'We are the second generation of a family business with over 25 years growing and exporting fresh fruit and vegetables from Elche. Our mission is to deliver top-quality produce that exceeds the expectations of international markets. We are committed to responsible agriculture, where sustainability is not a trend but the way we work every day.',
        feats:[['Care for the land','Responsible, sustainable farming.'],['Support the countryside','Commitment to our people and region.'],['Quality without compromise','Control at every stage.'],['International outlook','We take Elche to 15+ countries.']]} },
  sustain:{ id:"sustain", img:IMG.higos, nav:"sustain",
    es:{h1:'Más allá del cultivo: un <em>compromiso real</em>', lead:'La sostenibilidad no es una palabra de moda, es un principio que nos guía.',
        eyebrow:'Sostenibilidad', h2:'Tres ejes que <em>nos mueven</em>',
        body:'En Frutas Dama de Elche sabemos que producir de forma responsable es el único camino posible. Nuestro compromiso abarca el cuidado medioambiental, la responsabilidad social y la viabilidad económica. Optimizamos el uso del agua, reducimos residuos y trabajamos con personas comprometidas y un uso eficiente de los recursos.',
        feats:[['Medioambiente','Uso eficiente del agua y menos residuos.'],['Responsabilidad social','Empleo estable y cadena de valor local.'],['Viabilidad económica','Rentabilidad que sostiene el proyecto.'],['Certificaciones','GlobalG.A.P., GRASP y Carbon Trust.']]},
    en:{h1:'Beyond growing: a <em>real commitment</em>', lead:'Sustainability isn’t a buzzword, it’s a principle that guides us.',
        eyebrow:'Sustainability', h2:'Three pillars that <em>drive us</em>',
        body:'At Frutas Dama de Elche we know that producing responsibly is the only way forward. Our commitment covers environmental care, social responsibility and economic viability. We optimise water use, reduce waste and work with committed people and an efficient use of resources.',
        feats:[['Environment','Efficient water use and less waste.'],['Social responsibility','Stable jobs and local value chain.'],['Economic viability','Profitability that sustains the project.'],['Certifications','GlobalG.A.P., GRASP and Carbon Trust.']]} },
  quality:{ id:"quality", img:IMG.granadas, nav:"about",
    es:{h1:'Comprometidos con la <em>calidad</em>', lead:'Obsesionados con la frescura, desde el campo hasta el packaging.',
        eyebrow:'Calidad y frescura', h2:'Control <em>en cada etapa</em>',
        body:'Aplicamos controles rigurosos en toda la cadena para que la fruta llegue impecable a cualquier mercado. Selección visual una a una, cadena de frío ininterrumpida, certificaciones internacionales y trazabilidad total desde el campo hasta la entrega.',
        feats:[['Selección a mano','100% control visual antes de envasar.'],['Cadena de frío','Temperatura controlada hasta destino.'],['Certificación global','GlobalG.A.P., BRCGS, GRASP, Carbon Trust.'],['Trazabilidad total','Del campo a la entrega, sin lagunas.']]},
    en:{h1:'Committed to <em>quality</em>', lead:'Obsessed with freshness, from the field to the packaging.',
        eyebrow:'Quality & freshness', h2:'Control <em>at every stage</em>',
        body:'We apply rigorous controls across the whole chain so fruit arrives flawless in any market. One-by-one visual selection, an unbroken cold chain, international certifications and full traceability from field to delivery.',
        feats:[['Hand selection','100% visual control before packing.'],['Cold chain','Controlled temperature to destination.'],['Global certification','GlobalG.A.P., BRCGS, GRASP, Carbon Trust.'],['Full traceability','From field to delivery, no gaps.']]} }
};
function contentPage(key, lang){
  const c = CONTENT[key], d = c[lang];
  const main = pageHero(c.img, `<a href="index.html">${t("Inicio","Home",lang)}</a> / ${d.h1.replace(/<[^>]+>/g,"")}`, d.h1, d.lead)
    + splitSection(c.img, key, d.eyebrow, d.h2, d.body, d.feats)
    + ctaBlock(lang, t("¿Hablamos de tu <em>proyecto</em>?","Shall we talk about your <em>project</em>?",lang));
  return { id:c.id, nav:c.nav, bodyClass:"header-solid", lang, main,
    title:d.h1.replace(/<[^>]+>/g,"")+" · "+t("Granadas Dama de Elche","Dama de Elche",lang), desc:d.lead };
}

/* ---- Certificaciones ---- */
function certsPage(lang){
  const certs = t(
    [['GlobalG.A.P.','Buenas prácticas agrícolas y seguridad alimentaria.'],['IFS Food','Estándar internacional de calidad y seguridad.'],['BRCGS','Referencia global en seguridad alimentaria.'],['GRASP','Prácticas sociales responsables en el campo.'],['Carbon Trust','Medición y reducción de la huella de carbono.'],['Sorma / fruverpack','Partners de envasado y presentación.']],
    [['GlobalG.A.P.','Good agricultural practices and food safety.'],['IFS Food','International quality and safety standard.'],['BRCGS','Global benchmark in food safety.'],['GRASP','Responsible social practices in the field.'],['Carbon Trust','Measuring and reducing carbon footprint.'],['Sorma / fruverpack','Packaging and presentation partners.']],
    lang);
  const cards = certs.map(c=>`<div class="feature reveal"><h4>${c[0]}</h4><p>${c[1]}</p></div>`).join("");
  const h1=t('Certificaciones de <em>calidad</em>','Quality <em>certifications</em>',lang);
  const lead=t('Auditados y trazables en cada campaña. Nuestras certificaciones avalan la seguridad, la calidad y la responsabilidad de todo lo que producimos.','Audited and traceable every season. Our certifications back the safety, quality and responsibility of everything we produce.',lang);
  const main = pageHero(IMG.hero, `<a href="index.html">${t("Inicio","Home",lang)}</a> / ${t("Certificaciones","Certifications",lang)}`, h1, lead)
    + `<section class="section bg-cream"><div class="container"><div class="feature-grid" style="grid-template-columns:repeat(3,1fr)">${cards}</div></div></section>`
    + ctaBlock(lang, t("¿Quieres los <em>certificados</em>?","Want the <em>certificates</em>?",lang));
  return { id:"certs", nav:"about", bodyClass:"header-solid", lang, main, title:t("Certificaciones de Calidad · Dama de Elche","Quality Certifications · Dama de Elche",lang), desc:lead };
}

/* ---- Noticias ---- */
function newsPage(lang){
  const items=[
    [IMG.news1,'25 Abr 2025','25 Apr 2025',t('Los beneficios para la salud de las granadas Mollar de Elche','Health benefits of Mollar pomegranates from Elche',lang),t('Antioxidantes, vitaminas y sabor: por qué la Mollar es una de las granadas más valoradas.','Antioxidants, vitamins and flavour: why the Mollar is one of the most valued pomegranates.',lang)],
    [IMG.news2,'25 Abr 2025','25 Apr 2025',t('Frutas Dama de Elche expande sus mercados en Asia','Frutas Dama de Elche expands its markets in Asia',lang),t('Nuevos acuerdos de distribución acercan nuestra fruta a mercados estratégicos.','New distribution deals bring our fruit to strategic markets.',lang)],
    [IMG.news3,'23 Abr 2025','23 Apr 2025',t('Temporada de granadas: qué esperar este año','Pomegranate season: what to expect this year',lang),t('Calendario de campaña, variedades y previsiones de calibre y calidad.','Season calendar, varieties and calibre and quality forecasts.',lang)]
  ];
  const cards=items.map(n=>`<article class="ncard reveal"><div class="ncard-img" style="background-image:url('${n[0]}')"></div><div class="ncard-body"><span class="date">${lang==="en"?n[2]:n[1]}</span><h3>${n[3]}</h3><p>${n[4]}</p><span class="more">${t("Leer más","Read more",lang)} <span class="arrow">&rarr;</span></span></div></article>`).join("");
  const h1=t('Últimas <em>noticias</em>','Latest <em>news</em>',lang);
  const lead=t('Novedades de campaña, noticias de cosecha y perspectivas del sector hortofrutícola.','Season updates, harvest news and insights from the fresh produce sector.',lang);
  const main = pageHero(IMG.hero, `<a href="index.html">${t("Inicio","Home",lang)}</a> / ${t("Noticias","News",lang)}`, h1, lead)
    + `<section class="section bg-cream"><div class="container"><div class="blog-grid">${cards}</div></div></section>`;
  return { id:"news", nav:"news", bodyClass:"header-solid", lang, main, title:t("Noticias · Granadas Dama de Elche","News · Dama de Elche",lang), desc:lead };
}

/* ---- Contacto ---- */
function contactPage(lang){
  const info=`<div class="grid-cards" style="grid-template-columns:repeat(3,1fr)">
    <div class="feature reveal"><h4>${t("Teléfono","Phone",lang)}</h4><p><a href="tel:+34965458656">+34 965 458 656</a><br>${t("Lun–Vie 8:00–20:00 (GMT+1)","Mon–Fri 8:00–20:00 (GMT+1)",lang)}</p></div>
    <div class="feature reveal d1"><h4>Email</h4><p><a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a><br>${t("Respondemos en 24 h","We reply within 24 h",lang)}</p></div>
    <div class="feature reveal d2"><h4>${t("Dónde estamos","Where we are",lang)}</h4><p>C/ Santuario de la Luz, 7<br>Parque Agroalimentario La Alcudia<br>03290 Elche, Alicante</p></div>
  </div>`;
  const form=`<section class="section bg-cream-soft"><div class="container">
    <div class="sec-head center reveal"><span class="eyebrow">${t("Escríbenos","Write to us",lang)}</span><h2 class="h-sec">${t("Cuéntanos qué <em>necesitas</em>","Tell us what you <em>need</em>",lang)}</h2><p class="lead">${t("Volumen, formatos, mercado… te preparamos una propuesta a medida.","Volume, formats, market… we’ll prepare a tailored proposal.",lang)}</p></div>
    <form class="reveal" name="contacto" method="POST" data-netlify="true" netlify-honeypot="bot-field" style="max-width:760px;margin-inline:auto">
      <input type="hidden" name="form-name" value="contacto"><p style="display:none"><label>No: <input name="bot-field"></label></p>
      <div class="form-grid">
        <div><label class="lb">${t("Nombre","Name",lang)}</label><input class="field" name="nombre" required></div>
        <div><label class="lb">${t("Empresa","Company",lang)}</label><input class="field" name="empresa"></div>
        <div><label class="lb">${t("Teléfono","Phone",lang)}</label><input class="field" name="telefono"></div>
        <div><label class="lb">Email</label><input class="field" type="email" name="email" required></div>
        <div class="full"><label class="lb">${t("Mensaje","Message",lang)}</label><textarea class="field" name="mensaje" placeholder="${t("Escribe aquí tu consulta.","Write your enquiry here.",lang)}"></textarea></div>
      </div>
      <div style="text-align:center;margin-top:22px"><button class="btn btn-primary" type="submit">${t("Enviar","Send",lang)} <span class="arrow">&rarr;</span></button></div>
    </form></div></section>`;
  const h1=t('Hablemos de tu <em>proyecto</em>','Let’s talk about your <em>project</em>',lang);
  const lead=t('¿Quieres más información sobre nuestros productos, exportación o disponibilidad? Nuestro equipo comercial te contactará en breve.','Want more information about our products, exports or availability? Our sales team will get back to you shortly.',lang);
  const main = pageHero(IMG.hero, `<a href="index.html">${t("Inicio","Home",lang)}</a> / ${t("Contacto","Contact",lang)}`, h1, lead)
    + `<section class="section bg-cream"><div class="container">${info}</div></section>` + form;
  return { id:"contact", nav:"contact", bodyClass:"header-solid", lang, main, title:t("Contacto · Granadas Dama de Elche","Contact · Dama de Elche",lang), desc:lead };
}

/* ---- Legales (texto real de pomegranatespain.com; ES + traducción EN) ---- */
const LEGAL = {
  privacy:{ title:{es:"Política de Privacidad",en:"Privacy Policy"},
    es:`<h2>1. Identidad del responsable</h2><p>En cumplimiento del Reglamento (UE) 2016/679 y la Ley Orgánica 3/2018, se informa al usuario de que los datos personales que proporcione a través del sitio web <strong>pomegranatespain.com</strong> serán tratados por:</p><ul><li><strong>Responsable:</strong> FRUTAS DAMA DE ELCHE, S.L.</li><li><strong>CIF:</strong> B54566948</li><li><strong>Domicilio:</strong> C/ Santuario de la Luz, 7, Parque Agroalimentario La Alcudia, 03290 Elche/Elx (Alicante), España</li><li><strong>Email:</strong> <a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a></li><li><strong>Teléfono:</strong> +34 965 458 656</li></ul><h2>2. Finalidad del tratamiento</h2><p>Los datos recabados serán utilizados para: gestionar consultas recibidas a través del formulario de contacto; enviar comunicaciones comerciales, boletines y novedades sobre nuestros productos, si el usuario ha dado su consentimiento expreso; y gestionar la relación comercial en caso de contratación de productos o servicios.</p><h2>3. Base legal del tratamiento</h2><ul><li>El consentimiento explícito del usuario al marcar las casillas de los formularios.</li><li>La ejecución de un contrato o la aplicación de medidas precontractuales.</li><li>El cumplimiento de obligaciones legales aplicables al responsable.</li></ul><h2>4. Destinatarios de los datos</h2><p>Los datos no serán cedidos a terceros, salvo obligación legal o cuando sea necesario para prestar el servicio solicitado (empresas de logística, servicios técnicos, proveedores de alojamiento web o email). No se prevén transferencias internacionales de datos.</p><h2>5. Conservación de los datos</h2><p>Los datos se conservarán durante el tiempo necesario para cumplir la finalidad para la que se recabaron y, posteriormente, durante los plazos legalmente exigidos por normativa fiscal o comercial.</p><h2>6. Derechos del usuario</h2><p>El usuario puede ejercer los derechos de acceso, rectificación, supresión (“derecho al olvido”), limitación del tratamiento, portabilidad, oposición y retirada del consentimiento en cualquier momento. Para ello puede enviar una solicitud escrita, junto con copia de su DNI, a <a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a>. También tiene derecho a reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es/" target="_blank" rel="noopener">www.aepd.es</a>).</p><h2>7. Seguridad de los datos</h2><p>FRUTAS DAMA DE ELCHE, S.L. ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad e integridad de los datos personales tratados y evitar su pérdida, alteración y/o acceso por terceros no autorizados.</p><h2>8. Actualizaciones de la política</h2><p>Nos reservamos el derecho de modificar esta Política de Privacidad para adaptarla a novedades legislativas o jurisprudenciales. Los cambios se anunciarán en esta misma página con antelación razonable.</p>`,
    en:`<h2>1. Data controller</h2><p>In compliance with Regulation (EU) 2016/679 and Spanish Organic Law 3/2018, users are informed that personal data provided through the website <strong>pomegranatespain.com</strong> will be processed by:</p><ul><li><strong>Controller:</strong> FRUTAS DAMA DE ELCHE, S.L.</li><li><strong>Tax ID (CIF):</strong> B54566948</li><li><strong>Address:</strong> C/ Santuario de la Luz, 7, Parque Agroalimentario La Alcudia, 03290 Elche/Elx (Alicante), Spain</li><li><strong>Email:</strong> <a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a></li><li><strong>Phone:</strong> +34 965 458 656</li></ul><h2>2. Purpose of processing</h2><p>Data collected is used to: manage enquiries received through the contact form; send commercial communications, newsletters and product news where the user has given express consent; and manage the commercial relationship when products or services are contracted.</p><h2>3. Legal basis</h2><ul><li>The user’s explicit consent when ticking the relevant boxes in the forms.</li><li>The performance of a contract or pre-contractual measures.</li><li>Compliance with legal obligations applicable to the controller.</li></ul><h2>4. Data recipients</h2><p>Data will not be shared with third parties, except by legal obligation or where necessary to provide the requested service (logistics companies, technical services, web or email hosting providers). No international data transfers are foreseen.</p><h2>5. Data retention</h2><p>Data will be kept for as long as needed to fulfil the purpose for which it was collected and, thereafter, for the periods legally required by tax or commercial regulations.</p><h2>6. User rights</h2><p>Users may exercise their rights of access, rectification, erasure (“right to be forgotten”), restriction, portability, objection and withdrawal of consent at any time. To do so, send a written request, together with a copy of your ID, to <a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a>. You also have the right to lodge a complaint with the Spanish Data Protection Agency (<a href="https://www.aepd.es/" target="_blank" rel="noopener">www.aepd.es</a>).</p><h2>7. Data security</h2><p>FRUTAS DAMA DE ELCHE, S.L. has adopted the technical and organisational measures needed to guarantee the security and integrity of the personal data processed and to prevent its loss, alteration and/or access by unauthorised third parties.</p><h2>8. Policy updates</h2><p>We reserve the right to amend this Privacy Policy to adapt it to legislative or case-law developments. Changes will be announced on this page with reasonable notice.</p>` },
  terms:{ title:{es:"Términos y Condiciones de Uso",en:"Terms &amp; Conditions of Use"},
    es:`<h2>1. Objeto y aceptación</h2><p>El presente documento regula el uso del sitio web <strong>pomegranatespain.com</strong>, titularidad de FRUTAS DAMA DE ELCHE, S.L. Al acceder y navegar por este sitio, el visitante adquiere la condición de usuario, lo que implica la aceptación plena y sin reservas de todos los términos aquí recogidos. Si no está de acuerdo, le rogamos que se abstenga de utilizar el sitio web.</p><h2>2. Datos identificativos del titular</h2><ul><li><strong>Titular:</strong> FRUTAS DAMA DE ELCHE, S.L.</li><li><strong>CIF:</strong> B54566948</li><li><strong>Domicilio social:</strong> C/ Santuario de la Luz, 7, Parque Agroalimentario La Alcudia, 03290 Elche/Elx (Alicante), España</li><li><strong>Teléfono:</strong> +34 965 458 656</li><li><strong>Email:</strong> <a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a></li></ul><h2>3. Condiciones de uso</h2><p>El usuario se compromete a hacer un uso adecuado del sitio y sus contenidos conforme a la legislación vigente, este aviso, la moral y el orden público. Quedan expresamente prohibidas: la utilización del sitio con fines lesivos a la empresa o a terceros; la introducción o difusión de virus u otros sistemas que puedan causar daños; y el intento de acceso no autorizado a secciones privadas o servidores del sitio.</p><h2>4. Responsabilidad</h2><p>FRUTAS DAMA DE ELCHE, S.L. no se responsabiliza del mal uso que los usuarios puedan hacer del sitio, de la continuidad de los contenidos o posibles errores, ni de daños causados por virus o accesos no autorizados de terceros. La empresa se reserva el derecho a modificar los contenidos y este aviso legal sin previo aviso.</p><h2>5. Enlaces externos</h2><p>El sitio puede incluir enlaces a páginas de terceros. La empresa no se responsabiliza del contenido, disponibilidad ni políticas de privacidad de dichos sitios.</p><h2>6. Propiedad intelectual e industrial</h2><p>Todos los contenidos del sitio (textos, imágenes, logotipos, marcas, diseño gráfico y código fuente) son propiedad exclusiva de FRUTAS DAMA DE ELCHE, S.L. o de terceros que han autorizado su uso. Queda prohibida su reproducción, distribución, transformación o comunicación pública sin autorización expresa.</p><h2>7. Legislación y jurisdicción aplicable</h2><p>El presente aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de <strong>Elche (Alicante)</strong>, con renuncia expresa a cualquier otro fuero.</p>`,
    en:`<h2>1. Purpose and acceptance</h2><p>This document governs the use of the website <strong>pomegranatespain.com</strong>, owned by FRUTAS DAMA DE ELCHE, S.L. By accessing and browsing this site, the visitor becomes a user, which implies full and unreserved acceptance of all the terms set out here. If you do not agree, please refrain from using the website.</p><h2>2. Owner identification</h2><ul><li><strong>Owner:</strong> FRUTAS DAMA DE ELCHE, S.L.</li><li><strong>Tax ID (CIF):</strong> B54566948</li><li><strong>Registered office:</strong> C/ Santuario de la Luz, 7, Parque Agroalimentario La Alcudia, 03290 Elche/Elx (Alicante), Spain</li><li><strong>Phone:</strong> +34 965 458 656</li><li><strong>Email:</strong> <a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a></li></ul><h2>3. Conditions of use</h2><p>The user agrees to make proper use of the site and its contents in accordance with applicable law, this notice, morality and public order. The following are expressly prohibited: using the site for purposes harmful to the company or third parties; introducing or spreading viruses or other systems that may cause damage; and attempting unauthorised access to private sections or servers.</p><h2>4. Liability</h2><p>FRUTAS DAMA DE ELCHE, S.L. is not responsible for any misuse of the site by users, for the continuity of contents or possible errors, or for damage caused by viruses or unauthorised third-party access. The company reserves the right to modify contents and this legal notice without prior notice.</p><h2>5. External links</h2><p>The site may include links to third-party pages. The company is not responsible for the content, availability or privacy policies of such sites.</p><h2>6. Intellectual and industrial property</h2><p>All site contents (texts, images, logos, brands, graphic design and source code) are the exclusive property of FRUTAS DAMA DE ELCHE, S.L. or of third parties who have authorised their use. Their reproduction, distribution, transformation or public communication without express authorisation is prohibited.</p><h2>7. Governing law and jurisdiction</h2><p>This legal notice is governed by Spanish law. For any dispute, the parties submit to the courts of <strong>Elche (Alicante)</strong>, expressly waiving any other jurisdiction.</p>` },
  cookies:{ title:{es:"Política de Cookies",en:"Cookie Policy"},
    es:`<h2>1. ¿Qué son las cookies?</h2><p>Las cookies son pequeños archivos que se almacenan en tu dispositivo al visitar un sitio web. Su finalidad es reconocer al usuario, recordar sus preferencias y ofrecer una experiencia más eficiente y personalizada. También permiten realizar mediciones estadísticas y mostrar publicidad adaptada a los intereses del usuario.</p><h2>2. ¿Qué tipos de cookies utilizamos?</h2><h3>a) Cookies técnicas (necesarias)</h3><p>Permiten la navegación y el uso de las opciones o servicios del sitio (guardar el idioma, mantener la sesión, gestión del consentimiento).</p><h3>b) Cookies de análisis o medición</h3><p>Permiten cuantificar usuarios y analizar estadísticamente el uso del sitio (Google Analytics 4).</p><h3>c) Cookies de publicidad personalizada</h3><p>Se utilizan para mostrar anuncios relevantes y medir la efectividad de las campañas (Google Ads, LinkedIn Insight Tag, entre otras).</p><h2>3. ¿Qué cookies podemos utilizar?</h2><table><thead><tr><th>Cookie</th><th>Finalidad</th><th>Tipo</th><th>Duración</th><th>Proveedor</th></tr></thead><tbody><tr><td>_ga</td><td>Medición anónima de tráfico y comportamiento</td><td>Analítica</td><td>2 años</td><td>Google Analytics</td></tr><tr><td>_gid</td><td>Diferenciación de usuarios</td><td>Analítica</td><td>24 horas</td><td>Google Analytics</td></tr><tr><td>_gcl_au</td><td>Seguimiento de conversiones</td><td>Publicitaria</td><td>3 meses</td><td>Google Ads</td></tr><tr><td>_li_fat_id</td><td>Seguimiento de campañas</td><td>Publicitaria</td><td>30 días</td><td>LinkedIn</td></tr><tr><td>cookieConsent</td><td>Guardar preferencias de consentimiento</td><td>Técnica</td><td>1 año</td><td>CookieScript</td></tr></tbody></table><p>Algunas cookies podrían activarse de forma puntual o futura según las campañas de marketing o actualizaciones técnicas. La lista se mantendrá actualizada.</p><h2>4. Gestión del consentimiento</h2><p>Al acceder por primera vez se muestra un banner que permite aceptar todas las cookies, rechazar las no necesarias o configurar preferencias por categorías. Puedes modificar o retirar tu consentimiento en cualquier momento desde el botón de gestión de cookies del sitio.</p><h2>5. ¿Cómo cambiar la configuración?</h2><p>Además de la herramienta del sitio, puedes permitir, bloquear o eliminar las cookies desde la configuración de tu navegador (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).</p><h2>6. Modificaciones</h2><p>FRUTAS DAMA DE ELCHE, S.L. puede actualizar esta Política de Cookies según exigencias legislativas o cambios en el sitio. Te recomendamos revisarla periódicamente.</p><h2>7. Contacto</h2><p>Si tienes dudas, escríbenos a <a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a>.</p>`,
    en:`<h2>1. What are cookies?</h2><p>Cookies are small files stored on your device when you visit a website. Their purpose is to recognise the user, remember preferences and offer a more efficient, personalised experience. They also allow statistical measurement and interest-based advertising.</p><h2>2. What types of cookies do we use?</h2><h3>a) Technical cookies (necessary)</h3><p>Enable browsing and the use of the site’s options or services (saving language, keeping the session, consent management).</p><h3>b) Analytics/measurement cookies</h3><p>Let us count users and statistically analyse site usage (Google Analytics 4).</p><h3>c) Personalised advertising cookies</h3><p>Used to show relevant ads and measure campaign effectiveness (Google Ads, LinkedIn Insight Tag, among others).</p><h2>3. Which cookies may we use?</h2><table><thead><tr><th>Cookie</th><th>Purpose</th><th>Type</th><th>Duration</th><th>Provider</th></tr></thead><tbody><tr><td>_ga</td><td>Anonymous traffic and behaviour measurement</td><td>Analytics</td><td>2 years</td><td>Google Analytics</td></tr><tr><td>_gid</td><td>User differentiation</td><td>Analytics</td><td>24 hours</td><td>Google Analytics</td></tr><tr><td>_gcl_au</td><td>Conversion tracking</td><td>Advertising</td><td>3 months</td><td>Google Ads</td></tr><tr><td>_li_fat_id</td><td>Campaign tracking</td><td>Advertising</td><td>30 days</td><td>LinkedIn</td></tr><tr><td>cookieConsent</td><td>Store consent preferences</td><td>Technical</td><td>1 year</td><td>CookieScript</td></tr></tbody></table><p>Some cookies may be activated occasionally or in the future depending on marketing campaigns or technical updates. The list will be kept up to date.</p><h2>4. Consent management</h2><p>On first access a banner lets you accept all cookies, decline non-essential ones or configure preferences by category. You can modify or withdraw your consent at any time from the site’s cookie management button.</p><h2>5. How to change your settings</h2><p>Besides the site tool, you can allow, block or delete cookies from your browser settings (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).</p><h2>6. Changes</h2><p>FRUTAS DAMA DE ELCHE, S.L. may update this Cookie Policy according to legal requirements or site changes. We recommend reviewing it periodically.</p><h2>7. Contact</h2><p>If you have questions, write to <a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a>.</p>` },
  legal:{ title:{es:"Aviso Legal",en:"Legal Notice"},
    es:`<p>En cumplimiento de lo dispuesto en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa que el sitio web pomegranatespain.com es titularidad de:</p><ul><li><strong>Razón social:</strong> FRUTAS DAMA DE ELCHE, S.L.</li><li><strong>CIF:</strong> B54566948</li><li><strong>Domicilio social:</strong> C/ Santuario de la Luz, 7, Parque Agroalimentario La Alcudia, 03290 Elche/Elx (Alicante), España</li><li><strong>Teléfono:</strong> +34 965 458 656</li><li><strong>Email:</strong> <a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a></li><li><strong>Datos registrales:</strong> Inscrita en el Registro Mercantil de Alicante, Sección 8, Hoja A-125765, Inscripción/A 11 (18.03.25)</li></ul><h2>Objeto</h2><p>Este sitio web tiene por finalidad facilitar al público el conocimiento de las actividades de la empresa y ofrecer información general sobre sus productos hortofrutícolas, especialmente granadas.</p><h2>Condiciones de uso</h2><p>El acceso y uso del sitio atribuye la condición de usuario e implica la aceptación plena de todas las disposiciones de este Aviso Legal. El usuario se compromete a utilizar el portal conforme a la legislación vigente, la buena fe y el orden público. Queda prohibido el uso con fines ilícitos o lesivos.</p><h2>Propiedad intelectual e industrial</h2><p>Todos los contenidos (textos, imágenes, logotipos, iconos, software, marcas, etc.) son propiedad de FRUTAS DAMA DE ELCHE, S.L. o de terceros que han autorizado su uso, y están protegidos por la normativa vigente. Queda prohibida su reproducción total o parcial sin permiso expreso y por escrito.</p><h2>Responsabilidad</h2><p>La empresa no se hace responsable de errores u omisiones en los contenidos ni de los daños derivados de su utilización. Se reserva el derecho a modificar, actualizar o eliminar la información sin previo aviso.</p><h2>Enlaces a terceros</h2><p>Este sitio puede contener enlaces a webs de terceros. La empresa no se responsabiliza de su contenido ni estado, y su inclusión no implica recomendación.</p><h2>Legislación aplicable y jurisdicción</h2><p>El presente Aviso Legal se rige por la legislación española. Para cualquier controversia, el usuario y la empresa se someten a los juzgados y tribunales de Elche (Alicante), con renuncia a cualquier otro fuero.</p>`,
    en:`<p>In compliance with Spanish Law 34/2002, of 11 July, on Information Society Services and Electronic Commerce (LSSI-CE), it is stated that the website pomegranatespain.com is owned by:</p><ul><li><strong>Company:</strong> FRUTAS DAMA DE ELCHE, S.L.</li><li><strong>Tax ID (CIF):</strong> B54566948</li><li><strong>Registered office:</strong> C/ Santuario de la Luz, 7, Parque Agroalimentario La Alcudia, 03290 Elche/Elx (Alicante), Spain</li><li><strong>Phone:</strong> +34 965 458 656</li><li><strong>Email:</strong> <a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a></li><li><strong>Registry details:</strong> Registered at the Alicante Commercial Registry, Section 8, Sheet A-125765, Entry/A 11 (18.03.25)</li></ul><h2>Purpose</h2><p>This website aims to give the public information about the company’s activities and general information about its fresh produce, especially pomegranates.</p><h2>Conditions of use</h2><p>Access and use of the site grants user status and implies full acceptance of all the provisions of this Legal Notice. The user agrees to use the portal in accordance with applicable law, good faith and public order. Use for unlawful or harmful purposes is prohibited.</p><h2>Intellectual and industrial property</h2><p>All contents (texts, images, logos, icons, software, brands, etc.) are the property of FRUTAS DAMA DE ELCHE, S.L. or of third parties who have authorised their use, and are protected by current regulations. Total or partial reproduction without express written permission is prohibited.</p><h2>Liability</h2><p>The company is not responsible for errors or omissions in the contents or for damage arising from their use. It reserves the right to modify, update or remove the information without prior notice.</p><h2>Third-party links</h2><p>This site may contain links to third-party websites. The company is not responsible for their content or status, and their inclusion does not imply endorsement.</p><h2>Governing law and jurisdiction</h2><p>This Legal Notice is governed by Spanish law. For any dispute, the user and the company submit to the courts of Elche (Alicante), waiving any other jurisdiction.</p>` }
};
function legalPage(key, lang){
  const d = LEGAL[key], title = d.title[lang], body = d[lang];
  const main = pageHero(IMG.hero, `<a href="index.html">${t("Inicio","Home",lang)}</a> / ${title}`, title, "")
    .replace('class="page-hero"','class="page-hero page-hero--slim"')
    + `<section class="section bg-cream"><div class="container legal-wrap"><div class="legal-body reveal">${body}</div><p class="legal-updated">${t("Última actualización","Last updated",lang)}: ${t("mayo de 2025","May 2025",lang)}.</p></div></section>`;
  return { id:key, bodyClass:"header-solid", lang, main, title:title+" · Granadas Dama de Elche", desc:title };
}

/* ---- Home ---- */
function homePage(lang){
  const heroBtn1=t("Explorar el catálogo","Explore the catalogue",lang), heroBtn2=t("Hablar con ventas","Talk to sales",lang);
  const stat=(n,s,l)=>`<div class="stat reveal"><div class="num" data-count="${n}"${s?` data-suffix="${s}"`:""}>0</div><div class="lbl">${l}</div></div>`;
  const pcard=(id,img,tag,h,p)=>`<a href="${SLUG[id][lang]}" class="pcard reveal"><div class="pcard-img" style="background-image:url('${img}')"></div><span class="tag">${tag}</span><div class="pcard-body"><h3>${h}</h3><p>${p}</p><span class="more">${t("Ver más","See more",lang)} <span class="arrow">&rarr;</span></span></div></a>`;
  const pil=(n,h,p)=>`<div class="pillar reveal"><span class="pnum">— ${n}</span><h3>${h}</h3><p>${p}</p></div>`;
  const main = `
<section class="hero"><div class="hero-bg" style="background-image:url('${IMG.hero}')"></div>
  <div class="container">
    <h1>${t("La fruta que exige <em>excelencia</em>. Y la cumple.","The fruit that demands <em>excellence</em>. And delivers.",lang)}</h1>
    <p class="lead">${t("Granadas, pimientos, higos y coliflores seleccionados uno a uno desde Elche. Para tiendas, chefs y distribuidores que buscan lo memorable.","Pomegranates, peppers, figs and cauliflower selected one by one from Elche. For retailers, chefs and distributors who look for the memorable.",lang)}</p>
    <div class="btn-row"><a href="${SLUG.fruits[lang]}" class="btn btn-light">${heroBtn1} <span class="arrow">&rarr;</span></a><a href="${SLUG.contact[lang]}" class="btn btn-ghost-light">${heroBtn2}</a></div>
  </div><span class="scroll-hint">${t("Descubre","Discover",lang)}</span></section>

<section class="section--tight bg-ink"><div class="container"><div class="stats">
  ${stat(25,"+",t("Años cultivando","Years growing",lang))}${stat(15,"+",t("Países de exportación","Export countries",lang))}${stat(4,"",t("Categorías premium","Premium categories",lang))}${stat(100,"%",t("Trazabilidad","Traceability",lang))}
</div></div></section>

<section class="section bg-cream"><div class="container">
  <div class="sec-head center reveal"><span class="eyebrow">${t("Nuestra gama","Our range",lang)}</span><h2 class="h-sec">${t("Selección con <em>alma mediterránea</em>","A selection with <em>Mediterranean soul</em>",lang)}</h2><p class="lead">${t("Cuatro categorías para el canal profesional: sabor, calibre y presentación con constancia campaña tras campaña.","Four categories for the professional channel: flavour, calibre and presentation, consistent season after season.",lang)}</p></div>
  <div class="grid-cards">
    ${pcard("granadas",IMG.granadas,t("Estrella","Signature",lang),t("Granadas","Pomegranates",lang),t("Mollar, Wonderful, Acco y más.","Mollar, Wonderful, Acco and more.",lang))}
    ${pcard("pimientos",IMG.pimientos,t("Tricolor","Tricolour",lang),t("Pimientos","Peppers",lang),t("Rojo, amarillo y verde de alta gama.","Premium red, yellow and green.",lang))}
    ${pcard("coliflor",IMG.coliflor,t("Calibres 6/8","Calibres 6/8",lang),t("Coliflor","Cauliflower",lang),t("Textura tierna y sabor delicado.","Tender texture, delicate flavour.",lang))}
    ${pcard("higos",IMG.higos,t("Temporada","Season",lang),t("Higos y Brevas","Figs & Brevas",lang),t("Dulzura natural, recolección a mano.","Natural sweetness, hand-picked.",lang))}
  </div></div></section>

<section class="section bg-ink"><div class="container">
  <div class="sec-head center reveal"><span class="eyebrow gold">${t("Calidad","Quality",lang)}</span><h2 class="h-sec">${t("Obsesionados con <em>la frescura</em>","Obsessed with <em>freshness</em>",lang)}</h2><p class="lead">${t("Del campo al packaging, controles rigurosos en cada etapa para que la fruta llegue impecable.","From field to packaging, rigorous controls at every stage so fruit arrives flawless.",lang)}</p></div>
  <div class="pillars">
    ${pil("01",t("Selección a mano","Hand selection",lang),t("Verificación una a una: tamaño, color, madurez.","One-by-one check: size, colour, ripeness.",lang))}
    ${pil("02",t("Cadena de frío","Cold chain",lang),t("Temperatura controlada de la cosecha al destino.","Controlled temperature from harvest to destination.",lang))}
    ${pil("03",t("Certificación global","Global certification",lang),"GlobalG.A.P., BRCGS, GRASP, Carbon Trust.")}
    ${pil("04",t("Trazabilidad total","Full traceability",lang),t("Del campo a la entrega, sin lagunas.","From field to delivery, no gaps.",lang))}
  </div></div></section>

<section class="section bg-cream-soft"><div class="container center">
  <div class="sec-head center reveal"><span class="eyebrow">${t("Exportación","Exports",lang)}</span><h2 class="h-sec">${t("Exportamos sabor y origen a más de <em>15 países</em>","We export flavour and origin to over <em>15 countries</em>",lang)}</h2><p class="lead">${t("Presencia global desde Europa hasta América, África y Asia.","Global presence from Europe to America, Africa and Asia.",lang)}</p></div>
  <div class="export-map reveal"><img src="${IMG.map}" alt="${t("Mapa de exportación","Export map",lang)}" loading="lazy"></div>
  <div class="country-pills reveal"><span>Canadá</span><span>Brasil</span><span>Alemania</span><span>Francia</span><span>${t("Reino Unido","United Kingdom",lang)}</span><span>Italia</span><span>Polonia</span><span>Kenia</span><span>Ghana</span><span>Indonesia</span></div>
</div></section>

<section class="section bg-cream"><div class="container">
  <div class="sec-head between reveal"><div><span class="eyebrow">Blog</span><h2 class="h-sec">${t("Últimas noticias","Latest news",lang)}</h2></div><a href="${SLUG.news[lang]}" class="btn btn-ghost">${t("Ver todas","See all",lang)} <span class="arrow">&rarr;</span></a></div>
  <div class="blog-grid">
    <a href="${SLUG.news[lang]}" class="ncard reveal"><div class="ncard-img" style="background-image:url('${IMG.news1}')"></div><div class="ncard-body"><span class="date">${t("25 Abr 2025","25 Apr 2025",lang)}</span><h3>${t("Beneficios de las granadas Mollar de Elche","Benefits of Mollar pomegranates",lang)}</h3><p>${t("Antioxidantes, vitaminas y sabor.","Antioxidants, vitamins and flavour.",lang)}</p><span class="more">${t("Leer más","Read more",lang)} <span class="arrow">&rarr;</span></span></div></a>
    <a href="${SLUG.news[lang]}" class="ncard reveal d1"><div class="ncard-img" style="background-image:url('${IMG.news2}')"></div><div class="ncard-body"><span class="date">${t("25 Abr 2025","25 Apr 2025",lang)}</span><h3>${t("Nuevos mercados en Asia","New markets in Asia",lang)}</h3><p>${t("Acuerdos que acercan nuestra fruta al mundo.","Deals that bring our fruit to the world.",lang)}</p><span class="more">${t("Leer más","Read more",lang)} <span class="arrow">&rarr;</span></span></div></a>
    <a href="${SLUG.news[lang]}" class="ncard reveal d2"><div class="ncard-img" style="background-image:url('${IMG.news3}')"></div><div class="ncard-body"><span class="date">${t("23 Abr 2025","23 Apr 2025",lang)}</span><h3>${t("Temporada de granadas 2026","Pomegranate season 2026",lang)}</h3><p>${t("Calendario, variedades y previsiones.","Calendar, varieties and forecasts.",lang)}</p><span class="more">${t("Leer más","Read more",lang)} <span class="arrow">&rarr;</span></span></div></a>
  </div></div></section>

<section class="section--tight bg-ink"><div class="container center"><div class="reveal">
  <span class="eyebrow gold">${t("Boletín","Newsletter",lang)}</span><h2 class="h-sec" style="font-size:clamp(26px,3.6vw,38px)">${t("Suscríbete a nuestro boletín","Subscribe to our newsletter",lang)}</h2><p class="lead">${t("Novedades de campaña y disponibilidad, directas a tu correo.","Season updates and availability, straight to your inbox.",lang)}</p>
  <form class="newsletter-box" name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field"><input type="hidden" name="form-name" value="newsletter"><p style="display:none"><label>No: <input name="bot-field"></label></p><input class="field" type="email" name="email" placeholder="${t("tu@correo.com","you@email.com",lang)}" required aria-label="Email"><button type="submit" class="btn btn-primary">${t("Suscribirme","Subscribe",lang)}</button></form>
</div></div></section>

${ctaBlock(lang, t("¿Listo para llevar el <em>Mediterráneo</em> a tus clientes?","Ready to bring the <em>Mediterranean</em> to your clients?",lang))}
`;
  return { id:"home", lang, main, title:t("Granadas Dama de Elche · Frutas y verduras premium del Mediterráneo","Granadas Dama de Elche · Premium Mediterranean fruit & vegetables",lang), desc:t("Granadas, pimientos, higos y coliflores premium desde Elche. Trazabilidad total y exportación a más de 15 países.","Premium pomegranates, peppers, figs and cauliflower from Elche. Full traceability and export to 15+ countries.",lang) };
}

/* ============================ GENERAR ============================ */
const langs = ["es","en"];
function outPath(id, lang){
  const file = SLUG[id][lang];
  return lang==="en" ? path.join(ROOT,"en",file) : path.join(ROOT,file);
}
if(!fs.existsSync(path.join(ROOT,"en"))) fs.mkdirSync(path.join(ROOT,"en"));

let count=0;
langs.forEach(lang=>{
  const pages=[];
  pages.push(homePage(lang));
  pages.push(fruitsPage(lang));
  ["granadas","pimientos","coliflor","higos"].forEach(k=>pages.push(productPage(k,lang)));
  ["about","sustain","quality"].forEach(k=>pages.push(contentPage(k,lang)));
  pages.push(certsPage(lang));
  pages.push(newsPage(lang));
  pages.push(contactPage(lang));
  ["privacy","terms","cookies","legal"].forEach(k=>pages.push(legalPage(k,lang)));
  pages.forEach(pg=>{ fs.writeFileSync(outPath(pg.id,lang), shell(pg)); count++; });
});
console.log("Generadas "+count+" páginas ("+langs.join("+")+").");
