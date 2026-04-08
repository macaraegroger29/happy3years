/**
 * Consolidated master script for Spread Clone Anniversary
 * Includes: GSAP animations, Password logic, real-time counter, and Music Player.
 */

gsap.registerPlugin(ScrollTrigger);

// ═══ GLOBAL STATE ═══
const startDate = new Date('2023-04-19T00:00:00');
const year3Date = new Date('2026-04-19T00:00:00');

const playlist = [
    { id: '1nml-_YE2OU', title: 'The Most Beautiful Thing', artist: 'Bruno Major' },
    { id: 'sC75aU47GRk', title: 'K.', artist: 'Cigarettes After Sex' },
    { id: 'Lp7X6n4v_9M', title: 'Kabisado', artist: 'IV OF SPADES' },
    { id: 'sU2y32S8q-8', title: 'Medisina', artist: 'Zild' }
];

let currentTrack = 0;
let player;
let isPlaying = false;

const nicheDB = ['Vintage watches', 'Vinyl records', 'Bike parts', 'Sneakers', 'Handbags', 'Mechanical keyboards', 'Vintage guitars', 'Film cameras', 'Designer furniture', 'Rare books', 'Lego sets', 'Vintage clothing', 'Golf clubs', 'Fishing gear', 'Board games', 'Telescopes', 'Art prints', 'Musical instruments', 'Vintage jewelry', 'Drones', '3D printers', 'KitchenAid mixers', 'Dyson products', 'Vintage rugs', 'Surfboards'];

// ═══ HELPER FUNCTIONS ═══

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

// YT API Loader
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('ytPlayer', {
        height: '0',
        width: '0',
        videoId: playlist[currentTrack].id,
        playerVars: { 'autoplay': 0, 'controls': 0, 'disablekb': 1, 'enablejsapi': 1 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    const mp = document.getElementById('musicPlayer');
    if (mp) mp.classList.add('visible');
    updateProgressBar();
    loadTrack(0); // Prime the first track
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        nextTrack();
    }
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
}

function loadTrack(idx) {
    if (!player || !player.loadVideoById) return;
    player.loadVideoById(playlist[idx].id);
    player.playVideo(); // Force start after user gesture
    currentTrack = idx;

    // Update labels on the Front Card
    const activeCard = document.querySelector('#dealStack .deal-stack-card:first-child');
    if (activeCard) {
        const pt = activeCard.querySelector('.track-title');
        const pa = activeCard.querySelector('.track-artist');
        if (pt) pt.textContent = playlist[idx].title;
        if (pa) pa.textContent = playlist[idx].artist;
    }

    isPlaying = true;
    if (window.syncPlayIcons) window.syncPlayIcons();
}

function updateProgressBar() {
    if (player && player.getDuration) {
        const duration = player.getDuration();
        if (duration > 0) {
            const current = player.getCurrentTime();
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
      document.querySelectorAll('.hero-scatter').forEach((el, i) => {
        gsap.to(el, { opacity: 1, ease: 'none', scrollTrigger: { trigger: '.hero', start: '8% top', end: '18% top', scrub: true } });
        gsap.fromTo(el, { y: 400 + i * 30 }, { y: scatterSpeeds[i] || (-300), ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      });

      const stLines = document.querySelectorAll('.statement-line span');
      stLines.forEach((span, i) => {
        gsap.to(span, { y: '0%', opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: span.parentElement, start: 'top 82%', toggleActions: 'play none none none' }, delay: i * .25 });
      });

      document.querySelectorAll('.feature-img-wrap').forEach(wrap => {
        gsap.from(wrap, { y: 40, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: wrap, start: 'top 88%', toggleActions: 'play none none none' } });
        const imgs = wrap.querySelectorAll('img');
        if (imgs.length < 2) return;
        ScrollTrigger.create({ trigger: wrap, start: '40% center', onEnter: () => { imgs[0].classList.add('hide'); imgs[1].classList.remove('hide') }, onLeaveBack: () => { imgs[0].classList.remove('hide'); imgs[1].classList.add('hide') } });
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
                    if (!player || !player.pauseVideo) return;
                    if (isPlaying) { player.pauseVideo(); isPlaying = false; }
                    else { player.playVideo(); isPlaying = true; }
                    syncPlayIcons();
                };
            }
            if (nextBtn) {
                nextBtn.onclick = (e) => { e.stopPropagation(); cycleStack(); };
            }
            if (prevBtn) {
                prevBtn.onclick = (e) => { 
                    e.stopPropagation(); 
                    if (player && player.getCurrentTime && player.getCurrentTime() > 3) {
                        player.seekTo(0);
                    } else {
                        reverseCycleStack(); 
                    }
                };
            }
            if (progress) {
                progress.onclick = (e) => {
                    e.stopPropagation();
                    if (!player || !player.getDuration) return;
                    const rect = e.currentTarget.getBoundingClientRect(), pct = (e.clientX - rect.left) / rect.width;
                    const duration = player.getDuration();
                    if (duration > 0) player.seekTo(duration * pct, true);
                };
            }
        }

        window.loadTrackExtra = function() { syncPlayIcons(); };

        initStack();
        stackEl.addEventListener('click', (e) => { 
            if (!e.target.closest('.c-p-btn')) cycleStack(); 
        });
      }

      // Keep icons in sync with isPlaying state
      window.syncPlayIcons = function() {
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
        function setT(i) {
          tQ.forEach(s => s.classList.remove('active')); tR.forEach(s => s.classList.remove('active')); tAv.forEach(a => a.classList.remove('active'));
          tQ[i].classList.add('active'); tR[i].classList.add('active'); tAv[i].classList.add('active');
          tIdx = i; clearInterval(tTimer); tTimer = setInterval(() => setT((tIdx + 1) % tQ.length), 5000);
        }
        let tTimer = setInterval(() => setT((tIdx + 1) % tQ.length), 5000);
        tAv.forEach((av, i) => av.addEventListener('click', () => setT(i)));
      }
    }

    // Niche search global attachment
    window.submitNiche = function(val) {
      if (!val || val.trim().length < 2) return;
      document.getElementById('nicheDefault').style.display = 'none';
      document.getElementById('nicheScanning').style.display = 'block';
      document.getElementById('scanLabel').textContent = 'Scanning "' + val.trim() + '" across marketplaces...';
      setTimeout(() => { document.getElementById('scanFill').style.width = '100%' }, 50);
      setTimeout(() => {
        document.getElementById('nicheScanning').style.display = 'none';
        document.getElementById('nicheResult').style.display = 'block';
        const count = Math.floor(Math.random() * 80) + 20, spread = Math.floor(Math.random() * 300) + 120;
        document.getElementById('resultTitle').textContent = count + ' underpriced listings found';
        document.getElementById('resultSub').textContent = 'Average spread: $' + spread + '. Ready to start sending you alerts.';
      }, 2800);
    }

    // UPDATED ProgressBar Logic for dynamic cards
    function updateMasterProgressBar() {
        if (player && player.getDuration) {
            const duration = player.getDuration();
            if (duration > 0) {
                const current = player.getCurrentTime();
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

    /* ═══ NICHE INPUT ═══ */
    const nicheInput = document.getElementById('nicheInput');
    const nicheSug = document.getElementById('nicheSuggestions');
    const nicheSubmitBtn = document.getElementById('nicheSubmit');
    if (nicheInput) {
      nicheInput.addEventListener('input', function() {
        const q = this.value.toLowerCase().trim();
        nicheSug.innerHTML = '';
        if (q.length < 2) return;
        const matches = nicheDB.filter(n => n.toLowerCase().includes(q)).slice(0, 4);
        if (matches.length === 0 && q.length > 2) {
          nicheSug.innerHTML = '<span class="niche-sug" onclick="submitNiche(\'' + this.value + '\')">Search "' + this.value + '"</span>';
          return;
        }
        matches.forEach(m => {
          const s = document.createElement('span'); s.className = 'niche-sug'; s.textContent = m;
          s.addEventListener('click', () => { nicheInput.value = m; submitNiche(m) });
          nicheSug.appendChild(s);
        });
      });
      nicheInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); submitNiche(this.value) } });
    }
    if (nicheSubmitBtn) nicheSubmitBtn.addEventListener('click', () => submitNiche(nicheInput.value));

});
