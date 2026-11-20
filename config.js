/* ==========================================================
   IT PARK SOFTWARE — config.js
   Site settings that are safe to edit. Leave a value empty ("")
   when it is not known yet — the UI then shows a neutral placeholder.
   ========================================================== */
window.ITP_CONFIG = {
  siteName: "IT PARK SOFTWARE",

  /* Contact details (shown in footer and on the Contact page) */
  contacts: {
    phone: "",            // e.g. "+998901234567"
    email: "",            // e.g. "info@your-domain.uz"
    address: "",          // e.g. "Toshkent shahri, ..."
    workingHours: "",     // e.g. "Du–Ju 09:00–18:00"
    mapEmbedUrl: ""       // Google Maps "Embed a map" -> src="..." value
  },

  /* Telegram — change the link here and it updates on every page.
     Example: "https://t.me/your_company_username" */
  telegramUrl: "https://t.me/YOUR_USERNAME",

  /* Social networks. Empty value = icon is shown disabled. */
  socials: {
    telegram: "https://t.me/YOUR_USERNAME",
    instagram: "",
    linkedin: "",
    github: ""
  },

  /* Backend (add later). When "orderEndpoint" / "contactEndpoint" are set,
     forms are sent there as JSON via POST. While they are empty, forms are
     validated and the user is offered to send the message via Telegram —
     no fake "sent" message is ever shown. */
  api: {
    orderEndpoint: "",    // e.g. "https://api.your-domain.uz/orders"
    contactEndpoint: "",  // e.g. "https://api.your-domain.uz/contact"
    newsEndpoint: ""      // e.g. "https://api.your-domain.uz/news" (future)
  }
};

/* Tiny module registry: every js module registers an init() function,
   main.js runs them after the DOM and language are ready. */
window.ITP = {
  inits: [],
  register: function (fn) { this.inits.push(fn); },
  esc: function (v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
};
