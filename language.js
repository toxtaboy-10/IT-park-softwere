/* ==========================================================
   IT PARK SOFTWARE — language.js (central i18n engine)
   - t(key)        : translate a key
   - loc(obj)      : pick current language from {uz, ru, en}
   - apply(root)   : translate [data-i18n*] attributes
   Language is saved in localStorage and shared between pages.
   ========================================================== */
(function () {
  "use strict";
  var STORE_KEY = "itpark_lang";
  var LANGS = ["uz", "ru", "en"];
  var DICT = window.ITP_I18N || {};
  var current = "uz";

  function read() {
    try { var v = localStorage.getItem(STORE_KEY); if (LANGS.indexOf(v) > -1) return v; } catch (e) { /* storage blocked */ }
    return "uz";
  }
  function save(l) { try { localStorage.setItem(STORE_KEY, l); } catch (e) { /* ignore */ } }

  function t(key) {
    var d = DICT[current] || {};
    if (key in d) return d[key];
    return (DICT.uz && DICT.uz[key]) || key;
  }
  function loc(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[current] != null ? obj[current] : obj.uz;
  }
  var MONTHS = {
    uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
    ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  };
  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return iso;
    var day = parseInt(m[3], 10), month = MONTHS[current][parseInt(m[2], 10) - 1], year = m[1];
    return current === "en" ? month + " " + day + ", " + year : day + " " + month + " " + year;
  }

  function apply(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    ["placeholder", "aria-label", "title", "alt"].forEach(function (attr) {
      root.querySelectorAll("[data-i18n-" + attr + "]").forEach(function (el) { el.setAttribute(attr, t(el.getAttribute("data-i18n-" + attr))); });
    });
  }

  function applyMeta() {
    var page = document.body.getAttribute("data-page") || "home";
    var title = t("meta." + page + ".title"), desc = t("meta." + page + ".desc");
    document.title = title;
    var set = function (sel, val) { var m = document.querySelector(sel); if (m) m.setAttribute("content", val); };
    set('meta[name="description"]', desc);
    set('meta[property="og:title"]', title);
    set('meta[property="og:description"]', desc);
    set('meta[name="twitter:title"]', title);
    set('meta[name="twitter:description"]', desc);
  }

  function setLang(l, silent) {
    if (LANGS.indexOf(l) < 0) l = "uz";
    current = l;
    save(l);
    document.documentElement.lang = l;
    apply(document);
    applyMeta();
    if (!silent) document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: l } }));
  }

  window.I18n = {
    langs: LANGS,
    get lang() { return current; },
    t: t, loc: loc, apply: apply, setLang: setLang, formatDate: formatDate,
    init: function () { current = read(); document.documentElement.lang = current; }
  };
  window.I18n.init();
})();
