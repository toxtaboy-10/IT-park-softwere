/* ==========================================================
   IT PARK SOFTWARE — animations.js
   GSAP + ScrollTrigger: fade in, slide up, stagger, text reveal, counters.
   Graceful fallback (IntersectionObserver + CSS) when GSAP is unavailable.
   Heavy effects are reduced on small screens / reduced-motion.
   ========================================================== */
(function () {
  "use strict";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = window.matchMedia && window.matchMedia("(max-width: 720px)").matches;
  var hasGsap = !!window.gsap;
  var hasST = hasGsap && !!window.ScrollTrigger;
  if (hasST) { try { gsap.registerPlugin(ScrollTrigger); } catch (e) { hasST = false; } }

  function fmt(n) { return Math.round(n).toLocaleString("en-US").replace(/,/g, " "); }

  function counter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    if (reduced) { el.textContent = fmt(target); return; }
    el.textContent = "0";
    var run = function () {
      if (hasGsap) {
        var o = { v: 0 };
        gsap.to(o, { v: target, duration: 1.8, ease: "power2.out", onUpdate: function () { el.textContent = fmt(o.v); }, onComplete: function () { el.textContent = fmt(target); } });
      } else {
        var start = null;
        (function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / 1600, 1); el.textContent = fmt(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(performance.now());
      }
    };
    if (hasST) ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: run });
    else if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); run(); } }, { threshold: 0.4 });
      io.observe(el);
    } else el.textContent = fmt(target);
  }

  function gsapReveal(el) {
    var y = small ? 16 : 32;
    gsap.from(el, { y: y, opacity: 0, duration: 0.9, ease: "power3.out", clearProps: "transform,opacity",
      scrollTrigger: hasST ? { trigger: el, start: "top 90%", once: true } : undefined });
  }
  function gsapStagger(box) {
    var kids = Array.prototype.slice.call(box.children);
    if (!kids.length) return;
    gsap.from(kids, { y: small ? 18 : 36, opacity: 0, duration: 0.8, ease: "power3.out", stagger: small ? 0.05 : 0.09, clearProps: "transform,opacity",
      scrollTrigger: hasST ? { trigger: box, start: "top 88%", once: true } : undefined });
  }

  function fallbackObserve(nodes) {
    if (!("IntersectionObserver" in window) || reduced) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    nodes.forEach(function (n) { n.classList.add("reveal-pre"); io.observe(n); });
  }

  function scan(root) {
    root = root || document;
    var reveals = [], staggers = [];
    root.querySelectorAll("[data-reveal]:not([data-anim])").forEach(function (n) { n.setAttribute("data-anim", "1"); reveals.push(n); });
    root.querySelectorAll("[data-stagger]:not([data-anim])").forEach(function (n) { n.setAttribute("data-anim", "1"); staggers.push(n); });
    root.querySelectorAll("[data-count]:not([data-anim])").forEach(function (n) { n.setAttribute("data-anim", "1"); counter(n); });
    if (reduced) return;
    if (hasGsap) {
      reveals.forEach(gsapReveal);
      staggers.forEach(gsapStagger);
    } else {
      var all = reveals.slice();
      staggers.forEach(function (b) { Array.prototype.forEach.call(b.children, function (c) { all.push(c); }); });
      fallbackObserve(all);
    }
  }

  function heroIntro() {
    var title = document.querySelector("[data-hero-title]");
    if (!title || reduced || !hasGsap) return;
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(title, { yPercent: 35, opacity: 0, clipPath: "inset(0 0 100% 0)", duration: 1.1, clearProps: "all" })
      .from("[data-hero-in]", { y: 24, opacity: 0, duration: 0.8, stagger: 0.12, clearProps: "transform,opacity" }, "-=0.6")
      .from("[data-hero-visual]", { scale: 0.92, opacity: 0, duration: 1.2, clearProps: "transform,opacity" }, "-=1.1");
  }

  window.Anim = {
    init: function () { heroIntro(); scan(document); },
    scan: scan,
    /* Animate freshly rendered nodes (e.g. news page change) */
    enter: function (nodes) {
      if (reduced || !hasGsap || !nodes || !nodes.length) return;
      gsap.from(nodes, { y: 22, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.06, clearProps: "transform,opacity" });
    },
    refresh: function () { if (hasST) ScrollTrigger.refresh(); }
  };
})();
