/* ==========================================================
   IT PARK SOFTWARE — news.js
   News list (category filters + pagination), home "latest news", article modal.
   Data is DEMO; later replace getNews() with a fetch to ITP_CONFIG.api.newsEndpoint.
   ========================================================== */
(function () {
  "use strict";
  var esc = window.ITP.esc;
  var CFG = window.ITP_CONFIG || {};
  var PER_PAGE = 6;
  var cat = "all", page = 1, modal = null, openId = null;

  /* Data layer — swap for a backend call later */
  function getNews() { return (window.ITP_NEWS || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }); }
  function byId(id) { return getNews().filter(function (n) { return n.id === id; })[0]; }

  function cardHTML(n, featured) {
    return '<article class="card news-card' + (featured ? " news-featured" : "") + '" data-news="' + n.id + '">' +
      '<div class="news-card__cover"><img src="assets/images/' + n.cover + '.svg" alt="" width="640" height="400" loading="lazy">' +
      (n.demo ? '<span class="badge badge--demo">' + esc(I18n.t("common.demo")) + "</span>" : "") + "</div>" +
      '<div class="news-card__body"><div class="news-meta"><span class="cat">' + esc(I18n.t("newscat." + n.category)) + '</span><span class="when"><i data-icon="calendar"></i><time datetime="' + n.date + '">' + esc(I18n.formatDate(n.date)) + "</time></span></div>" +
      (featured ? "<h2>" : "<h3>") + esc(I18n.loc(n.title)) + (featured ? "</h2>" : "</h3>") + "<p>" + esc(I18n.loc(n.excerpt)) + "</p>" +
      '<button class="news-card__more" type="button" data-open="' + n.id + '"><span>' + esc(I18n.t("common.readMore")) + '</span><i data-icon="arrowRight"></i></button></div></article>';
  }

  function renderFilters() {
    var box = document.getElementById("news-filters");
    if (!box) return;
    box.innerHTML = ["all", "company", "technology", "events", "tips"].map(function (c) {
      return '<button class="filter" type="button" data-filter="' + c + '" aria-pressed="' + (c === cat) + '">' + esc(c === "all" ? I18n.t("common.all") : I18n.t("newscat." + c)) + "</button>";
    }).join("");
  }

  function renderList(animate) {
    var grid = document.getElementById("news-grid");
    if (!grid) return;
    var all = getNews().filter(function (n) { return cat === "all" || n.category === cat; });
    var pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
    if (page > pages) page = pages;
    var slice = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    var feat = document.getElementById("news-featured");
    var html = "";
    if (feat) {
      feat.innerHTML = slice.length && page === 1 ? cardHTML(slice[0], true) : "";
      html = slice.slice(page === 1 ? 1 : 0).map(function (n) { return cardHTML(n, false); }).join("");
    } else html = slice.map(function (n) { return cardHTML(n, false); }).join("");
    grid.innerHTML = html;
    var empty = document.getElementById("news-empty"); if (empty) empty.hidden = all.length > 0;
    Icons.render(document.getElementById("news-section") || grid);
    renderPagination(pages);
    if (animate && window.Anim) Anim.enter(document.querySelectorAll("#news-featured > .card, #news-grid > .card"));
  }

  function renderPagination(pages) {
    var box = document.getElementById("news-pagination");
    if (!box) return;
    if (pages <= 1) { box.innerHTML = ""; return; }
    var h = '<button class="page-btn" type="button" data-page="' + (page - 1) + '"' + (page === 1 ? " disabled" : "") + ' aria-label="' + esc(I18n.t("news.prev")) + '"><i data-icon="chevronLeft"></i></button>';
    for (var i = 1; i <= pages; i++) h += '<button class="page-btn" type="button" data-page="' + i + '"' + (i === page ? ' aria-current="page"' : "") + ' aria-label="' + esc(I18n.t("news.page")) + " " + i + '">' + i + "</button>";
    h += '<button class="page-btn" type="button" data-page="' + (page + 1) + '"' + (page === pages ? " disabled" : "") + ' aria-label="' + esc(I18n.t("news.next")) + '"><i data-icon="chevronRight"></i></button>';
    box.innerHTML = h;
    Icons.render(box);
  }

  function renderLatest() {
    var box = document.getElementById("news-latest");
    if (!box) return;
    box.innerHTML = getNews().slice(0, 3).map(function (n) { return cardHTML(n, false); }).join("");
    Icons.render(box);
  }

  function modalHTML(n) {
    return '<div class="modal__art"><img src="assets/images/' + n.cover + '.svg" alt="" width="640" height="400"></div>' +
      '<div class="news-meta"><span class="cat">' + esc(I18n.t("newscat." + n.category)) + '</span><span class="when"><i data-icon="calendar"></i><time datetime="' + n.date + '">' + esc(I18n.formatDate(n.date)) + "</time></span>" + (n.demo ? '<span class="badge badge--demo">' + esc(I18n.t("common.demo")) + "</span>" : "") + "</div>" +
      '<h2 id="news-modal-title" style="margin-top:14px;font-size:clamp(1.5rem,3vw,2.1rem)">' + esc(I18n.loc(n.title)) + "</h2>" +
      '<div class="article-body">' + I18n.loc(n.body).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>";
  }

  function open(id) {
    var n = byId(id); if (!n) return;
    if (!modal) modal = Modal.create("news-modal");
    openId = id;
    modal.open(modalHTML(n), "news-modal-title");
  }

  function init() {
    renderFilters(); renderList(false); renderLatest();
    var filters = document.getElementById("news-filters");
    if (filters) filters.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]"); if (!b) return;
      cat = b.getAttribute("data-filter"); page = 1; renderFilters(); renderList(true);
    });
    var pag = document.getElementById("news-pagination");
    if (pag) pag.addEventListener("click", function (e) {
      var b = e.target.closest("[data-page]"); if (!b || b.disabled) return;
      page = parseInt(b.getAttribute("data-page"), 10) || 1; renderList(true);
      var top = document.getElementById("news-section"); if (top) top.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    ["news-section", "news-latest"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("click", function (e) { var b = e.target.closest("[data-open]"); if (b) open(b.getAttribute("data-open")); });
    });
    document.addEventListener("langchange", function () {
      renderFilters(); renderList(false); renderLatest();
      if (modal && modal.isOpen() && byId(openId)) modal.open(modalHTML(byId(openId)), "news-modal-title");
    });
  }
  window.ITP.register(init);
})();
