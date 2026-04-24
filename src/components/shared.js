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
