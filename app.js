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
  const mobileSlideTrigger = document.querySelector('#mobile-slide-trigger');
  const mobileSlideLabel = document.querySelector('#mobile-slide-label');
  const slideNav = document.querySelector('#slide-nav-list');
  const mobile = window.matchMedia('(max-width: 900px)');

  let currentSlide = 0;
  let transitionTimer;
  let toastTimer;

  const TENSE_DATA = {
    present: {
      eqLeftV: 'V普通形 / Adj-<b lang="ja">い</b>',
      capV: 'Tempelkan langsung pada bentuk biasa tanpa sisipan partikel tambahan.',
      v1: ['読む', '読む（辞書）', '読むのでした'],
      v2: ['行く', '行かない', '行かないのでした'],
      v3: ['忙しい', '忙しくない', '忙しくないのでした'],
      eqLeftN: 'N / Adj-<b lang="ja">な</b> + <b lang="ja">な</b>',
      capN: 'Untuk bentuk kini positif, wajib menyisipkan <strong lang="ja">な</strong> sebelum <strong lang="ja">のでした</strong>.',
      n1: ['休日', '休日な', '休日なのでした'],
      n2: ['静か', '静かな', '静かなのでした'],
      n3: ['雨', '雨じゃない', '雨じゃないのでした']
    },
    past: {
      eqLeftV: 'V<b lang="ja">た</b>形 / Adj-<b lang="ja">かった</b>',
      capV: 'Ubah kata kerja ke bentuk lampau (た/なかった) atau kata sifat い ke かった.',
      v1: ['読む', '読んだ', '読んだのでした'],
      v2: ['行く', '行かなかった', '行かなかったのでした'],
      v3: ['忙しい', '忙しかった', '忙しかったのでした'],
      eqLeftN: 'N / Adj-<b lang="ja">な</b> + <b lang="ja">だった</b>',
      capN: 'Pada bentuk lampau, <strong lang="ja">な</strong> tidak dipakai; gunakan <strong lang="ja">だった</strong> atau <strong lang="ja">じゃなかった</strong>.',
      n1: ['休日', '休日だった', '休日だったのでした'],
      n2: ['静か', '静かだった', '静かだったのでした'],
      n3: ['雨', '雨じゃなかった', '雨じゃなかったのでした']
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
    announcer.textContent = 'Slide ' + (index + 1) + ' dari ' + slides.length + ': ' + slides[index].dataset.title;
  }

  function applyTense(tenseKey) {
    const data = TENSE_DATA[tenseKey];
    if (!data) return;

    document.querySelector('#eq-left-v').innerHTML = data.eqLeftV;
    document.querySelector('#cap-v').textContent = data.capV;
    document.querySelector('#v-step1-base').textContent = data.v1[0];
    document.querySelector('#v-step1-mid').textContent = data.v1[1];
    document.querySelector('#v-step1-out').textContent = data.v1[2];
    document.querySelector('#v-step2-base').textContent = data.v2[0];
    document.querySelector('#v-step2-mid').textContent = data.v2[1];
    document.querySelector('#v-step2-out').textContent = data.v2[2];
    document.querySelector('#v-step3-base').textContent = data.v3[0];
    document.querySelector('#v-step3-mid').textContent = data.v3[1];
    document.querySelector('#v-step3-out').textContent = data.v3[2];

    document.querySelector('#eq-left-n').innerHTML = data.eqLeftN;
    document.querySelector('#cap-n').innerHTML = data.capN;
    document.querySelector('#n-step1-base').textContent = data.n1[0];
    document.querySelector('#n-step1-mid').textContent = data.n1[1];
    document.querySelector('#n-step1-out').textContent = data.n1[2];
    document.querySelector('#n-step2-base').textContent = data.n2[0];
    document.querySelector('#n-step2-mid').textContent = data.n2[1];
    document.querySelector('#n-step2-out').textContent = data.n2[2];
    document.querySelector('#n-step3-base').textContent = data.n3[0];
    document.querySelector('#n-step3-mid').textContent = data.n3[1];
    document.querySelector('#n-step3-out').textContent = data.n3[2];

    tenseButtons.forEach(btn => {
      const active = btn.dataset.tense === tenseKey;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
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

  fitStage();
  applyTense('present');
  goToSlide(readHash(), { updateHash: Boolean(location.hash), animate: false });
})();
