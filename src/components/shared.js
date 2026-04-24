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

// Reveal on scroll
export function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
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

// Init all
export function initAll() {
  initDarkMode();
  initMobileMenu();
  initScrollProgress();
  initBackToTop();
  initReveal();
  initMobNav();
}
