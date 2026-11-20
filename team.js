/* ==========================================================
   IT PARK SOFTWARE — team.js
   Team cards. Entries in team-data.js are PLACEHOLDERS (no invented people).
   Fill name / photo / socials in js/data/team-data.js to show real staff.
   ========================================================== */
(function () {
  "use strict";
  var esc = window.ITP.esc;
  var DATA = window.ITP_TEAM || [];

  function socialIcon(name, icon, url) {
    return url ? '<a class="social" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + name + '"><i data-icon="' + icon + '"></i></a>'
      : '<span class="social is-off" title="' + esc(I18n.t("team.socialOff")) + '"><i data-icon="' + icon + '"></i></span>';
  }

  function cardHTML(m) {
    var s = m.socials || {};
    var name = m.name ? "<h3>" + esc(m.name) + "</h3>" : '<h3 style="color:var(--gray-dim);font-weight:600">' + esc(I18n.t("team.namePlaceholder")) + "</h3>";
    return '<article class="card team-card"><div class="team-card__photo"><img src="' + esc(m.photo || "assets/images/avatar-placeholder.svg") + '" alt="" width="400" height="400" loading="lazy"></div>' +
      name + '<p class="role">' + esc(I18n.t(m.role)) + '</p><p class="spec">' + esc(I18n.t(m.spec)) + "</p>" +
      '<div class="socials">' + socialIcon("Telegram", "send", s.telegram) + socialIcon("LinkedIn", "linkedin", s.linkedin) + socialIcon("GitHub", "github", s.github) + "</div></article>";
  }

  function render() {
    document.querySelectorAll("[data-team-grid]").forEach(function (box) {
      var limit = parseInt(box.getAttribute("data-limit"), 10) || DATA.length;
      box.innerHTML = DATA.slice(0, limit).map(cardHTML).join("");
      Icons.render(box);
    });
  }
  function init() { render(); document.addEventListener("langchange", render); }
  window.ITP.register(init);
})();
