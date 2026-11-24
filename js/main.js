/* =========================================================
   MEHR STORY — main.js
   콘텐츠는 js/data.js 에서 수정하세요.
   ========================================================= */
(() => {
  "use strict";
  const D = window.MEHR_DATA;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const REDUCED = mqReduce.matches;
  const FINE = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  if (REDUCED) document.body.classList.add("reduced-motion");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PH = (t) => `<span class="placeholder">${t}</span>`;

  /* ---------------- 1. 데이터 렌더링 ---------------- */
  function renderNovels() {
    const wrap = $("#novels");
    wrap.innerHTML = D.novels.map((n, i) => `
      <article class="novel" data-id="${esc(n.id)}" style="--n-main:${n.theme.main};--n-glow:${n.theme.glow};--n-soft:${n.theme.soft}">
        <div class="novel__cover-wrap">
          <div class="novel__halo" aria-hidden="true"></div>
          <button class="novel__cover" type="button" data-open="${esc(n.id)}" aria-label="${esc(n.title)} 상세 보기" style="aspect-ratio:${n.coverRatio}">
            <img src="${esc(n.coverSm)}" srcset="${esc(n.coverSm)} 520w, ${esc(n.cover)} 1000w" sizes="(max-width:900px) 340px, 380px"
                 alt="${esc(n.title)} 표지" loading="lazy" decoding="async" style="aspect-ratio:${n.coverRatio}">
          </button>
        </div>
        <div class="novel__info">
          <span class="novel__num">NOVEL · ${String(i + 1).padStart(2, "0")}</span>
          ${n.banner ? `<div class="novel__banner"><img src="${esc(n.banner)}" alt="" loading="lazy" decoding="async" style="aspect-ratio:${n.bannerRatio || "auto"}"></div>` : ""}
          <h3 class="novel__title">${esc(n.title)}</h3>
          ${n.tagline ? `<p class="novel__tagline">“${esc(n.tagline)}”</p>` : ""}
          <p class="novel__meta">${n.genre ? esc(n.genre) : PH("장르 · 키워드 준비 중")}</p>
          <button class="crystal-btn crystal-btn--sm" type="button" data-open="${esc(n.id)}">
            <span class="crystal-btn__gem"><img src="assets/img/icons/celestial/ui-book.svg" alt="" loading="lazy"></span>
            <span class="crystal-btn__label">Open the Book</span>
          </button>
        </div>
      </article>`).join("");
  }

  function renderProfile() {
    const p = D.profile;
    $("#profileBody").innerHTML = `
      <div class="profile__visual">
        <div class="profile__frame">
          <div class="profile__img"><img src="${esc(p.imageSm)}" srcset="${esc(p.imageSm)} 800w, ${esc(p.image)} 1600w"
               sizes="(max-width:900px) 92vw, 680px" alt="작가 연월 프로필 이미지" loading="lazy" decoding="async"></div>
          <span class="profile__caption">Yeonwol</span>
        </div>
      </div>
      <div class="profile__text">
        <h3 class="profile__name">${esc(p.nameEn)}<span>|</span><b>${esc(p.nameKo)}</b></h3>
        <p class="profile__title">${esc(p.title)}</p>
        ${p.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}
        <div class="edu">
          <h3>Education</h3>
          <ul>${p.education.map((e) => `<li><strong>${esc(e.title)}</strong><span>${esc(e.period)}</span></li>`).join("")}</ul>
        </div>
      </div>`;
  }

  const skillIcon = `<img class="gem" src="assets/img/icons/celestial/ui-spark.svg" alt="" width="46" height="46" loading="lazy">`;

  function renderSkills() {
    $("#creativeList").innerHTML = D.creative.map((c) => `<li>${esc(c)}</li>`).join("");
    $("#techGrid").innerHTML = D.technical.map((t) => `
      <article class="gem-card" data-gem="${esc(t.gem)}"><div class="gem-card__in">
        ${skillIcon}
        <h4>${esc(t.category)}</h4>
        <ul>${t.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      </div></article>`).join("");
  }

  function renderContacts() {
    $("#contactCards").innerHTML = D.contacts.map((c) => {
      const v = (c.value || "").trim();
      let href = "";
      if (v) href = c.type === "gmail" ? `mailto:${v}` : c.type === "instagram" ? `https://www.instagram.com/${v.replace(/^@/, "")}/` : v;
      const shown = v ? (c.type === "instagram" ? "@" + v.replace(/^@/, "") : v) : "연락처 준비 중";
      const inner = `<img src="${esc(c.icon)}" alt="" loading="lazy" decoding="async"><h3>${esc(c.label)}</h3>
        <span class="value">${esc(shown)}</span><span class="note">${esc(c.note || "")}</span>`;
      return v
        ? `<a class="contact-card" href="${esc(href)}" ${c.type === "gmail" ? "" : 'target="_blank" rel="noopener"'}>${inner}</a>`
        : `<div class="contact-card is-empty" aria-label="${esc(c.label)} 연락처 준비 중">${inner}</div>`;
    }).join("");
  }

  renderNovels(); renderProfile(); renderSkills(); renderContacts();

  /* ---------------- 2. Lenis + ScrollTrigger ---------------- */
  let lenis = null;
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
  if (!REDUCED && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.9 });
    if (hasGSAP) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const headerOffset = () => -($("#header").offsetHeight - 2);
  function scrollToTarget(target) {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    const offset = el.id === "home" ? 0 : headerOffset();
    if (lenis) lenis.scrollTo(el.id === "home" ? 0 : el, { offset, duration: 1.8, onComplete: () => {
      // 지연 로딩 이미지로 위치가 바뀐 경우 한 번 더 보정
      if (el.id !== "home" && Math.abs(el.getBoundingClientRect().top + offset) > 4) lenis.scrollTo(el, { offset, duration: 0.6 });
    } });
    else window.scrollTo({ top: el.id === "home" ? 0 : el.getBoundingClientRect().top + window.scrollY + offset, behavior: REDUCED ? "auto" : "smooth" });
  }

  /* ---------------- 3. 헤더 / 메뉴 / TOP ---------------- */
  const header = $("#header"), nav = $("#nav"), burger = $("#burger"), topBtn = $("#topBtn");
  function closeMenu() { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "메뉴 열기"); if (lenis && !modalOpen) lenis.start(); }
  burger.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  $$("[data-scroll-to]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    if (a.classList.contains("crystal-btn")) { a.classList.remove("is-clicked"); void a.offsetWidth; a.classList.add("is-clicked"); }
    closeMenu();
    scrollToTarget(a.getAttribute("data-scroll-to"));
  }));
  topBtn.addEventListener("click", () => scrollToTarget("#home"));
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    topBtn.classList.toggle("is-visible", y > window.innerHeight * 0.8);
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // 현재 섹션 메뉴 발광
  const links = $$(".nav__link");
  const setActive = (id) => links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + id));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.dataset.section); });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  $$("[data-section]").forEach((s) => io.observe(s));
  setActive("home");

  /* ---------------- 4. 배경 별빛 · 금빛 입자 ---------------- */
  const dust = $("#dust"), dctx = dust.getContext("2d");
  let DW = 0, DH = 0, DPR = Math.min(window.devicePixelRatio || 1, 2), stars = [], motes = [];
  function initDust() {
    DW = window.innerWidth; DH = window.innerHeight;
    dust.width = DW * DPR; dust.height = DH * DPR; dctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const area = DW * DH, small = DW < 700;
    stars = Array.from({ length: Math.round(area / (small ? 9000 : 6500)) }, () => ({
      x: Math.random() * DW, y: Math.random() * DH * 1.6, r: Math.random() * 1.1 + 0.2, p: Math.random() * Math.PI * 2, s: 0.4 + Math.random() * 1.2, d: 0.05 + Math.random() * 0.15
    }));
    motes = Array.from({ length: Math.round(area / (small ? 26000 : 18000)) }, () => newMote(true));
  }
  function newMote(init) {
    return { x: Math.random() * DW, y: init ? Math.random() * DH : DH + 10, r: Math.random() * 1.8 + 0.5, vy: -(0.08 + Math.random() * 0.25), vx: (Math.random() - 0.5) * 0.12, a: 0.22 + Math.random() * 0.45, p: Math.random() * 6.28, sv: Math.random() < 0.45 };
  }
  let lastT = 0, dustRun = true;
  function drawDust(t) {
    const dt = Math.min(50, t - lastT || 16) / 16; lastT = t;
    dctx.clearRect(0, 0, DW, DH);
    const sy = window.scrollY;
    for (const s of stars) {
      const y = ((s.y - sy * s.d) % (DH * 1.6) + DH * 1.6) % (DH * 1.6);
      if (y > DH) continue;
      const tw = REDUCED ? 0.7 : 0.45 + 0.55 * Math.sin(t * 0.001 * s.s + s.p);
      dctx.globalAlpha = tw * 0.8; dctx.fillStyle = s.r > 0.9 ? "#FFF8E6" : "#E9EBEE";
      dctx.beginPath(); dctx.arc(s.x, y, s.r, 0, 6.283); dctx.fill();
    }
    for (const m of motes) {
      if (!REDUCED) { m.x += (m.vx + Math.sin(t * 0.0004 + m.p) * 0.08) * dt; m.y += m.vy * dt; }
      if (m.y < -10) Object.assign(m, newMote(false));
      const g = dctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
      if (m.sv) { g.addColorStop(0, `rgba(233,235,238,${m.a * 0.9})`); g.addColorStop(1, "rgba(197,200,206,0)"); }
      else { g.addColorStop(0, `rgba(255,232,170,${m.a})`); g.addColorStop(1, "rgba(245,216,139,0)"); }
      dctx.globalAlpha = 1; dctx.fillStyle = g; dctx.beginPath(); dctx.arc(m.x, m.y, m.r * 4, 0, 6.283); dctx.fill();
    }
    dctx.globalAlpha = 1;
    if (!REDUCED && dustRun) requestAnimationFrame(drawDust);
  }
  initDust(); requestAnimationFrame(drawDust);
  if (REDUCED) window.addEventListener("scroll", () => requestAnimationFrame(drawDust), { passive: true });
  let rT; window.addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => { initDust(); if (REDUCED) drawDust(0); }, 200); });
  document.addEventListener("visibilitychange", () => { dustRun = !document.hidden; if (dustRun && !REDUCED) requestAnimationFrame(drawDust); });

  /* ---------------- 5. 마우스 빛 · 공간감 ---------------- */
  const glow = $(".cursor-glow");
  const hero = $("#home");
  const heroLayers = $$(".hero__bg .layer");
  if (FINE && !REDUCED && hasGSAP) {
    gsap.set(glow, { x: window.innerWidth / 2, y: window.innerHeight * 0.4 });
    const gx = gsap.quickTo(glow, "x", { duration: 0.9, ease: "power3" });
    const gy = gsap.quickTo(glow, "y", { duration: 0.9, ease: "power3" });
    const movers = heroLayers.map((l) => ({ d: parseFloat(l.dataset.depth || 0.3),
      x: gsap.quickTo(l, "x", { duration: 1.6, ease: "power3" }), y: gsap.quickTo(l, "y", { duration: 1.6, ease: "power3" }) }));
    window.addEventListener("mousemove", (e) => {
      gx(e.clientX); gy(e.clientY);
      if (window.scrollY > window.innerHeight) return;
      const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => { m.x(nx * 44 * m.d); m.y(ny * 26 * m.d); });
    }, { passive: true });
  } else { glow.style.opacity = 0; }

  /* ---------------- 6. 작품 표지 3D 틸트 ---------------- */
  if (FINE && !REDUCED) {
    $$(".novel__cover").forEach((c) => {
      c.addEventListener("mousemove", (e) => {
        const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.transform = `rotateY(${(px - 0.5) * 16}deg) rotateX(${(0.5 - py) * 12}deg) translateZ(20px)`;
        c.style.setProperty("--gx", px * 100 + "%"); c.style.setProperty("--gy", py * 100 + "%");
      });
      c.addEventListener("mouseleave", () => { c.style.transform = ""; });
    });
  }

  /* ---------------- 7. 상세 모달 (책 펼침) ---------------- */
  const modal = $("#bookModal"), book = $("#book"), bCover = $("#bookCover"), bCoverImg = $("#bookCoverImg"), bLeft = $("#bookLeftImg"), bRight = $("#bookRight");
  let modalOpen = false, lastFocus = null;
  function modalHTML(n, idx) {
    const chars = n.characters && n.characters.length
      ? `<ul class="bm-chars">${n.characters.map((c) => `<li>${c.image ? `<img src="${esc(c.image)}" alt="${esc(c.name)}" loading="lazy">` : ""}<strong>${esc(c.name)}</strong><span>${esc(c.role || "")}</span></li>`).join("")}</ul>`
      : `<p>${PH("등장인물 소개 준비 중")}</p>`;
    const links = n.links && n.links.length
      ? `<div class="bm-links">${n.links.map((l) => `<a class="bm-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")}</div>`
      : `<p>${PH("연재처 정보 준비 중")}</p>`;
    let trailer = "";
    if (n.trailer) {
      trailer = /\.(mp4|webm)$/i.test(n.trailer)
        ? `<div class="bm-trailer"><video src="${esc(n.trailer)}" controls preload="none"></video></div>`
        : `<div class="bm-trailer"><iframe src="${esc(n.trailer)}" title="${esc(n.title)} 트레일러" loading="lazy" allowfullscreen></iframe></div>`;
    }
    const gallery = n.gallery && n.gallery.length
      ? `<div class="bm-gallery">${n.gallery.map((g) => `<img src="${esc(g.src)}" alt="${esc(g.alt || "")}" loading="lazy" ${g.ratio ? `style="aspect-ratio:${g.ratio}"` : ""}>`).join("")}</div>` : "";
    return `
      <span class="bm-num">NOVEL · ${String(idx + 1).padStart(2, "0")}</span>
      ${n.banner ? `<div class="bm-banner"><img src="${esc(n.banner)}" alt="" style="aspect-ratio:${n.bannerRatio || "auto"}"></div>` : ""}
      <h3 class="bm-title" id="bmTitle">${esc(n.title)}</h3>
      ${n.tagline ? `<p class="bm-tagline">“${esc(n.tagline)}”</p>` : ""}
      <div class="bm-block"><h4>INTRODUCTION · 작품 소개</h4><p>${n.intro ? esc(n.intro) : PH("작품 소개 준비 중")}</p></div>
      <div class="bm-block"><h4>SYNOPSIS · 시놉시스</h4><p>${n.synopsis ? esc(n.synopsis) : PH("시놉시스 준비 중")}</p></div>
      <div class="bm-block"><h4>CHARACTERS · 등장인물</h4>${chars}</div>
      <div class="bm-block"><h4>READ · 연재처</h4>${links}</div>
      ${trailer ? `<div class="bm-block"><h4>TRAILER · 트레일러</h4>${trailer}</div>` : ""}
      ${gallery ? `<div class="bm-block"><h4>GALLERY · 아트워크</h4>${gallery}</div>` : ""}`;
  }
  function openModal(id) {
    const idx = D.novels.findIndex((x) => x.id === id); if (idx < 0) return;
    const n = D.novels[idx];
    lastFocus = document.activeElement;
    book.style.setProperty("--b-main", n.theme.main); book.style.setProperty("--b-glow", n.theme.glow); book.style.setProperty("--b-soft", n.theme.soft);
    bCoverImg.src = n.cover; bCoverImg.alt = "";
    bLeft.src = n.cover; bLeft.alt = `${n.title} 표지`;
    bRight.innerHTML = modalHTML(n, idx); bRight.scrollTop = 0;
    modal.hidden = false; modalOpen = true;
    if (lenis) lenis.stop();
    document.documentElement.style.overflow = "hidden";
    const desktop = window.innerWidth > 900;
    if (hasGSAP && !REDUCED) {
      const tl = gsap.timeline();
      tl.fromTo(".book-modal__backdrop", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" })
        .fromTo(book, { opacity: 0, scale: 0.86, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.1);
      if (desktop) {
        gsap.set(bCover, { rotationY: 0, display: "block" });
        gsap.set([bLeft, bRight], { opacity: 0 });
        tl.to(bCover, { rotationY: -180, duration: 1.4, ease: "power3.inOut" }, 0.55)
          .to(bLeft, { opacity: 1, duration: 0.6 }, 1.5)
          .to(bRight, { opacity: 1, duration: 0.8 }, 0.9)
          .fromTo($$(".bm-block, .bm-title, .bm-banner", bRight), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.6, ease: "power2.out" }, 1.0)
          .set(bCover, { display: "none" });
      } else {
        gsap.set([bLeft, bRight], { opacity: 1 });
        tl.fromTo(book, { rotationX: 12, transformPerspective: 1200 }, { rotationX: 0, duration: 0.9, ease: "power3.out" }, 0.1);
      }
    } else { bCover.style.display = "none"; }
    setTimeout(() => $(".book-modal__close").focus({ preventScroll: true }), 50);
  }
  function closeModal() {
    if (!modalOpen) return;
    const done = () => { modal.hidden = true; modalOpen = false; document.documentElement.style.overflow = ""; if (lenis) lenis.start(); if (lastFocus) lastFocus.focus({ preventScroll: true }); };
    if (hasGSAP && !REDUCED) {
      gsap.timeline({ onComplete: done })
        .to(book, { opacity: 0, scale: 0.9, y: 20, duration: 0.5, ease: "power2.in" })
        .to(".book-modal__backdrop", { opacity: 0, duration: 0.4 }, 0.15);
    } else done();
  }
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]"); if (o) { openModal(o.dataset.open); return; }
    if (e.target.closest("[data-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { if (modalOpen) closeModal(); else if (nav.classList.contains("is-open")) closeMenu(); }
    if (e.key === "Tab" && modalOpen) {
      const f = $$("button, a[href], iframe, video", modal).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------------- 8. 스크롤 애니메이션 ---------------- */
  function setupScrollAnimations() {
    if (!hasGSAP || REDUCED) return;
    // 히어로 패럴랙스 (스크롤)
    heroLayers.forEach((l) => {
      const d = parseFloat(l.dataset.depth || 0.3);
      gsap.to(l, { yPercent: d * 40, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    });
    gsap.to(".hero__content", { y: -80, opacity: 0.15, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });

    // 섹션 헤드 리빌
    $$(".section__head").forEach((h) => {
      gsap.from(h.children, { opacity: 0, y: 40, filter: "blur(6px)", stagger: 0.12, duration: 1.4, ease: "power3.out",
        scrollTrigger: { trigger: h, start: "top 82%" } });
    });
    $$(".divider").forEach((d) => gsap.from(d.children, { scaleX: 0, opacity: 0, duration: 1.6, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: d, start: "top 90%" } }));

    // 작품 순차 등장
    $$(".novel").forEach((n, i) => {
      const left = i % 2 === 0;
      const tl = gsap.timeline({ scrollTrigger: { trigger: n, start: "top 78%" } });
      tl.from($(".novel__cover-wrap", n), { opacity: 0, x: (left ? -1 : 1) * (window.innerWidth < 700 ? 24 : 60), rotationY: left ? 18 : -18, transformPerspective: 1000, duration: 1.6, ease: "power3.out" })
        .from($(".novel__info", n).children, { opacity: 0, y: 30, stagger: 0.1, duration: 1.1, ease: "power3.out" }, 0.3);
      gsap.to($(".novel__halo", n), { yPercent: -18, ease: "none", scrollTrigger: { trigger: n, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo($(".novel__cover-wrap", n), { y: 40 }, { y: -40, ease: "none", scrollTrigger: { trigger: n, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // 프로필
    const pv = $(".profile__visual"), pt = $(".profile__text");
    gsap.from(pv, { opacity: 0, x: window.innerWidth < 700 ? -20 : -50, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: pv, start: "top 80%" } });
    gsap.to(".profile__img img", { scale: 1, yPercent: -4, ease: "none", scrollTrigger: { trigger: pv, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(pt.children, { opacity: 0, y: 30, stagger: 0.14, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: pt, start: "top 80%" } });

    // 스킬
    gsap.from(".creative-list li", { opacity: 0, y: 20, scale: 0.94, stagger: 0.07, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".creative-list", start: "top 85%" } });
    gsap.from(".gem-card", { opacity: 0, y: 50, rotationX: -14, transformPerspective: 900, stagger: 0.09, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".gem-grid", start: "top 82%" } });

    // 연락처
    gsap.from(".contact-card", { opacity: 0, y: 40, stagger: 0.15, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".contact__cards", start: "top 85%" } });
    gsap.from(".footer > *", { opacity: 0, y: 20, stagger: 0.1, duration: 1.1, ease: "power2.out", scrollTrigger: { trigger: ".footer", start: "top 90%" } });

    // 이미지 로드로 높이가 바뀌면 재계산
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  /* ---------------- 9. 히어로 타이틀 (이야기가 쓰이듯) ---------------- */
  function splitChars(el) {
    const text = el.textContent; el.setAttribute("aria-label", text); el.classList.add("is-split");
    el.innerHTML = [...text].map((c) => `<span class="ch" aria-hidden="true">${c === " " ? " " : esc(c)}</span>`).join("");
    return $$(".ch", el);
  }
  const koLines = $$("[data-write]"), enLine = $("[data-write-en]");
  const heroBits = $$(".hero .reveal-up");
  let koChars = [], enChars = [];
  if (hasGSAP && !REDUCED) {
    koLines.forEach((l) => { koChars = koChars.concat(splitChars(l)); });
    enChars = splitChars(enLine);
    gsap.set(koChars, { opacity: 0, y: "0.25em", filter: "blur(10px)" });
    gsap.set(enChars, { opacity: 0, filter: "blur(4px)" });
    gsap.set(heroBits, { opacity: 0, y: 24 });
    gsap.set([".hero__moon", ".hero__still", ".hero__orn"], { opacity: 0 });
  }
  function playHero() {
    if (!hasGSAP || REDUCED) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".hero__moon", { opacity: 1, duration: 2.4 }, 0.3)
      .to(".hero__still", { opacity: 0.55, duration: 2.4 }, 0.8)
      .to(".hero__orn", { opacity: 0.45, duration: 2.4, stagger: 0.3 }, 1)
      .to(heroBits[0], { opacity: 1, y: 0, duration: 1.4 }, 0.6)
      .to(koChars, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.075, ease: "power2.out" }, 1.0)
      .to(enChars, { opacity: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.022, ease: "none" }, ">-0.5")
      .to(heroBits.slice(1), { opacity: 1, y: 0, duration: 1.4, stagger: 0.25 }, ">-0.4");
  }

  /* ---------------- 10. 시네마틱 영상 인트로 ---------------- */
  const intro = $("#intro"), video = $("#introVideo");
  let entering = false, introTl = null, idleGlint = null, stopParticles = () => {};
  function finishIntro() {
    if (idleGlint) idleGlint.kill();
    intro.classList.add("is-done");
    document.body.classList.remove("is-loading");
    if (lenis) { lenis.start(); lenis.scrollTo(0, { immediate: true }); }
    window.scrollTo(0, 0);
    playHero();
    if (hasGSAP) ScrollTrigger.refresh();
    window.MEHR_BGM && window.MEHR_BGM.reveal();
  }
  function enterSite() {
    if (entering) return; entering = true;
    window.MEHR_BGM && window.MEHR_BGM.start(); // 사용자 클릭 시점에 배경음악 시작
    if (!hasGSAP || REDUCED) { intro.remove(); finishIntro(); return; }
    const spill = $(".intro__spill");
    (introTl && introTl.kill(), gsap.timeline({ onComplete: () => { stopParticles(); try { video.pause(); } catch (e) {} intro.remove(); } }))
      .to(".intro__center", { opacity: 0, y: -20, filter: "blur(6px)", duration: 1.0, ease: "power2.in" }, 0)
      .to(video, { scale: 1.16, duration: 2.6, ease: "power2.inOut" }, 0)
      .fromTo(spill, { opacity: 0, scale: 0.4 }, { opacity: 0.85, scale: 1.6, duration: 1.4, ease: "power2.in" }, 0.3)
      .add(finishIntro, 1.6)
      .to(intro, { opacity: 0, duration: 1.6, ease: "power2.inOut" }, 1.6);
  }
  // 금빛 입자가 배너 주위로 모여드는 연출
  function particleGather(rect, duration) {
    const cv = $("#introCanvas"), ctx = cv.getContext("2d");
    const W = window.innerWidth, H = window.innerHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = W < 700 ? 260 : 520;
    const parts = Array.from({ length: n }, () => {
      const ang = Math.random() * 6.283, dist = Math.max(W, H) * (0.35 + Math.random() * 0.5);
      // 배너 테두리 근처로 모이도록 목표점 생성
      const edge = Math.random();
      let tx = rect.left + Math.random() * rect.width, ty = rect.top + Math.random() * rect.height;
      if (edge < 0.6) { tx = rect.left + rect.width * (0.2 + Math.random() * 0.6); ty = rect.top + rect.height * (0.2 + Math.random() * 0.55); }
      return { x: W / 2 + Math.cos(ang) * dist, y: H / 2 + Math.sin(ang) * dist, tx, ty, r: Math.random() * 1.3 + 0.4, d: Math.random() };
    });
    const st = { p: 0, fade: 1 }; let alive = true; stopParticles = () => { alive = false; };
    (function frame() {
      if (!alive) { ctx.clearRect(0, 0, W, H); return; }
      ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = "lighter";
      for (const q of parts) {
        const k = Math.min(1, Math.max(0, (st.p - q.d * 0.35) / (1 - q.d * 0.35))), e = 1 - Math.pow(1 - k, 3), sw = (1 - e) * 140, an = e * 7 + q.d * 12;
        const x = q.x + (q.tx - q.x) * e + Math.cos(an) * sw, y = q.y + (q.ty - q.y) * e + Math.sin(an) * sw * 0.6;
        ctx.fillStyle = `rgba(255,${205 + Math.round(q.d * 45)},150,${Math.min(1, k * 1.5) * st.fade * 0.8})`;
        ctx.beginPath(); ctx.arc(x, y, q.r, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(frame);
    })();
    return gsap.timeline({ onComplete: () => { alive = false; } })
      .to(st, { p: 1, duration, ease: "power2.inOut" })
      .to(st, { fade: 0, duration: 1.4, ease: "power1.out" }, duration - 0.5);
  }

  let bannerShown = false;
  function showBanner() {
    if (bannerShown || entering) return; bannerShown = true;
    const center = $(".intro__center"), skip = $("#introSkip");
    skip.classList.add("is-hidden");
    center.style.visibility = "visible";
    try { video.pause(); } catch (_) {}
    if (REDUCED || !hasGSAP) { intro.classList.add("is-static"); return; }
    const logoBtn = $("#introEnter"), rect = logoBtn.getBoundingClientRect();
    gsap.set(logoBtn, { opacity: 1, "--rev": "-25%", "--g": "-30%" });
    gsap.set(".intro__logo-img", { scale: 1.08, filter: "blur(6px)" });
    introTl = gsap.timeline()
      .to(intro, { "--dim": 1, duration: 2.0, ease: "power2.inOut" }, 0)
      .add(particleGather(rect, 1.9), 0)
      // 휘리릭: 왼쪽→오른쪽으로 글자가 쓸려 나타남
      .to(logoBtn, { "--rev": "135%", duration: 1.7, ease: "power2.inOut" }, 1.1)
      .to(".intro__logo-img", { scale: 1, filter: "blur(0px)", duration: 1.9, ease: "power3.out", clearProps: "filter,transform" }, 1.1)
      // 빛이 글자 위를 스쳐 지나감
      .to(logoBtn, { "--g": "130%", duration: 1.3, ease: "power1.inOut" }, 2.5)
      .fromTo(".intro__hint", { opacity: 0 }, { opacity: 1, duration: 1.4 }, 3.0)
      .add(() => {
        // 대기 중에도 가끔 은은한 빛 스침
        idleGlint = gsap.timeline({ repeat: -1, repeatDelay: 4.5 }).set(logoBtn, { "--g": "-30%" }).to(logoBtn, { "--g": "130%", duration: 1.6, ease: "power1.inOut" });
      }, 4.0);
  }

  function runIntro() {
    $("#introEnter").addEventListener("click", (e) => { e.stopPropagation(); enterSite(); });
    window.addEventListener("keydown", function onKey(e) {
      if (!document.body.contains(intro) || entering) { window.removeEventListener("keydown", onKey); return; }
      if (bannerShown && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); enterSite(); }
      if (e.key === "Escape" && !bannerShown) skipIntro();
    });
    $("#introSkip").addEventListener("click", (e) => { e.stopPropagation(); skipIntro(); });
    if (lenis) lenis.stop();
    window.scrollTo(0, 0);
    if (REDUCED || !hasGSAP) {
      // 모션 감소: 자동 재생 없이 마지막 장면(정지 이미지)과 입장 배너
      video.preload = "none"; video.poster = "assets/video/intro-end.jpg";
      showBanner();
      return;
    }
    // 영상 1회 재생 → 끝나면 마지막 장면에서 정지 + 배너
    video.addEventListener("ended", showBanner, { once: true });
    video.addEventListener("timeupdate", () => { if (video.duration && video.currentTime >= video.duration - 0.25) showBanner(); });
    video.addEventListener("error", () => setTimeout(showBanner, 600), { once: true });
    gsap.fromTo(video, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power1.out" });
    const p = video.play();
    if (p && p.catch) p.catch(() => { video.poster = "assets/video/intro-end.jpg"; setTimeout(showBanner, 800); });
    // 안전장치: 영상이 멈추거나 로드되지 않으면 12초 후 배너 표시
    setTimeout(showBanner, 12000);
  }
  function skipIntro() {
    if (entering) return; entering = true;
    window.MEHR_BGM && window.MEHR_BGM.start();
    if (introTl) introTl.kill(); stopParticles();
    try { video.pause(); } catch (_) {}
    if (hasGSAP && !REDUCED) gsap.to(intro, { opacity: 0, duration: 0.9, ease: "power2.inOut", onComplete: () => intro.remove() });
    else intro.remove();
    finishIntro();
  }

  setupScrollAnimations();
  const fontsReady = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve();
  fontsReady.then(runIntro);
  mqReduce.addEventListener?.("change", () => location.reload());
})();
