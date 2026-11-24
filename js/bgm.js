/* =========================================================
   MEHR STORY — 배경음악 (BGM)
   · 인트로 "Click to Enter" 클릭(사용자 동작) 시에만 재생 시작 — 자동재생 없음
   · 켜기/끄기 + 볼륨, 설정은 localStorage 에 저장
   · 곡 목록은 js/data.js 의 bgm.tracks
   ========================================================= */
(function () {
  "use strict";
  const cfg = (window.MEHR_DATA && window.MEHR_DATA.bgm) || {};
  const tracks = (cfg.tracks || []).filter((t) => t && (t.mp3 || t.ogg));
  const root = document.getElementById("bgm");
  if (!root || !tracks.length) { if (root) root.remove(); window.MEHR_BGM = { start() {}, reveal() {} }; return; }

  const KEY = "mehrstory.bgm";
  const btn = document.getElementById("bgmToggle");
  const slider = document.getElementById("bgmVolume");
  const titleEl = document.getElementById("bgmTitle");

  // 저장된 설정 (on: 켜짐 여부, vol: 0~1)
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (_) {}
  const state = {
    on: saved.on !== false,
    vol: typeof saved.vol === "number" ? Math.min(1, Math.max(0, saved.vol)) : (cfg.volume ?? 0.32),
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ on: state.on, vol: state.vol })); } catch (_) {} };

  const probe = document.createElement("audio");
  const useOgg = !!(probe.canPlayType && probe.canPlayType('audio/ogg; codecs="vorbis"'));
  const srcOf = (t) => (useOgg && t.ogg) ? t.ogg : (t.mp3 || t.ogg);

  // 곡 전환 시 겹쳐 흐르도록(크로스페이드) 오디오 두 개를 번갈아 사용
  const players = [new Audio(), new Audio()];
  players.forEach((a) => { a.preload = "none"; a.loop = false; a.volume = 0; a._g = 0; });
  let cur = 0, idx = 0, started = false, wantPlay = false, xfading = false;

  // iPhone/iPad 는 audio.volume 을 바꿀 수 없어서 Web Audio(GainNode)로 볼륨을 조절
  let actx = null;
  function setupGraph() {
    if (actx) { if (actx.state === "suspended") actx.resume().catch(() => {}); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    // 파일을 직접 열었을 때(file://)는 Web Audio 가 무음이 될 수 있어 기본 볼륨 방식 사용
    if (!AC || location.protocol === "file:") return;
    try {
      actx = new AC();
      players.forEach((a) => {
        const src = actx.createMediaElementSource(a), g = actx.createGain();
        g.gain.value = 0; src.connect(g).connect(actx.destination); a._gain = g; a.volume = 1;
      });
    } catch (_) { actx = null; players.forEach((a) => { a._gain = null; }); }
  }
  function apply(a) {
    const v = Math.min(1, Math.max(0, a._g * state.vol));
    if (a._gain) a._gain.gain.value = v; else a.volume = v;
  }
  // 볼륨 페이드 (gain 0~1 × 사용자 볼륨)
  function fade(a, to, ms, done) {
    cancelAnimationFrame(a._raf);
    const from = a._g, t0 = performance.now();
    const step = (now) => {
      const k = ms ? Math.min(1, (now - t0) / ms) : 1;
      a._g = from + (to - from) * (k * k * (3 - 2 * k));
      apply(a);
      if (k < 1) a._raf = requestAnimationFrame(step); else if (done) done();
    };
    a._raf = requestAnimationFrame(step);
  }
  function load(a, i) {
    const t = tracks[i];
    if (a._i !== i) { a.src = srcOf(t); a._i = i; a.preload = "auto"; }
  }
  function setTitle() { titleEl.textContent = "♪ " + tracks[idx].title; }

  function playCurrent(fadeMs) {
    const a = players[cur];
    load(a, idx); setTitle();
    const p = a.play();
    if (p && p.catch) p.catch(() => armRetry());
    fade(a, 1, fadeMs);
  }
  // 재생이 브라우저에 의해 막히면(예: Esc 로 넘긴 경우) 다음 클릭/키 입력 때 다시 시도
  let armed = false;
  function armRetry() {
    if (armed) return; armed = true;
    const go = (e) => {
      if (e && root.contains(e.target)) return; // 컨트롤 자체 조작은 따로 처리
      ["pointerdown", "keydown", "touchend"].forEach((ev) => window.removeEventListener(ev, go, true));
      armed = false;
      if (state.on && wantPlay) { setupGraph(); playCurrent(3000); }
    };
    ["pointerdown", "keydown", "touchend"].forEach((ev) => window.addEventListener(ev, go, true));
  }

  // 곡 끝나기 4초 전에 다음 곡으로 크로스페이드 (곡이 하나면 같은 곡을 다시)
  players.forEach((a, n) => {
    a.addEventListener("timeupdate", () => {
      if (n !== cur || xfading || !wantPlay || !a.duration) return;
      if (a.duration - a.currentTime <= 4) {
        xfading = true;
        const old = a;
        idx = (idx + 1) % tracks.length; cur = 1 - cur;
        const nxt = players[cur]; nxt._g = 0; apply(nxt);
        if (nxt._i === idx) nxt.currentTime = 0;
        playCurrent(2500);
        fade(old, 0, 3500, () => { old.pause(); xfading = false; });
      }
    });
    a.addEventListener("ended", () => { if (n === cur && wantPlay && !xfading) { idx = (idx + 1) % tracks.length; playCurrent(1500); } });
    a.addEventListener("error", () => {
      if (n !== cur || !wantPlay) return;
      // 파일 오류 시 다음 곡으로
      if (tracks.length > 1) { idx = (idx + 1) % tracks.length; a._i = -1; setTimeout(() => playCurrent(2000), 400); }
    });
  });
  // 다음 곡 미리 받아두기 (재생 중일 때만)
  players[0].addEventListener("playing", () => {
    if (tracks.length > 1) { const o = players[1]; if (o.paused && o._i == null) { o.preload = "auto"; o.src = srcOf(tracks[(idx + 1) % tracks.length]); o._i = (idx + 1) % tracks.length; } }
  }, { once: true });

  function render() {
    root.dataset.state = state.on ? "on" : "off";
    btn.setAttribute("aria-pressed", String(state.on));
    btn.setAttribute("aria-label", state.on ? "배경음악 끄기" : "배경음악 켜기");
    btn.title = state.on ? "배경음악 끄기" : "배경음악 켜기";
    const v = Math.round(state.vol * 100);
    slider.value = v; slider.style.setProperty("--v", v + "%");
    slider.setAttribute("aria-valuetext", v + "%");
  }

  function turnOn(fadeMs) {
    setupGraph();
    state.on = true; wantPlay = true; save(); render();
    playCurrent(fadeMs);
  }
  function turnOff() {
    state.on = false; wantPlay = false; save(); render();
    players.forEach((a) => { if (!a.paused) fade(a, 0, 900, () => a.pause()); });
  }

  btn.addEventListener("click", () => {
    if (state.on && wantPlay) turnOff();
    else { started = true; turnOn(1800); }
    // 터치 기기: 버튼을 누르면 볼륨 패널도 펼침
    if (window.matchMedia("(hover: none)").matches) openPanel();
  });
  let closeT = 0;
  function openPanel() {
    root.classList.add("is-open");
    clearTimeout(closeT); closeT = setTimeout(() => root.classList.remove("is-open"), 4000);
  }
  document.addEventListener("pointerdown", (e) => { if (!root.contains(e.target)) root.classList.remove("is-open"); });
  slider.addEventListener("input", () => {
    state.vol = Math.min(1, Math.max(0, slider.value / 100));
    players.forEach(apply);
    render(); save();
    if (window.matchMedia("(hover: none)").matches) openPanel();
  });

  // 탭을 떠나면 잠시 멈추고, 돌아오면 다시 은은하게
  document.addEventListener("visibilitychange", () => {
    if (!wantPlay) return;
    const a = players[cur];
    if (document.hidden) fade(a, 0, 400, () => a.pause());
    else { if (actx && actx.state === "suspended") actx.resume().catch(() => {}); const p = a.play(); if (p && p.catch) p.catch(() => armRetry()); fade(a, 1, 1500); }
  });

  render();
  window.MEHR_BGM = {
    // 인트로 입장 클릭(사용자 동작) 안에서 호출됨
    start() {
      if (started) return; started = true;
      if (state.on) turnOn(4000);
    },
    reveal() { root.classList.add("is-ready"); },
    get players() { return players; },
    get context() { return actx; },
  };
})();
