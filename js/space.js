/* =========================================================
   MEHR STORY — 공통 우주 배경
   · 블랙 위의 골드·실버 성운 + 3겹 별(깊이감) + 가끔 별똥별
   · 별들이 마우스를 따라 부드럽게 움직임 (가까운 별일수록 크게)
   · 터치 기기: 은은하게 떠다니고 손가락을 따라감 / 모션 감소: 정지 화면
   · 화면 밖이거나 탭이 숨겨지면 멈춤
   ========================================================= */
(function () {
  "use strict";
  const cv = document.getElementById("heroSpace");
  if (!cv || !cv.getContext) return;
  const hero = cv.closest(".hero") || cv.parentElement;
  const ctx = cv.getContext("2d");
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);

  // 깊이별 이동량(px) — 가까운 층일수록 많이 움직임
  const SHIFT_X = 32, SHIFT_Y = 22, M = 26; // M: 가장자리 여유
  const LAYERS = [
    { depth: 0.18, per: 1700, r: [0.35, 0.9], a: [0.35, 0.8] },
    { depth: 0.5, per: 5200, r: [0.6, 1.4], a: [0.5, 0.95] },
    { depth: 1.0, per: 17000, r: [1.1, 2.2], a: [0.7, 1], glow: true },
  ];
  const COLORS = ["#E9EBEE", "#C5C8CE", "#E9EBEE", "#FFF8E6", "#F5D88B"];
  const rootStyle = document.documentElement.style;
  let pageFrame = 0;

  let W = 0, H = 0, DPR = 1, FW = 0, FH = 0, layers = [], nebula = null, sprite = null;
  let tx = 0, ty = 0, cx = 0, cy = 0, mxp = -9999, myp = -9999, hasPointer = false;
  let running = false, visible = true, inView = true, raf = 0, last = 0;
  const shooters = []; let nextShoot = 0;

  function makeSprite() {
    const s = document.createElement("canvas"), n = 64; s.width = s.height = n;
    const g = s.getContext("2d"), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.12, "rgba(255,248,230,.8)");
    gr.addColorStop(0.35, "rgba(197,200,206,.20)"); gr.addColorStop(1, "rgba(197,200,206,0)");
    g.fillStyle = gr; g.fillRect(0, 0, n, n);
    // 가는 십자 빛
    g.globalCompositeOperation = "lighter"; g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1;
    g.beginPath(); g.moveTo(n / 2, 6); g.lineTo(n / 2, n - 6); g.moveTo(6, n / 2); g.lineTo(n - 6, n / 2); g.stroke();
    return s;
  }

  // 성운 텍스처는 크기 변경 시 한 번만 그려 둠
  function makeNebula() {
    const sc = 0.5, w = Math.ceil(FW * sc), h = Math.ceil(FH * sc);
    const n = document.createElement("canvas"); n.width = w; n.height = h;
    const g = n.getContext("2d");
    const base = g.createLinearGradient(0, 0, w * 0.3, h);
    base.addColorStop(0, "#050505"); base.addColorStop(0.46, "#0A0A0D"); base.addColorStop(1, "#050505");
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = "lighter";
    const blob = (x, y, r, c, a) => {
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(0.5, `rgba(${c},${a * 0.4})`); gr.addColorStop(1, `rgba(${c},0)`);
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    };
    const pal = ["54,48,38", "73,58,35", "61,61,63", "30,34,43", "31,27,32", "88,68,40"];
    // 대각선 은하수 띠를 따라 성운 덩어리 배치
    const bx0 = -0.1, by0 = 0.15, bx1 = 1.1, by1 = 0.75;
    for (let i = 0; i < 60; i++) {
      const t = Math.random(), off = (Math.random() - 0.5) * 0.45;
      const x = (bx0 + (bx1 - bx0) * t) * w - off * h * 0.5, y = (by0 + (by1 - by0) * t) * h + off * h;
      blob(x, y, rand(0.08, 0.3) * Math.max(w, h), pal[(Math.random() * pal.length) | 0], rand(0.038, 0.083));
    }
    for (let i = 0; i < 14; i++) blob(Math.random() * w, Math.random() * h, rand(0.1, 0.25) * Math.max(w, h), pal[(Math.random() * pal.length) | 0], rand(0.018, 0.039));
    // 은하 중심의 밝은 빛
    for (let i = 0; i < 9; i++) {
      const t = rand(0.3, 0.75);
      blob((bx0 + (bx1 - bx0) * t) * w, (by0 + (by1 - by0) * t) * h + rand(-0.04, 0.04) * h, rand(0.038, 0.083) * Math.max(w, h), "193,170,124", rand(0.03, 0.058));
    }
    // 아주 촘촘한 미세 별(띠 근처에 더 많이)
    const dots = Math.round(w * h / 90);
    for (let i = 0; i < dots; i++) {
      let x, y;
      if (Math.random() < 0.6) { const t = Math.random(), off = (Math.random() + Math.random() + Math.random() - 1.5) * 0.18; x = (bx0 + (bx1 - bx0) * t) * w - off * h * 0.5; y = (by0 + (by1 - by0) * t) * h + off * h; }
      else { x = Math.random() * w; y = Math.random() * h; }
      g.fillStyle = `rgba(${Math.random() < 0.3 ? "245,216,139" : "233,235,238"},${rand(0.065, 0.32)})`;
      g.fillRect(x, y, Math.random() < 0.85 ? 0.6 : 1.1, Math.random() < 0.85 ? 0.6 : 1.1);
    }
    g.globalCompositeOperation = "source-over";
    return n;
  }

  function resize() {
    const r = hero.getBoundingClientRect();
    const nW = Math.max(1, Math.round(r.width)), nH = Math.max(1, Math.round(r.height));
    // 모바일 주소창 때문에 높이만 조금 바뀌는 경우는 다시 만들지 않음 (깜빡임 방지)
    if (nebula && nW === W && Math.abs(nH - H) < 160) return;
    W = nW; H = nH;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    FW = W + M * 2; FH = H + M * 2;
    const small = W < 700, area = FW * FH;
    layers = LAYERS.map((L) => ({
      ...L,
      stars: Array.from({ length: Math.round(area / L.per * (small ? 0.75 : 1)) }, () => ({
        x: Math.random() * FW, y: Math.random() * FH, r: rand(L.r[0], L.r[1]), a: rand(L.a[0], L.a[1]),
        p: Math.random() * TAU, s: rand(0.6, 2.2), c: COLORS[(Math.random() * COLORS.length) | 0],
      })),
    }));
    nebula = makeNebula();
    if (!sprite) sprite = makeSprite();
    if (!running) draw(performance.now(), true);
  }

  function spawnShooter(now) {
    const fromLeft = Math.random() < 0.5, ang = (fromLeft ? rand(18, 35) : rand(145, 162)) * Math.PI / 180;
    shooters.push({ x: fromLeft ? rand(0, W * 0.5) : rand(W * 0.5, W), y: rand(0, H * 0.35), vx: Math.cos(ang), vy: Math.sin(ang),
      sp: rand(0.7, 1.2), len: rand(120, 240), born: now, life: rand(900, 1400) });
    nextShoot = now + rand(10000, 19000);
  }

  function draw(now, still) {
    const dt = Math.min(64, now - last || 16); last = now;
    if (!still) {
      if (!hasPointer || !FINE) {
        // 터치 기기 또는 마우스 없음: 천천히 떠다니는 움직임(손가락 위치가 있으면 그쪽으로)
        const dx = Math.sin(now * 0.00011) * 0.35, dy = Math.cos(now * 0.00008) * 0.3;
        if (!hasPointer) { tx = dx; ty = dy; }
      }
      const k = 1 - Math.pow(0.965, dt / 16); // 부드러운 감속
      cx += (tx - cx) * k; cy += (ty - cy) * k;
    }
    ctx.clearRect(0, 0, W, H);
    // 성운 (가장 먼 층)
    if (nebula) ctx.drawImage(nebula, -M + cx * SHIFT_X * 0.22, -M + cy * SHIFT_Y * 0.22, FW, FH);
    // 별 3층
    for (const L of layers) {
      const ox = cx * SHIFT_X * L.depth, oy = cy * SHIFT_Y * L.depth;
      for (const s of L.stars) {
        let x = ((s.x + ox) % FW + FW) % FW - M, y = ((s.y + oy) % FH + FH) % FH - M;
        if (x < -4 || y < -4 || x > W + 4 || y > H + 4) continue;
        let tw = still ? 0.8 : 0.55 + 0.45 * Math.sin(now * 0.001 * s.s + s.p);
        if (hasPointer && L.depth > 0.4) { const d = Math.hypot(x - mxp, y - myp); if (d < 140) tw = Math.min(1.25, tw + (1 - d / 140) * 0.22); }
        const a = Math.min(1, s.a * tw);
        if (L.glow) {
          const sz = s.r * 9 * (0.8 + tw * 0.3);
          ctx.globalAlpha = a; ctx.drawImage(sprite, x - sz / 2, y - sz / 2, sz, sz);
        } else {
          ctx.globalAlpha = a; ctx.fillStyle = s.c;
          if (s.r < 0.8) ctx.fillRect(x, y, s.r * 1.4, s.r * 1.4);
          else { ctx.beginPath(); ctx.arc(x, y, s.r, 0, TAU); ctx.fill(); }
        }
      }
    }
    ctx.globalAlpha = 1;
    // 별똥별
    if (!still) {
      if (!nextShoot) nextShoot = now + rand(6500, 11500);
      if (now > nextShoot) spawnShooter(now);
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i], t = (now - s.born) / s.life;
        if (t >= 1) { shooters.splice(i, 1); continue; }
        const dist = (now - s.born) * s.sp, hx = s.x + s.vx * dist, hy = s.y + s.vy * dist;
        const fade = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        const g = ctx.createLinearGradient(hx, hy, hx - s.vx * s.len, hy - s.vy * s.len);
        g.addColorStop(0, `rgba(255,255,255,${0.52 * fade})`); g.addColorStop(0.3, `rgba(245,216,139,${0.23 * fade})`); g.addColorStop(1, "rgba(245,216,139,0)");
        ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - s.vx * s.len, hy - s.vy * s.len); ctx.stroke();
        ctx.globalAlpha = fade * 0.55; ctx.drawImage(sprite, hx - 9, hy - 9, 18, 18); ctx.globalAlpha = 1;
      }
    }
  }

  function loop(now) {
    if (!running) return;
    draw(now, false);
    raf = requestAnimationFrame(loop);
  }
  function update() {
    const should = !REDUCED && visible && inView;
    if (should && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    else if (!should && running) { running = false; cancelAnimationFrame(raf); }
  }

  // 마우스/손가락 위치 → 목표값 (-0.5 ~ 0.5). 별은 마우스 방향으로 따라감
  function updatePageDepth() {
    if (pageFrame) return;
    pageFrame = requestAnimationFrame(() => {
      pageFrame = 0;
      rootStyle.setProperty("--space-x", tx.toFixed(3));
      rootStyle.setProperty("--space-y", ty.toFixed(3));
    });
  }

  function onPointer(e) {
    tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5;
    if (e.pointerType === "mouse" && FINE) updatePageDepth();
    if (!inView) return;
    const r = cv.getBoundingClientRect();
    mxp = e.clientX - r.left; myp = e.clientY - r.top; hasPointer = true;
  }
  if (!REDUCED) {
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.addEventListener("mouseleave", () => { tx = 0; ty = 0; mxp = myp = -9999; updatePageDepth(); });
    if (!FINE) window.addEventListener("touchend", () => { hasPointer = false; mxp = myp = -9999; }, { passive: true });
  }
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; update(); });
  if ("IntersectionObserver" in window) new IntersectionObserver((en) => { inView = en[0].isIntersecting; update(); }).observe(hero);

  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 180); });
  resize(); update();
  window.MEHR_SPACE = { get running() { return running; }, get stars() { return layers.reduce((n, l) => n + l.stars.length, 0); } };
})();
