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

// Init all
export function initAll() {
  initDarkMode();
  initMobileMenu();
  initScrollProgress();
  initBackToTop();
  initStaggerReveal();
  initMobNav();
  initNavScroll();
  initLazyImages();
  initRipple();
  initSwipeNav();
}
