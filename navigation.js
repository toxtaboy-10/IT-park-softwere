/* ==========================================================
   IT PARK SOFTWARE — navigation.js
   Sticky header state, mobile menu, language dropdown, and the shared Modal helper.
   ========================================================== */
(function () {
  "use strict";

  /* ---------- Generic modal (used by services, projects, news) ---------- */
  var lastFocus = null, activeModal = null;

  function focusables(root) {
    return Array.prototype.slice.call(root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter(function (el) { return el.offsetParent !== null; });
  }

  function createModal(id) {
    var el = document.createElement("div");
    el.className = "modal";
    el.id = id;
    el.innerHTML = '<div class="modal__backdrop" data-modal-close></div>' +
      '<div class="modal__dialog" role="dialog" aria-modal="true" tabindex="-1">' +
      '<button class="modal__close" type="button" data-modal-close data-i18n-aria-label="common.close" aria-label="Close"><i data-icon="x"></i></button>' +
      '<div class="modal__content"></div></div>';
    document.body.appendChild(el);
    var api = {
      el: el,
      dialog: el.querySelector(".modal__dialog"),
      content: el.querySelector(".modal__content"),
      open: function (html, labelledBy) {
        api.content.innerHTML = "";
        if (typeof html === "string") api.content.innerHTML = html; else api.content.appendChild(html);
        if (labelledBy) api.dialog.setAttribute("aria-labelledby", labelledBy);
        window.Icons && Icons.render(el);
        I18n.apply(el);
        if (activeModal !== api) lastFocus = document.activeElement;
        activeModal = api;
        el.classList.add("is-open");
        document.body.classList.add("modal-open");
        api.dialog.scrollTop = 0;
        setTimeout(function () { api.dialog.focus(); }, 30);
      },
      close: function () {
        if (!el.classList.contains("is-open")) return;
        el.classList.remove("is-open");
        document.body.classList.remove("modal-open");
        activeModal = null;
        if (lastFocus && lastFocus.focus) lastFocus.focus();
        document.dispatchEvent(new CustomEvent("modalclose", { detail: { id: id } }));
      },
      isOpen: function () { return el.classList.contains("is-open"); }
    };
    el.addEventListener("click", function (e) { if (e.target.closest("[data-modal-close]")) api.close(); });
    return api;
  }

  document.addEventListener("keydown", function (e) {
    if (!activeModal) return;
    if (e.key === "Escape") { activeModal.close(); return; }
    if (e.key === "Tab") {
      var f = focusables(activeModal.dialog);
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === activeModal.dialog)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.Modal = { create: createModal };

  /* ---------- Header behaviour ---------- */
  function init() {
    var header = document.getElementById("siteHeader");
    var nav = document.getElementById("siteNav");
    var toggle = document.getElementById("menuToggle");
    var langBtn = document.getElementById("langBtn");
    var langMenu = document.getElementById("langMenu");
    if (!header) return;

    function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 12); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function setMenu(open) {
      nav.classList.toggle("is-open", open);
      header.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", I18n.t(open ? "nav.menuClose" : "nav.menu"));
      toggle.querySelector(".icon").innerHTML = Icons.svg(open ? "x" : "menu", 22);
      document.body.style.overflow = open ? "hidden" : "";
    }
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1020) setMenu(false); });

    function setLangMenu(open) {
      langMenu.classList.toggle("is-open", open);
      langBtn.setAttribute("aria-expanded", String(open));
    }
    langBtn.addEventListener("click", function (e) { e.stopPropagation(); setLangMenu(!langMenu.classList.contains("is-open")); });
    langMenu.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lang]");
      if (!b) return;
      I18n.setLang(b.getAttribute("data-lang"));
      setLangMenu(false);
      langBtn.focus();
    });
    document.addEventListener("click", function (e) { if (!e.target.closest("#lang")) setLangMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (langMenu.classList.contains("is-open")) { setLangMenu(false); langBtn.focus(); }
      if (nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });

    function syncLang() {
      document.getElementById("langCode").textContent = I18n.lang.toUpperCase();
      langMenu.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-checked", String(b.getAttribute("data-lang") === I18n.lang)); });
      toggle.setAttribute("aria-label", I18n.t(nav.classList.contains("is-open") ? "nav.menuClose" : "nav.menu"));
    }
    syncLang();
    document.addEventListener("langchange", syncLang);
  }
  window.ITP.register(init);
})();
