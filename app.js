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
  const scenarioButtons = [...document.querySelectorAll('.scenario-btn')];
  const patternButtons = [...document.querySelectorAll('.pattern-btn')];
  const mobileSlideTrigger = document.querySelector('#mobile-slide-trigger');
  const mobileSlideLabel = document.querySelector('#mobile-slide-label');
  const slideNav = document.querySelector('#slide-nav-list');
  const mobile = window.matchMedia('(max-width: 900px)');

  let currentSlide = 0;
  let currentScenario = 'shop';
  let currentPattern = 'nodeshita';
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

  const SCENARIOS = {
    shop: {
      context: 'Kamu datang ke toko kue, lalu melihat papan jadwal tutup di kaca.',
      patterns: {
        nodeshita: {
          badge: 'Realisasi / Kesadaran Baru',
          jp: 'この<ruby>店<rt>みせ</rt></ruby>は、<ruby>毎<rt>まい</rt></ruby><ruby>週<rt>しゅう</rt></ruby><ruby>水<rt>すい</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>が<ruby>定<rt>てい</rt></ruby><ruby>休<rt>きゅう</rt></ruby><ruby>日<rt>び</rt></ruby><mark>なのでした</mark>。',
          id: '“Oh, ternyata toko ini memang libur tetap setiap hari Rabu.”',
          why: 'Mengungkapkan momen penutur baru menyadari atau mengingat fakta tersebut. Nadanya reflektif dan tidak kaku seperti analisis sebab-akibat.'
        },
        nodesu: {
          badge: 'Penjelasan Aktif Kini',
          jp: 'すみません、<ruby>今日<rt>きょう</rt></ruby>は<ruby>水<rt>すい</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>なので<ruby>休<rt>やす</rt></ruby>み<mark>なのです</mark>。',
          id: '“Maaf, karena hari ini hari Rabu, toko sedang libur.”',
          why: 'Dipakai staf untuk memberi tahu alasan kondisi saat ini secara langsung kepada pelanggan yang datang, bukan monolog penemuan diri sendiri.'
        },
        karadatta: {
          badge: 'Sebab Langsung Objektif',
          jp: '<ruby>店<rt>みせ</rt></ruby>が<ruby>閉<rt>し</rt></ruby>まっていたのは、<ruby>水<rt>すい</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>が<ruby>定<rt>てい</rt></ruby><ruby>休<rt>きゅう</rt></ruby><ruby>日<rt>び</rt></ruby>だ<mark>からだった</mark>。',
          id: '“Alasan toko itu tutup adalah karena hari Rabu merupakan hari libur tetap.”',
          why: 'Menunjuk sebab fisik/aturan secara langsung dan analitis. Fokusnya menjawab pertanyaan “kenapa tutup?”, tanpa kesan baru sadar.'
        },
        wakedatta: {
          badge: 'Kesimpulan Logis',
          jp: '<ruby>水<rt>すい</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>は<ruby>休<rt>やす</rt></ruby>みだから、<ruby>開<rt>あ</rt></ruby>いていない<mark>わけだった</mark>。',
          id: '“Karena hari Rabu libur, wajar saja kalau tokonya tidak buka.”',
          why: 'Menarik simpulan yang masuk akal dari dua fakta (Rabu libur + pintu terkunci). Menekankan logika “pantas saja”, bukan sekadar penuturan cerita.'
        }
      }
    },
    tanaka: {
      context: 'Kemarin Tanaka tiba-tiba bergegas pulang sebelum jam kerja selesai.',
      patterns: {
        nodeshita: {
          badge: 'Latar Belakang & Realisasi',
          jp: '<ruby>田<rt>た</rt></ruby><ruby>中<rt>なか</rt></ruby>さんが<ruby>急<rt>いそ</rt></ruby>いで<ruby>帰<rt>かえ</rt></ruby>ったのは、<ruby>家<rt>か</rt></ruby><ruby>族<rt>ぞく</rt></ruby>の<ruby>誕<rt>たん</rt></ruby><ruby>生<rt>じょう</rt></ruby><ruby>日<rt>び</rt></ruby>だっ<mark>たのでした</mark>。',
          id: '“Ternyata alasan Tanaka buru-buru pulang kemarin adalah ulang tahun keluarganya.”',
          why: 'Menceritakan kembali atau baru memahami latar belakang tindakan Tanaka dengan nuansa hangat dan reflektif.'
        },
        nodesu: {
          badge: 'Penjelasan Aktif Kini',
          jp: '<ruby>実<rt>じつ</rt></ruby>は、<ruby>今日<rt>きょう</rt></ruby>は<ruby>家<rt>か</rt></ruby><ruby>族<rt>ぞく</rt></ruby>の<ruby>誕<rt>たん</rt></ruby><ruby>生<rt>じょう</rt></ruby><ruby>日<rt>び</rt></ruby><mark>なのです</mark>。それで<ruby>先<rt>さき</rt></ruby>に<ruby>帰<rt>かえ</rt></ruby>ります。',
          id: '“Sebenarnya hari ini ulang tahun keluarga saya. Jadi saya pulang duluan ya.”',
          why: 'Diucapkan langsung oleh Tanaka pada saat izin pulang sekarang agar rekan kerjanya memahami situasinya saat itu juga.'
        },
        karadatta: {
          badge: 'Sebab Langsung Objektif',
          jp: '<ruby>彼<rt>かれ</rt></ruby>が<ruby>早<rt>そう</rt></ruby><ruby>退<rt>たい</rt></ruby>したのは、<ruby>家<rt>か</rt></ruby><ruby>族<rt>ぞく</rt></ruby>の<ruby>誕<rt>たん</rt></ruby><ruby>生<rt>じょう</rt></ruby><ruby>日<rt>び</rt></ruby>だっ<mark>たからだった</mark>。',
          id: '“Ia pulang lebih awal karena hari itu adalah ulang tahun keluarganya.”',
          why: 'Menyebut penyebab secara lugas dan objektif seperti catatan atau laporan peristiwa, tanpa nuansa penuturan cerita.'
        },
        wakedatta: {
          badge: 'Kesimpulan Logis',
          jp: '<ruby>家<rt>か</rt></ruby><ruby>族<rt>ぞく</rt></ruby>の<ruby>誕<rt>たん</rt></ruby><ruby>生<rt>じょう</rt></ruby><ruby>日<rt>び</rt></ruby>だから、あんなに<ruby>急<rt>いそ</rt></ruby>いでいた<mark>わけだった</mark>。',
          id: '“Karena ulang tahun keluarganya, pantas saja ia tampak begitu terburu-buru.”',
          why: 'Menghubungkan fakta ulang tahun dengan sikap terburu-buru tadi menjadi simpulan logis (“pantas saja begitu”).'
        }
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

  function renderDistinctionLab() {
    const scenario = SCENARIOS[currentScenario];
    const entry = scenario?.patterns[currentPattern];
    if (!scenario || !entry) return;

    document.querySelector('#lab-badge').textContent = entry.badge;
    document.querySelector('#lab-context').textContent = scenario.context;
    document.querySelector('#lab-sentence').innerHTML = entry.jp;
    document.querySelector('#lab-translation').textContent = entry.id;
    document.querySelector('#lab-why-text').textContent = entry.why;

    scenarioButtons.forEach(btn => {
      const active = btn.dataset.scenario === currentScenario;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    patternButtons.forEach(btn => {
      const active = btn.dataset.pattern === currentPattern;
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

  async function toggleFullscreen() {
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

  scenarioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentScenario = btn.dataset.scenario;
      renderDistinctionLab();
    });
  });

  patternButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentPattern = btn.dataset.pattern;
      renderDistinctionLab();
    });
  });

  window.addEventListener('hashchange', () => goToSlide(readHash(), { updateHash: false }));
  new ResizeObserver(fitStage).observe(stage);

  document.addEventListener('fullscreenchange', () => {
    const label = document.fullscreenElement ? 'Keluar layar penuh' : 'Masuk layar penuh';
    fullscreenButton.setAttribute('aria-label', label);
    fullscreenButton.title = label + ' (F)';
    fitStage();
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
  renderDistinctionLab();
  goToSlide(readHash(), { updateHash: Boolean(location.hash), animate: false });
})();
