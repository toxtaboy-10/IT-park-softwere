/* ==========================================================
   IT PARK SOFTWARE — main.js
   Boot order: shared layout -> icons -> language -> page modules -> animations
   ========================================================== */
(function () {
  "use strict";
  function boot() {
    Components.mount();
    Icons.render(document);
    I18n.setLang(I18n.lang, true);
    Components.localizeFooterServices();

    var tg = (window.ITP_CONFIG || {}).telegramUrl;
    document.querySelectorAll("[data-telegram]").forEach(function (a) {
      a.setAttribute("href", tg); a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer");
    });

    window.ITP.inits.forEach(function (fn) {
      try { fn(); } catch (err) { console.error("[IT PARK] module init failed:", err); }
    });

    Icons.render(document);
    I18n.apply(document);
    if (window.Anim) Anim.init();

    document.addEventListener("langchange", function () {
      Icons.render(document);
      Components.localizeFooterServices();
      document.querySelectorAll("[data-telegram]").forEach(function (a) { a.setAttribute("href", tg); });
    });
    window.addEventListener("load", function () { if (window.Anim) Anim.refresh(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
