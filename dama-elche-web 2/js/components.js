/* DAMA · componentes compartidos (header, menú, footer, cookies) — bilingüe */
(function () {
  "use strict";

  var isEN = (document.documentElement.lang || "es").toLowerCase().indexOf("en") === 0;
  // prefijo para saltar de un idioma a otro
  var toOther = isEN ? "../" : "en/";
  var toRoot = isEN ? "../" : "";        // raíz del idioma actual
  var assets = isEN ? "../" : "";        // css/js/img viven en la raíz

  var MARK = '<span class="brand-mark" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3c.6-1 1.8-1.6 3-1.4-.3 1.1-1 2-2 2.4 3.2.7 5.6 3.6 5.6 7.1 0 4.7-3.4 8.4-6.6 8.4S5.4 15.8 5.4 11.1c0-3.4 2.3-6.3 5.4-7.1-1-.5-1.7-1.3-2-2.4 1.2-.2 2.4.4 3 1.4Z" fill="#FAF6EE"/><circle cx="9.6" cy="11" r="1" fill="#7C1C1C"/><circle cx="12" cy="9.4" r="1" fill="#7C1C1C"/><circle cx="14.4" cy="11" r="1" fill="#7C1C1C"/><circle cx="10.6" cy="13.6" r="1" fill="#7C1C1C"/><circle cx="13.4" cy="13.6" r="1" fill="#7C1C1C"/></svg></span>';

  // slugs por idioma (mismo orden). key = id de página
  var PAGES = {
    home:      { es:"index.html",                        en:"index.html",          nav:{es:"Inicio",en:"Home"} },
    fruits:    { es:"frutas-y-verduras.html",            en:"fruits-and-vegetables.html", nav:{es:"Frutas y Verduras",en:"Fruits & Vegetables"} },
    about:     { es:"mision-y-valores.html",             en:"about.html",          nav:{es:"Nosotros",en:"About"} },
    sustain:   { es:"sostenibilidad.html",               en:"sustainability.html", nav:{es:"Sostenibilidad",en:"Sustainability"} },
    news:      { es:"noticias.html",                     en:"news.html",           nav:{es:"Noticias",en:"News"} },
    contact:   { es:"contacto.html",                     en:"contact.html",        nav:{es:"Contacto",en:"Contact"} },
    catalog:   { es:"https://www.nuestrocatalogo.es/Frutas_Dama_De_Elche/MailView/", en:"https://www.nuestrocatalogo.es/Frutas_Dama_De_Elche/MailView/", nav:{es:"Catálogo",en:"Catalogue"} },
    granadas:  { es:"granadas.html",                     en:"pomegranates.html" },
    pimientos: { es:"pimientos.html",                    en:"peppers.html" },
    coliflor:  { es:"coliflor.html",                     en:"cauliflower.html" },
    higos:     { es:"higos-y-brevas.html",               en:"figs.html" },
    quality:   { es:"calidad-y-frescura.html",           en:"quality.html" },
    certs:     { es:"certificaciones-de-calidad.html",   en:"certifications.html" },
    privacy:   { es:"politica-de-privacidad.html",       en:"privacy-policy.html" },
    terms:     { es:"terminos-de-servicio.html",         en:"terms.html" },
    cookies:   { es:"politica-de-cookies.html",          en:"cookie-policy.html" },
    legal:     { es:"aviso-legal.html",                  en:"legal-notice.html" }
  };
  var L = isEN ? "en" : "es";
  var href = function (id) { return (assets) + PAGES[id][L]; };     // enlace dentro del idioma actual
  // (en EN, los hermanos están en la misma carpeta, así que sin prefijo; en ES igual)
  var hrefSame = function (id) { return PAGES[id][L]; };
  var extAttr = function (id) { return /^https?:/.test(PAGES[id][L]) ? ' target="_blank" rel="noopener"' : ''; };

  var T = {
    es: {
      contact:"Contactar", nav:["home","fruits","about","sustain","news","catalog","contact"],
      explore:"Explorar", products:"Productos", contactCol:"Contacto",
      brandDesc:"Segunda generación de una empresa familiar con más de 25 años cultivando y exportando frutas y verduras frescas de alta calidad desde Elche.",
      rights:"Todos los derechos reservados.",
      legal:[["terms","Términos"],["privacy","Privacidad"],["cookies","Cookies"],["legal","Aviso legal"]],
      cookie:'Usamos cookies propias y de terceros para mejorar tu experiencia y analizar el tráfico. Consulta nuestra <a href="'+hrefSame("cookies")+'">Política de Cookies</a>.',
      accept:"Aceptar", reject:"Rechazar",
      prodNav:[["granadas","Granadas"],["pimientos","Pimientos"],["coliflor","Coliflor"],["higos","Higos y Brevas"]]
    },
    en: {
      contact:"Contact", nav:["home","fruits","about","sustain","news","catalog","contact"],
      explore:"Explore", products:"Products", contactCol:"Contact",
      brandDesc:"A second-generation family business with over 25 years growing and exporting premium fresh fruit and vegetables from Elche.",
      rights:"All rights reserved.",
      legal:[["terms","Terms"],["privacy","Privacy"],["cookies","Cookies"],["legal","Legal notice"]],
      cookie:'We use our own and third-party cookies to improve your experience and analyse traffic. See our <a href="'+hrefSame("cookies")+'">Cookie Policy</a>.',
      accept:"Accept", reject:"Decline",
      prodNav:[["granadas","Pomegranates"],["pimientos","Peppers"],["coliflor","Cauliflower"],["higos","Figs & Brevas"]]
    }
  }[L];

  var pageId = document.body.getAttribute("data-page") || "home";
  var activeNav = document.body.getAttribute("data-nav") || pageId;
  var brandName = '<span class="brand-name">DAMA<span> Granadas</span><small>Mediterranean Excellence</small></span>';
  var LOGOIMG = '<img class="brand-logo" src="' + assets + 'img/logo-grupo.svg" alt="Grupo Dama de Elche" width="200" height="52">';

  // ---- Selector de idioma (apunta a la página equivalente en el otro idioma) ----
  var otherFile = PAGES[pageId] ? PAGES[pageId][isEN ? "es" : "en"] : "index.html";
  var langSwitch =
    '<span class="lang-switch">' +
      '<a href="' + (isEN ? toOther + otherFile : hrefSame(pageId)) + '"' + (isEN ? "" : ' class="active"') + '>ES</a>' +
      '<span class="sep">|</span>' +
      '<a href="' + (isEN ? hrefSame(pageId) : toOther + otherFile) + '"' + (isEN ? ' class="active"' : "") + '>EN</a>' +
    '</span>';

  // ---- HEADER ----
  var navHTML = T.nav.map(function (id) {
    return '<a href="' + hrefSame(id) + '"' + extAttr(id) + (id === activeNav ? ' class="active"' : "") + '>' + PAGES[id].nav[L] + '</a>';
  }).join("");

  var header =
    '<header class="site-header"><div class="container">' +
      '<a href="' + hrefSame("home") + '" class="brand" aria-label="Grupo Dama de Elche">' + LOGOIMG + '</a>' +
      '<nav class="nav" aria-label="Principal">' + navHTML + '</nav>' +
      '<div class="header-cta">' + langSwitch +
        '<a href="' + hrefSame("contact") + '" class="btn btn-primary">' + T.contact + '</a>' +
        '<button class="burger" aria-label="Menú" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div>' +
    '</div></header>';

  // ---- MENÚ MÓVIL ----
  var mmNav = T.nav.map(function (id) { return '<a href="' + hrefSame(id) + '"' + extAttr(id) + '>' + PAGES[id].nav[L] + '</a>'; }).join("");
  var mobile =
    '<div class="mobile-menu" id="mobileMenu"><button class="mm-close" aria-label="Cerrar">&times;</button>' +
      mmNav +
      '<a href="' + hrefSame("contact") + '" class="btn btn-primary mm-cta">' + T.contact + '</a>' +
      langSwitch.replace('class="lang-switch"','class="lang-switch" style="margin-top:18px"') +
    '</div>';

  // ---- FOOTER ----
  var exploreLinks = T.nav.filter(function(id){return id!=="contact";}).map(function (id) {
    return '<li><a href="' + hrefSame(id) + '"' + extAttr(id) + '>' + PAGES[id].nav[L] + '</a></li>';
  }).join("");
  var prodLinks = T.prodNav.map(function (p) { return '<li><a href="' + hrefSame(p[0]) + '">' + p[1] + '</a></li>'; }).join("");
  var legalLinks = T.legal.map(function (l) { return '<a href="' + hrefSame(l[0]) + '">' + l[1] + '</a>'; }).join("");
  var CDN = assets + "img/";
  var partners = [["cert-globalgap.png","GlobalG.A.P."],["cert-ifs.png","IFS Food"],["cert-brcgs.png","BRCGS"],["cert-fruverpack.png","fruverpack"],["cert-sorma.png","Sorma Ibérica"]];
  var partnersHTML = partners.map(function (p) { return '<img src="' + CDN + p[0] + '" alt="' + p[1] + '" loading="lazy">'; }).join("");

  var footer =
    '<footer class="site-footer"><div class="container">' +
      '<div class="footer-top">' +
        '<div class="footer-brand"><a href="' + hrefSame("home") + '" class="brand">' + LOGOIMG + '</a><p>' + T.brandDesc + '</p></div>' +
        '<div class="fcol"><h4>' + T.explore + '</h4><ul>' + exploreLinks + '</ul></div>' +
        '<div class="fcol"><h4>' + T.products + '</h4><ul>' + prodLinks + '</ul></div>' +
        '<div class="fcol"><h4>' + T.contactCol + '</h4><ul>' +
          '<li><a href="tel:+34965458656">+34 965 458 656</a></li>' +
          '<li><a href="mailto:info@granadasdamadeelche.com">info@granadasdamadeelche.com</a></li>' +
          '<li>C/ Santuario de la Luz, 7</li><li>Parque Agroalimentario La Alcudia</li><li>03290 Elche, Alicante</li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="footer-partners">' + partnersHTML + '</div>' +
      '<div class="footer-legal"><span>&copy; <span data-year>2026</span> Frutas Dama de Elche, S.L. ' + T.rights + '</span><span class="links">' + legalLinks + '</span></div>' +
    '</div></footer>';

  // ---- COOKIES ----
  var cookie =
    '<div class="cookie-banner" role="dialog" aria-label="Cookies"><p>' + T.cookie + '</p>' +
    '<div class="ck-actions"><button class="btn btn-ghost-light" data-cookie="reject" style="border-color:rgba(250,246,238,.5)">' + T.reject + '</button>' +
    '<button class="btn btn-primary" data-cookie="accept">' + T.accept + '</button></div></div>';

  // ---- Inyección ----
  document.body.insertAdjacentHTML("afterbegin", header + mobile);
  document.body.insertAdjacentHTML("beforeend", footer + cookie);
})();
