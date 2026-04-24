/* ══════════════════════════════════════
   SOCIAL & INTERACTIVE FEATURES
   1. Share Card Generator
   2. Travel Journal (游记)
   3. Check-in Map (打卡地图)
   4. Rating Rankings (评价排行)
   5. Utility Widget (实用信息浮窗)
   ══════════════════════════════════════ */

// ── Helpers ──
const LS = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};

function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ══════════════════════════════════════
// 1. SHARE CARD GENERATOR
// ══════════════════════════════════════
export function initShareCards() {
  document.querySelectorAll('[data-share]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const cfg = JSON.parse(btn.dataset.share);
      await generateShareCard(cfg);
    });
  });
}

async function generateShareCard({ title = '济南旅游攻略', subtitle = '', items = [], page = 'index' }) {
  const W = 750, H = 1050;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(0.5, '#16213e');
  grad.addColorStop(1, '#0f3460');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Decorative circles
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#c9a96e';
  ctx.beginPath(); ctx.arc(600, 200, 250, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(150, 800, 180, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Top accent bar
  ctx.fillStyle = '#c9a96e';
  ctx.fillRect(0, 0, W, 6);

  // Brand logo area
  ctx.fillStyle = '#c9a96e';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('⛲ 泉城攻略', 40, 60);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '14px sans-serif';
  ctx.fillText('jinan-travel-guide', 40, 82);

  // Main title
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px "Noto Serif SC", serif, sans-serif';
  wrapText(ctx, title, 40, 180, W - 80, 60);

  // Subtitle
  if (subtitle) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '22px sans-serif';
    ctx.fillText(subtitle, 40, 260);
  }

  // Content items
  let y = 320;
  ctx.font = '20px sans-serif';
  items.forEach((item, i) => {
    if (y > 800) return;
    // Item background
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    roundRect(ctx, 30, y - 8, W - 60, 56, 12);
    ctx.fill();
    // Number
    ctx.fillStyle = '#c9a96e';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`${i + 1}`, 50, y + 28);
    // Name
    ctx.fillStyle = '#fff';
    ctx.font = '18px sans-serif';
    ctx.fillText(item.name || item, 80, y + 28);
    // Extra info
    if (item.info) {
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '14px sans-serif';
      ctx.fillText(item.info, 80, y + 48);
    }
    y += 68;
  });

  // QR code placeholder (simple pattern)
  const qrX = W - 170, qrY = H - 200;
  ctx.fillStyle = '#fff';
  ctx.fillRect(qrX, qrY, 130, 130);
  // Draw a simple QR-like pattern
  drawQRPattern(ctx, qrX + 10, qrY + 10, 110);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('扫码查看完整攻略', qrX + 65, qrY + 148);
  ctx.textAlign = 'left';

  // Bottom bar
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(0, H - 60, W, 60);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '14px sans-serif';
  ctx.fillText('🌊 济南旅游攻略 · 72泉涌，千年文脉', 40, H - 28);
  ctx.fillStyle = '#c9a96e';
  ctx.textAlign = 'right';
  ctx.fillText(new Date().toLocaleDateString('zh-CN'), W - 40, H - 28);
  ctx.textAlign = 'left';

  // Show in modal with download/copy buttons
  const dataUrl = canvas.toDataURL('image/png');
  showShareModal(dataUrl, title);
}

function drawQRPattern(ctx, x, y, size) {
  ctx.fillStyle = '#111';
  const cellSize = size / 11;
  // Corner squares
  const corners = [[0, 0], [8, 0], [0, 8]];
  corners.forEach(([cx, cy]) => {
    ctx.fillRect(x + cx * cellSize, y + cy * cellSize, 3 * cellSize, 3 * cellSize);
    ctx.clearRect(x + (cx + 0.5) * cellSize, y + (cy + 0.5) * cellSize, 2 * cellSize, 2 * cellSize);
    ctx.fillRect(x + (cx + 1) * cellSize, y + (cy + 1) * cellSize, cellSize, cellSize);
  });
  // Random data modules
  const rng = mulberry32(42);
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 11; c++) {
      if ((r < 4 && c < 4) || (r < 4 && c > 7) || (r > 7 && c < 4)) continue;
      if (rng() > 0.5) {
        ctx.fillStyle = '#111';
        ctx.fillRect(x + r * cellSize, y + c * cellSize, cellSize, cellSize);
      }
    }
  }
}

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const chars = text.split('');
  let line = '';
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(line, x, y);
      line = ch; y += lineH;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y);
}

function showShareModal(dataUrl, title) {
  const html = `
    <div style="text-align:center">
      <h3 style="margin-bottom:16px">📤 分享卡片</h3>
      <img src="${dataUrl}" style="max-width:100%;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.2);margin-bottom:20px" alt="分享卡片">
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" id="shareDownload">📥 下载图片</button>
        <button class="btn btn-outline" id="shareCopy">📋 复制到剪贴板</button>
      </div>
    </div>`;
  // Import openModal dynamically
  const { openModal } = await import('./shared.js');
  openModal(html);

  document.getElementById('shareDownload').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `济南攻略-${title}-${Date.now()}.png`;
    a.click();
    showToast('✅ 图片已下载');
  });

  document.getElementById('shareCopy').addEventListener('click', async () => {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('✅ 已复制到剪贴板');
    } catch {
      showToast('❌ 复制失败，请使用下载');
    }
  });
}


// ══════════════════════════════════════
// 2. TRAVEL JOURNAL (游记)
// ══════════════════════════════════════
export function initTravelJournal() {
  const container = document.getElementById('journal-section');
  if (!container) return;

  const journals = LS.get('jinan-journals', []);

  function render() {
    container.innerHTML = `
      <div class="section-inner">
        <div class="section-header">
          <div class="eyebrow">TRAVEL JOURNAL</div>
          <h2>📝 我的游记</h2>
          <p>记录旅途中的美好瞬间</p>
        </div>
        <div class="journal-form" style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:32px">
          <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">
            <input type="date" id="journalDate" value="${new Date().toISOString().slice(0, 10)}"
              style="flex:1;min-width:140px;padding:10px 14px;border:1px solid var(--border2);background:var(--bg);border-radius:10px;font-family:var(--sans);font-size:.85rem;outline:none;color:var(--text)">
            <input type="text" id="journalTitle" placeholder="标题（可选）"
              style="flex:2;min-width:200px;padding:10px 14px;border:1px solid var(--border2);background:var(--bg);border-radius:10px;font-family:var(--sans);font-size:.85rem;outline:none;color:var(--text)">
          </div>
          <textarea id="journalContent" placeholder="写下你的旅途见闻、感受…" rows="4"
            style="width:100%;padding:12px;border:1px solid var(--border2);background:var(--bg);border-radius:10px;font-family:var(--sans);font-size:.85rem;resize:vertical;outline:none;color:var(--text);margin-bottom:12px"></textarea>
          <div style="display:flex;gap:12px;justify-content:flex-end;flex-wrap:wrap">
            <button class="btn btn-outline btn-sm" id="journalExport">📤 导出全部</button>
            <button class="btn btn-primary btn-sm" id="journalSave">💾 保存游记</button>
          </div>
        </div>
        <div id="journalList" style="display:flex;flex-direction:column;gap:16px"></div>
      </div>`;

    renderList();
    bindEvents();
  }

  function renderList() {
    const list = document.getElementById('journalList');
    if (!journals.length) {
      list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3);font-size:.9rem">📝 还没有游记，开始记录你的旅程吧！</div>';
      return;
    }
    list.innerHTML = journals.sort((a, b) => b.date.localeCompare(a.date)).map((j, i) => `
      <div class="journal-card" data-idx="${i}" style="background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius);padding:20px;position:relative;transition:all .3s">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span style="font-size:.75rem;padding:3px 10px;border-radius:100px;background:var(--accent2);color:var(--accent);font-weight:600">${j.date}</span>
          ${j.title ? `<span style="font-weight:700;font-size:.95rem">${escH(j.title)}</span>` : ''}
          <button class="journal-delete" data-idx="${i}" style="margin-left:auto;background:none;border:none;color:var(--coral);cursor:pointer;font-size:.85rem;padding:4px 8px;border-radius:6px" title="删除">🗑️</button>
        </div>
        <p style="font-size:.85rem;color:var(--text2);line-height:1.7;white-space:pre-wrap">${escH(j.content)}</p>
      </div>
    `).join('');
  }

  function bindEvents() {
    document.getElementById('journalSave')?.addEventListener('click', () => {
      const date = document.getElementById('journalDate').value;
      const title = document.getElementById('journalTitle').value.trim();
      const content = document.getElementById('journalContent').value.trim();
      if (!content) { showToast('❌ 请输入游记内容'); return; }
      journals.push({ date, title, content, ts: Date.now() });
      LS.set('jinan-journals', journals);
      document.getElementById('journalContent').value = '';
      document.getElementById('journalTitle').value = '';
      renderList();
      showToast('✅ 游记已保存');
    });

    document.getElementById('journalExport')?.addEventListener('click', () => {
      if (!journals.length) { showToast('❌ 没有游记可导出'); return; }
      const text = journals.sort((a, b) => b.date.localeCompare(a.date))
        .map(j => `【${j.date}】${j.title || '无标题'}\n${j.content}\n`).join('\n---\n\n');
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `济南游记-${Date.now()}.txt`;
      a.click();
      showToast('✅ 游记已导出');
    });

    document.getElementById('journalList')?.addEventListener('click', (e) => {
      const delBtn = e.target.closest('.journal-delete');
      if (!delBtn) return;
      const idx = parseInt(delBtn.dataset.idx);
      journals.splice(idx, 1);
      LS.set('jinan-journals', journals);
      renderList();
      showToast('✅ 已删除');
    });
  }

  render();
}


// ══════════════════════════════════════
// 3. CHECK-IN MAP (打卡地图)
// ══════════════════════════════════════
export async function initCheckinMap() {
  const container = document.getElementById('checkin-map-section');
  if (!container) return;

  // Load spots data
  let spots = [];
  try {
    const res = await fetch('/src/data/spots.json');
    spots = await res.json();
  } catch { return; }

  const checked = LS.get('jinan-checked', []);

  function render() {
    const checkedCount = checked.length;
    const total = spots.length;
    const pct = Math.round(checkedCount / total * 100);

    container.innerHTML = `
      <div class="section-inner">
        <div class="section-header">
          <div class="eyebrow">CHECK-IN MAP</div>
          <h2>📍 我的打卡地图</h2>
          <p>已完成 <strong style="color:var(--accent)">${checkedCount}</strong> / ${total} 个景点 (${pct}%)</p>
        </div>
        <div style="display:flex;gap:32px;flex-wrap:wrap;align-items:flex-start">
          <div style="flex:1;min-width:300px">
            <canvas id="checkinCanvas" width="500" height="600" style="width:100%;max-width:500px;border-radius:var(--radius-lg);border:1px solid var(--border);background:var(--card-bg);cursor:pointer"></canvas>
          </div>
          <div style="flex:1;min-width:280px">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
              <div style="flex:1;height:8px;background:var(--bg3);border-radius:4px;overflow:hidden">
                <div style="width:${pct}%;height:100%;background:var(--accent);border-radius:4px;transition:width .5s"></div>
              </div>
              <span style="font-size:.85rem;font-weight:700;color:var(--accent)">${pct}%</span>
            </div>
            <div id="checkinList" style="max-height:450px;overflow-y:auto;display:flex;flex-direction:column;gap:6px"></div>
          </div>
        </div>
      </div>`;

    drawMap();
    renderCheckinList();
  }

  function drawMap() {
    const canvas = document.getElementById('checkinCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim() || '#f8f6f3';
    ctx.fillRect(0, 0, W, H);

    // Draw Jinan outline (simplified)
    ctx.strokeStyle = 'rgba(201,169,110,0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    // Simplified Jinan city boundary
    const outline = [
      [50, 80], [150, 40], [280, 30], [400, 60], [460, 120],
      [480, 220], [470, 340], [440, 440], [380, 520], [280, 560],
      [180, 540], [100, 480], [50, 380], [30, 260], [40, 160]
    ];
    outline.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // Fill area lightly
    ctx.fillStyle = 'rgba(201,169,110,0.05)';
    ctx.fill();

    // Draw river
    ctx.strokeStyle = 'rgba(42,157,143,0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 300);
    ctx.quadraticCurveTo(200, 280, 300, 290);
    ctx.quadraticCurveTo(380, 300, 450, 310);
    ctx.stroke();

    // Map spots to canvas coordinates
    const lats = spots.map(s => s.lat).filter(Boolean);
    const lngs = spots.map(s => s.lng).filter(Boolean);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);

    const pad = 60;
    const mapW = W - pad * 2, mapH = H - pad * 2;

    spots.forEach(spot => {
      if (!spot.lat || !spot.lng) return;
      const x = pad + ((spot.lng - minLng) / (maxLng - minLng)) * mapW;
      const y = pad + (1 - (spot.lat - minLat) / (maxLat - minLat)) * mapH;
      const isChecked = checked.includes(spot.id);

      // Draw marker
      ctx.beginPath();
      ctx.arc(x, y, isChecked ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = isChecked ? '#c9a96e' : 'rgba(201,169,110,0.3)';
      ctx.fill();
      if (isChecked) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Checkmark
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✓', x, y + 3);
        ctx.textAlign = 'left';
      }

      // Label for important spots
      if (spot.badge === 'must' || isChecked) {
        ctx.fillStyle = isChecked ? 'var(--text)' : 'rgba(0,0,0,0.5)';
        ctx.font = `${isChecked ? 'bold ' : ''}10px sans-serif`;
        ctx.fillText(spot.name, x + 10, y + 4);
      }
    });

    // Legend
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = '12px sans-serif';
    ctx.fillText('🟡 已打卡  ⚪ 未打卡', 20, H - 15);

    // Click to toggle
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      let closest = null, minDist = 20;
      spots.forEach(spot => {
        if (!spot.lat || !spot.lng) return;
        const x = pad + ((spot.lng - minLng) / (maxLng - minLng)) * mapW;
        const y = pad + (1 - (spot.lat - minLat) / (maxLat - minLat)) * mapH;
        const d = Math.hypot(mx - x, my - y);
        if (d < minDist) { minDist = d; closest = spot; }
      });

      if (closest) {
        toggleCheckin(closest.id);
      }
    };
  }

  function toggleCheckin(id) {
    const idx = checked.indexOf(id);
    if (idx >= 0) {
      checked.splice(idx, 1);
      showToast('已取消打卡');
    } else {
      checked.push(id);
      const spot = spots.find(s => s.id === id);
      showToast(`✅ 打卡成功：${spot?.name || id}`);
    }
    LS.set('jinan-checked', checked);
    render();
  }

  function renderCheckinList() {
    const list = document.getElementById('checkinList');
    if (!list) return;
    list.innerHTML = spots.map(spot => {
      const isChecked = checked.includes(spot.id);
      return `
        <div class="checkin-item" data-id="${spot.id}" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:${isChecked ? 'var(--accent2)' : 'var(--bg2)'};border-radius:10px;cursor:pointer;transition:all .2s;border:1px solid ${isChecked ? 'var(--accent)' : 'transparent'}">
          <span style="font-size:1.2rem">${isChecked ? '✅' : '⬜'}</span>
          <span style="flex:1;font-size:.85rem;font-weight:${isChecked ? '600' : '400'}">${spot.name}</span>
          <span style="font-size:.7rem;color:var(--text3)">${spot.rating}★</span>
        </div>`;
    }).join('');

    list.addEventListener('click', (e) => {
      const item = e.target.closest('.checkin-item');
      if (item) toggleCheckin(item.dataset.id);
    });
  }

  render();
}


// ══════════════════════════════════════
// 4. RATING RANKINGS (评价排行)
// ══════════════════════════════════════
export async function initRankings() {
  const container = document.getElementById('rankings-section');
  if (!container) return;

  let spots = [], foods = [];
  try {
    const [spotsRes, foodRes] = await Promise.all([
      fetch('/src/data/spots.json'),
      fetch('/src/data/food.json')
    ]);
    spots = await spotsRes.json();
    const foodData = await foodRes.json();
    foods = foodData.foods || foodData;
  } catch { return; }

  // Top 5 by rating
  const topSpots = [...spots].sort((a, b) => b.rating - a.rating).slice(0, 5);
  // Top 5 by reviews count
  const topFoods = [...foods].sort((a, b) => {
    const aR = a.shops?.length || 0;
    const bR = b.shops?.length || 0;
    return bR - aR;
  }).slice(0, 5);
  // Newest (by order in file, last 5)
  const newest = [...spots].slice(-5).reverse();

  container.innerHTML = `
    <div class="section-inner">
      <div class="section-header">
        <div class="eyebrow">HOT THIS WEEK</div>
        <h2>🏆 本周热门</h2>
        <p>最受欢迎的景点和美食</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
        <div class="ranking-card">
          <h3 style="font:700 1rem/1.4 var(--serif);margin-bottom:16px;display:flex;align-items:center;gap:8px">🏛️ 评分最高景点</h3>
          ${topSpots.map((s, i) => `
            <div class="ranking-item" style="display:flex;align-items:center;gap:12px;padding:10px 0;${i < topSpots.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
              <span style="width:28px;height:28px;border-radius:50%;background:${i < 3 ? 'var(--accent)' : 'var(--bg3)'};color:${i < 3 ? '#fff' : 'var(--text3)'};display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0">${i + 1}</span>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:.88rem">${s.name}</div>
                <div style="font-size:.75rem;color:var(--text3)">${s.reviews} 条评价</div>
              </div>
              <span style="color:#f59e0b;font-size:.85rem;font-weight:700">${s.rating}★</span>
            </div>
          `).join('')}
        </div>
        <div class="ranking-card">
          <h3 style="font:700 1rem/1.4 var(--serif);margin-bottom:16px;display:flex;align-items:center;gap:8px">🍜 热门美食</h3>
          ${topFoods.map((f, i) => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;${i < topFoods.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
              <span style="width:28px;height:28px;border-radius:50%;background:${i < 3 ? 'var(--accent)' : 'var(--bg3)'};color:${i < 3 ? '#fff' : 'var(--text3)'};display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0">${i + 1}</span>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:.88rem">${f.name}</div>
                <div style="font-size:.75rem;color:var(--text3)">${f.tag || f.cat}</div>
              </div>
              <span style="font-size:.7rem;padding:2px 8px;background:var(--accent2);color:var(--accent);border-radius:100px">${f.must ? '必吃' : f.cat}</span>
            </div>
          `).join('')}
        </div>
        <div class="ranking-card">
          <h3 style="font:700 1rem/1.4 var(--serif);margin-bottom:16px;display:flex;align-items:center;gap:8px">🆕 最新添加</h3>
          ${newest.map((s, i) => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;${i < newest.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
              <span style="font-size:1.2rem;flex-shrink:0">📍</span>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:.88rem">${s.name}</div>
                <div style="font-size:.75rem;color:var(--text3)">${s.desc.slice(0, 30)}…</div>
              </div>
              <span style="font-size:.7rem;padding:2px 8px;background:rgba(34,197,94,.1);color:#22c55e;border-radius:100px">NEW</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
}


// ══════════════════════════════════════
// 5. UTILITY WIDGET (实用信息浮窗)
// ══════════════════════════════════════
export function initUtilityWidget() {
  // Check if user closed it
  if (LS.get('jinan-widget-closed', false)) return;

  const widget = document.createElement('div');
  widget.id = 'utility-widget';
  widget.innerHTML = `
    <div class="widget-header" style="display:flex;align-items:center;justify-content:space-between;cursor:move;padding:8px 12px;background:var(--accent);color:#fff;border-radius:12px 12px 0 0">
      <span style="font-size:.8rem;font-weight:600">📌 实用信息</span>
      <div style="display:flex;gap:8px">
        <button id="widgetCollapse" style="background:none;border:none;color:#fff;cursor:pointer;font-size:.85rem;padding:2px" title="折叠">−</button>
        <button id="widgetClose" style="background:none;border:none;color:#fff;cursor:pointer;font-size:.85rem;padding:2px" title="关闭">✕</button>
      </div>
    </div>
    <div class="widget-body" style="padding:12px;background:var(--card-bg);border:1px solid var(--border);border-top:none;border-radius:0 0 12px 12px;font-size:.8rem">
      <div id="widgetTime" style="margin-bottom:8px;color:var(--text2)"></div>
      <div id="widgetWeather" style="margin-bottom:8px;color:var(--text2)">🌤️ 加载天气…</div>
      <div id="widgetHoliday" style="margin-bottom:8px;color:var(--text2)"></div>
      <div id="widgetSeason" style="color:var(--text2)"></div>
    </div>`;

  // Style the widget container
  Object.assign(widget.style, {
    position: 'fixed', bottom: '100px', right: '20px', zIndex: '98',
    width: '220px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,.15)',
    transition: 'all .3s', userSelect: 'none'
  });

  document.body.appendChild(widget);

  // Collapse toggle
  let collapsed = false;
  document.getElementById('widgetCollapse').addEventListener('click', () => {
    collapsed = !collapsed;
    widget.querySelector('.widget-body').style.display = collapsed ? 'none' : 'block';
    document.getElementById('widgetCollapse').textContent = collapsed ? '+' : '−';
  });

  // Close
  document.getElementById('widgetClose').addEventListener('click', () => {
    widget.style.opacity = '0';
    widget.style.transform = 'scale(.9)';
    setTimeout(() => widget.remove(), 300);
    LS.set('jinan-widget-closed', true);
  });

  // Drag
  let isDragging = false, startX, startY, origX, origY;
  const header = widget.querySelector('.widget-header');
  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX; startY = e.clientY;
    const rect = widget.getBoundingClientRect();
    origX = rect.left; origY = rect.top;
    widget.style.transition = 'none';
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    widget.style.left = origX + dx + 'px';
    widget.style.top = origY + dy + 'px';
    widget.style.right = 'auto';
    widget.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    widget.style.transition = 'all .3s';
  });

  // Touch drag
  header.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    const rect = widget.getBoundingClientRect();
    origX = rect.left; origY = rect.top;
    widget.style.transition = 'none';
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX, dy = e.touches[0].clientY - startY;
    widget.style.left = origX + dx + 'px';
    widget.style.top = origY + dy + 'px';
    widget.style.right = 'auto';
    widget.style.bottom = 'auto';
  }, { passive: true });
  document.addEventListener('touchend', () => {
    isDragging = false;
    widget.style.transition = 'all .3s';
  });

  // Update time
  function updateTime() {
    const now = new Date();
    document.getElementById('widgetTime').innerHTML = `🕐 ${now.toLocaleString('zh-CN', { hour12: false })}`;
  }
  updateTime();
  setInterval(updateTime, 1000);

  // Load weather
  async function loadWidgetWeather() {
    try {
      const res = await fetch('https://wttr.in/Jinan?format=%t+%C&lang=zh');
      const text = await res.text();
      document.getElementById('widgetWeather').textContent = `🌤️ ${text.trim()}`;
    } catch {
      document.getElementById('widgetWeather').textContent = '🌤️ 济南天气';
    }
  }
  loadWidgetWeather();

  // Holiday countdown
  const holidays = [
    { name: '元旦', month: 1, day: 1 },
    { name: '春节', month: 1, day: 29 }, // 2026
    { name: '清明节', month: 4, day: 5 },
    { name: '劳动节', month: 5, day: 1 },
    { name: '端午节', month: 6, day: 19 },
    { name: '中秋节', month: 9, day: 21 },
    { name: '国庆节', month: 10, day: 1 },
  ];
  const now = new Date();
  let nextHoliday = null;
  for (const h of holidays) {
    const d = new Date(now.getFullYear(), h.month - 1, h.day);
    if (d > now) { nextHoliday = { ...h, date: d }; break; }
  }
  if (!nextHoliday) {
    const h = holidays[0];
    nextHoliday = { ...h, date: new Date(now.getFullYear() + 1, h.month - 1, h.day) };
  }
  const daysLeft = Math.ceil((nextHoliday.date - now) / 86400000);
  document.getElementById('widgetHoliday').textContent = `📅 距${nextHoliday.name}还有 ${daysLeft} 天`;

  // Season recommendation
  const month = now.getMonth() + 1;
  const seasonRecs = {
    spring: '🌸 春季推荐：五龙潭赏樱、大明湖踏青',
    summer: '☀️ 夏季推荐：大明湖赏荷、护城河夜游',
    autumn: '🍂 秋季推荐：千佛山红叶、灵岩寺银杏',
    winter: '❄️ 冬季推荐：趵突泉雾气、温泉泡汤'
  };
  let season = 'spring';
  if ([6, 7, 8].includes(month)) season = 'summer';
  else if ([9, 10, 11].includes(month)) season = 'autumn';
  else if ([12, 1, 2].includes(month)) season = 'winter';
  document.getElementById('widgetSeason').textContent = seasonRecs[season];
}


// ══════════════════════════════════════
// AUTO-INIT: Detect page and init relevant features
// ══════════════════════════════════════
export function initSocialFeatures() {
  const page = location.pathname.replace(/.*\//, '') || 'index.html';

  // All pages get: share cards, utility widget
  initShareCards();
  initUtilityWidget();

  // Page-specific
  if (page === 'itinerary.html') initTravelJournal();
  if (page === 'spots.html') initCheckinMap();
  if (page === 'index.html' || page === '') initRankings();
}

// Helper
function escH(s) { return s ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : ''; }
