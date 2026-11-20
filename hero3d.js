/* ==========================================================
   IT PARK SOFTWARE — hero3d.js
   Three.js hero scene: a glowing network core with orbit rings and floating blocks.
   Falls back to the static SVG artwork if Three.js / WebGL are unavailable.
   ========================================================== */
(function () {
  "use strict";
  function init() {
    var wrap = document.getElementById("hero-visual");
    if (!wrap || !window.THREE) return;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var mobile = window.matchMedia && window.matchMedia("(max-width: 720px)").matches;
    var THREE = window.THREE;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !mobile, powerPreference: "high-performance" }); }
    catch (e) { return; }
    wrap.insertBefore(canvas, wrap.firstChild);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 9);
    var GREEN = 0x39ff14, GREEN2 = 0x00d084, BLUE = 0x087fff;
    var root = new THREE.Group();
    scene.add(root);

    /* Core */
    var coreGeo = new THREE.IcosahedronGeometry(1.7, 1);
    var core = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0x04140b, transparent: true, opacity: 0.88 }));
    var wire = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0.85 }));
    var nodes = new THREE.Points(coreGeo, new THREE.PointsMaterial({ color: 0xbaff9e, size: 0.09, sizeAttenuation: true }));
    var shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.35, 2), new THREE.MeshBasicMaterial({ color: BLUE, wireframe: true, transparent: true, opacity: 0.14 }));
    var inner = new THREE.Group();
    inner.add(core, wire, nodes, shell);
    root.add(inner);

    /* Orbit rings with travelling beads */
    function ring(radius, color, tiltX, tiltZ) {
      var g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 8, 200), new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.7 })));
      var bead = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), new THREE.MeshBasicMaterial({ color: color }));
      g.add(bead);
      g.rotation.x = tiltX; g.rotation.z = tiltZ;
      g.userData = { bead: bead, radius: radius, speed: 0.6 + Math.random() * 0.5, angle: Math.random() * 6.28 };
      root.add(g);
      return g;
    }
    var rings = [ring(3.1, GREEN, 1.15, 0.2), ring(3.7, BLUE, 0.55, -0.5), ring(2.75, GREEN2, 1.5, 0.9)];

    /* Floating blocks (edges only) */
    var blocks = [];
    var blockCount = mobile ? 5 : 9;
    var boxGeo = new THREE.BoxGeometry(1, 1, 1);
    var edgeGeo = new THREE.EdgesGeometry(boxGeo);
    for (var i = 0; i < blockCount; i++) {
      var s = 0.22 + Math.random() * 0.3;
      var m = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: i % 3 === 0 ? BLUE : GREEN, transparent: true, opacity: 0.85 }));
      m.scale.setScalar(s);
      var a = (i / blockCount) * Math.PI * 2, r = 3.4 + Math.random() * 1.2;
      m.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 4, Math.sin(a) * r * 0.5);
      m.userData = { base: m.position.y, phase: Math.random() * 6.28, spin: (Math.random() - 0.5) * 0.02 };
      root.add(m); blocks.push(m);
    }

    /* Dust */
    var count = mobile ? 120 : 260, pos = new Float32Array(count * 3);
    for (var p = 0; p < count; p++) {
      var rr = 3 + Math.random() * 3.2, th = Math.random() * 6.28, ph = Math.acos(2 * Math.random() - 1);
      pos[p * 3] = rr * Math.sin(ph) * Math.cos(th); pos[p * 3 + 1] = rr * Math.sin(ph) * Math.sin(th); pos[p * 3 + 2] = rr * Math.cos(ph);
    }
    var dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: GREEN, size: 0.03, transparent: true, opacity: 0.7 }));
    root.add(dust);

    /* Sizing */
    function resize() {
      var w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(wrap); else window.addEventListener("resize", resize);

    /* Pointer parallax */
    var target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    if (!mobile) {
      window.addEventListener("pointermove", function (e) {
        target.x = (e.clientX / window.innerWidth - 0.5) * 0.7;
        target.y = (e.clientY / window.innerHeight - 0.5) * 0.45;
      }, { passive: true });
    }

    /* Loop (paused when hidden / off-screen) */
    var running = false, visible = true, raf = 0, t0 = performance.now(), shown = false;
    function frame(now) {
      raf = 0;
      if (!running) return;
      var t = (now - t0) / 1000;
      cur.x += (target.x - cur.x) * 0.05; cur.y += (target.y - cur.y) * 0.05;
      root.rotation.y = cur.x + t * 0.05; root.rotation.x = cur.y;
      inner.rotation.y = t * 0.25; inner.rotation.x = Math.sin(t * 0.3) * 0.15;
      shell.rotation.y = -t * 0.12;
      rings.forEach(function (g) {
        var d = g.userData; d.angle += 0.01 * d.speed;
        d.bead.position.set(Math.cos(d.angle) * d.radius, Math.sin(d.angle) * d.radius, 0);
      });
      blocks.forEach(function (b) {
        b.rotation.x += b.userData.spin; b.rotation.y += b.userData.spin * 1.3;
        b.position.y = b.userData.base + Math.sin(t * 0.8 + b.userData.phase) * 0.25;
      });
      dust.rotation.y = t * 0.02;
      renderer.render(scene, camera);
      if (!shown) { shown = true; wrap.classList.add("is-3d"); }
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      var should = visible && !document.hidden && !reduced;
      if (should && !running) { running = true; raf = requestAnimationFrame(frame); }
      else if (!should) { running = false; }
    }
    if (reduced) { renderer.render(scene, camera); wrap.classList.add("is-3d"); return; }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; sync(); }).observe(wrap);
    document.addEventListener("visibilitychange", sync);
    sync();
  }
  window.ITP.register(init);
})();
