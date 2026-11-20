/* ==========================================================
   IT PARK SOFTWARE — services.js
   Service cards + modal window (details, benefits, tech, related projects, order form).
   ========================================================== */
(function () {
  "use strict";
  var CFG = window.ITP_CONFIG || {};
  var esc = window.ITP.esc;
  var DATA = window.ITP_SERVICES || [];
  var PROJECTS = window.ITP_PROJECTS || [];
  var modal = null, state = { id: null, view: "info", values: {} };

  function byId(id) { return DATA.filter(function (s) { return s.id === id; })[0]; }

  function cardHTML(s) {
    return '<article class="card svc-card" data-service="' + s.id + '">' +
      '<span class="svc-card__icon"><i data-icon="' + s.icon + '"></i></span>' +
      '<div class="svc-card__body"><h3>' + esc(I18n.loc(s.name)) + "</h3><p>" + esc(I18n.loc(s.short)) + "</p></div>" +
      '<img class="svc-card__art" src="assets/images/' + s.art + '.svg" alt="" width="640" height="400" loading="lazy">' +
      '<button class="svc-card__more" type="button" data-open="' + s.id + '"><span>' + esc(I18n.t("common.more")) + '</span><i data-icon="arrowRight"></i></button></article>';
  }

  function renderGrid() {
    var grid = document.getElementById("services-grid");
    if (!grid) return;
    grid.innerHTML = DATA.map(cardHTML).join("");
    Icons.render(grid);
  }

  function infoHTML(s) {
    var rel = (s.projects || []).map(function (id) { return PROJECTS.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    var relHTML = rel.length ? '<div class="related">' + rel.map(function (p) {
      return '<a class="related__item" href="projects.html?open=' + p.id + '"><img src="assets/images/' + p.cover + '.svg" alt="" width="64" height="40" loading="lazy"><div><strong>' + esc(p.name) + "</strong><span>" + esc(I18n.t("common.demo")) + "</span></div></a>";
    }).join("") + "</div>" : '<p style="font-size:.92rem">' + esc(I18n.t("modal.relatedNone")) + "</p>";
    return '<div class="modal__head"><span class="ico"><i data-icon="' + s.icon + '"></i></span><h2 id="svc-modal-title">' + esc(I18n.loc(s.name)) + "</h2></div>" +
      '<p class="modal__lead">' + esc(I18n.loc(s.long)) + "</p>" +
      '<div class="modal__cols"><div class="modal__section"><h3>' + esc(I18n.t("modal.benefits")) + '</h3><ul class="checklist" style="margin-top:0">' +
      I18n.loc(s.benefits).map(function (b) { return '<li><i data-icon="check"></i><span>' + esc(b) + "</span></li>"; }).join("") + "</ul></div>" +
      '<div><div class="modal__section"><h3>' + esc(I18n.t("modal.tech")) + '</h3><div class="chips">' + s.tech.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div></div>" +
      '<div class="modal__section"><h3>' + esc(I18n.t("modal.related")) + "</h3>" + relHTML + "</div></div></div>" +
      '<div class="modal__actions"><button class="btn btn--primary" type="button" data-act="order"><span>' + esc(I18n.t("common.order")) + '</span><i data-icon="arrowRight"></i></button>' +
      '<a class="btn btn--telegram" href="' + esc(CFG.telegramUrl) + '" target="_blank" rel="noopener noreferrer"><i data-icon="send"></i><span>' + esc(I18n.t("common.telegram")) + "</span></a></div>";
  }

  function orderHTML(s) {
    return '<button class="back-link" type="button" data-act="back"><i data-icon="arrowRight"></i><span>' + esc(I18n.t("common.back")) + "</span></button>" +
      '<div class="modal__head"><span class="ico"><i data-icon="' + s.icon + '"></i></span><div><h2 id="svc-modal-title">' + esc(I18n.t("modal.orderTitle")) + "</h2><p>" + esc(I18n.t("modal.orderLead")) + "</p></div></div>" +
      Forms.orderFormHTML(s.id, state.values);
  }

  function render() {
    var s = byId(state.id); if (!s) return;
    modal.open(state.view === "order" ? orderHTML(s) : infoHTML(s), "svc-modal-title");
    var form = modal.content.querySelector("#order-form");
    if (form) Forms.bind(form, "order");
  }

  function open(id, view) {
    if (!byId(id)) return;
    if (!modal) {
      modal = Modal.create("service-modal");
      modal.content.addEventListener("click", function (e) {
        var a = e.target.closest("[data-act]"); if (!a) return;
        if (a.getAttribute("data-act") === "order") { state.view = "order"; render(); var f = modal.content.querySelector("input"); if (f) f.focus(); }
        if (a.getAttribute("data-act") === "back") { saveValues(); state.view = "info"; render(); }
      });
    }
    state.id = id; state.view = view || "info"; state.values = {};
    render();
  }

  function saveValues() {
    var form = modal && modal.content.querySelector("#order-form");
    if (!form) return;
    state.values = Forms.collect(form);
    var sel = form.querySelector("#of-service"); if (sel && sel.value) state.id = sel.value;
  }

  function renderAreas() {
    var box = document.getElementById("about-areas");
    if (!box) return;
    box.innerHTML = DATA.map(function (s) {
      return '<a class="chip" href="services.html?open=' + s.id + '">' + esc(I18n.loc(s.name)) + "</a>";
    }).join("");
  }

  function init() {
    renderGrid(); renderAreas();
    var grid = document.getElementById("services-grid");
    if (grid) grid.addEventListener("click", function (e) { var b = e.target.closest("[data-open]"); if (b) open(b.getAttribute("data-open")); });

    document.addEventListener("langchange", function () {
      renderGrid(); renderAreas();
      if (modal && modal.isOpen()) { saveValues(); render(); }
    });

    var q = new URLSearchParams(location.search).get("open");
    if (q && byId(q)) setTimeout(function () { open(q); }, 350);
  }

  window.Services = { open: open };
  window.ITP.register(init);
})();
