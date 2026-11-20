/* ==========================================================
   IT PARK SOFTWARE — projects.js
   Projects grid with JS category filters, home carousel (Swiper) and detail modal.
   All sample projects are DEMO content.
   ========================================================== */
(function () {
  "use strict";
  var esc = window.ITP.esc;
  var DATA = window.ITP_PROJECTS || [];
  var modal = null, current = "all", openId = null, swiper = null;

  function byId(id) { return DATA.filter(function (p) { return p.id === id; })[0]; }
  var catLabel = function (c) { return I18n.t("filter." + c); };

  function cardHTML(p, slide) {
    var inner = '<article class="card project-card" data-project="' + p.id + '">' +
      '<div class="project-card__cover"><img src="assets/images/' + p.cover + '.svg" alt="" width="640" height="400" loading="lazy">' +
      (p.demo ? '<span class="badge badge--demo">' + esc(I18n.t("common.demo")) + "</span>" : "") + "</div>" +
      '<div class="project-card__body"><span class="project-card__cat">' + esc(catLabel(p.category)) + "</span>" +
      "<h3>" + esc(p.name) + "</h3><p>" + esc(I18n.loc(p.desc)) + "</p>" +
      '<div class="chips">' + p.tech.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div>" +
      '<button class="project-card__more" type="button" data-open="' + p.id + '"><span>' + esc(I18n.t("common.viewMore")) + '</span><i data-icon="arrowUpRight"></i></button></div></article>';
    return slide ? '<div class="swiper-slide">' + inner + "</div>" : inner;
  }

  function renderGrid() {
    var grid = document.getElementById("projects-grid");
    if (!grid) return;
    var list = DATA.filter(function (p) { return current === "all" || p.category === current; });
    grid.innerHTML = list.length ? list.map(function (p) { return cardHTML(p, false); }).join("") : "";
    var empty = document.getElementById("projects-empty");
    if (empty) empty.hidden = list.length > 0;
    Icons.render(grid);
  }

  function renderFilters() {
    var box = document.getElementById("project-filters");
    if (!box) return;
    var cats = ["all", "web", "mobile", "ai", "software"];
    box.innerHTML = cats.map(function (c) {
      return '<button class="filter" type="button" data-filter="' + c + '" aria-pressed="' + (c === current) + '">' + esc(c === "all" ? I18n.t("common.all") : catLabel(c)) + "</button>";
    }).join("");
  }

  function renderCarousel() {
    var wrap = document.getElementById("projects-swiper");
    if (!wrap) return;
    var list = DATA.slice(0, 6);
    wrap.querySelector(".swiper-wrapper").innerHTML = list.map(function (p) { return cardHTML(p, true); }).join("");
    Icons.render(wrap);
    if (swiper) { swiper.destroy(true, true); swiper = null; }
    if (window.Swiper) {
      swiper = new Swiper(wrap, {
        slidesPerView: 1.08, spaceBetween: 18, grabCursor: true, watchOverflow: true,
        pagination: { el: wrap.querySelector(".swiper-pagination"), clickable: true },
        breakpoints: { 720: { slidesPerView: 2, spaceBetween: 20 }, 1100: { slidesPerView: 3, spaceBetween: 22 } }
      });
    }
  }

  function modalHTML(p) {
    var features = I18n.loc(p.features) || [];
    return '<div class="modal__art"><img src="assets/images/' + p.cover + '.svg" alt="" width="640" height="400"></div>' +
      '<div class="chips" style="margin-bottom:14px"><span class="badge">' + esc(catLabel(p.category)) + "</span>" + (p.demo ? '<span class="badge badge--demo">' + esc(I18n.t("common.demo")) + "</span>" : "") + "</div>" +
      '<h2 id="project-modal-title" style="font-size:clamp(1.6rem,3vw,2.2rem)">' + esc(p.name) + "</h2>" +
      '<p class="modal__lead" style="margin-top:12px">' + esc(I18n.loc(p.desc)) + "</p>" +
      '<div class="modal__cols"><div><h3>' + esc(I18n.t("projects.features")) + '</h3><ul class="checklist" style="margin-top:0">' +
      features.map(function (f) { return '<li><i data-icon="check"></i><span>' + esc(f) + "</span></li>"; }).join("") + "</ul></div>" +
      "<div><h3>" + esc(I18n.t("projects.tech")) + '</h3><div class="chips">' + p.tech.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div>" +
      '<h3 style="margin-top:22px">' + esc(I18n.t("projects.status")) + "</h3><p>" + esc(I18n.t(p.demo ? "projects.statusDemo" : "projects.status")) + "</p></div></div>" +
      '<div class="modal__actions"><a class="btn btn--primary" href="contact.html"><span>' + esc(I18n.t("nav.cta")) + '</span><i data-icon="arrowRight"></i></a></div>';
  }

  function open(id) {
    var p = byId(id); if (!p) return;
    if (!modal) modal = Modal.create("project-modal");
    openId = id;
    modal.open(modalHTML(p), "project-modal-title");
  }

  function onClick(e) {
    var b = e.target.closest("[data-open]");
    if (b) open(b.getAttribute("data-open"));
  }

  function init() {
    renderFilters(); renderGrid(); renderCarousel();
    var filters = document.getElementById("project-filters");
    if (filters) filters.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]"); if (!b) return;
      current = b.getAttribute("data-filter");
      renderFilters(); renderGrid();
      if (window.Anim) Anim.enter(document.querySelectorAll("#projects-grid > .card"));
    });
    ["projects-grid", "projects-swiper"].forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener("click", onClick); });

    document.addEventListener("langchange", function () {
      renderFilters(); renderGrid(); renderCarousel();
      if (modal && modal.isOpen() && byId(openId)) modal.open(modalHTML(byId(openId)), "project-modal-title");
    });

    var q = new URLSearchParams(location.search).get("open");
    if (q && byId(q)) setTimeout(function () { open(q); }, 350);
  }
  window.ITP.register(init);
})();
