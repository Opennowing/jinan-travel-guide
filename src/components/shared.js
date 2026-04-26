/* ═══ SHARED COMPONENTS JS ═══ */

// Dark mode toggle
export function initDarkMode() {
  const html = document.documentElement;
  const btn = document.querySelector('.dark-toggle');
  const saved = localStorage.getItem('jinan-dark');
  if (saved === 'true') html.classList.add('dark');
  if (btn) {
    btn.textContent = html.classList.contains('dark') ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      html.classList.toggle('dark');
      const isDark = html.classList.contains('dark');
      localStorage.setItem('jinan-dark', isDark);
      btn.textContent = isDark ? '☀️' : '🌙';
    });
  }
}

// Mobile menu
export function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      links.classList.toggle('mob-open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('mob-open'));
    });
  }
}

// Scroll progress
export function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / h * 100) + '%';
  }, { passive: true });
}

// Back to top
export function initBackToTop() {
  const btn = document.querySelector('.btt');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('vis', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Modal utility
export function openModal(html) {
  let overlay = document.querySelector('.modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal"><button class="modal-close">✕</button><div class="modal-content"></div></div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }
  overlay.querySelector('.modal-content').innerHTML = html;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Skeleton card generator
export function skeletonCards(n = 6) {
  let html = '';
  for (let i = 0; i < n; i++) {
    html += `<div class="card skeleton-card">
      <div class="skeleton-img skeleton"></div>
      <div class="card-body">
        <div class="skeleton skeleton-line" style="width:70%"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-line xshort"></div>
      </div>
    </div>`;
  }
  return html;
}

// Stars helper
export function stars(n) {
  let s = '';
  for (let i = 0; i < 5; i++) s += i < Math.floor(n) ? '★' : '☆';
  return s;
}

// Reveal on scroll (legacy, now handled by initStaggerReveal in initAll)
export function initReveal() {
  initStaggerReveal();
}

// Mobile bottom nav active state
export function initMobNav() {
  const links = document.querySelectorAll('.mob-nav a');
  links.forEach(a => {
    if (a.getAttribute('href') === location.pathname.replace(/.*\//,'') || 
        (a.getAttribute('href') === 'index.html' && (location.pathname.endsWith('/') || location.pathname.endsWith('index.html')))) {
      a.classList.add('active');
    }
  });
}

// Nav scroll effect
export function initNavScroll() {
  const nav = document.querySelector('.top-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// Lazy image loading with blur-up
export function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if (!imgs.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.parentElement.classList.add('img-loading');
      img.addEventListener('load', () => {
        img.parentElement.classList.remove('img-loading');
        img.classList.add('img-loaded');
      }, {once:true});
      img.addEventListener('error', () => {
        img.parentElement.classList.remove('img-loading');
        img.src = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect fill="#e8dcc8" width="400" height="250"/><text x="200" y="120" text-anchor="middle" fill="#c9a96e" font-size="40">🏔️</text><text x="200" y="160" text-anchor="middle" fill="#999" font-size="14" font-family="sans-serif">图片加载中...</text></svg>');
        img.classList.add('img-loaded');
      }, {once:true});
      io.unobserve(img);
    });
  }, {rootMargin:'200px'});
  imgs.forEach(img => io.observe(img));
}

// Ripple effect on interactive cards
export function initRipple() {
  document.addEventListener('click', e => {
    const card = e.target.closest('.card, .highlight-card, .route-card, .tool-card');
    if (!card) return;
    card.style.position = card.style.position || 'relative';
    card.style.overflow = 'hidden';
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

// Mobile swipe gesture for page navigation
export function initSwipeNav() {
  if (window.innerWidth > 768) return;
  const pages = ['index.html','spots.html','food.html','itinerary.html','guide.html','culture.html'];
  const current = location.pathname.replace(/.*\//,'') || 'index.html';
  const idx = pages.indexOf(current);
  if (idx < 0) return;
  let startX = 0;
  document.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; }, {passive:true});
  document.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].screenX;
    if (Math.abs(diff) < 80) return;
    if (diff > 0 && idx < pages.length - 1) location.href = pages[idx + 1];
    else if (diff < 0 && idx > 0) location.href = pages[idx - 1];
  }, {passive:true});
}

// Stagger reveal on scroll
export function initStaggerReveal() {
  const io = new IntersectionObserver((entries) => {
    let delay = 0;
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => { e.target.classList.add('revealed'); }, delay);
        delay += 80;
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
}



// ─── Image Lazy Load with Skeleton Screen ───
export function initLazyImageSkeleton() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const container = entry.target;
      const img = container.querySelector('img');
      if (!img) { io.unobserve(container); return; }
      container.classList.add('img-loading');
      container.classList.remove('img-loaded');
      let skeleton = container.querySelector('.img-skeleton');
      if (!skeleton) {
        skeleton = document.createElement('div');
        skeleton.className = 'img-skeleton';
        skeleton.style.cssText = 'position:absolute;inset:0;z-index:2;background:var(--bg2);display:flex;align-items:center;justify-content:center;';
        skeleton.innerHTML = '<div style="width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite"></div>';
        container.appendChild(skeleton);
      }
      const onLoad = () => {
        container.classList.remove('img-loading');
        container.classList.add('img-loaded');
        if (skeleton) { skeleton.style.opacity='0'; skeleton.style.transition='opacity .3s'; setTimeout(()=>skeleton.remove(),300); }
      };
      const onError = () => {
        container.classList.remove('img-loading');
        container.classList.add('img-loaded');
        if (skeleton) skeleton.remove();
        img.src = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect fill="#e8dcc8" width="400" height="250"/><text x="200" y="120" text-anchor="middle" fill="#c9a96e" font-size="40">🏔️</text><text x="200" y="160" text-anchor="middle" fill="#999" font-size="14" font-family="sans-serif">图片加载中</text></svg>');
      };
      if (img.complete && img.naturalWidth > 0) { onLoad(); }
      else { img.addEventListener('load', onLoad, {once:true}); img.addEventListener('error', onError, {once:true}); }
      io.unobserve(container);
    });
  }, { rootMargin: '300px 0px' });
  document.querySelectorAll('.card-img, .img-container').forEach(el => {
    if (!el.querySelector('img')) return;
    io.observe(el);
  });
}

// ─── Back to Top with Progress Ring ───
export function initBackToTopEnhanced() {
  const btn = document.querySelector('.btt');
  if (!btn) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.style.cssText = 'position:absolute;inset:-4px;width:56px;height:56px;transform:rotate(-90deg);pointer-events:none;';
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx','24'); circle.setAttribute('cy','24'); circle.setAttribute('r','22');
  circle.setAttribute('fill','none'); circle.setAttribute('stroke','rgba(255,255,255,.3)');
  circle.setAttribute('stroke-width','2');
  const circ = 2 * Math.PI * 22;
  circle.setAttribute('stroke-dasharray', circ);
  circle.setAttribute('stroke-dashoffset', circ);
  circle.style.transition = 'stroke-dashoffset .15s linear';
  svg.appendChild(circle);
  btn.style.position = 'relative';
  btn.appendChild(svg);
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / scrollH, 1);
      circle.setAttribute('stroke-dashoffset', `${circ * (1 - progress)}`);
      btn.classList.toggle('vis', window.scrollY > 400);
      ticking = false;
    });
  }, {passive:true});
  btn.addEventListener('click', () => {
    const start = window.scrollY;
    const duration = 600;
    const startTime = performance.now();
    function easeOutCubic(t) { return 1 - Math.pow(1-t,3); }
    function step(now) {
      const elapsed = now - startTime;
      const p = Math.min(elapsed/duration, 1);
      window.scrollTo(0, start * (1 - easeOutCubic(p)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ─── Page Transition ───
export function initPageTransition() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (href === location.pathname.replace(/.*\//,'')) return;
    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(() => { location.href = href; }, 300);
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) overlay.classList.remove('active'); });
}

// ─── Scroll Progress Enhanced ───
export function initScrollProgressEnhanced() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / h;
      bar.style.width = (progress * 100) + '%';
      const hue = 40 + progress * 20;
      bar.style.background = `linear-gradient(90deg, hsl(${hue},70%,55%), hsl(${hue+20},65%,50%))`;
      ticking = false;
    });
  }, {passive:true});
}

// ─── Rating Stars Visual ───
export function renderRatingStars(rating, count) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  let html = '<span class="rating-visual"><span class="star-bar">';
  for (let i = 0; i < 5; i++) {
    if (i < full) html += '<span style="color:#f59e0b">★</span>';
    else if (i === full && hasHalf) html += '<span style="color:#f59e0b">★</span>';
    else html += '<span style="color:var(--text3)">☆</span>';
  }
  html += '</span>';
  html += `<span class="score">${rating}</span>`;
  if (count) html += `<span class="count">(${count})</span>`;
  html += '</span>';
  return html;
}

// Add spin animation for skeleton loader
const _spinStyle = document.createElement('style');
_spinStyle.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(_spinStyle);

// ─── Card Interactions (favorites + card click) ───
export function initCardInteractions() {
  // 收藏按钮点击事件
  document.addEventListener('click', e => {
    const favBtn = e.target.closest('.card-fav-btn');
    if (!favBtn) return;
    e.stopPropagation();
    const id = favBtn.dataset.id;
    const type = favBtn.dataset.type; // 'spot' or 'food'
    toggleFavorite(id, type, favBtn);
  });

  // 卡片点击跳转（排除按钮点击）
  document.addEventListener('click', e => {
    const card = e.target.closest('.card[data-href]');
    if (!card || e.target.closest('.card-fav-btn')) return;
    location.href = card.dataset.href;
  });

  // 初始化已收藏状态
  initFavStates();
}

function toggleFavorite(id, type, btn) {
  const key = `jinan-fav-${type}`;
  const favs = JSON.parse(localStorage.getItem(key) || '[]');
  const idx = favs.indexOf(id);
  if (idx >= 0) {
    favs.splice(idx, 1);
    btn.classList.remove('active');
    btn.textContent = '♡';
    showToast('已取消收藏');
  } else {
    favs.push(id);
    btn.classList.add('active');
    btn.textContent = '♥';
    showToast('已收藏');
  }
  localStorage.setItem(key, JSON.stringify(favs));
}

function initFavStates() {
  ['spot', 'food'].forEach(type => {
    const key = `jinan-fav-${type}`;
    const favs = JSON.parse(localStorage.getItem(key) || '[]');
    document.querySelectorAll(`.card-fav-btn[data-type="${type}"]`).forEach(btn => {
      if (favs.includes(btn.dataset.id)) {
        btn.classList.add('active');
        btn.textContent = '♥';
      }
    });
  });
}

export function showToast(msg, duration = 2000) {
  let toast = document.getElementById('jinan-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'jinan-toast';
    toast.className = 'jinan-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ─── Enhanced Lazy Image Skeleton with WebP + Priority ───
export function initLazyImageSkeletonEnhanced() {
  // WebP detection
  let webpSupported = false;
  const webpTest = new Image();
  webpTest.onload = () => { webpSupported = true; };
  webpTest.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const container = entry.target;
      const img = container.querySelector('img');
      if (!img) { io.unobserve(container); return; }
      container.classList.add('img-loading');
      container.classList.remove('img-loaded');

      let skeleton = container.querySelector('.img-skeleton');
      if (!skeleton) {
        skeleton = document.createElement('div');
        skeleton.className = 'img-skeleton';
        skeleton.style.cssText = 'position:absolute;inset:0;z-index:2;background:var(--bg3);display:flex;align-items:center;justify-content:center;';
        skeleton.innerHTML = '<div style="width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite"></div>';
        container.appendChild(skeleton);
      }

      const onLoad = () => {
        container.classList.remove('img-loading');
        container.classList.add('img-loaded');
        if (skeleton) { skeleton.style.opacity='0'; skeleton.style.transition='opacity .3s'; setTimeout(()=>skeleton.remove(),300); }
      };
      const onError = () => {
        container.classList.remove('img-loading');
        container.classList.add('img-loaded');
        if (skeleton) skeleton.remove();
        // Generate a nicer SVG fallback
        const name = img.alt || '济南';
        const colors = [['#c9a96e','#e8dcc8'],['#2a9d8f','#d4f1ed'],['#e76f51','#fce4de'],['#8b5cf6','#ede9fe']];
        const ci = Math.abs([...name].reduce((a,c)=>a+c.charCodeAt(0),0)) % colors.length;
        const [bg,fg] = colors[ci];
        img.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect fill="${bg}" width="600" height="400" rx="12"/><text x="300" y="180" text-anchor="middle" font-size="50">🏔️</text><text x="300" y="240" text-anchor="middle" fill="${fg}" font-size="20" font-family="sans-serif" font-weight="bold">${name}</text></svg>`)}`;
      };

      if (img.complete && img.naturalWidth > 0) { onLoad(); }
      else { img.addEventListener('load', onLoad, {once:true}); img.addEventListener('error', onError, {once:true}); }

      // Priority: first 4 images load eagerly
      const allCards = document.querySelectorAll('.card-img, .img-container');
      const idx = [...allCards].indexOf(container);
      if (idx < 4) {
        img.loading = 'eager';
      }

      io.unobserve(container);
    });
  }, { rootMargin: '300px 0px' });

  document.querySelectorAll('.card-img, .img-container').forEach(el => {
    if (!el.querySelector('img')) return;
    io.observe(el);
  });
}


// Init all
export function initAll() {
  initDarkMode();
  initMobileMenu();
  initScrollProgressEnhanced();
  initBackToTopEnhanced();
  initStaggerReveal();
  initMobNav();
  initNavScroll();
  initLazyImageSkeleton();
  initRipple();
  initSwipeNav();
  initPageTransition();
  initCardInteractions();
}
