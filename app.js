(() => {
  'use strict';

  const slides = [...document.querySelectorAll('.slide')];
  const stage = document.querySelector('.stage');
  const slideButtons = [...document.querySelectorAll('.slide-nav [data-go]')];
  const previousButton = document.querySelector('.previous');
  const nextButton = document.querySelector('.next');
  const announcer = document.querySelector('#slide-announcer');
  const fullscreenButton = document.querySelector('#fullscreen-button');
  const furiganaToggle = document.querySelector('#furigana-toggle');
  const furiganaState = document.querySelector('#furigana-state');
  const tenseButtons = [...document.querySelectorAll('.tense-btn')];
  const flipButtons = [...document.querySelectorAll('[data-flip-target]')];
  const mobileSlideTrigger = document.querySelector('#mobile-slide-trigger');
  const mobileSlideLabel = document.querySelector('#mobile-slide-label');
  const slideNav = document.querySelector('#slide-nav-list');
  const mobile = window.matchMedia('(max-width: 900px)');

  let currentSlide = 0;
  let transitionTimer;
  let toastTimer;

  const TENSE_DATA = {
    present: {
      v: {
        eqLeft: 'V普通形 / Adj-<b lang="ja">い</b>',
        cap: 'Untuk kalimat positif, tempelkan langsung pada bentuk kamus kata kerja atau bentuk dasar kata sifat <strong lang="ja">い</strong>.',
        steps: [
          ['読む', '読む（辞書）', '読むのでした'],
          ['行く', '行く（辞書）', '行くのでした'],
          ['忙しい', '忙しい（い形）', '忙しいのでした']
        ]
      },
      vn: {
        eqLeft: 'V<b lang="ja">ない</b>形 / Adj-<b lang="ja">くない</b>',
        cap: 'Untuk kalimat negatif, ubah dulu kata kerja ke <strong lang="ja">ない</strong> atau kata sifat <strong lang="ja">い</strong> ke <strong lang="ja">くない</strong> sebelum <strong lang="ja">のでした</strong>.',
        steps: [
          ['読む', '読まない', '読まないのでした'],
          ['行く', '行かない', '行かないのでした'],
          ['忙しい', '忙しくない', '忙しくないのでした']
        ]
      },
      n: {
        eqLeft: 'N / Adj-<b lang="ja">な</b> + <b lang="ja">な</b>',
        cap: 'Untuk bentuk kini positif, wajib menyisipkan <strong lang="ja">な</strong> sebelum <strong lang="ja">のでした</strong>.',
        steps: [
          ['休日', '休日な', '休日なのでした'],
          ['静か', '静かな', '静かなのでした'],
          ['雨', '雨な', '雨なのでした']
        ]
      },
      nn: {
        eqLeft: 'N / Adj-<b lang="ja">な</b> + <b lang="ja">じゃない</b>',
        cap: 'Untuk kalimat negatif, pakai <strong lang="ja">じゃない</strong> tanpa menyisipkan <strong lang="ja">な</strong>.',
        steps: [
          ['休日', '休日じゃない', '休日じゃないのでした'],
          ['静か', '静かじゃない', '静かじゃないのでした'],
          ['雨', '雨じゃない', '雨じゃないのでした']
        ]
      }
    },
    past: {
      v: {
        eqLeft: 'V<b lang="ja">た</b>形 / Adj-<b lang="ja">かった</b>',
        cap: 'Untuk bentuk lampau positif, ubah kata kerja ke bentuk <strong lang="ja">た</strong> atau kata sifat <strong lang="ja">い</strong> ke <strong lang="ja">かった</strong>.',
        steps: [
          ['読む', '読んだ', '読んだのでした'],
          ['行く', '行った', '行ったのでした'],
          ['忙しい', '忙しかった', '忙しかったのでした']
        ]
      },
      vn: {
        eqLeft: 'V<b lang="ja">なかった</b> / Adj-<b lang="ja">くなかった</b>',
        cap: 'Untuk lampau negatif, ubah ke <strong lang="ja">なかった</strong> atau kata sifat <strong lang="ja">くなかった</strong> sebelum <strong lang="ja">のでした</strong>.',
        steps: [
          ['読む', '読まなかった', '読まなかったのでした'],
          ['行く', '行かなかった', '行かなかったのでした'],
          ['忙しい', '忙しくなかった', '忙しくなかったのでした']
        ]
      },
      n: {
        eqLeft: 'N / Adj-<b lang="ja">な</b> + <b lang="ja">だった</b>',
        cap: 'Pada bentuk lampau positif, <strong lang="ja">な</strong> diganti dengan <strong lang="ja">だった</strong> sebelum <strong lang="ja">のでした</strong>.',
        steps: [
          ['休日', '休日だった', '休日だったのでした'],
          ['静か', '静かだった', '静かだったのでした'],
          ['雨', '雨だった', '雨だったのでした']
        ]
      },
      nn: {
        eqLeft: 'N / Adj-<b lang="ja">な</b> + <b lang="ja">じゃなかった</b>',
        cap: 'Untuk lampau negatif, gunakan <strong lang="ja">じゃなかった</strong> setelah kata benda atau kata sifat <strong lang="ja">な</strong>.',
        steps: [
          ['休日', '休日じゃなかった', '休日じゃなかったのでした'],
          ['静か', '静かじゃなかった', '静かじゃなかったのでした'],
          ['雨', '雨じゃなかった', '雨じゃなかったのでした']
        ]
      }
    }
  };

  function fitStage() {
    stage.style.setProperty('--deck-scale', stage.clientWidth / 1440);
  }

  function readHash() {
    const match = location.hash.match(/^#slide-(\d+)$/);
    if (!match) return 0;
    const index = Number(match[1]) - 1;
    return index >= 0 && index < slides.length ? index : 0;
  }

  function goToSlide(index, { updateHash = true, focus = false, animate = true } = {}) {
    if (!Number.isInteger(index) || index < 0 || index >= slides.length) return;
    const changed = currentSlide !== index;
    const focusIsInSlide = slides.some(slide => slide.contains(document.activeElement));
    currentSlide = index;
    clearTimeout(transitionTimer);

    slides.forEach((slide, i) => {
      const active = i === index;
      slide.hidden = !active;
      slide.inert = !active;
      slide.classList.toggle('active', active);
      slide.classList.remove('entering');
    });

    if (changed && animate) {
      slides[index].classList.add('entering');
      transitionTimer = setTimeout(() => slides[index].classList.remove('entering'), 420);
    }

    slideButtons.forEach((button, i) => {
      button.classList.toggle('current', i === index);
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });

    previousButton.disabled = index === 0;
    nextButton.disabled = index === slides.length - 1;
    document.querySelector('.skip-link').href = '#slide-' + (index + 1);
    if (mobileSlideLabel) {
      mobileSlideLabel.textContent = 'Slide ' + (index + 1) + ' / ' + slides.length + ' · ' + slides[index].dataset.title;
    }
    closeMobileNav();

    if (updateHash && location.hash !== '#slide-' + (index + 1)) {
      try {
        history.replaceState(null, '', '#slide-' + (index + 1));
      } catch {
        location.hash = 'slide-' + (index + 1);
      }
    }

    if (focus || focusIsInSlide) slides[index].focus({ preventScroll: true });
    if (changed && mobile.matches) window.scrollTo({ top: 0, behavior: 'instant' });
    if (index === 2) {
      syncFormulaSliders();
      requestAnimationFrame(() => syncFormulaSliders());
    }
    announcer.textContent = 'Slide ' + (index + 1) + ' dari ' + slides.length + ': ' + slides[index].dataset.title;
  }

  function getSliderStartTime(sliders) {
    for (const slider of sliders) {
      for (const anim of slider.getAnimations()) {
        if (typeof anim.startTime === 'number' && Number.isFinite(anim.startTime)) {
          return anim.startTime;
        }
      }
    }
    return null;
  }

  function syncFormulaSliders(referenceStartTime = null) {
    const sliders = document.querySelectorAll('#slide-3 .form-slider');
    if (!sliders.length) return;
    let sharedStart = typeof referenceStartTime === 'number' && Number.isFinite(referenceStartTime)
      ? referenceStartTime
      : getSliderStartTime(document.querySelectorAll('#slide-3 .formula-face:not([inert]) .form-slider'));
    if (sharedStart === null) {
      sharedStart = getSliderStartTime(sliders);
    }
    if (sharedStart === null) return;
    sliders.forEach(slider => {
      slider.getAnimations().forEach(anim => {
        if (anim.playState === 'paused') anim.play();
        if (anim.startTime !== sharedStart) anim.startTime = sharedStart;
      });
    });
  }

  function setFormulaPanel(prefix, group) {
    document.querySelector(`#eq-left-${prefix}`).innerHTML = group.eqLeft;
    document.querySelector(`#cap-${prefix}`).innerHTML = group.cap;
    group.steps.forEach((step, idx) => {
      const n = idx + 1;
      document.querySelector(`#${prefix}-step${n}-base`).textContent = step[0];
      document.querySelector(`#${prefix}-step${n}-mid`).textContent = step[1];
      document.querySelector(`#${prefix}-step${n}-out`).textContent = step[2];
    });
  }

  function applyTense(tenseKey) {
    const data = TENSE_DATA[tenseKey];
    if (!data) return;

    ['v', 'vn', 'n', 'nn'].forEach(prefix => setFormulaPanel(prefix, data[prefix]));
    requestAnimationFrame(() => syncFormulaSliders());

    tenseButtons.forEach(btn => {
      const active = btn.dataset.tense === tenseKey;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function toggleFormulaFlip(targetId, { restoreFocus = false } = {}) {
    const flip = document.getElementById(targetId);
    if (!flip) return;
    const refStart = getSliderStartTime(
      flip.querySelectorAll('.formula-face:not([inert]) .form-slider')
    );
    const isFlipped = flip.classList.toggle('is-flipped');
    const front = flip.querySelector('.formula-face-front');
    const back = flip.querySelector('.formula-face-back');
    const inner = flip.querySelector('.formula-card-inner');
    if (front) {
      front.inert = isFlipped;
      front.setAttribute('aria-hidden', String(isFlipped));
    }
    if (back) {
      back.inert = !isFlipped;
      back.setAttribute('aria-hidden', String(!isFlipped));
    }
    syncFormulaSliders(refStart);
    requestAnimationFrame(() => syncFormulaSliders(refStart));
    if (inner) {
      const onFlipTransitionEnd = event => {
        if (event.target !== inner) return;
        inner.removeEventListener('transitionend', onFlipTransitionEnd);
        syncFormulaSliders();
      };
      inner.addEventListener('transitionend', onFlipTransitionEnd);
    }
    const label = targetId === 'flip-v' ? 'Kata kerja dan kata sifat i' : 'Kata benda dan kata sifat na';
    announcer.textContent = label + ' menampilkan bentuk ' + (isFlipped ? 'negatif.' : 'positif.');
    if (restoreFocus) {
      const nextBtn = (isFlipped ? back : front)?.querySelector('.polarity-btn');
      nextBtn?.focus({ preventScroll: true });
    }
  }

  function closeMobileNav({ restoreFocus = false } = {}) {
    if (!slideNav || !mobileSlideTrigger) return;
    const wasOpen = slideNav.classList.contains('is-open');
    slideNav.classList.remove('is-open');
    mobileSlideTrigger.setAttribute('aria-expanded', 'false');
    if (wasOpen && restoreFocus) mobileSlideTrigger.focus({ preventScroll: true });
  }

  function toggleMobileNav() {
    if (!slideNav || !mobileSlideTrigger) return;
    const isOpen = slideNav.classList.toggle('is-open');
    mobileSlideTrigger.setAttribute('aria-expanded', String(isOpen));
  }

  function toggleFurigana() {
    const hidden = document.body.classList.toggle('furigana-hidden');
    const active = !hidden;
    furiganaToggle.setAttribute('aria-pressed', String(active));
    furiganaState.textContent = active ? 'Aktif' : 'Sembunyi';
    announcer.textContent = active ? 'Furigana ditampilkan.' : 'Furigana disembunyikan.';
  }

  function toast(message) {
    const element = document.querySelector('#toast');
    clearTimeout(toastTimer);
    element.textContent = message;
    element.hidden = false;
    toastTimer = setTimeout(() => {
      element.hidden = true;
    }, 4000);
  }

  const fullscreenUse = fullscreenButton.querySelector('use');
  let autoFullscreenPending = Boolean(document.fullscreenEnabled && document.documentElement.requestFullscreen);

  function disarmAutoFullscreen() {
    autoFullscreenPending = false;
    document.removeEventListener('click', handleFirstFullscreenGesture, true);
    document.removeEventListener('keydown', handleFirstFullscreenGesture, true);
  }

  async function enterFullscreenSilently() {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Ignore fullscreen denials when triggered opportunistically on first interaction
    }
  }

  function handleFirstFullscreenGesture(event) {
    if (!autoFullscreenPending || !event.isTrusted) return;
    if (event.type === 'click') {
      const clickedToggle = event.target?.closest?.('#fullscreen-button');
      disarmAutoFullscreen();
      if (clickedToggle || document.fullscreenElement) return;
      enterFullscreenSilently();
      return;
    }
    if (event.type === 'keydown') {
      if (['Escape', 'Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      const pressedF = event.key.toLowerCase() === 'f';
      disarmAutoFullscreen();
      if (pressedF || document.fullscreenElement) return;
      enterFullscreenSilently();
    }
  }

  async function toggleFullscreen() {
    disarmAutoFullscreen();
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else toast('Browser ini belum mendukung layar penuh. Gunakan mode lanskap untuk ruang lebih luas.');
    } catch {
      toast('Layar penuh tidak tersedia di jendela ini. Buka langsung di browser untuk memakai fitur ini.');
    }
  }

  document.querySelectorAll('[data-go]').forEach(button => {
    button.addEventListener('click', () => goToSlide(Number(button.dataset.go), { focus: true }));
  });

  document.querySelector('.brand').addEventListener('click', event => {
    event.preventDefault();
    goToSlide(0, { focus: true });
  });

  previousButton.addEventListener('click', () => goToSlide(currentSlide - 1, { focus: true }));
  nextButton.addEventListener('click', () => goToSlide(currentSlide + 1, { focus: true }));
  furiganaToggle.addEventListener('click', toggleFurigana);
  fullscreenButton.addEventListener('click', toggleFullscreen);
  if (mobileSlideTrigger) {
    mobileSlideTrigger.addEventListener('click', toggleMobileNav);
  }
  document.addEventListener('click', event => {
    if (slideNav?.classList.contains('is-open') && !event.target.closest('#slide-nav-list, #mobile-slide-trigger')) {
      closeMobileNav();
    }
  });

  tenseButtons.forEach(btn => {
    btn.addEventListener('click', () => applyTense(btn.dataset.tense));
  });

  flipButtons.forEach(btn => {
    btn.addEventListener('click', event => toggleFormulaFlip(btn.dataset.flipTarget, { restoreFocus: event.detail === 0 }));
  });

  window.addEventListener('hashchange', () => goToSlide(readHash(), { updateHash: false }));
  new ResizeObserver(fitStage).observe(stage);

  if (autoFullscreenPending) {
    document.addEventListener('click', handleFirstFullscreenGesture, true);
    document.addEventListener('keydown', handleFirstFullscreenGesture, true);
  }

  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    const label = active ? 'Keluar layar penuh' : 'Masuk layar penuh';
    fullscreenButton.setAttribute('aria-label', label);
    fullscreenButton.title = label + ' (F)';
    if (fullscreenUse) fullscreenUse.setAttribute('href', active ? '#collapse' : '#expand');
    fitStage();
    requestAnimationFrame(fitStage);
  });

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Escape' && slideNav?.classList.contains('is-open')) {
      event.preventDefault();
      closeMobileNav({ restoreFocus: true });
      return;
    }
    const target = event.target;
    if (target.closest('input, textarea, select, [contenteditable="true"]')) return;

    if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) {
      event.preventDefault();
      goToSlide(currentSlide + 1, { focus: true });
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      goToSlide(currentSlide - 1, { focus: true });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      goToSlide(event.key === 'Home' ? 0 : slides.length - 1, { focus: true });
    } else if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      toggleFullscreen();
    } else if (event.key === ' ' && !target.closest('button, a, summary')) {
      event.preventDefault();
      goToSlide(event.shiftKey ? currentSlide - 1 : currentSlide + 1, { focus: true });
    }
  });

  let touchStart = null;
  stage.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target.closest('button, input, textarea, a')) {
      touchStart = null;
      return;
    }
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });

  stage.addEventListener('touchend', event => {
    if (!touchStart || event.changedTouches.length !== 1) return;
    const deltaX = event.changedTouches[0].clientX - touchStart.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(deltaX) > 75 && Math.abs(deltaX) > Math.abs(deltaY) * 1.8) {
      if (deltaX < 0) goToSlide(currentSlide + 1, { focus: true });
      else goToSlide(currentSlide - 1, { focus: true });
    }
    touchStart = null;
  }, { passive: true });

  stage.addEventListener('touchcancel', () => {
    touchStart = null;
  }, { passive: true });

  window.addEventListener('beforeprint', () => {
    slides.forEach(slide => {
      slide.inert = false;
    });
  });

  window.addEventListener('afterprint', () => {
    slides.forEach((slide, index) => {
      slide.inert = index !== currentSlide;
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && currentSlide === 2) {
      requestAnimationFrame(() => syncFormulaSliders());
    }
  });

  fitStage();
  applyTense('present');
  goToSlide(readHash(), { updateHash: Boolean(location.hash), animate: false });
})();
