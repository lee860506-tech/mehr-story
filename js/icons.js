(() => {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const gestures = {
    novel: { rotation: -5, y: -3 },
    'visual-story': { x: 3, rotation: 4 },
    audiobook: { scale: 1.055 },
    'audio-drama': { x: -2, rotation: -5 },
    podcast: { y: -4, scale: 1.035 },
    'cinematic-story': { rotation: 6 },
    'story-universe': { rotation: 7 },
    about: { x: 2, y: -3 },
    skill: { rotation: 8 },
    contact: { y: -3, rotation: -3 }
  };

  document.querySelectorAll('[data-celestial]').forEach((icon, index) => {
    const wrap = document.createElement('span');
    wrap.className = 'celestial-emblem';
    if (icon.classList.contains('section__icon')) wrap.classList.add('celestial-emblem--section');
    if (icon.classList.contains('section__emblem')) wrap.classList.add('celestial-emblem--heading');
    wrap.style.setProperty('--float-delay', (-index * .62) + 's');
    const art = document.createElement('span');
    art.className = 'celestial-emblem__art';
    const shine = icon.cloneNode();
    shine.removeAttribute('data-celestial');
    shine.className = 'celestial-emblem__shine';
    shine.alt = '';
    icon.replaceWith(wrap);
    wrap.append(art);
    art.append(icon, shine);

    const target = wrap.closest('.story-universe__grid li') || wrap;
    let timeline;
    function animate() {
      if (!window.gsap || !motion.matches) return;
      timeline?.kill();
      timeline = gsap.timeline();
      timeline
        .to(art, { ...gestures[icon.dataset.celestial], duration: .55, ease: 'sine.out' }, 0)
        .fromTo(shine,
          { clipPath: 'polygon(-45% 0,-28% 0,-44% 100%,-61% 100%)' },
          { clipPath: 'polygon(146% 0,163% 0,147% 100%,130% 100%)', duration: .88, ease: 'sine.inOut' }, 0)
        .fromTo(shine, { opacity: 0 }, { opacity: .38, duration: .30 }, 0)
        .to(shine, { opacity: 0, duration: .58 }, .30)
        .to(art, { x: 0, y: 0, rotation: 0, scale: 1, duration: .75, ease: 'sine.inOut', clearProps: 'transform' }, .57);
    }

    target.addEventListener('pointerenter', event => {
      if (finePointer.matches && event.pointerType !== 'touch') animate();
    });
    target.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') animate();
    });
    target.addEventListener('focusin', animate);
    motion.addEventListener('change', () => {
      if (motion.matches || !timeline) return;
      timeline.kill();
      gsap.set([art, shine], { clearProps: 'transform,opacity,clipPath' });
    });
  });
})();
