/* DAMA · Granadas Dama de Elche — interacciones del sitio */
(function () {
  "use strict";

  /* ---- Header sticky: cambia a fondo claro al hacer scroll ---- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Menú móvil a pantalla completa ---- */
  var burger = document.querySelector(".burger");
  var menu = document.querySelector(".mobile-menu");
  var closeBtn = document.querySelector(".mm-close");
  var setMenu = function (open) {
    if (!menu) return;
    menu.classList.toggle("open", open);
    document.body.classList.toggle("no-scroll", open);
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
  };
  if (burger) burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  if (closeBtn) closeBtn.addEventListener("click", function () { setMenu(false); });
  if (menu) menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---- Reveal al hacer scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Contador de cifras (count-up) ---- */
  var nums = document.querySelectorAll("[data-count]");
  var animateNum = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && nums.length) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateNum(en.target); io2.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { io2.observe(el); });
  }

  /* ---- Año actual en el footer ---- */
  var y = document.querySelectorAll("[data-year]");
  y.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Banner de cookies (consentimiento propio, sin dependencias) ---- */
  var CONSENT_KEY = "dama_cookie_consent";
  var getConsent = function () { try { return window.localStorage.getItem(CONSENT_KEY); } catch (e) { return "seen"; } };
  var setConsent = function (v) { try { window.localStorage.setItem(CONSENT_KEY, v); } catch (e) {} };
  var banner = document.querySelector(".cookie-banner");
  if (banner) {
    if (!getConsent()) { banner.classList.add("show"); }
    banner.querySelectorAll("[data-cookie]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setConsent(btn.getAttribute("data-cookie")); // "accept" | "reject"
        banner.classList.remove("show");
      });
    });
  }

  /* ---- Pestañas de producto (Características/Nutrición/Cultivo) ---- */
  document.querySelectorAll("[data-tabs]").forEach(function (tabs) {
    var btns = tabs.querySelectorAll(".tab-btn");
    var panels = tabs.querySelectorAll(".tab-panel");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var i = b.getAttribute("data-tab");
        btns.forEach(function (x) { x.classList.remove("is-active"); });
        panels.forEach(function (x) { x.classList.remove("is-active"); });
        b.classList.add("is-active");
        var panel = tabs.querySelector('.tab-panel[data-panel="' + i + '"]');
        if (panel) panel.classList.add("is-active");
      });
    });
  });
})();
