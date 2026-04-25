// PWA Helper — offline detection, A2HS prompt, image fallback
// Import this module in every HTML page

// ── Offline Notification Bar ──
export function initOfflineBar() {
  const bar = document.createElement('div');
  bar.id = 'offline-bar';
  bar.innerHTML = `
    <span class="offline-bar-text">📶 当前为离线模式，部分功能受限</span>
    <button class="offline-bar-close" aria-label="关闭提示">✕</button>
  `;
  bar.style.cssText = `
    position:fixed;top:0;left:0;right:0;z-index:10000;
    background:#fef3c7;color:#1a1a1a;
    padding:10px 16px;font-size:.85rem;font-weight:500;
    display:none;align-items:center;justify-content:center;gap:12px;
    box-shadow:0 2px 12px rgba(0,0,0,.1);
    transform:translateY(-100%);transition:transform .35s ease;
  `;
  bar.querySelector('.offline-bar-close').style.cssText = `
    background:none;border:none;cursor:pointer;font-size:1rem;
    color:#1a1a1a;padding:2px 6px;border-radius:4px;
    line-height:1;
  `;

  document.body.prepend(bar);

  function showBar() {
    bar.style.display = 'flex';
    requestAnimationFrame(() => { bar.style.transform = 'translateY(0)'; });
  }
  function hideBar() {
    bar.style.transform = 'translateY(-100%)';
    setTimeout(() => { bar.style.display = 'none'; }, 350);
  }

  // Check initial state
  if (!navigator.onLine) showBar();

  window.addEventListener('offline', showBar);
  window.addEventListener('online', () => {
    hideBar();
    // Optional: auto-reload cached page content on reconnect
  });

  bar.querySelector('.offline-bar-close').addEventListener('click', hideBar);
}

// ── Add to Home Screen (A2HS) Prompt ──
export function initA2HS() {
  const DISMISS_KEY = 'jinan-a2hs-dismissed';
  const DISMISS_DAYS = 7;

  // Check if user dismissed recently
  const dismissed = localStorage.getItem(DISMISS_KEY);
  if (dismissed) {
    const elapsed = Date.now() - parseInt(dismissed);
    if (elapsed < DISMISS_DAYS * 86400000) return;
  }

  // Check if already installed (standalone mode)
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  if (window.navigator.standalone === true) return;

  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show custom install card
    const card = document.createElement('div');
    card.id = 'a2hs-card';
    card.innerHTML = `
      <div class="a2hs-inner">
        <div class="a2hs-icon">⛲</div>
        <div class="a2hs-text">
          <strong>添加到主屏幕</strong>
          <span>随时离线查看济南旅游攻略</span>
        </div>
        <button class="a2hs-install">安装</button>
        <button class="a2hs-dismiss" aria-label="关闭">✕</button>
      </div>
    `;
    card.style.cssText = `
      position:fixed;bottom:80px;left:16px;right:16px;z-index:9999;
      max-width:480px;margin:0 auto;
      background:#fff;border-radius:16px;
      box-shadow:0 8px 40px rgba(0,0,0,.18),0 0 0 1px rgba(201,169,110,.25);
      padding:22px 24px;animation:a2hsSlideUp .4s ease;
    `;

    // Inject animation
    if (!document.getElementById('a2hs-styles')) {
      const style = document.createElement('style');
      style.id = 'a2hs-styles';
      style.textContent = `
        @keyframes a2hsSlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .a2hs-inner{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding-right:32px}
        .a2hs-icon{font-size:2.4rem;flex-shrink:0;line-height:1}
        .a2hs-text{flex:1;min-width:140px}
        .a2hs-text strong{display:block;font-size:1rem;color:#1a1a1a;margin-bottom:4px}
        .a2hs-text span{font-size:.82rem;color:#555;line-height:1.4}
        .a2hs-install{background:linear-gradient(135deg,#c9a96e,#b8963e);color:#fff;border:none;padding:10px 28px;border-radius:100px;font-size:.88rem;font-weight:700;cursor:pointer;transition:all .25s;white-space:nowrap;box-shadow:0 4px 12px rgba(201,169,110,.3)}
        .a2hs-install:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(201,169,110,.4)}
        .a2hs-dismiss{background:none;border:none;cursor:pointer;font-size:1.1rem;color:#888;padding:6px;position:absolute;top:14px;right:14px;line-height:1;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:all .2s}
        .a2hs-dismiss:hover{background:rgba(0,0,0,.06);color:#555}
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(card);

    card.querySelector('.a2hs-install').addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('A2HS: User accepted install');
      }
      deferredPrompt = null;
      card.remove();
    });

    card.querySelector('.a2hs-dismiss').addEventListener('click', () => {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
      card.remove();
    });
  });

  window.addEventListener('appinstalled', () => {
    console.log('A2HS: App installed');
    localStorage.removeItem(DISMISS_KEY);
    const card = document.getElementById('a2hs-card');
    if (card) card.remove();
  });
}

// ── Image Optimization & Fallback ──
export function initImageOptimization() {
  // Add decoding="async" and onerror fallback to all images
  const fallbackSvg = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect fill="#f0ebe3" width="400" height="250"/><text x="200" y="115" text-anchor="middle" fill="#c9a96e" font-size="48">🏔️</text><text x="200" y="155" text-anchor="middle" fill="#999" font-size="14" font-family="system-ui,sans-serif">图片加载失败</text></svg>')}`;

  function optimizeImage(img) {
    // Add decoding="async" if not already set
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }

    // Add error fallback
    img.addEventListener('error', function handleError() {
      img.removeEventListener('error', handleError);
      img.src = fallbackSvg;
      img.style.objectFit = 'contain';
      img.style.background = '#f0ebe3';
    }, { once: true });
  }

  // Process existing images
  document.querySelectorAll('img').forEach(optimizeImage);

  // Observe dynamically added images
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'IMG') optimizeImage(node);
        node.querySelectorAll?.('img').forEach(optimizeImage);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ── Service Worker Registration ──
export function initSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/jinan-travel-guide/sw.js')
        .then(reg => {
          console.log('SW registered:', reg.scope);
          // Check for updates periodically
          setInterval(() => reg.update(), 60 * 60 * 1000);
        })
        .catch(err => console.log('SW registration failed:', err));
    });
  }
}

// ── Init All PWA Features ──
export function initPWA() {
  initOfflineBar();
  initImageOptimization();
  initSW();
}
