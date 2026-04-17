/**
 * Consolidated master script for Spread Clone Anniversary
 * Includes: GSAP animations, Password logic, real-time counter, and Music Player.
 */

gsap.registerPlugin(ScrollTrigger);

// ═══ GLOBAL STATE ═══
const startDate = new Date('2023-04-19T00:00:00');
const year3Date = new Date('2026-04-19T00:00:00');

const playlist = [
  { src: 'spread-assets/paru-paro.mp3', title: 'Paru-paro', artist: 'IV OF SPADES' },
  { src: 'spread-assets/most-beautiful-thing.mp3', title: 'The Most Beautiful Thing', artist: 'Bruno Major' },
  { src: 'spread-assets/apocalypse.mp3', title: 'Apocalypse', artist: 'Cigarettes After Sex' },
  { src: 'spread-assets/kabisado.mp3', title: 'Kabisado', artist: 'IV OF SPADES' },
  { src: 'spread-assets/medisina.mp3', title: 'Medisina', artist: 'Zild' },
  { src: 'spread-assets/satellite.mp3', title: 'Satellite', artist: 'Harry Styles' },
  { src: 'spread-assets/from-the-start.mp3', title: 'From The Start', artist: 'Laufey' },
  { src: 'spread-assets/count-on-me.mp3', title: 'Count On Me', artist: 'Bruno Mars' }
];

let currentTrack = 0;
let player = new Audio();
let isPlaying = false;

const nicheDB = ['Vintage watches', 'Vinyl records', 'Bike parts', 'Sneakers', 'Handbags', 'Mechanical keyboards', 'Vintage guitars', 'Film cameras', 'Designer furniture', 'Rare books', 'Lego sets', 'Vintage clothing', 'Golf clubs', 'Fishing gear', 'Board games', 'Telescopes', 'Art prints', 'Musical instruments', 'Vintage jewelry', 'Drones', '3D printers', 'KitchenAid mixers', 'Dyson products', 'Vintage rugs', 'Surfboards'];

// ═══ HELPER FUNCTIONS ═══

function reverseString(str) {
  return str.split("").reverse().join("");
}

function updateCounter() {
  const now = new Date();
  const cYears = document.getElementById('countYears');
  const cMonths = document.getElementById('countMonths');
  const cDays = document.getElementById('countDays');
  const cHomes = document.getElementById('countHours');
  const cMins = document.getElementById('countMins');
  const cSecs = document.getElementById('countSecs');

  if (!cYears || !cMonths || !cDays || !cHomes || !cMins || !cSecs) return;

  // Years
  let years = now.getFullYear() - startDate.getFullYear();
  let m = now.getMonth() - startDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < startDate.getDate())) {
    years--;
  }

  // Months
  let months = (now.getFullYear() - startDate.getFullYear()) * 12 + now.getMonth() - startDate.getMonth();
  if (now.getDate() < startDate.getDate()) {
    months--;
  }
  months = months % 12;

  // Days calculation (more accurate)
  const dayStartCalc = new Date(startDate);
  dayStartCalc.setFullYear(now.getFullYear());
  dayStartCalc.setMonth(now.getMonth());
  if (now < dayStartCalc) {
    dayStartCalc.setMonth(now.getMonth() - 1);
    // Correct date if previous month has fewer days
    const originalDate = startDate.getDate();
    const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    dayStartCalc.setDate(Math.min(originalDate, lastDayOfPrevMonth));
  } else {
    const originalDate = startDate.getDate();
    const lastDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    dayStartCalc.setDate(Math.min(originalDate, lastDayOfCurrentMonth));
  }

  let days = Math.floor((now - dayStartCalc) / (1000 * 60 * 60 * 24));
  if (days < 0) days = 0; // Boundary safety

  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  cYears.textContent = years;
  cMonths.textContent = months;
  cDays.textContent = days;
  cHomes.textContent = h;
  cMins.textContent = min;
  cSecs.textContent = s;

  // Milestone logic
  if (now >= year3Date) {
    const counterEl = document.getElementById('anniversaryCounter');
    if (counterEl) {
      const desc = counterEl.previousElementSibling.querySelector('h2');
      if (desc && !desc.textContent.includes('3 Years')) {
        desc.textContent = "3 Years Total and Counting.";
      }
    }
  }
}

// Music Player Initialization
player.addEventListener('ended', () => nextTrack());
player.addEventListener('canplay', () => {
  if (isPlaying) player.play().catch(e => console.log("Play failed:", e));
});

function nextTrack() {
  currentTrack = (currentTrack + 1) % playlist.length;
  loadTrack(currentTrack);
}

function loadTrack(idx) {
  if (!player) return;
  player.src = playlist[idx].src;
  player.load();
  if (isPlaying) {
    player.play().catch(e => console.log("Play blocked by browser:", e));
  }
  currentTrack = idx;

  // Update labels on the Front Card
  const activeCard = document.querySelector('#dealStack .deal-stack-card:first-child');
  if (activeCard) {
    const pt = activeCard.querySelector('.track-title');
    const pa = activeCard.querySelector('.track-artist');
    if (pt) pt.textContent = playlist[idx].title;
    if (pa) pa.textContent = playlist[idx].artist;
  }

  // Use a slight delay to ensure metadata is loaded for visual sync if needed
  if (window.syncPlayIcons) window.syncPlayIcons();
}

function updateProgressBar() {
  if (player && player.duration) {
    const duration = player.duration;
    if (duration > 0) {
      const current = player.currentTime;
      const pct = (current / duration) * 100;
      const pb = document.getElementById('progressBar');
      if (pb) pb.style.width = pct + '%';
    }
  }
  requestAnimationFrame(updateProgressBar);
}

// ═══ MAIN DOM LOGIC ═══
document.addEventListener('DOMContentLoaded', () => {

  /* ═══ PAGE LOADER & PASSWORD ═══ */
  const loader = document.getElementById('pageLoader');
  const heartContainer = document.getElementById('heartContainer');
  const passIn = document.getElementById('passIn');
  const loaderCounter = document.getElementById('loaderCounter');
  const loaderFill = document.getElementById('loaderFill');

  document.body.style.overflow = 'hidden';

  // The actual loading timeline
  const loadTL = gsap.timeline({
    paused: true,
    onComplete: () => {
      document.body.style.overflow = '';
      loader.style.display = 'none';
      // Init Lenis smooth scroll
      const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.5 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      initPage();
    }
  });

  loadTL.to({ val: 0 }, {
    val: 100, duration: 1.4, ease: 'power2.inOut',
    onUpdate: function () {
      const v = Math.round(this.targets()[0].val);
      loaderCounter.textContent = String(v).padStart(2, '0');
      loaderFill.style.width = v + '%';
    }
  }, 0);

  loadTL.to([heartContainer, loaderCounter, '#loaderLine'], { opacity: 0, y: -8, duration: .3, ease: 'power2.in', stagger: .04 }, 1.6);
  loadTL.to(loader, { yPercent: -100, duration: .7, ease: 'power3.inOut' }, 1.8);

  const entranceTL = gsap.timeline();
  entranceTL.to(heartContainer, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
  entranceTL.to('#passwordInputWrap', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');

  gsap.to(heartContainer, { scale: 1.15, repeat: -1, yoyo: true, duration: 0.8, ease: 'power1.inOut' });

  passIn.addEventListener('input', () => {
    const val = passIn.value.toLowerCase();
    if (val === 'love' || val === '3years') checkPass(true);
  });

  passIn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') checkPass(false);
  });

  function checkPass(isAuto) {
    const val = passIn.value.toLowerCase();
    const isCorrect = (val === 'love' || val === '3years');
    if (isCorrect) {
      gsap.to('#passwordInputWrap', {
        opacity: 0, y: -10, duration: 0.4, ease: 'power2.in', onComplete: () => {
          document.getElementById('passwordInputWrap').style.display = 'none';
          gsap.to(['#loaderLine', loaderCounter], { opacity: 1, duration: 0.4 });
          loadTL.play();
        }
      });
    } else if (!isAuto) {
      gsap.to('#passwordInputWrap', {
        x: 10, repeat: 3, yoyo: true, duration: 0.06, ease: 'power2.inOut', onComplete: () => {
          gsap.to('#passwordInputWrap', { x: 0, duration: 0.06 });
          passIn.value = '';
        }
      });
    }
  }

  /* ═══ PAGE INITIALIZATION ═══ */
  function initPage() {
    // Start music after password entry (user gesture)
    if (player && typeof loadTrack === 'function') {
      loadTrack(0);
    }

    // Counter Start
    setInterval(updateCounter, 1000);
    updateCounter();

    /* Hero text entrance */
    const heroWords = document.querySelectorAll('.hero-word span');
    gsap.to(heroWords, {
      y: '0%', opacity: 1, duration: 1.2, stagger: 0.06, ease: 'power3.out', delay: .3,
      onComplete: () => {
        heroWords.forEach(w => { w.style.transform = 'translateY(0%)'; w.style.opacity = '1' });
      }
    });
    gsap.fromTo('.hero-sub', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1 });
    gsap.fromTo('.hero-actions', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out', delay: 1.2 });

    gsap.to('.hero-content', { opacity: 0, y: -60, ease: 'none', scrollTrigger: { trigger: '.hero', start: '3% top', end: '14% top', scrub: true } });
    gsap.to('.hero-spinner', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '3% top', end: '10% top', scrub: true } });

    const heroMain = document.getElementById('heroMain');
    gsap.to(heroMain, {
      scale: .25, borderRadius: '28px',
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '30% top', scrub: true }
    });

    const scatterSpeeds = [-280, -400, -220, -360, -300, -250, -420, -240];
    document.querySelectorAll('.hero-scatter-wrap').forEach((el, i) => {
      // Parallax & Opacity (Outer Wrap)
      gsap.to(el, { opacity: 1, ease: 'none', scrollTrigger: { trigger: '.hero', start: '8% top', end: '18% top', scrub: true } });
      gsap.fromTo(el, { y: 400 + i * 30 }, { y: scatterSpeeds[i] || (-300), ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

      // Continuous drifting/floating effect (Inner Polaroid)
      const polaroid = el.querySelector('.hero-polaroid');
      if (polaroid) {
        gsap.to(polaroid, {
          x: (i % 2 === 0 ? 15 : -15),
          rotation: (i % 2 === 0 ? 3 : -3),
          duration: 3 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 2
        });
      }
    });



    const stLines = document.querySelectorAll('.statement-line span');
    stLines.forEach((span, i) => {
      gsap.to(span, { y: '0%', opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: span.parentElement, start: 'top 82%', toggleActions: 'play none none none' }, delay: i * .25 });
    });

    document.querySelectorAll('.feature-img-wrap').forEach(wrap => {
      gsap.from(wrap, { y: 40, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: wrap, start: 'top 88%', toggleActions: 'play none none none' } });

      // Toggle hidden image on click
      wrap.addEventListener('click', () => {
        wrap.classList.toggle('show-hidden');
      });
    });

    document.querySelectorAll('.pf-img').forEach(img => {
      const wrap = img.closest('.photo-full');
      gsap.fromTo(img, { scale: 1.25, y: '-12%' }, { scale: 1.02, y: '4%', ease: 'none', scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    document.querySelectorAll('.photo-full').forEach(el => {
      gsap.to(el, { width: 'calc(100% - 32px)', borderRadius: '24px', ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 20%', scrub: true } });
    });

    document.querySelectorAll('.gs-reveal').forEach(el => {
      gsap.from(el, { y: 28, opacity: 0, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' } });
    });

    const carnation = document.querySelector('.carnation-dec');
    if (carnation) {
      gsap.set(carnation, {
        yPercent: -90,
        x: 60, // starts tucked in
        scale: 0.9,
        rotation: -25, // tucked inwardly
        opacity: 0,
        transformOrigin: "80% 80%"
      });

      gsap.to(carnation, {
        x: -50, // push out further to the left
        scale: 1,
        opacity: 1,
        filter: 'drop-shadow(-8px 12px 16px rgba(0,0,0,0.5))',
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: carnation.closest('.feature-img-wrap'),
          start: 'top 75%',
          once: true
        },
        onComplete: () => {
          gsap.to(carnation, {
            y: "+=8", // Gentle float
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }
      });
    }

    ScrollTrigger.create({ trigger: '.niche-pills', start: 'top 85%', onEnter: () => { document.querySelectorAll('.niche-pill').forEach((el, i) => { setTimeout(() => el.classList.add('in'), i * 50) }) }, once: true });

    gsap.from('.control-section', { y: 120, ease: 'none', scrollTrigger: { trigger: '.control-section', start: 'top bottom', end: 'top 60%', scrub: true } });

    const chatCard = document.getElementById('chatCard');
    if (chatCard) {
      ScrollTrigger.create({ trigger: chatCard, start: 'top 78%', onEnter: () => { chatCard.querySelectorAll('.c-msg').forEach(m => { setTimeout(() => m.classList.add('visible'), parseInt(m.dataset.d) || 0) }) }, once: true });
    }

    document.querySelectorAll('.mag-btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * .2, y: y * .25, duration: .4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => { gsap.to(btn, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,0.4)' }) });
    });

    const scroller = document.getElementById('photoScroller');
    if (scroller) {
      const halfW = scroller.scrollWidth / 2;
      gsap.to(scroller, { x: -halfW, ease: 'none', duration: 40, repeat: -1, modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % halfW) } });
    }

    // ═══ MUSIC CARD STACK ═══
    function buildMusicCard(track) {
      const el = document.createElement('div'); el.className = 'deal-stack-card';
      el.innerHTML = `
          <div class="music-track-card">
            <div class="track-now-playing"><span></span>Now Playing</div>
            <div class="track-art">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="var(--muted-light)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z"/></svg>
            </div>
            <div class="track-title">${track.title}</div>
            <div class="track-artist">${track.artist}</div>
            
            <div class="card-progress-wrap">
              <div class="card-progress-top">
                <span class="curr-time">0:00</span>
                <span class="total-time">0:00</span>
              </div>
              <div class="card-progress">
                <div class="card-progress-bar"></div>
              </div>
            </div>

            <div class="card-player-controls">
              <button class="c-p-btn prev-btn">
                <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
              </button>
              <button class="c-p-btn play-pause-btn active-play">
                <svg viewBox="0 0 24 24" class="play-icon"><path d="M8 5v14l11-7z"/></svg>
                <svg viewBox="0 0 24 24" class="pause-icon" style="display:none"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <button class="c-p-btn next-btn">
                <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
              </button>
            </div>
          </div>
        `;
      return el;
    }

    const stackEl = document.getElementById('dealStack');
    if (stackEl) {
      let stackCards = [], stackIdx = 0, stackAnimating = false;
      const positions = [{ scale: 1, y: 12 }, { scale: .96, y: -14 }, { scale: .92, y: -40 }];

      function initStack() {
        for (let i = 0; i < 3; i++) {
          const c = buildMusicCard(playlist[(stackIdx + i) % playlist.length]);
          stackEl.appendChild(c);
          stackCards.push(c);
          gsap.set(c, { xPercent: -50, left: '50%', bottom: 0, ...positions[i], zIndex: 3 - i })
        }
        stackIdx = 3;
        updateActiveCardControls();
      }

      // (loadTrack moved to global scope)

      function cycleStack() {
        if (stackAnimating) return;
        stackAnimating = true;
        const front = stackCards[0];
        gsap.to(front, { y: 420, scale: 1.1, opacity: 0, duration: .6, ease: 'power2.inOut', onComplete: () => front.remove() });
        gsap.to(stackCards[1], { ...positions[0], zIndex: 3, duration: .6, ease: 'power2.inOut' });
        gsap.to(stackCards[2], { ...positions[1], zIndex: 2, duration: .6, ease: 'power2.inOut' });

        const nextTrackIdx = stackIdx % playlist.length;
        const nc = buildMusicCard(playlist[nextTrackIdx]);
        stackEl.appendChild(nc);
        gsap.set(nc, { xPercent: -50, left: '50%', bottom: 0, scale: .88, y: -60, zIndex: 1, opacity: 0 });
        gsap.to(nc, { ...positions[2], zIndex: 1, opacity: 1, duration: .6, ease: 'power2.inOut' });

        stackCards = [stackCards[1], stackCards[2], nc];
        stackIdx++;

        // Logic for track index:
        // stackIdx is now the one above the one just added at back.
        // Front card is stackIdx - 3.
        const currentVisibleTrackIdx = (stackIdx - 3 + playlist.length) % playlist.length;
        loadTrack(currentVisibleTrackIdx);

        updateActiveCardControls();
        setTimeout(() => { stackAnimating = false }, 650);
      }

      function reverseCycleStack() {
        if (stackAnimating) return;
        stackAnimating = true;

        const back = stackCards[2];
        back.remove();

        // The card we want to bring back to front is the one that was JUST before the current front.
        // Current front is (stackIdx - 3). Previous front is (stackIdx - 4).
        stackIdx--;
        const prevTrackIdx = (stackIdx - 3 + playlist.length) % playlist.length;
        const nc = buildMusicCard(playlist[prevTrackIdx]);

        // Insert at beginning of container so it's the "first-child"
        stackEl.insertBefore(nc, stackEl.firstChild);

        gsap.set(nc, { xPercent: -50, left: '50%', bottom: 0, y: 420, scale: 1.1, zIndex: 4, opacity: 0 });

        // Animate it onto the front position
        gsap.to(nc, { ...positions[0], zIndex: 3, opacity: 1, duration: .6, ease: 'power2.inOut' });
        gsap.to(stackCards[0], { ...positions[1], zIndex: 2, duration: .6, ease: 'power2.inOut' });
        gsap.to(stackCards[1], { ...positions[2], zIndex: 1, duration: .6, ease: 'power2.inOut' });

        stackCards = [nc, stackCards[0], stackCards[1]];

        loadTrack(prevTrackIdx);
        updateActiveCardControls();
        setTimeout(() => { stackAnimating = false }, 650);
      }

      function updateActiveCardControls() {
        const activeCard = stackCards[0];
        if (!activeCard) return;

        // Stop stackAnimating if it somehow gets stuck
        setTimeout(() => { stackAnimating = false }, 1000);

        const playBtn = activeCard.querySelector('.play-pause-btn');
        const nextBtn = activeCard.querySelector('.next-btn');
        const prevBtn = activeCard.querySelector('.prev-btn');
        const progress = activeCard.querySelector('.card-progress');

        if (playBtn) {
          playBtn.onclick = (e) => {
            e.stopPropagation();
            if (!player) return;
            if (isPlaying) { player.pause(); isPlaying = false; }
            else { player.play().catch(e => console.log("Play blocked:", e)); isPlaying = true; }
            syncPlayIcons();
          };
        }
        if (nextBtn) {
          nextBtn.onclick = (e) => { e.stopPropagation(); cycleStack(); };
        }
        if (prevBtn) {
          prevBtn.onclick = (e) => {
            e.stopPropagation();
            if (player && player.currentTime > 3) {
              player.currentTime = 0;
            } else {
              reverseCycleStack();
            }
          };
        }
        if (progress) {
          progress.onclick = (e) => {
            e.stopPropagation();
            if (!player || !player.duration) return;
            const rect = e.currentTarget.getBoundingClientRect(), pct = (e.clientX - rect.left) / rect.width;
            const duration = player.duration;
            if (duration > 0) player.currentTime = duration * pct;
          };
        }
      }

      window.loadTrackExtra = function () { syncPlayIcons(); };

      initStack();
      stackEl.addEventListener('click', (e) => {
        if (!e.target.closest('.c-p-btn')) cycleStack();
      });
    }

    // Keep icons in sync with isPlaying state
    window.syncPlayIcons = function () {
      document.querySelectorAll('.play-pause-btn').forEach(btn => {
        const playIcon = btn.querySelector('.play-icon');
        const pauseIcon = btn.querySelector('.pause-icon');
        if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
        if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
      });
    }

    // ═══ TESTIMONIAL ═══
    const tQ = document.querySelectorAll('#tQuote span'), tR = document.querySelectorAll('#tRole span'), tAv = document.querySelectorAll('.t-avatar');
    if (tQ.length && tR.length && tAv.length) {
      let tIdx = 0;
      let tTimer = setInterval(() => setT((tIdx + 1) % tQ.length), 5000);

      function setT(i) {
        if (i === tIdx && tQ[i].classList.contains('active')) return;

        tQ.forEach(s => s.classList.remove('active'));
        tR.forEach(s => s.classList.remove('active'));
        tAv.forEach(a => a.classList.remove('active'));

        tQ[i].classList.add('active');
        tR[i].classList.add('active');
        tAv[i].classList.add('active');

        // Background Image Change with Smooth Fade
        const bg = document.querySelector('.tb-bg');
        const bgImages = ['spread-assets/message.jpg', 'spread-assets/promise.jpg', 'spread-assets/journey.jpg', 'spread-assets/forever.jpg'];

        if (bg && bgImages[i]) {
          gsap.to(bg, {
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
              bg.src = bgImages[i];
              // Wait for image to load before fading in
              bg.onload = () => {
                gsap.to(bg, { opacity: 1, duration: 0.4 });
              };
              // Fallback in case onload doesn't fire (e.g. cached)
              if (bg.complete) {
                gsap.to(bg, { opacity: 1, duration: 0.4 });
              }
            }
          });
        }

        tIdx = i;
        clearInterval(tTimer);
        tTimer = setInterval(() => setT((tIdx + 1) % tQ.length), 5000);
      }
      tAv.forEach((av, i) => av.addEventListener('click', () => setT(i)));
    }

    // Initialize the first game
    setControl(0);
  }

  // Control Section Toggle
  window.setControl = function (idx) {
    const btns = document.querySelectorAll('.ct-btn');
    const descs = document.querySelectorAll('#controlDesc p');
    const wraps = document.querySelectorAll('.game-wrapper');

    btns.forEach((b, i) => {
      if (i === idx) b.classList.add('active');
      else b.classList.remove('active');
    });

    descs.forEach((p, i) => {
      if (i === idx) p.classList.add('active');
      else p.classList.remove('active');
    });

    wraps.forEach((w, i) => {
      w.style.display = (i === idx) ? 'flex' : 'none';
    });

    // Reset success state when switching
    document.getElementById('gameSuccess').style.display = 'none';

    // Init the game if needed
    if (idx === 0) initSudoku();
    else if (idx === 1) initWordSearch();
    else if (idx === 2) initMaze();
  }

  // ═══ SUDOKU 9x9 ═══
  let sudokuState = [];
  const sudokuSolution = [
    5, 3, 4, 6, 7, 8, 9, 1, 2,
    6, 7, 2, 1, 9, 5, 3, 4, 8,
    1, 9, 8, 3, 4, 2, 5, 6, 7,
    8, 5, 9, 7, 6, 1, 4, 2, 3,
    4, 2, 6, 8, 5, 3, 7, 9, 1,
    7, 1, 3, 9, 2, 4, 8, 5, 6,
    9, 6, 1, 5, 3, 7, 2, 8, 4,
    2, 8, 7, 4, 1, 9, 6, 3, 5,
    3, 4, 5, 2, 8, 6, 1, 7, 9
  ];
  const sudokuInitial = [
    5, 3, 0, 0, 7, 0, 0, 0, 0,
    6, 0, 0, 1, 9, 5, 0, 0, 0,
    0, 9, 8, 0, 0, 0, 0, 6, 0,
    8, 0, 0, 0, 6, 0, 0, 0, 3,
    4, 0, 0, 8, 0, 3, 0, 0, 1,
    7, 0, 0, 0, 2, 0, 0, 0, 6,
    0, 6, 0, 0, 0, 0, 2, 8, 0,
    0, 0, 0, 4, 1, 9, 0, 0, 5,
    0, 0, 0, 0, 8, 0, 0, 7, 9
  ];

  function initSudoku() {
    const grid = document.getElementById('sudokuGrid');
    if (!grid) return;
    grid.innerHTML = '';
    sudokuState = [...sudokuInitial];

    sudokuInitial.forEach((val, i) => {
      const cell = document.createElement('div');
      cell.className = 'sudoku-cell';
      if (val !== 0) {
        cell.classList.add('locked');
        cell.textContent = val;
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.inputMode = 'numeric';
        input.maxLength = 1;
        input.oninput = (e) => {
          const v = parseInt(e.target.value);
          if (v >= 1 && v <= 9) {
            sudokuState[i] = v;
            checkSudokuWin();
          } else {
            e.target.value = '';
            sudokuState[i] = 0;
          }
        };
        cell.appendChild(input);
      }
      grid.appendChild(cell);
    });
  }

  function checkSudokuWin() {
    const isWin = sudokuState.every((val, i) => val === sudokuSolution[i]);
    if (isWin) showGameSuccess("Perfect match! Parang tayo lang, loveyy. ❤️");
  }

  // ═══ WORD SEARCH ═══
  const wsWords = ['LOVE', 'ALWAYS', 'ANNIVERSARY', 'TOGETHER', 'FOREVER', 'STORY', 'ROMANCE', 'SMILE', 'THREE', 'YEARS', 'APRIL'];
  const wsLetters = [
    'A', 'L', 'W', 'A', 'Y', 'S', 'Y', 'E', 'A', 'R', 'S', 'S',
    'A', 'N', 'N', 'I', 'V', 'E', 'R', 'S', 'A', 'R', 'Y', 'M',
    'N', 'O', 'P', 'R', 'I', 'L', 'O', 'M', 'A', 'N', 'C', 'I',
    'I', 'V', 'E', 'R', 'S', 'A', 'R', 'Y', 'G', 'O', 'O', 'L',
    'T', 'O', 'G', 'E', 'T', 'H', 'E', 'R', 'H', 'U', 'N', 'E',
    'H', 'J', 'R', 'O', 'M', 'A', 'N', 'C', 'E', 'K', 'L', 'T',
    'R', 'O', 'A', 'P', 'R', 'I', 'L', 'C', 'A', 'T', 'O', 'X',
    'E', 'F', 'O', 'R', 'E', 'V', 'E', 'R', 'P', 'O', 'M', 'P',
    'E', 'S', 'T', 'O', 'R', 'Y', 'M', 'S', 'T', 'O', 'R', 'Y',
    'M', 'A', 'L', 'W', 'A', 'Y', 'S', 'L', 'M', 'N', 'O', 'P',
    'A', 'G', 'V', 'I', 'B', 'M', 'X', 'O', 'V', 'V', 'E', 'O',
    'S', 'I', 'A', 'P', 'R', 'I', 'L', 'S', 'L', 'O', 'V', 'E'
  ];
  let wsFound = [];
  let wsSelected = [];

  function initWordSearch() {
    const grid = document.getElementById('wordSearchGrid');
    const list = document.getElementById('wordList');
    if (!grid || !list) return;

    grid.innerHTML = '';
    list.innerHTML = '';
    wsFound = [];
    wsSelected = [];

    let isDragging = false;
    let startCellIdx = -1;
    const wsCols = 12;
    wsLetters.forEach((letter, i) => {
      const cell = document.createElement('div');
      cell.className = 'ws-cell';
      cell.textContent = letter;

      cell.onmousedown = (e) => {
        isDragging = true;
        startCellIdx = i;
        // Start fresh selection (keep 'found' class, only remove 'selected')
        document.querySelectorAll('.ws-cell').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        updateWordSearch();
      };

      cell.onmouseenter = () => {
        if (!isDragging || startCellIdx === -1) return;

        const startRow = Math.floor(startCellIdx / wsCols);
        const startCol = startCellIdx % wsCols;
        const curRow = Math.floor(i / wsCols);
        const curCol = i % wsCols;

        const dRow = curRow - startRow;
        const dCol = curCol - startCol;

        if (dRow === 0 || dCol === 0 || Math.abs(dRow) === Math.abs(dCol)) {
          document.querySelectorAll('.ws-cell').forEach(c => c.classList.remove('selected'));

          const stepRow = dRow === 0 ? 0 : dRow / Math.abs(dRow);
          const stepCol = dCol === 0 ? 0 : dCol / Math.abs(dCol);
          const steps = Math.max(Math.abs(dRow), Math.abs(dCol));

          const cells = document.querySelectorAll('.ws-cell');
          for (let step = 0; step <= steps; step++) {
            const r = startRow + step * stepRow;
            const c = startCol + step * stepCol;
            cells[r * wsCols + c].classList.add('selected');
          }

          updateWordSearch();
        }
      };

      grid.appendChild(cell);
    });

    // Reset isDragging on mouseup and clear unsuccessful selections
    const handleMouseUp = () => {
      if (typeof isDragging !== 'undefined') {
        isDragging = false;
        startCellIdx = -1;
        // Remove 'selected' from all cells; 'found' class keeps the highlight for found words
        document.querySelectorAll('.ws-cell').forEach(c => c.classList.remove('selected'));
      }
    };
    window.onmouseup = handleMouseUp;
    // Removed redundant window listener logic

    wsWords.forEach(word => {
      const item = document.createElement('div');
      item.className = 'word-item';
      item.textContent = word;
      item.id = `ws-item-${word}`;
      list.appendChild(item);
    });
  }

  function updateWordSearch() {
    const selectedCells = document.querySelectorAll('.ws-cell.selected');
    const selectedString = Array.from(selectedCells).map(c => c.textContent).join('');

    wsWords.forEach(word => {
      if (!wsFound.includes(word) && (selectedString.includes(word) || reverseString(selectedString).includes(word))) {
        wsFound.push(word);
        document.getElementById(`ws-item-${word}`).classList.add('found');
        selectedCells.forEach(c => {
          if (word.includes(c.textContent)) {
            c.classList.remove('selected');
            c.classList.add('found');
          }
        });
      }
    });

    if (wsFound.length === wsWords.length) showGameSuccess("Nahanap mo lahat! Galing talaga ng Pauline ko. ✨");
  }

  // ═══ 31x31 GRID MAZE ═══ (Synced with Reference Image)
  const mazeDim = 31;
  const mazeLayout = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1,
    1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
  ];

  let playerPos = -1;

  function initMaze() {
    const grid = document.getElementById('mazeGrid');
    if (!grid) return;
    grid.innerHTML = '';
    let isDrawing = false;
    playerPos = -1;

    mazeLayout.forEach((type, i) => {
      const cell = document.createElement('div');
      cell.className = 'm-cell';
      cell.dataset.index = i; // For easy lookup
      if (type === 1) cell.classList.add('wall');
      else if (type === 0) cell.classList.add('path');
      else if (type === 2) {
        cell.classList.add('start');
        cell.textContent = 'S';
        playerPos = i; // Initial position
      }
      else if (type === 3) {
        cell.classList.add('end');
        cell.textContent = '❤';
      }

      cell.onmousedown = (e) => {
        if (type === 2 || i === playerPos) {
          isDrawing = true;
          document.querySelectorAll('.m-cell').forEach(c => c.classList.remove('active'));
          cell.classList.add('active');
          playerPos = i;
        }
      };

      cell.onmouseenter = () => {
        if (!isDrawing) return;
        if (type === 1) {
          resetMaze();
          return;
        }
        cell.classList.add('active');
        playerPos = i;
        if (type === 3) {
          isDrawing = false;
          showGameSuccess("Nakarating ka rin sa puso ko. ❤️");
        }
      };

      grid.appendChild(cell);
    });

    // Ensure the player is marked at start
    if (playerPos !== -1) {
      const startCell = grid.children[playerPos];
      if (startCell) startCell.classList.add('active');
    }

    window.addEventListener('mouseup', () => {
      isDrawing = false;
    });

    // Keyboard arrow key support (attach only once)
    if (!window._mazeKeyListenerAttached) {
      window._mazeKeyListenerAttached = true;
      document.addEventListener('keydown', (e) => {
        const mazeVisible = document.getElementById('gameMaze') &&
          document.getElementById('gameMaze').style.display !== 'none';
        if (!mazeVisible) return;
        const map = {
          'ArrowUp': 'up',
          'ArrowDown': 'down',
          'ArrowLeft': 'left',
          'ArrowRight': 'right'
        };
        if (map[e.key]) {
          e.preventDefault(); // stop page from scrolling
          window.moveMazePlayer(map[e.key]);
        }
      });
    }
  }

  function resetMaze() {
    document.querySelectorAll('.m-cell').forEach(c => c.classList.remove('active'));
    // Restart from the 'S' cell
    mazeLayout.forEach((type, i) => {
      if (type === 2) {
        playerPos = i;
        const grid = document.getElementById('mazeGrid');
        if (grid && grid.children[i]) grid.children[i].classList.add('active');
      }
    });
  }

  window.moveMazePlayer = function (dir) {
    if (playerPos === -1) return;

    let nextPos = playerPos;
    const row = Math.floor(playerPos / mazeDim);
    const col = playerPos % mazeDim;

    if (dir === 'up' && row > 0) nextPos = playerPos - mazeDim;
    else if (dir === 'down' && row < mazeDim - 1) nextPos = playerPos + mazeDim;
    else if (dir === 'left' && col > 0) nextPos = playerPos - 1;
    else if (dir === 'right' && col < mazeDim - 1) nextPos = playerPos + 1;

    if (nextPos !== playerPos && mazeLayout[nextPos] !== 1) {
      playerPos = nextPos;
      const grid = document.getElementById('mazeGrid');
      const cells = grid.querySelectorAll('.m-cell');
      cells[playerPos].classList.add('active');

      if (mazeLayout[playerPos] === 3) {
        showGameSuccess("Nakarating ka rin sa puso ko. ❤️");
      }
    }
  }

  // ═══ GLOBALS ═══
  window.showGameSuccess = function (msg) {
    const success = document.getElementById('gameSuccess');
    if (success) {
      document.getElementById('successMessage').textContent = msg || "Nakarating ka rin sa puso ko.";
      success.style.display = 'flex';
      const controlRight = document.querySelector('.control-right');
      if (controlRight) spawnHeartBurst(controlRight);
    }
  }

  window.resetCurrentGame = function () {
    const btns = document.querySelectorAll('.ct-btn');
    let currentIdx = 0;
    btns.forEach((b, i) => { if (b.classList.contains('active')) currentIdx = i; });
    setControl(currentIdx);
  }

  // Memory Database for The Little Things
  const memoryDB = {
    'First Date': { img: 'spread-assets/pic2.jpg', cap: 'Yung unang beses tayong nagkita. Sobrang kaba ko nun.' },
    'Coffee Dates': { img: 'spread-assets/coffee.jpg', cap: 'Coffee shop hopping tayo palagi.' },
    'Sweet Dessert': { img: 'spread-assets/icecream.jpg', cap: 'Ending the day with something sweet, just like you.' },
    'Manaoag Church': { img: 'spread-assets/manaoag.jpg', cap: 'Our favorite place to pray and give thanks together.' },
    'Beach Walks': { img: 'spread-assets/beach.jpg', cap: 'Watching the waves, feeling your hand in mine. My favorite peace.' },
    'Travel Adventures': { img: 'spread-assets/travel.jpg', cap: 'First time natin sa Baguio magkasama!' },
    'Cooking Together': { img: 'spread-assets/luto.jpg', cap: 'Ang tagal lutuin, pero worth it sa sarap.' },
    'Flowers': { img: 'spread-assets/flower.jpg', cap: 'You deserve to be celebrated every single day, just because.' },
    'The Day': { img: 'spread-assets/day.jpg', cap: 'The day my life changed for the better. I love you, loveyy.' },
    'default': { img: 'spread-assets/placeholder.png', cap: 'Memory natin na hindi ko makakalimutan.' }
  };

  // Niche search global attachment
  window.submitNiche = function (val) {
    if (!val || val.trim().length < 2) return;

    // Hide results if another search is starting
    document.getElementById('nicheResult').style.display = 'none';
    document.getElementById('nicheScanning').style.display = 'block';

    // Reset polaroid scan progress and animation
    document.getElementById('scanFill').style.width = '0%';
    const polaroid = document.getElementById('nichePhoto');
    if (polaroid) {
      gsap.set(polaroid, { scale: 0, rotation: -15, opacity: 0 });
    }

    document.getElementById('scanLabel').textContent = 'Naaalala ko nung "' + val.trim() + '"...';
    setTimeout(() => { document.getElementById('scanFill').style.width = '100%' }, 50);

    setTimeout(() => {
      document.getElementById('nicheScanning').style.display = 'none';
      document.getElementById('nicheResult').style.display = 'block';

      // Look up memory or use default
      const lookupVal = val.trim();
      const mem = memoryDB[lookupVal] || memoryDB['default'];
      const imgEl = document.getElementById('nicheImg');
      const capEl = document.getElementById('nicheCap');

      if (imgEl) imgEl.src = mem.img;
      if (capEl) capEl.textContent = mem.cap;

      const count = Math.floor(Math.random() * 80) + 20;
      document.getElementById('resultTitle').textContent = lookupVal;
      document.getElementById('resultSub').textContent = 'Isa sa mga paborito kong memory natin.';

      // Animate Polaroid In
      if (polaroid) {
        gsap.to(polaroid, {
          scale: 1,
          rotation: Math.random() * 10 - 5, // Random slight tilt
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.5)'
        });
      }
    }, 2800);
  }

  // UPDATED ProgressBar Logic for dynamic cards
  function updateMasterProgressBar() {
    if (player && player.duration) {
      const duration = player.duration;
      if (duration > 0) {
        const current = player.currentTime;
        const pct = (current / duration) * 100;

        const fmt = (s) => {
          const m = Math.floor(s / 60);
          const sec = Math.floor(s % 60);
          return m + ":" + (sec < 10 ? '0' : '') + sec;
        };

        // Target all visible progress bars in the stack
        document.querySelectorAll('.card-progress-bar').forEach(pb => {
          pb.style.width = pct + '%';
        });

        // Update time labels on the front card primarily
        const activeCard = document.querySelector('.deal-stack-card:first-child');
        if (activeCard) {
          const curLbl = activeCard.querySelector('.curr-time');
          const totLbl = activeCard.querySelector('.total-time');
          if (curLbl) curLbl.textContent = fmt(current);
          if (totLbl) totLbl.textContent = fmt(duration);
        }
      }
    }
    requestAnimationFrame(updateMasterProgressBar);
  }
  updateMasterProgressBar();

  /* ═══ NICHE INPUT REMOVED ═══ */

  /* ═══ HEART BUBBLES ═══ */
  function initHeartBubbles(containerId, triggerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let bubbleInterval;

    function spawnHeart() {
      const heart = document.createElement('div');
      heart.className = 'heart-bubble';

      // Randomize
      const size = Math.floor(Math.random() * 16) + 12; // 12px to 28px
      const left = Math.floor(Math.random() * 100);
      const opacity = Math.random() * 0.4 + 0.1;
      const duration = Math.random() * 4 + 6; // 6s to 12s
      const sway = Math.random() * 40 + 20; // 20px to 60px sway

      heart.innerHTML = `
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        `;

      gsap.set(heart, { left: left + '%', opacity: 0, scale: 0.5, y: 0 });
      container.appendChild(heart);

      // Core animation
      const tl = gsap.timeline({ onComplete: () => heart.remove() });

      tl.to(heart, {
        opacity: opacity,
        scale: 1,
        duration: 1,
        ease: 'power1.out'
      }, 0);

      tl.to(heart, {
        y: -800,
        duration: duration,
        ease: 'none'
      }, 0);

      // Bubble swaying (sine wave)
      tl.to(heart, {
        x: sway,
        duration: duration / 4,
        repeat: 4,
        yoyo: true,
        ease: 'sine.inOut'
      }, 0);

      tl.to(heart, {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        ease: 'power1.in'
      }, duration - 1);
    }

    ScrollTrigger.create({
      trigger: triggerId,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => {
        bubbleInterval = setInterval(spawnHeart, 800);
      },
      onLeave: () => {
        clearInterval(bubbleInterval);
      },
      onEnterBack: () => {
        bubbleInterval = setInterval(spawnHeart, 800);
      },
      onLeaveBack: () => {
        clearInterval(bubbleInterval);
      }
    });
  }

  initHeartBubbles('heartBubbleContainer', '#deal');
  initHeartBubbles('nicheHeartContainer', '#niches');

  /* ═══ POLAROID HOVER BURST ═══ */
  function spawnHeartBurst(polaroidElement) {
    const count = 12;
    const colors = ['#E63222', '#FF6B6B', '#FF8E8E', '#D43F33'];

    // We append to the wrapper so it sits behind the hovered polaroid
    const parent = polaroidElement.parentNode;
    // ensure parent is positioned so absolute works
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-particle';
      const size = Math.random() * 12 + 8;
      const color = colors[Math.floor(Math.random() * colors.length)];

      heart.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>`;

      // GSAP uses xPercent and yPercent to center it exactly within the parent
      gsap.set(heart, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        scale: 0,
        opacity: 1,
        rotation: Math.random() * 360
      });
      parent.appendChild(heart);

      const angle = (i / count) * 360 + (Math.random() * 40 - 20);
      const distance = Math.random() * 100 + 70; // increased distance slightly
      const tx = Math.cos(angle * Math.PI / 180) * distance;
      const ty = Math.sin(angle * Math.PI / 180) * distance;

      gsap.to(heart, {
        x: tx,
        y: ty,
        scale: Math.random() * 0.5 + 0.8,
        opacity: 0,
        rotation: `+=${Math.random() * 180 - 90}`,
        duration: 2.0 + Math.random() * 1.5, // SLOW MOTION EFFECT
        ease: 'power2.out',
        onComplete: () => heart.remove()
      });
    }
  }

  function attachPolaroidListeners() {
    const polaroids = document.querySelectorAll('.hero-polaroid, .niche-polaroid');
    polaroids.forEach(p => {
      if (p.dataset.hasBurst) return;
      p.dataset.hasBurst = "true";

      p.addEventListener('mouseenter', (e) => {
        spawnHeartBurst(p);
      });
    });
  }

  // Initial attach
  attachPolaroidListeners();

  // Re-attach when niche search happens (since it might be hidden/empty initially)
  const originalSubmitNiche = window.submitNiche;
  window.submitNiche = function (val) {
    originalSubmitNiche(val);
    // Wait for the polaroid to animate in
    setTimeout(attachPolaroidListeners, 3000);
  };
});

