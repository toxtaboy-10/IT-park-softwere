/* ==========================================================
   IT PARK SOFTWARE — components.js
   One shared Header and Footer rendered on every page.
   ========================================================== */
(function () {
  "use strict";
  var CFG = window.ITP_CONFIG || {};
  var PAGES = [
    { id: "home", href: "index.html", key: "nav.home" },
    { id: "about", href: "about.html", key: "nav.about" },
    { id: "services", href: "services.html", key: "nav.services" },
    { id: "projects", href: "projects.html", key: "nav.projects" },
    { id: "news", href: "news.html", key: "nav.news" },
    { id: "team", href: "team.html", key: "nav.team" },
    { id: "contact", href: "contact.html", key: "nav.contact" }
  ];

  function isReal(url) { return !!url && url.indexOf("YOUR_USERNAME") < 0; }

  function header(page) {
    var links = PAGES.map(function (p) {
      return '<a class="nav__link" href="' + p.href + '"' + (p.id === page ? ' aria-current="page"' : "") + ' data-i18n="' + p.key + '"></a>';
    }).join("");
    return '' +
      '<header class="site-header" id="siteHeader"><div class="container site-header__inner">' +
      '<a class="logo" href="index.html" aria-label="IT PARK SOFTWARE"><img src="assets/images/logo-mark.svg" alt="" width="42" height="42"><span class="logo__text"><strong>IT PARK</strong><span>SOFTWARE</span></span></a>' +
      '<nav class="nav" id="siteNav" data-i18n-aria-label="nav.main" aria-label="">' + links +
      '<a class="btn btn--primary nav__cta" href="contact.html"><span data-i18n="nav.cta"></span><i data-icon="arrowRight"></i></a></nav>' +
      '<div class="header-actions">' +
      '<div class="lang" id="lang"><button class="lang__btn" id="langBtn" type="button" aria-haspopup="true" aria-expanded="false" data-i18n-aria-label="lang.label" aria-label=""><i data-icon="globe"></i><span id="langCode">UZ</span><i data-icon="chevronDown" data-size="16"></i></button>' +
      '<div class="lang__menu" id="langMenu" role="menu">' +
      I18n.langs.map(function (l) { return '<button class="lang__item" type="button" role="menuitemradio" aria-checked="false" data-lang="' + l + '"><span data-i18n="lang.' + l + '"></span><i data-icon="check"></i></button>'; }).join("") +
      '</div></div>' +
      '<a class="btn btn--primary btn--sm" href="contact.html"><span data-i18n="nav.cta"></span><i data-icon="arrowRight"></i></a>' +
      '<button class="menu-toggle" id="menuToggle" type="button" aria-controls="siteNav" aria-expanded="false" data-i18n-aria-label="nav.menu" aria-label=""><i data-icon="menu"></i></button>' +
      '</div></div></header>';
  }

  function social(name, icon, url) {
    return isReal(url)
      ? '<a class="social" href="' + url + '" target="_blank" rel="noopener noreferrer" aria-label="' + name + '"><i data-icon="' + icon + '"></i></a>'
      : '<span class="social is-off" aria-hidden="true"><i data-icon="' + icon + '"></i></span>';
  }

  function line(icon, value, placeholderKey, href) {
    if (value) {
      var inner = href ? '<a href="' + href + '">' + value + "</a>" : "<span>" + value + "</span>";
      return '<li class="footer__line"><i data-icon="' + icon + '"></i>' + inner + "</li>";
    }
    return '<li class="footer__line is-placeholder"><i data-icon="' + icon + '"></i><span data-i18n="' + placeholderKey + '"></span></li>';
  }

  function footer() {
    var c = CFG.contacts || {}, s = CFG.socials || {};
    var nav = PAGES.map(function (p) { return '<li><a href="' + p.href + '" data-i18n="' + p.key + '"></a></li>'; }).join("");
    var services = (window.ITP_SERVICES || []).slice(0, 6).map(function (sv) {
      return '<li><a href="services.html?open=' + sv.id + '" data-service-name="' + sv.id + '">' + sv.name.uz + "</a></li>";
    }).join("");
    return '' +
      '<footer class="site-footer"><div class="container"><div class="footer__grid">' +
      '<div class="footer__about"><a class="logo" href="index.html" aria-label="IT PARK SOFTWARE"><img src="assets/images/logo-mark.svg" alt="" width="42" height="42"><span class="logo__text"><strong>IT PARK</strong><span>SOFTWARE</span></span></a>' +
      '<p data-i18n="footer.about"></p><div class="socials">' +
      social("Telegram", "send", s.telegram || CFG.telegramUrl) + social("Instagram", "instagram", s.instagram) + social("LinkedIn", "linkedin", s.linkedin) + social("GitHub", "github", s.github) +
      '</div></div>' +
      '<div class="footer__col"><h3 data-i18n="footer.links"></h3><ul>' + nav + '</ul></div>' +
      '<div class="footer__col"><h3 data-i18n="footer.services"></h3><ul>' + services + '</ul></div>' +
      '<div class="footer__col"><h3 data-i18n="footer.contact"></h3><ul>' +
      line("phone", c.phone, "footer.placeholder.phone", c.phone ? "tel:" + c.phone.replace(/[^\d+]/g, "") : "") +
      line("mail", c.email, "footer.placeholder.email", c.email ? "mailto:" + c.email : "") +
      line("mapPin", c.address, "footer.placeholder.address", "") +
      '</ul></div></div>' +
      '<div class="footer__bottom"><span>© <span id="year"></span> IT PARK SOFTWARE. <span data-i18n="footer.rights"></span></span><span>Software Development &amp; IT Solutions</span></div></div></footer>';
  }

  function mount() {
    var page = document.body.getAttribute("data-page") || "home";
    var h = document.getElementById("site-header"), f = document.getElementById("site-footer");
    if (h) h.innerHTML = header(page);
    if (f) f.innerHTML = footer();
    var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
  }

  /* Footer service names follow the language */
  function localizeFooterServices() {
    document.querySelectorAll("[data-service-name]").forEach(function (a) {
      var sv = (window.ITP_SERVICES || []).filter(function (s) { return s.id === a.getAttribute("data-service-name"); })[0];
      if (sv) a.textContent = I18n.loc(sv.name);
    });
  }
  document.addEventListener("langchange", localizeFooterServices);

  window.Components = { mount: mount, localizeFooterServices: localizeFooterServices, isReal: isReal };
})();
