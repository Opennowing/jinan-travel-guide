/* ══════════════════════════════════════
   SHOPIFY-INSPIRED ANIMATIONS MODULE
   Smooth, performant, delightful
   ══════════════════════════════════════ */

// ─── 1. SCROLL-TRIGGERED REVEALS ───
// Enhanced IntersectionObserver with stagger groups and multiple reveal directions
export function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade');
  if (!reveals.length) return;

  // Group siblings for stagger
  const groups = new Map();
  reveals.forEach(el => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const parent = el.parentElement;
      const siblings = groups.get(parent) || [];
      const idx = siblings.indexOf(el);
      const delay = idx >= 0 ? idx * 80 : 0;
      setTimeout(() => el.classList.add('revealed'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => io.observe(el));
}

// ─── 2. PARALLAX HERO ───
// Subtle parallax on page-hero elements (Shopify-style depth)
export function initParallax() {
  const hero = document.querySelector('.page-hero, .hero');
  if (!hero) return;

  const layers = hero.querySelectorAll('.parallax-layer, .hero-slides');
  if (!layers.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const progress = -rect.top / hero.offsetHeight;
      if (progress >= 0 && progress <= 1.5) {
        layers.forEach((layer, i) => {
          const speed = (i + 1) * 0.15;
          const y = progress * speed * 100;
          layer.style.transform = `translate3d(0, ${y}px, 0)`;
        });
      }
      ticking = false;
    });
  }, { passive: true });
}

// ─── 3. ANIMATED COUNTERS ───
// Count up numbers when they scroll into view (Shopify stat blocks)
export function initCounters() {
  const counters = document.querySelectorAll('.counter, [data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count || el.textContent.replace(/[^0-9.]/g, ''));
    const suffix = el.dataset.suffix || el.textContent.replace(/[0-9.,]/g, '');
    const prefix = el.dataset.prefix || '';
    const decimals = (el.dataset.decimals || '0') | 0;
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = target * ease;
      el.textContent = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => {
    el.dataset.count = el.dataset.count || el.textContent.replace(/[^0-9.]/g, '');
    io.observe(el);
  });
}

// ─── 4. MAGNETIC BUTTONS ───
// Buttons subtly follow cursor (Shopify CTA effect)
export function initMagneticButtons() {
  if ('ontouchstart' in window) return; // Skip on touch devices
  const btns = document.querySelectorAll('.btn-magnetic, .btn-primary, .rec-btn');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(.23,1,.32,1)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
}

// ─── 5. SMOOTH CARD TILT ───
// 3D perspective tilt on card hover (Shopify product cards)
export function initCardTilt() {
  if ('ontouchstart' in window) return;
  const cards = document.querySelectorAll('.card, .culture-card, .people-card, .explore-card, .tool-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -6;
      const rotateY = (x - 0.5) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(.23,1,.32,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

// ─── 6. SMOOTH FILTER TRANSITIONS ───
// Animate cards in/out during filter changes
export function initFilterTransitions() {
  // Observe card-grid for child changes
  const grids = document.querySelectorAll('.card-grid');
  grids.forEach(grid => {
    const observer = new MutationObserver(() => {
      const cards = grid.querySelectorAll('.card');
      cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s cubic-bezier(.23,1,.32,1), transform 0.4s cubic-bezier(.23,1,.32,1)';
          card.style.opacity = '1';
          card.style.transform = '';
          setTimeout(() => { card.style.transition = ''; }, 400);
        }, i * 50);
      });
    });
    observer.observe(grid, { childList: true });
  });
}

// ─── 7. IMAGE REVEAL ON LOAD ───
// Graceful image fade-in with scale (Shopify image loading)
export function initImageReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .img-reveal { opacity: 0; transform: scale(1.04); transition: opacity 0.6s cubic-bezier(.23,1,.32,1), transform 0.6s cubic-bezier(.23,1,.32,1); }
    .img-reveal.loaded { opacity: 1; transform: scale(1); }
  `;
  document.head.appendChild(style);

  const imgs = document.querySelectorAll('.card-img img, .modal-img img');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.classList.add('img-reveal');
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      }
      io.unobserve(img);
    });
  }, { rootMargin: '100px' });
  imgs.forEach(img => io.observe(img));
}

// ─── 8. SCROLL-LINKED OPACITY ───
// Fade elements based on scroll position (Shopify hero text)
export function initScrollFade() {
  const elements = document.querySelectorAll('.scroll-fade');
  if (!elements.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        if (rect.top < viewH && rect.bottom > 0) {
          const progress = 1 - (rect.top / viewH);
          const opacity = Math.max(0, Math.min(1, progress * 1.5));
          el.style.opacity = opacity;
        }
      });
      ticking = false;
    });
  }, { passive: true });
}

// ─── 9. SMOOTH ANCHOR SCROLL ───
// Enhanced smooth scroll with offset for fixed nav
export function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

// ─── 10. PAGE LOAD SEQUENCE ───
// Staggered entrance animation on page load
export function initPageLoadSequence() {
  const elements = document.querySelectorAll('.page-hero h1, .page-hero p, .page-hero .eyebrow, .page-hero .btn');
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.6s cubic-bezier(.23,1,.32,1), transform 0.6s cubic-bezier(.23,1,.32,1)';
      el.style.opacity = '1';
      el.style.transform = '';
      setTimeout(() => { el.style.transition = ''; }, 600);
    }, 200 + i * 120);
  });
}

// ─── 11. STICKY SECTION INDICATOR ───
// Highlight active section in nav as user scrolls
export function initSectionIndicator() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.section-nav a, .nav-links a');
  if (!sections.length || !navLinks.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.id;
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
      ticking = false;
    });
  }, { passive: true });
}

// ─── 12. RIPPLE EFFECT (Enhanced) ───
export function initRippleEnhanced() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.card, .btn, .filter-btn, .tab-btn, .tool-card, .why-card');
    if (!target) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    target.style.position = target.style.position || 'relative';
    target.style.overflow = 'hidden';
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

// ═══ INIT ALL ═══
export function initShopifyAnimations() {
  // Respect user motion preferences
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  initScrollReveals();
  initParallax();
  initCounters();
  initMagneticButtons();
  initCardTilt();
  initFilterTransitions();
  initImageReveal();
  initScrollFade();
  initSmoothScroll();
  initPageLoadSequence();
  initRippleEnhanced();
  initSectionFade();
  initStaggerChildren();
  initSmoothFilter();
}

// ─── 13. SECTION FADE-IN ───
// Smooth section entrance as user scrolls
export function initSectionFade() {
  const sections = document.querySelectorAll('.section, .section-alt');
  if (!sections.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s cubic-bezier(.23,1,.32,1), transform 0.8s cubic-bezier(.23,1,.32,1)';
    io.observe(section);
  });
}

// ─── 14. STAGGER CHILDREN ───
// Auto-stagger direct children of elements with .stagger-parent class
export function initStaggerChildren() {
  const parents = document.querySelectorAll('.stagger-parent');
  parents.forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 60}ms`;
    });
  });
}

// ─── 15. SMOOTH FILTER ANIMATION ───
// Animate card grid when filters change (Shopify collection filtering)
export function initSmoothFilter() {
  const grids = document.querySelectorAll('.card-grid');
  grids.forEach(grid => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          const cards = grid.querySelectorAll('.card');
          cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px) scale(0.96)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.35s cubic-bezier(.23,1,.32,1), transform 0.35s cubic-bezier(.23,1,.32,1)';
              card.style.opacity = '1';
              card.style.transform = '';
            }, i * 40);
          });
        }
      });
    });
    observer.observe(grid, { childList: true });
  });
}
