document.addEventListener('DOMContentLoaded', () => {

// 1. PAGE LOADER
const loader = document.getElementById('pageLoader');
const loaderCounter = document.getElementById('loaderCounter');
const loaderFill = document.getElementById('loaderFill');
const loaderLogo = document.getElementById('loaderLogo');
const heroWords = document.querySelectorAll('.hero-word');

document.body.style.overflow = 'hidden';

// Fake loader progress
let progress = 0;
const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(finishLoad, 400);
    }
    loaderFill.style.width = progress + '%';
    loaderCounter.textContent = Math.round(progress).toString().padStart(2, '0');
}, 50);

setTimeout(() => {
    loaderLogo.style.opacity = 1;
    loaderLogo.style.transform = 'translateY(0)';
}, 100);

function finishLoad() {
    loader.style.opacity = 0;
    setTimeout(() => {
        loader.style.display = 'none';
        document.body.style.overflow = '';
        startHeroAnimations();
    }, 500);
}

function startHeroAnimations() {
    const nav = document.getElementById('mainNav');
    nav.classList.add('visible');
    
    heroWords.forEach((hw, i) => {
        setTimeout(() => {
            hw.classList.add('active');
        }, i * 60 + 300);
    });

    const sub = document.querySelector('.hero-sub');
    const actions = document.querySelector('.hero-actions');
    if (sub) {
        sub.style.opacity = '1';
        sub.style.transform = 'translateY(0)';
        sub.style.transition = 'opacity 1s, transform 1s';
    }
    if (actions) {
        setTimeout(() => {
            actions.style.opacity = '1';
            actions.style.transform = 'translateY(0)';
            actions.style.transition = 'opacity 0.8s, transform 0.8s';
        }, 200);
    }

    const scatters = document.querySelectorAll('.hero-scatter');
    scatters.forEach((el, i) => {
        el.style.transition = 'opacity 1s ease-out';
        setTimeout(() => {
            el.style.opacity = '1';
        }, i * 100 + 400);
    });
}

// 2. NAVBAR SCROLL
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
});

// 3. SCROLL PARALLAX (Hero scale & Hero scatter)
const heroMain = document.getElementById('heroMain');
const heroContent = document.querySelector('.hero-content');
const heroSpinner = document.querySelector('.hero-spinner');
const heroScatter = document.querySelectorAll('.hero-scatter');

function handleParallax() {
    const scrollY = window.scrollY;
    
    if (scrollY < window.innerHeight * 1.5) {
        // scale hero main
        if (heroMain) {
            let scale = Math.max(0.25, 1 - (scrollY / (window.innerHeight * 1.5)));
            let radius = Math.min(28, (scrollY / window.innerHeight) * 28);
            heroMain.style.transform = `scale(${scale})`;
            heroMain.style.borderRadius = `${radius}px`;
        }

        if (heroContent) {
            let op = Math.max(0, 1 - (scrollY / 300));
            heroContent.style.opacity = op;
            heroContent.style.transform = `translateY(-${scrollY * 0.2}px)`;
        }
        if (heroSpinner) {
            heroSpinner.style.opacity = Math.max(0, 1 - (scrollY / 200));
        }

        // scatter speed
        heroScatter.forEach((el, i) => {
            const indexSpeed = 0.15 + (i * 0.04);
            el.style.transform = `translateY(-${scrollY * indexSpeed}px)`;
        });
    }

    // Photo break animations
    document.querySelectorAll('.photo-full').forEach(pf => {
        const rect = pf.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            let progress = 1 - (rect.top / window.innerHeight);
            progress = Math.max(0, Math.min(1, progress));
            pf.style.width = `calc(100% - ${progress * 32}px)`;
            pf.style.borderRadius = `${progress * 24}px`;
        }
    });

    requestAnimationFrame(handleParallax);
}
requestAnimationFrame(handleParallax);

// 4. INTERSECTION OBSERVERS
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Deal with nested animations
            if (entry.target.classList.contains('chat-card')) {
                const msgs = entry.target.querySelectorAll('.c-msg');
                msgs.forEach(m => {
                    const d = parseInt(m.dataset.d) || 0;
                    setTimeout(() => m.classList.add('visible'), d);
                });
            }
            if (entry.target.classList.contains('stats-row-overlay')) {
                const nums = entry.target.querySelectorAll('.stat-num[data-count]');
                nums.forEach(n => {
                    if (!n.dataset.animated) {
                        n.dataset.animated = "true";
                        const target = parseInt(n.dataset.count);
                        const p = n.dataset.prefix || '';
                        const s = n.dataset.suffix || '';
                        let val = 0;
                        const inc = target / 30;
                        const tInt = setInterval(() => {
                            val += inc;
                            if (val >= target) {
                                val = target;
                                clearInterval(tInt);
                            }
                            n.textContent = p + Math.round(val) + s;
                        }, 30);
                    }
                });
            }
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.gs-reveal, .chat-card, .statement-line, .pr-card, .niche-pill, .stats-row-overlay').forEach(el => io.observe(el));

// Feature Image Swap
const observerImg = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const wrap = entry.target;
        const imgs = wrap.querySelectorAll('img');
        if (imgs.length < 2) return;
        if (entry.intersectionRatio > 0.5) {
            imgs[0].classList.add('hide');
            imgs[1].classList.remove('hide');
        } else {
            imgs[0].classList.remove('hide');
            imgs[1].classList.add('hide');
        }
    });
}, { threshold: [0, 0.5, 1] });
document.querySelectorAll('.feature-img-wrap').forEach(w => observerImg.observe(w));

// Deal Stack Rotator
const dealStack = document.getElementById('dealStack');
if (dealStack) {
    const dealData=[
      {id:'#4,291',label:'Espresso Machine',name:'Breville Oracle Touch',buyPlat:'FB Marketplace',sellPlat:'eBay',ask:'$1,200',bought:'$750',fee:'−$90',sold:'$1,340',profit:'+$500'},
      {id:'#4,292',label:'Office Chair',name:'Herman Miller Aeron',buyPlat:'Craigslist',sellPlat:'Apt Deco',ask:'$520',bought:'$380',fee:'−$48',sold:'$710',profit:'+$282'},
      {id:'#4,293',label:'Camera Body',name:'Canon EOS R6 Mark II',buyPlat:'OfferUp',sellPlat:'eBay',ask:'$1,800',bought:'$1,400',fee:'−$120',sold:'$2,050',profit:'+$530'}
    ];
    let idx = 0;
    
    function buildDeal(d) {
        const el = document.createElement('div');
        el.className = 'deal-stack-card';
        el.innerHTML = `<div class="dsc-bar"><span>Deal ${d.id} — <strong>${d.label}</strong></span><div class="dsc-live">AI Score: 94</div></div><div class="dsc-body"><div class="dsc-side"><div class="s-lbl">Listed At</div><div class="s-name">${d.name}</div><div class="s-plat">${d.buyPlat}</div><div class="s-price">${d.ask}</div></div><div class="dsc-arrow">→</div><div class="dsc-side"><div class="s-lbl">Resale Value</div><div class="s-name">${d.name}</div><div class="s-plat">${d.sellPlat}</div><div class="s-price sell">${d.sold}</div></div></div><div class="dsc-profit"><div class="dsc-profit-row"><div class="dsc-profit-item"><div class="plbl">Offer</div><div class="pval">${d.bought}</div></div><div class="dsc-profit-item"><div class="plbl">Est. Fee</div><div class="pval">${d.fee}</div></div></div><div class="dsc-profit-big"><div class="plbl">Projected Profit</div><div class="pval">${d.profit}</div></div></div>`;
        return el;
    }

    // Since we don't have GSAP, we will do a simpler fade exchange logic using CSS transitions.
    // For simplicity, we just rebuild it every 4s.
    setInterval(() => {
        idx = (idx + 1) % dealData.length;
        dealStack.innerHTML = '';
        const nc = buildDeal(dealData[idx]);
        nc.style.position = 'relative';
        nc.style.transform = 'translateY(10px)';
        nc.style.opacity = '0';
        nc.style.transition = 'transform 0.5s, opacity 0.5s';
        dealStack.appendChild(nc);
        setTimeout(() => {
            nc.style.transform = 'translateY(0)';
            nc.style.opacity = '1';
        }, 50);
    }, 4000);
}

// Controls
window.setControl = function(i) {
    document.querySelectorAll('.ct-btn').forEach((b, j) => b.classList.toggle('active', j === i));
    document.querySelectorAll('#controlDesc p').forEach((p, j) => p.classList.toggle('active', j === i));
}

// Testimonials
const tQ = document.querySelectorAll('#tQuote span'), tR = document.querySelectorAll('#tRole span'), tAv = document.querySelectorAll('.t-avatar');
window.setT = function(i) {
    tQ.forEach(s => s.classList.remove('active'));
    tR.forEach(s => s.classList.remove('active'));
    tAv.forEach(a => { if(a) a.classList.remove('active'); });
    if(tQ[i]) tQ[i].classList.add('active');
    if(tR[i]) tR[i].classList.add('active');
    if(tAv[i]) tAv[i].classList.add('active');
}

// Photo Scroller Infinite Animation
const photoScroller = document.getElementById('photoScroller');
if (photoScroller) {
    let scrollPos = 0;
    function infiniteScroll() {
        scrollPos -= 1;
        if (scrollPos <= -(photoScroller.scrollWidth / 2)) {
            scrollPos = 0;
        }
        photoScroller.style.transform = `translateX(${scrollPos}px)`;
        requestAnimationFrame(infiniteScroll);
    }
    infiniteScroll();
}

// Niche Search
window.submitNiche = function(val) {
    // simplified for brevity
    document.getElementById('nicheDefault').style.display='none';
    document.getElementById('nicheScanning').style.display='block';
    document.getElementById('scanLabel').textContent='Scanning "'+val.trim()+'" across marketplaces...';
    setTimeout(()=>{document.getElementById('scanFill').style.width='100%'}, 50);
    setTimeout(()=>{
        document.getElementById('nicheScanning').style.display='none';
        document.getElementById('nicheResult').style.display='block';
        document.getElementById('resultTitle').textContent='42 underpriced listings found';
    }, 2500);
}

});
