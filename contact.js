/* ==========================================================
   IT PARK SOFTWARE — contact.js
   Shared form validation + submit flow (order form in the service modal,
   contact form on contact.html) and contact-page info blocks.
   Backend-ready: set ITP_CONFIG.api.orderEndpoint / contactEndpoint.
   Without a backend NO fake "sent" message is shown.
   ========================================================== */
(function () {
  "use strict";
  var CFG = window.ITP_CONFIG || {};
  var esc = window.ITP.esc;

  /* ---------- Validation rules ---------- */
  var RULES = {
    name: function (v) { return v.trim().length >= 2; },
    phone: function (v) { var d = v.replace(/\D/g, ""); return /^[+\d\s()\-]+$/.test(v.trim()) && d.length >= 9 && d.length <= 15; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    subject: function (v) { return v.trim().length >= 3; },
    message: function (v) { return v.trim().length >= 10; },
    details: function (v) { return v.trim().length >= 10; },
    service: function (v) { return !!v; }
  };

  function errEl(input) { return input.closest(".field").querySelector(".field__error"); }

  function checkField(input) {
    var rule = input.getAttribute("data-rule");
    var ok = RULES[rule] ? RULES[rule](input.value || "") : true;
    var box = errEl(input);
    input.setAttribute("aria-invalid", ok ? "false" : "true");
    if (box) {
      box.classList.toggle("is-visible", !ok);
      if (!ok) { box.setAttribute("data-i18n", "err." + rule); box.textContent = I18n.t("err." + rule); }
      else { box.removeAttribute("data-i18n"); box.textContent = ""; }
    }
    return ok;
  }

  function validate(form) {
    var first = null, all = true;
    form.querySelectorAll("[data-rule]").forEach(function (inp) {
      if (!checkField(inp)) { all = false; if (!first) first = inp; }
    });
    if (first) first.focus();
    return all;
  }

  function collect(form) {
    var data = {};
    form.querySelectorAll("[data-rule]").forEach(function (i) { data[i.name] = i.value.trim(); });
    return data;
  }

  /* ---------- Status area ---------- */
  function setStatus(form, kind, key, withTelegram, tgText) {
    var box = form.querySelector(".form__status");
    if (!box) return;
    box.className = "form__status form__status--" + kind + " is-visible";
    var icon = kind === "ok" ? "check" : kind === "error" ? "alert" : "info";
    box.innerHTML = '<i data-icon="' + icon + '"></i><div><span data-i18n="' + key + '"></span>' +
      (withTelegram ? '<div class="form__actions" style="margin-top:12px"><button type="button" class="btn btn--telegram btn--sm" data-tg-send><i data-icon="send"></i><span data-i18n="form.sendTelegram"></span></button></div>' : "") + "</div>";
    Icons.render(box); I18n.apply(box);
    if (withTelegram) {
      box.querySelector("[data-tg-send]").addEventListener("click", function () {
        var done = function () { setStatus(form, "info", "form.copied", true, tgText); };
        var open = function () { window.open(CFG.telegramUrl, "_blank", "noopener"); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(tgText).then(function () { done(); open(); }, function () { open(); });
        else open();
      });
    }
  }

  function telegramText(type, data) {
    var lines = [type === "order" ? "IT PARK SOFTWARE — " + I18n.t("modal.orderTitle") : "IT PARK SOFTWARE — " + I18n.t("contact.form.title")];
    Object.keys(data).forEach(function (k) { lines.push(k + ": " + data[k]); });
    return lines.join("\n");
  }

  function submit(form, type) {
    if (!validate(form)) return;
    var data = collect(form);
    var endpoint = (CFG.api || {})[type === "order" ? "orderEndpoint" : "contactEndpoint"];
    if (!endpoint) { setStatus(form, "info", "form.noBackend", true, telegramText(type, data)); return; }
    var btn = form.querySelector('[type="submit"]');
    var label = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span><span>' + esc(I18n.t("form.sending")) + "</span>";
    fetch(endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: type, lang: I18n.lang, fields: data, page: location.href, createdAt: new Date().toISOString() })
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      setStatus(form, "ok", "form.ok", false); form.reset();
    }).catch(function () {
      setStatus(form, "error", "form.error", true, telegramText(type, data));
    }).then(function () { btn.disabled = false; btn.innerHTML = label; Icons.render(btn); });
  }

  function bind(form, type) {
    form.setAttribute("novalidate", "novalidate");
    form.addEventListener("submit", function (e) { e.preventDefault(); submit(form, type); });
    form.querySelectorAll("[data-rule]").forEach(function (inp) {
      inp.addEventListener("blur", function () { if (inp.value || inp.getAttribute("aria-invalid") === "true") checkField(inp); });
      inp.addEventListener("input", function () { if (inp.getAttribute("aria-invalid") === "true") checkField(inp); });
    });
  }

  /* ---------- Order form markup (used inside the service modal) ---------- */
  function field(id, labelKey, control, rule) {
    return '<div class="field"><label for="' + id + '"><span data-i18n="' + labelKey + '"></span><span class="req" aria-hidden="true">*</span></label>' + control +
      '<div class="field__error" id="' + id + '-err" aria-live="polite"></div></div>';
  }
  function orderFormHTML(selectedId, values) {
    values = values || {};
    var opts = '<option value="" data-i18n="order.service"></option>' + (window.ITP_SERVICES || []).map(function (s) {
      return '<option value="' + s.id + '"' + (s.id === selectedId ? " selected" : "") + ">" + esc(I18n.loc(s.name)) + "</option>";
    }).join("");
    var v = function (k) { return esc(values[k] || ""); };
    return '<form class="form" id="order-form" novalidate>' +
      '<div class="form__row">' +
      field("of-name", "order.name", '<input class="input" id="of-name" name="name" data-rule="name" autocomplete="name" data-i18n-placeholder="order.namePh" value="' + v("name") + '" aria-describedby="of-name-err">') +
      field("of-phone", "order.phone", '<input class="input" id="of-phone" name="phone" type="tel" data-rule="phone" autocomplete="tel" inputmode="tel" data-i18n-placeholder="order.phonePh" value="' + v("phone") + '" aria-describedby="of-phone-err">') +
      "</div><div class=\"form__row\">" +
      field("of-email", "order.email", '<input class="input" id="of-email" name="email" type="email" data-rule="email" autocomplete="email" data-i18n-placeholder="order.emailPh" value="' + v("email") + '" aria-describedby="of-email-err">') +
      field("of-service", "order.service", '<select class="input" id="of-service" name="service" data-rule="service" aria-describedby="of-service-err">' + opts + "</select>") +
      "</div>" +
      field("of-details", "order.details", '<textarea class="input" id="of-details" name="details" data-rule="details" data-i18n-placeholder="order.detailsPh" aria-describedby="of-details-err">' + v("details") + "</textarea>") +
      '<div class="form__status" role="status" aria-live="polite"></div>' +
      '<div class="form__actions"><button class="btn btn--primary" type="submit"><span data-i18n="order.submit"></span><i data-icon="arrowRight"></i></button>' +
      '<a class="btn btn--telegram" href="' + esc(CFG.telegramUrl) + '" target="_blank" rel="noopener noreferrer"><i data-icon="send"></i><span data-i18n="common.telegram"></span></a></div></form>';
  }

  window.Forms = { validate: validate, bind: bind, orderFormHTML: orderFormHTML, collect: collect };

  /* ---------- Contact page ---------- */
  function fillContacts() {
    var c = CFG.contacts || {}, s = CFG.socials || {};
    var real = Components.isReal;
    var tg = real(s.telegram) ? s.telegram : (real(CFG.telegramUrl) ? CFG.telegramUrl : "");
    var map = {
      phone: { value: c.phone, href: c.phone ? "tel:" + c.phone.replace(/[^\d+]/g, "") : "" },
      email: { value: c.email, href: c.email ? "mailto:" + c.email : "" },
      address: { value: c.address, href: "" },
      telegram: { value: tg ? tg.replace(/^https?:\/\//, "") : "", href: tg },
      instagram: { value: real(s.instagram) ? s.instagram.replace(/^https?:\/\//, "") : "", href: real(s.instagram) ? s.instagram : "" }
    };
    document.querySelectorAll("[data-contact]").forEach(function (item) {
      var k = item.getAttribute("data-contact"), m = map[k]; if (!m) return;
      var val = item.querySelector("strong");
      if (m.value) {
        val.removeAttribute("data-i18n"); val.textContent = m.value; val.classList.remove("is-placeholder");
        if (m.href) { item.setAttribute("href", m.href); if (/^https?:/.test(m.href)) { item.setAttribute("target", "_blank"); item.setAttribute("rel", "noopener noreferrer"); } }
      } else {
        val.setAttribute("data-i18n", "contact.ph." + k); val.classList.add("is-placeholder"); item.removeAttribute("href");
      }
    });
    var box = document.getElementById("map-box");
    if (box && c.mapEmbedUrl) {
      box.innerHTML = '<iframe title="Google Maps" src="' + esc(c.mapEmbedUrl) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
    }
    var soc = document.getElementById("contact-socials");
    if (soc) {
      var item = function (n, icon, url) { return real(url) ? '<a class="social" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" aria-label="' + n + '"><i data-icon="' + icon + '"></i></a>' : '<span class="social is-off" aria-hidden="true"><i data-icon="' + icon + '"></i></span>'; };
      soc.innerHTML = item("Telegram", "send", s.telegram || CFG.telegramUrl) + item("Instagram", "instagram", s.instagram) + item("LinkedIn", "linkedin", s.linkedin) + item("GitHub", "github", s.github);
    }
  }

  function init() {
    var form = document.getElementById("contact-form");
    if (form) { bind(form, "contact"); fillContacts(); }
  }
  window.ITP.register(init);
})();
