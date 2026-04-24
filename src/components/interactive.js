/* ═══ INTERACTIVE FEATURES MODULE ═══
   济南旅游攻略 - 高级交互功能
   Vanilla JS · 零依赖 · localStorage持久化
*/

// ── Constants ──
const KEYS = {
  searchHistory: 'jinan-search-history',
  favorites: 'jinan-favorites',
  itinerary: 'jinan-itinerary',
  stopTimes: 'jinan-stop-times',
  tripPlanner: 'jinan-triplan',
  weatherCache: 'jinan-weather-cache',
  fontSize: 'jinan-fontsize',
  highContrast: 'jinan-highcontrast',
  reducedMotion: 'jinan-reduced-motion',
  reviews: 'jinan-reviews',
  dark: 'jinan-dark',
  checklist: 'jinan-checklist'
};

// ── Pinyin Initial Map (common places) ──
const PINYIN_MAP = {
  '趵': 'B', '突': 'T', '泉': 'Q', '大': 'D', '明': 'M', '湖': 'H',
  '千': 'Q', '佛': 'F', '山': 'S', '黑': 'H', '虎': 'H',
  '五': 'W', '龙': 'L', '潭': 'T', '芙': 'F', '蓉': 'R',
  '街': 'J', '宽': 'K', '厚': 'H', '里': 'L', '解': 'J',
  '放': 'F', '阁': 'G', '博': 'B', '物': 'W', '馆': 'G',
  '省': 'S', '灵': 'L', '岩': 'Y', '寺': 'S', '红': 'H',
  '叶': 'Y', '谷': 'G', '百': 'B', '脉': 'M', '洪': 'H',
  '家': 'J', '楼': 'L', '教': 'J', '堂': 'T',
  '糖': 'T', '醋': 'C', '鲤': 'L', '鱼': 'Y',
  '九': 'J', '转': 'Z', '大': 'D', '肠': 'C',
  '把': 'B', '子': 'Z', '肉': 'R', '油': 'Y', '旋': 'X',
  '草': 'C', '包': 'B', '甜': 'T', '沫': 'M',
  '烧': 'S', '烤': 'K', '爆': 'B', '炒': 'C', '腰': 'Y', '花': 'H',
  '葱': 'C', '海': 'H', '参': 'S', '奶': 'N', '汤': 'T', '蒲': 'P', '菜': 'C',
  '老': 'L', '酸': 'S', '泡': 'P', '茶': 'C',
  '面': 'M', '豆': 'D', '腐': 'F', '脑': 'N',
  '水': 'S', '饺': 'J', '包': 'B', '子': 'Z',
  '地': 'D', '瓜': 'G', '民': 'M', '小': 'X',
  '区': 'Q', '商': 'S', '埠': 'B', '经': 'J',
  '三': 'S', '路': 'L', '印': 'Y', '象': 'X',
  '超': 'C', '然': 'R'
};

function getPinyinInitials(str) {
  return str.split('').map(c => PINYIN_MAP[c] || c.toUpperCase()).join('');
}

// ── Toast Utility ──
function showToast(msg, duration = 2000) {
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

// ═══════════════════════════════════════
// 1. SMART SEARCH SYSTEM
// ═══════════════════════════════════════
export class SmartSearch {
  constructor(spots = [], foods = []) {
    this.spots = spots;
    this.foods = foods;
    this.history = JSON.parse(localStorage.getItem(KEYS.searchHistory) || '[]');
    this.hotSearches = ['趵突泉', '大明湖', '千佛山', '把子肉', '油旋', '甜沫', '黑虎泉', '草包包子'];
    this.searchIndex = this._buildIndex();
    this.activeIndex = -1;
    this.isOpen = false;
  }

  _buildIndex() {
    const index = [];
    this.spots.forEach(s => {
      index.push({
        id: s.id, name: s.name, type: 'spot', cat: s.cat,
        desc: s.desc, rating: s.rating, price: s.price,
        meta: s.meta, pinyin: getPinyinInitials(s.name),
        keywords: `${s.name} ${s.desc} ${s.cat} ${s.dur || ''} ${(s.audience || []).join(' ')}`
      });
    });
    this.foods.forEach(f => {
      index.push({
        id: f.id, name: f.name, type: 'food', cat: f.cat,
        desc: f.desc, rating: null, price: f.price,
        meta: f.tag, pinyin: getPinyinInitials(f.name),
        keywords: `${f.name} ${f.desc} ${f.cat} ${f.tag || ''} ${f.where || ''}`
      });
    });
    return index;
  }

  search(query) {
    if (!query || !query.trim()) return { spots: [], foods: [], suggestions: [] };
    const q = query.trim().toLowerCase();
    const pinyinQ = q.toUpperCase();
    const results = [];

    for (const item of this.searchIndex) {
      let score = 0;
      const nameLower = item.name.toLowerCase();
      const pinyin = item.pinyin;

      // Exact name match
      if (nameLower === q) score += 100;
      // Name contains query
      else if (nameLower.includes(q)) score += 80;
      // Pinyin initial match
      else if (pinyin.includes(pinyinQ)) score += 60;
      // Keywords match
      else if (item.keywords.toLowerCase().includes(q)) score += 40;
      // Fuzzy: character overlap
      else {
        const overlap = [...q].filter(c => nameLower.includes(c)).length;
        if (overlap >= Math.ceil(q.length * 0.5)) score += 20 + overlap * 5;
      }

      if (score > 0) results.push({ ...item, score });
    }

    results.sort((a, b) => b.score - a.score);
    const spots = results.filter(r => r.type === 'spot').slice(0, 5);
    const foods = results.filter(r => r.type === 'food').slice(0, 5);
    const suggestions = results.slice(0, 8).map(r => r.name);

    return { spots, foods, suggestions };
  }

  saveHistory(query) {
    if (!query || !query.trim()) return;
    const q = query.trim();
    this.history = this.history.filter(h => h !== q);
    this.history.unshift(q);
    if (this.history.length > 5) this.history = this.history.slice(0, 5);
    localStorage.setItem(KEYS.searchHistory, JSON.stringify(this.history));
  }

  clearHistory() {
    this.history = [];
    localStorage.setItem(KEYS.searchHistory, '[]');
  }

  // Bind to a search input element
  bind(inputEl, containerEl) {
    if (!inputEl || !containerEl) return;

    // Create dropdown panel
    const panel = document.createElement('div');
    panel.className = 'smart-search-panel';
    panel.setAttribute('role', 'listbox');
    panel.setAttribute('aria-label', '搜索结果');
    containerEl.appendChild(panel);

    let debounceTimer;
    const renderPanel = (query) => {
      if (!query || !query.trim()) {
        // Show hot + history
        let html = '';
        if (this.history.length) {
          html += `<div class="ssp-section"><div class="ssp-title">🕐 最近搜索</div><div class="ssp-tags">`;
          this.history.forEach(h => {
            html += `<button class="ssp-tag" data-q="${this._esc(h)}">${this._esc(h)}</button>`;
          });
          html += `<button class="ssp-tag ssp-clear" data-action="clear-history">清除</button></div></div>`;
        }
        html += `<div class="ssp-section"><div class="ssp-title">🔥 热门搜索</div><div class="ssp-tags">`;
        this.hotSearches.forEach(h => {
          html += `<button class="ssp-tag" data-q="${this._esc(h)}">${this._esc(h)}</button>`;
        });
        html += `</div></div>`;
        panel.innerHTML = html;
        panel.classList.add('open');
        this.isOpen = true;
        this._bindTags(panel, inputEl);
        return;
      }

      const results = this.search(query);
      if (!results.spots.length && !results.foods.length) {
        panel.innerHTML = `<div class="ssp-empty">没有找到"${this._esc(query)}"的相关结果</div>`;
        panel.classList.add('open');
        this.isOpen = true;
        return;
      }

      let html = '';
      if (results.spots.length) {
        html += `<div class="ssp-section"><div class="ssp-title">🏛️ 景点</div>`;
        results.spots.forEach(r => {
          html += `<button class="ssp-item" data-type="spot" data-id="${r.id}" data-name="${this._esc(r.name)}" role="option">
            <div class="ssp-item-main"><span class="ssp-name">${this._highlight(r.name, query)}</span>
            <span class="ssp-type-badge spot">景点</span></div>
            <div class="ssp-item-meta">${r.rating ? `★ ${r.rating}` : ''} · ${r.price === 0 ? '免费' : '¥' + r.price} · ${r.cat}</div>
          </button>`;
        });
        html += `</div>`;
      }
      if (results.foods.length) {
        html += `<div class="ssp-section"><div class="ssp-title">🍜 美食</div>`;
        results.foods.forEach(r => {
          html += `<button class="ssp-item" data-type="food" data-id="${r.id}" data-name="${this._esc(r.name)}" role="option">
            <div class="ssp-item-main"><span class="ssp-name">${this._highlight(r.name, query)}</span>
            <span class="ssp-type-badge food">美食</span></div>
            <div class="ssp-item-meta">${r.meta || r.cat}</div>
          </button>`;
        });
        html += `</div>`;
      }
      panel.innerHTML = html;
      panel.classList.add('open');
      this.isOpen = true;
      this.activeIndex = -1;

      // Click handler for results
      panel.querySelectorAll('.ssp-item').forEach(item => {
        item.addEventListener('click', () => {
          this.saveHistory(item.dataset.name);
          panel.classList.remove('open');
          this.isOpen = false;
          inputEl.value = item.dataset.name;
          if (item.dataset.type === 'spot') {
            window.location.href = `spots.html?q=${encodeURIComponent(item.dataset.name)}`;
          } else {
            window.location.href = `food.html?q=${encodeURIComponent(item.dataset.name)}`;
          }
        });
      });
    };

    const doSearch = () => {
      const q = inputEl.value.trim();
      if (!q) return;
      this.saveHistory(q);
      panel.classList.remove('open');
      this.isOpen = false;
      // Navigate to spots page with query
      window.location.href = `spots.html?q=${encodeURIComponent(q)}`;
    };

    inputEl.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => renderPanel(inputEl.value.trim()), 150);
    });

    inputEl.addEventListener('focus', () => {
      renderPanel(inputEl.value.trim());
    });

    inputEl.addEventListener('keydown', (e) => {
      const items = panel.querySelectorAll('.ssp-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.activeIndex = Math.min(this.activeIndex + 1, items.length - 1);
        this._highlightActive(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.activeIndex = Math.max(this.activeIndex - 1, 0);
        this._highlightActive(items);
      } else if (e.key === 'Enter') {
        if (this.activeIndex >= 0 && items[this.activeIndex]) {
          items[this.activeIndex].click();
        } else {
          doSearch();
        }
      } else if (e.key === 'Escape') {
        panel.classList.remove('open');
        this.isOpen = false;
        inputEl.blur();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!containerEl.contains(e.target)) {
        panel.classList.remove('open');
        this.isOpen = false;
      }
    });

    // Bind search button if exists
    const searchBtn = containerEl.querySelector('button');
    if (searchBtn) {
      searchBtn.addEventListener('click', doSearch);
    }
  }

  _highlightActive(items) {
    items.forEach((it, i) => it.classList.toggle('active', i === this.activeIndex));
    if (items[this.activeIndex]) {
      items[this.activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  _highlight(text, query) {
    if (!query) return this._esc(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return this._esc(text).replace(regex, '<mark>$1</mark>');
  }

  _esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  _bindTags(panel, inputEl) {
    panel.querySelectorAll('.ssp-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        if (tag.dataset.action === 'clear-history') {
          this.clearHistory();
          panel.querySelectorAll('.ssp-section')[0]?.remove();
          return;
        }
        if (tag.dataset.q) {
          inputEl.value = tag.dataset.q;
          this.saveHistory(tag.dataset.q);
          window.location.href = `spots.html?q=${encodeURIComponent(tag.dataset.q)}`;
        }
      });
    });
  }

  // Render inline search results on spots/food pages
  renderInlineResults(query, container, allSpots, allFoods) {
    if (!query || !container) return false;
    const results = this.search(query);
    if (!results.spots.length && !results.foods.length) return false;

    let html = `<div class="search-results-inline"><div class="sri-header">
      <h3>🔍 搜索"${this._esc(query)}"的结果</h3>
      <button class="sri-close" onclick="this.closest('.search-results-inline').remove()">✕ 关闭</button>
    </div>`;

    if (results.spots.length) {
      html += `<div class="sri-group"><h4>🏛️ 景点 (${results.spots.length})</h4><div class="sri-grid">`;
      results.spots.forEach(r => {
        const spot = allSpots.find(s => s.id === r.id);
        if (spot) {
          html += `<div class="sri-card" onclick="window.dispatchEvent(new CustomEvent('openSpotDetail',{detail:'${spot.id}'}))">
            <img src="${spot.img}" alt="${spot.name}" loading="lazy">
            <div class="sri-card-body">
              <div class="sri-card-name">${spot.name}</div>
              <div class="sri-card-meta">★ ${spot.rating} · ${spot.price === 0 ? '免费' : '¥' + spot.price}</div>
            </div>
          </div>`;
        }
      });
      html += `</div></div>`;
    }
    if (results.foods.length) {
      html += `<div class="sri-group"><h4>🍜 美食 (${results.foods.length})</h4><div class="sri-grid">`;
      results.foods.forEach(r => {
        const food = allFoods.find(f => f.id === r.id);
        if (food) {
          html += `<div class="sri-card">
            <img src="${food.img}" alt="${food.name}" loading="lazy">
            <div class="sri-card-body">
              <div class="sri-card-name">${food.name}</div>
              <div class="sri-card-meta">${food.tag} · ${food.price || ''}</div>
            </div>
          </div>`;
        }
      });
      html += `</div></div>`;
    }
    html += `</div>`;
    container.innerHTML = html;
    return true;
  }
}

// ═══════════════════════════════════════
// 2. FAVORITES SYSTEM
// ═══════════════════════════════════════
export class Favorites {
  constructor() {
    this.favorites = JSON.parse(localStorage.getItem(KEYS.favorites) || '[]');
    this._listeners = [];
  }

  toggle(itemId) {
    const idx = this.favorites.indexOf(itemId);
    if (idx === -1) {
      this.favorites.push(itemId);
      showToast('♥ 已收藏');
    } else {
      this.favorites.splice(idx, 1);
      showToast('♡ 已取消收藏');
    }
    localStorage.setItem(KEYS.favorites, JSON.stringify(this.favorites));
    this._updateBadge();
    this._listeners.forEach(fn => fn(this.favorites));
    return this.favorites.includes(itemId);
  }

  isFavorite(itemId) {
    return this.favorites.includes(itemId);
  }

  getAll() {
    return [...this.favorites];
  }

  count() {
    return this.favorites.length;
  }

  onChange(fn) {
    this._listeners.push(fn);
  }

  // Add favorite button to a card element
  injectButton(cardEl, itemId) {
    if (!cardEl || cardEl.querySelector('.fav-btn')) return;
    const btn = document.createElement('button');
    btn.className = `fav-btn ${this.isFavorite(itemId) ? 'active' : ''}`;
    btn.setAttribute('aria-label', this.isFavorite(itemId) ? '取消收藏' : '收藏');
    btn.dataset.id = itemId;
    btn.innerHTML = this.isFavorite(itemId) ? '♥' : '♡';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const isFav = this.toggle(itemId);
      btn.classList.toggle('active', isFav);
      btn.innerHTML = isFav ? '♥' : '♡';
      btn.setAttribute('aria-label', isFav ? '取消收藏' : '收藏');
    });
    // Insert into card-img
    const imgWrap = cardEl.querySelector('.card-img');
    if (imgWrap) {
      imgWrap.appendChild(btn);
    }
  }

  // Update nav badge
  _updateBadge() {
    let badge = document.querySelector('.fav-badge');
    if (!badge) {
      const nav = document.querySelector('.top-nav');
      if (!nav) return;
      badge = document.createElement('span');
      badge.className = 'fav-badge';
      nav.appendChild(badge);
    }
    badge.textContent = this.count();
    badge.style.display = this.count() > 0 ? 'flex' : 'none';
    badge.setAttribute('aria-label', `${this.count()} 个收藏`);
  }

  // Render favorites panel
  renderPanel(spotsData = [], foodsData = []) {
    if (!this.favorites.length) {
      return `<div class="fav-empty">
        <div class="fav-empty-icon">♡</div>
        <p>还没有收藏任何景点或美食</p>
        <p class="fav-empty-hint">在景点或美食页面点击 ♡ 按钮添加收藏</p>
      </div>`;
    }

    let html = '<div class="fav-list">';
    this.favorites.forEach(id => {
      const spot = spotsData.find(s => s.id === id);
      const food = foodsData.find(f => f.id === id);
      const item = spot || food;
      if (!item) return;
      const isSpot = !!spot;
      html += `<div class="fav-item" data-id="${id}">
        <img src="${item.img}" alt="${item.name}" loading="lazy" class="fav-item-img">
        <div class="fav-item-info">
          <div class="fav-item-name">${item.name}</div>
          <div class="fav-item-meta">${isSpot ? `★ ${item.rating} · ${item.price === 0 ? '免费' : '¥' + item.price}` : item.tag || item.cat}</div>
        </div>
        <div class="fav-item-actions">
          <a href="${isSpot ? 'spots.html' : 'food.html'}?q=${encodeURIComponent(item.name)}" class="btn btn-sm btn-outline">查看</a>
          <button class="fav-remove-btn" data-id="${id}" aria-label="移除收藏">✕</button>
        </div>
      </div>`;
    });
    html += '</div>';
    return html;
  }
}

// ═══════════════════════════════════════
// 3. TRIP PLANNER (Enhanced)
// ═══════════════════════════════════════
export class TripPlanner {
  constructor(spots = [], foods = []) {
    this.spots = spots;
    this.foods = foods;
    this._load();
  }

  _load() {
    this.stops = JSON.parse(localStorage.getItem(KEYS.tripPlanner) || '[]');
    this.stopTimes = JSON.parse(localStorage.getItem(KEYS.stopTimes) || '{}');
  }

  _save() {
    localStorage.setItem(KEYS.tripPlanner, JSON.stringify(this.stops));
    localStorage.setItem(KEYS.stopTimes, JSON.stringify(this.stopTimes));
  }

  getItem(id) {
    return this.spots.find(s => s.id === id) || this.foods.find(f => f.id === id) || null;
  }

  addStop(id, time = '') {
    if (this.stops.includes(id)) {
      showToast('该地点已在行程中');
      return false;
    }
    this.stops.push(id);
    if (time) this.stopTimes[id] = time;
    this._save();
    showToast('✓ 已加入行程');
    return true;
  }

  removeStop(id) {
    this.stops = this.stops.filter(s => s !== id);
    delete this.stopTimes[id];
    this._save();
  }

  reorder(fromIdx, toIdx) {
    if (fromIdx === toIdx) return;
    const [item] = this.stops.splice(fromIdx, 1);
    this.stops.splice(toIdx, 0, item);
    this._save();
  }

  setStopTime(id, time) {
    this.stopTimes[id] = time;
    this._save();
  }

  // Greedy nearest-neighbor route optimization
  optimizeRoute() {
    if (this.stops.length < 3) {
      showToast('至少需要3个地点才能优化路线');
      return;
    }

    const items = this.stops.map(id => this.getItem(id)).filter(Boolean);
    const withCoords = items.filter(i => i.lat && i.lng);

    if (withCoords.length < 3) {
      showToast('地点坐标数据不足，无法优化');
      return;
    }

    // Greedy nearest neighbor from first item
    const optimized = [withCoords[0].id];
    const remaining = withCoords.slice(1);

    while (remaining.length > 0) {
      const last = this.getItem(optimized[optimized.length - 1]);
      let nearestIdx = 0;
      let nearestDist = Infinity;
      remaining.forEach((item, idx) => {
        const dist = this._haversine(last.lat, last.lng, item.lat, item.lng);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = idx;
        }
      });
      optimized.push(remaining[nearestIdx].id);
      remaining.splice(nearestIdx, 1);
    }

    // Add items without coords at the end
    const withoutCoords = items.filter(i => !i.lat || !i.lng);
    withoutCoords.forEach(i => optimized.push(i.id));

    this.stops = optimized;
    this._save();
    showToast('🗺️ 路线已优化！');
  }

  _haversine(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Detect time conflicts
  detectConflicts() {
    const conflicts = [];
    const sorted = this.stops
      .map(id => ({ id, time: this.stopTimes[id] || '' }))
      .filter(s => s.time);

    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = this._parseTimeRange(sorted[i].time);
      const next = this._parseTimeRange(sorted[i + 1].time);
      if (curr && next && curr.end > next.start) {
        conflicts.push({
          stop1: sorted[i].id,
          stop2: sorted[i + 1].id,
          message: `${this.getItem(sorted[i].id)?.name || ''} 与 ${this.getItem(sorted[i + 1].id)?.name || ''} 时间重叠`
        });
      }
    }
    return conflicts;
  }

  _parseTimeRange(timeStr) {
    if (!timeStr) return null;
    const parts = timeStr.split('-');
    if (parts.length !== 2) return null;
    return {
      start: this._timeToMinutes(parts[0].trim()),
      end: this._timeToMinutes(parts[1].trim())
    };
  }

  _timeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  calculateTotalCost() {
    return this.stops.reduce((sum, id) => {
      const item = this.getItem(id);
      return sum + (item ? (item.price || 0) : 0);
    }, 0);
  }

  calculateTotalTime() {
    return this.stops.reduce((sum, id) => {
      const item = this.getItem(id);
      if (!item || !item.dur) return sum;
      const match = item.dur.match(/(\d+(?:\.\d+)?)/);
      return sum + (match ? parseFloat(match[1]) : 1);
    }, 0);
  }

  generateShareText() {
    if (!this.stops.length) return '我的济南行程（空）';
    let text = `🗺️ 我的济南行程（${this.stops.length}站）\n\n`;
    this.stops.forEach((id, i) => {
      const item = this.getItem(id);
      if (!item) return;
      const time = this.stopTimes[id] || '';
      const cost = item.price === 0 ? '免费' : `¥${item.price}`;
      text += `${i + 1}. ${item.name}`;
      if (time) text += ` (${time})`;
      text += ` · ${cost}\n`;
    });
    text += `\n💰 门票总计约 ¥${this.calculateTotalCost()}`;
    text += `\n⏱ 预计总时长 ${this.calculateTotalTime().toFixed(1)} 小时`;
    text += `\n\n— 来自济南旅游攻略`;
    return text;
  }

  // Export to ICS calendar format
  exportToCalendar(tripDate = '') {
    if (!this.stops.length) {
      showToast('行程为空，无法导出');
      return;
    }
    const date = tripDate || new Date().toISOString().slice(0, 10);
    const dateStr = date.replace(/-/g, '');
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//济南旅游攻略//CN\n';

    this.stops.forEach((id, i) => {
      const item = this.getItem(id);
      if (!item) return;
      const time = this.stopTimes[id] || '';
      let startHour = 8 + i * 2;
      let endHour = startHour + 2;
      if (time) {
        const parts = time.split('-');
        if (parts.length === 2) {
          const sh = parseInt(parts[0]);
          const eh = parseInt(parts[1]);
          if (!isNaN(sh)) startHour = sh;
          if (!isNaN(eh)) endHour = eh;
        }
      }
      ics += `BEGIN:VEVENT\nDTSTART:${dateStr}T${String(startHour).padStart(2, '0')}0000\n`;
      ics += `DTEND:${dateStr}T${String(endHour).padStart(2, '0')}0000\n`;
      ics += `SUMMARY:济南 - ${item.name}\n`;
      ics += `DESCRIPTION:${item.desc || ''}\\n费用: ${item.price === 0 ? '免费' : '¥' + item.price}\n`;
      ics += `END:VEVENT\n`;
    });
    ics += 'END:VCALENDAR';

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `济南行程-${date}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📅 日历文件已下载');
  }

  // Render interactive timeline
  renderTimeline() {
    if (!this.stops.length) {
      return `<div class="tp-empty">
        <div class="tp-empty-icon">📋</div>
        <p>行程还没有内容</p>
        <p class="tp-empty-hint">在景点或美食页面添加目的地</p>
      </div>`;
    }

    // Check conflicts
    const conflicts = this.detectConflicts();
    const conflictIds = new Set();
    conflicts.forEach(c => { conflictIds.add(c.stop1); conflictIds.add(c.stop2); });

    let html = `<div class="tp-controls">
      <button class="btn btn-sm btn-primary tp-optimize" aria-label="优化路线">🗺️ 优化路线</button>
      <button class="btn btn-sm btn-outline tp-share" aria-label="分享行程">📤 分享</button>
      <button class="btn btn-sm btn-outline tp-export" aria-label="导出日历">📅 导出日历</button>
      <button class="btn btn-sm btn-outline tp-clear" aria-label="清空行程">🗑️ 清空</button>
    </div>`;

    if (conflicts.length) {
      html += `<div class="tp-conflicts">⚠️ 检测到时间冲突：${conflicts.map(c => c.message).join('；')}</div>`;
    }

    html += `<div class="tp-timeline" role="list" aria-label="行程时间线">`;
    this.stops.forEach((id, i) => {
      const item = this.getItem(id);
      if (!item) return;
      const time = this.stopTimes[id] || '';
      const isSpot = this.spots.some(s => s.id === id);
      const hasConflict = conflictIds.has(id);

      html += `<div class="tp-item ${hasConflict ? 'conflict' : ''}" draggable="true" data-index="${i}" data-id="${id}" role="listitem" aria-label="${item.name}">
        <div class="tp-drag-handle" aria-hidden="true">⠿</div>
        <div class="tp-item-content">
          <div class="tp-item-top">
            <span class="tp-item-num">${i + 1}</span>
            <span class="tp-item-name">${item.name}</span>
            <span class="tp-item-type ${isSpot ? 'spot' : 'food'}">${isSpot ? '景点' : '美食'}</span>
          </div>
          <div class="tp-item-details">
            <input type="text" class="tp-time-input" data-id="${id}" value="${time}" placeholder="时间 (如 09:00-11:00)" aria-label="${item.name}时间">
            <span class="tp-item-cost">${item.price === 0 ? '免费' : '¥' + item.price}</span>
            ${item.dur ? `<span class="tp-item-dur">⏱ ${item.dur}</span>` : ''}
          </div>
        </div>
        <button class="tp-remove-btn" data-id="${id}" aria-label="移除${item.name}">✕</button>
      </div>`;
    });
    html += `</div>`;

    // Summary
    html += `<div class="tp-summary">
      <div class="tp-stat"><span class="tp-stat-label">站点</span><span class="tp-stat-value">${this.stops.length}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">门票</span><span class="tp-stat-value">¥${this.calculateTotalCost()}</span></div>
      <div class="tp-stat"><span class="tp-stat-label">时长</span><span class="tp-stat-value">${this.calculateTotalTime().toFixed(1)}h</span></div>
    </div>`;

    return html;
  }

  // Bind drag & drop to rendered timeline
  bindTimeline(container) {
    if (!container) return;
    let draggedEl = null;
    let draggedIdx = -1;

    const onDragStart = (e) => {
      draggedEl = e.target.closest('.tp-item');
      if (!draggedEl) return;
      draggedIdx = parseInt(draggedEl.dataset.index);
      draggedEl.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', draggedIdx);
    };

    const onDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const target = e.target.closest('.tp-item');
      if (target && target !== draggedEl) {
        target.classList.add('drag-over');
      }
    };

    const onDragLeave = (e) => {
      const target = e.target.closest('.tp-item');
      if (target) target.classList.remove('drag-over');
    };

    const onDrop = (e) => {
      e.preventDefault();
      const target = e.target.closest('.tp-item');
      if (target && target !== draggedEl) {
        const toIdx = parseInt(target.dataset.index);
        this.reorder(draggedIdx, toIdx);
        showToast('行程已重新排列');
      }
      container.querySelectorAll('.tp-item').forEach(el => {
        el.classList.remove('dragging', 'drag-over');
      });
    };

    const onDragEnd = () => {
      container.querySelectorAll('.tp-item').forEach(el => {
        el.classList.remove('dragging', 'drag-over');
      });
      draggedEl = null;
      draggedIdx = -1;
    };

    // Touch drag support
    let touchStartY = 0;
    let touchItem = null;
    let touchClone = null;

    const onTouchStart = (e) => {
      const handle = e.target.closest('.tp-drag-handle');
      if (!handle) return;
      touchItem = handle.closest('.tp-item');
      if (!touchItem) return;
      touchStartY = e.touches[0].clientY;
      draggedIdx = parseInt(touchItem.dataset.index);

      touchClone = touchItem.cloneNode(true);
      touchClone.className = 'tp-item tp-touch-clone';
      touchClone.style.position = 'fixed';
      touchClone.style.zIndex = '999';
      touchClone.style.width = touchItem.offsetWidth + 'px';
      touchClone.style.opacity = '0.8';
      touchClone.style.pointerEvents = 'none';
      document.body.appendChild(touchClone);

      const rect = touchItem.getBoundingClientRect();
      touchClone.style.left = rect.left + 'px';
      touchClone.style.top = rect.top + 'px';
      touchItem.classList.add('dragging');
    };

    const onTouchMove = (e) => {
      if (!touchClone) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      touchClone.style.top = (y - 30) + 'px';

      // Find target
      container.querySelectorAll('.tp-item:not(.dragging)').forEach(el => {
        el.classList.remove('drag-over');
        const rect = el.getBoundingClientRect();
        if (y > rect.top && y < rect.bottom) {
          el.classList.add('drag-over');
        }
      });
    };

    const onTouchEnd = (e) => {
      if (!touchClone || !touchItem) return;
      const y = e.changedTouches[0].clientY;
      let targetIdx = -1;

      container.querySelectorAll('.tp-item:not(.dragging)').forEach(el => {
        el.classList.remove('drag-over');
        const rect = el.getBoundingClientRect();
        if (y > rect.top && y < rect.bottom) {
          targetIdx = parseInt(el.dataset.index);
        }
      });

      if (targetIdx >= 0 && targetIdx !== draggedIdx) {
        this.reorder(draggedIdx, targetIdx);
        showToast('行程已重新排列');
      }

      touchItem.classList.remove('dragging');
      touchClone.remove();
      touchClone = null;
      touchItem = null;
    };

    container.addEventListener('dragstart', onDragStart);
    container.addEventListener('dragover', onDragOver);
    container.addEventListener('dragleave', onDragLeave);
    container.addEventListener('drop', onDrop);
    container.addEventListener('dragend', onDragEnd);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);

    // Time input change
    container.addEventListener('change', (e) => {
      if (e.target.classList.contains('tp-time-input')) {
        this.setStopTime(e.target.dataset.id, e.target.value);
      }
    });

    // Remove button
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.tp-remove-btn');
      if (btn) {
        this.removeStop(btn.dataset.id);
        showToast('已从行程移除');
      }
    });

    // Control buttons
    container.addEventListener('click', (e) => {
      if (e.target.closest('.tp-optimize')) {
        this.optimizeRoute();
      }
      if (e.target.closest('.tp-share')) {
        const text = this.generateShareText();
        if (navigator.share) {
          navigator.share({ title: '我的济南行程', text });
        } else {
          navigator.clipboard?.writeText(text);
          showToast('行程已复制到剪贴板');
        }
      }
      if (e.target.closest('.tp-export')) {
        this.exportToCalendar();
      }
      if (e.target.closest('.tp-clear')) {
        if (confirm('确定要清空行程吗？')) {
          this.stops = [];
          this.stopTimes = {};
          this._save();
          showToast('行程已清空');
        }
      }
    });
  }
}

// ═══════════════════════════════════════
// 4. COMPARE TOOL
// ═══════════════════════════════════════
export class CompareTool {
  constructor() {
    this.items = [];
    this.maxItems = 4;
  }

  add(item) {
    if (this.items.length >= this.maxItems) {
      showToast(`最多对比 ${this.maxItems} 个景点`);
      return false;
    }
    if (this.items.find(i => i.id === item.id)) {
      showToast('已在对比列表中');
      return false;
    }
    this.items.push(item);
    showToast(`已添加到对比 (${this.items.length}/${this.maxItems})`);
    return true;
  }

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
  }

  clear() {
    this.items = [];
  }

  has(id) {
    return this.items.some(i => i.id === id);
  }

  count() {
    return this.items.length;
  }

  // Inject compare button into card
  injectButton(cardEl, spot) {
    if (!cardEl || cardEl.querySelector('.compare-btn')) return;
    const btn = document.createElement('button');
    btn.className = `compare-btn ${this.has(spot.id) ? 'active' : ''}`;
    btn.setAttribute('aria-label', this.has(spot.id) ? '取消对比' : '加入对比');
    btn.dataset.id = spot.id;
    btn.innerHTML = '⚖️';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.has(spot.id)) {
        this.remove(spot.id);
        btn.classList.remove('active');
        btn.setAttribute('aria-label', '加入对比');
      } else {
        this.add(spot);
        btn.classList.add('active');
        btn.setAttribute('aria-label', '取消对比');
      }
    });
    const imgWrap = cardEl.querySelector('.card-img');
    if (imgWrap) imgWrap.appendChild(btn);
  }

  // Render compare panel
  renderPanel() {
    if (!this.items.length) return '';

    const fields = [
      { label: '价格', key: 'price', format: v => v === 0 ? '<span style="color:var(--teal)">免费</span>' : `¥${v}` },
      { label: '评分', key: 'rating', format: v => `★ ${v}` },
      { label: '时长', key: 'dur', format: v => v || '—' },
      { label: '开放时间', key: 'open', format: v => (v || '—').split('(')[0].split('·')[0].trim() },
      { label: '适合人群', key: 'audience', format: v => (v || []).map(a => ({ family: '亲子', couple: '情侣', elder: '老人', solo: '独行' }[a] || a)).join('、') || '—' },
      { label: '交通', key: 'transport', format: v => (v || '—').slice(0, 25) },
      { label: '预约', key: 'book', format: v => (v || '无需').slice(0, 20) },
      { label: '分类', key: 'cat', format: v => ({ spring: '泉水', nature: '自然', history: '历史', food: '美食街' }[v] || v) }
    ];

    let html = `<div class="compare-panel ${this.items.length > 0 ? 'open' : ''}">
      <div class="compare-header">
        <h4>⚖️ 景点对比 (${this.items.length}/${this.maxItems})</h4>
        <div class="compare-header-actions">
          <button class="btn btn-sm btn-outline compare-clear">清空</button>
          <button class="compare-toggle" aria-label="展开/收起对比面板">▼</button>
        </div>
      </div>
      <div class="compare-body">
        <table class="compare-table" role="table" aria-label="景点对比表格">
          <thead><tr>
            <th class="compare-field-label">项目</th>
            ${this.items.map(item => `<th class="compare-item-header">
              <img src="${item.img}" alt="${item.name}" class="compare-thumb">
              <div class="compare-item-name">${item.name}</div>
              <button class="compare-remove" data-id="${item.id}" aria-label="移除${item.name}">✕</button>
            </th>`).join('')}
          </tr></thead>
          <tbody>
            ${fields.map(f => `<tr>
              <td class="compare-field-label">${f.label}</td>
              ${this.items.map(item => `<td>${f.format(item[f.key])}</td>`).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

    return html;
  }

  // Bind events to rendered panel
  bindPanel(container) {
    if (!container) return;
    container.addEventListener('click', (e) => {
      if (e.target.closest('.compare-clear')) {
        this.clear();
      }
      if (e.target.closest('.compare-remove')) {
        this.remove(e.target.closest('.compare-remove').dataset.id);
      }
      if (e.target.closest('.compare-toggle')) {
        const body = container.querySelector('.compare-body');
        const btn = container.querySelector('.compare-toggle');
        if (body) {
          body.classList.toggle('collapsed');
          btn.textContent = body.classList.contains('collapsed') ? '▲' : '▼';
        }
      }
    });
  }
}

// ═══════════════════════════════════════
// 5. BUDGET CALCULATOR (Enhanced)
// ═══════════════════════════════════════
export class BudgetCalculator {
  constructor() {
    this.rates = { USD: 0.14, EUR: 0.13, JPY: 21.5, KRW: 190, GBP: 0.11 };
    this.levelPrices = {
      budget: {
        ticket: 30, food: 50, transport: 15, hotel: 80, shopping: 30, emergency: 20
      },
      comfort: {
        ticket: 80, food: 120, transport: 40, hotel: 300, shopping: 80, emergency: 50
      },
      premium: {
        ticket: 120, food: 250, transport: 80, hotel: 600, shopping: 200, emergency: 100
      }
    };
    // Season multipliers
    this.seasonMult = {
      spring: 1.0, summer: 1.1, autumn: 1.15, winter: 0.85,
      peak: 1.3 // National holidays
    };
  }

  calculate(options = {}) {
    const {
      days = 2,
      people = 2,
      level = 'comfort',
      season = 'spring',
      activities = []
    } = options;

    const prices = this.levelPrices[level] || this.levelPrices.comfort;
    const mult = this.seasonMult[season] || 1.0;

    const breakdown = {
      ticket: Math.round(prices.ticket * days * people * mult),
      food: Math.round(prices.food * days * people * mult),
      transport: Math.round(prices.transport * days * people * mult),
      hotel: Math.round(prices.hotel * (days - 1) * Math.ceil(people / 2) * mult),
      shopping: Math.round(prices.shopping * people),
      emergency: Math.round(prices.emergency * days)
    };

    // Activity adjustments
    activities.forEach(act => {
      if (act === 'museum') breakdown.ticket = Math.round(breakdown.ticket * 0.7);
      if (act === 'hiking') breakdown.transport = Math.round(breakdown.transport * 0.6);
      if (act === 'foodie') breakdown.food = Math.round(breakdown.food * 1.3);
    });

    const total = Object.values(breakdown).reduce((s, v) => s + v, 0);

    // Currency conversions
    const currencies = {};
    for (const [code, rate] of Object.entries(this.rates)) {
      currencies[code] = Math.round(total * rate);
    }

    return {
      total,
      breakdown,
      currencies,
      perPerson: Math.round(total / people),
      perDay: Math.round(total / days),
      level,
      season,
      days,
      people
    };
  }

  renderBreakdown(budget) {
    if (!budget) return '';
    const labels = {
      ticket: { icon: '🎫', name: '门票' },
      food: { icon: '🍜', name: '餐饮' },
      transport: { icon: '🚌', name: '交通' },
      hotel: { icon: '🏨', name: '住宿' },
      shopping: { icon: '🛍️', name: '购物' },
      emergency: { icon: '🆘', name: '应急' }
    };

    const maxVal = Math.max(...Object.values(budget.breakdown));

    let html = `<div class="budget-result">
      <div class="budget-total">
        <div class="budget-total-amount">¥${budget.total.toLocaleString()}</div>
        <div class="budget-total-meta">${budget.days}天${budget.people}人 · 每人 ¥${budget.perPerson.toLocaleString()} · 每天 ¥${budget.perDay.toLocaleString()}</div>
      </div>
      <div class="budget-bars">`;

    for (const [key, value] of Object.entries(budget.breakdown)) {
      const label = labels[key];
      const pct = maxVal > 0 ? (value / maxVal * 100) : 0;
      html += `<div class="budget-bar-row">
        <span class="budget-bar-icon">${label.icon}</span>
        <span class="budget-bar-label">${label.name}</span>
        <div class="budget-bar-track"><div class="budget-bar-fill" style="width:${pct}%"></div></div>
        <span class="budget-bar-value">¥${value.toLocaleString()}</span>
      </div>`;
    }

    html += `</div>
      <div class="budget-currencies">
        <span class="budget-currency-title">💱 参考汇率</span>
        <div class="budget-currency-list">
          <span>$${budget.currencies.USD} USD</span>
          <span>€${budget.currencies.EUR} EUR</span>
          <span>¥${budget.currencies.JPY} JPY</span>
          <span>₩${budget.currencies.KRW} KRW</span>
        </div>
      </div>
    </div>`;

    return html;
  }
}

// ═══════════════════════════════════════
// 6. OFFLINE CACHE MANAGER
// ═══════════════════════════════════════
export class OfflineManager {
  constructor() {
    this.cacheName = 'jinan-travel-v1';
    this.hasSW = 'serviceWorker' in navigator;
  }

  async cacheEssentials() {
    if (!this.hasSW) return;
    try {
      const cache = await caches.open(this.cacheName);
      const urls = [
        '/jinan-travel-guide/data/spots.json',
        '/jinan-travel-guide/data/food.json',
        '/jinan-travel-guide/assets/social-Dy3PicR1.css'
      ];
      await Promise.all(urls.map(url => cache.add(url).catch(() => {})));
      localStorage.setItem('jinan-cache-time', Date.now().toString());
    } catch (e) {
      console.warn('Cache failed:', e);
    }
  }

  async getCachedData(key) {
    try {
      const cache = await caches.open(this.cacheName);
      const response = await cache.match(key);
      if (response) return await response.json();
    } catch (e) { /* ignore */ }
    return null;
  }

  getCacheStatus() {
    const time = localStorage.getItem('jinan-cache-time');
    if (!time) return { cached: false };
    const age = Date.now() - parseInt(time);
    return {
      cached: true,
      time: new Date(parseInt(time)).toLocaleString('zh-CN'),
      ageHours: Math.round(age / 3600000),
      fresh: age < 86400000 // 24h
    };
  }

  renderStatus() {
    const status = this.getCacheStatus();
    if (!status.cached) {
      return '<div class="cache-status">📦 尚未缓存离线数据</div>';
    }
    return `<div class="cache-status ${status.fresh ? 'fresh' : 'stale'}">
      📦 离线数据${status.fresh ? '已就绪' : '需更新'} · 缓存于 ${status.time}
    </div>`;
  }
}

// ═══════════════════════════════════════
// 7. WEATHER WIDGET
// ═══════════════════════════════════════
export class WeatherWidget {
  constructor() {
    this.cache = JSON.parse(localStorage.getItem(KEYS.weatherCache) || 'null');
  }

  async fetchWeather() {
    // Check cache (15 min)
    if (this.cache && Date.now() - this.cache.ts < 900000) {
      return this.cache.data;
    }
    try {
      const res = await fetch('https://wttr.in/Jinan?format=j1&lang=zh');
      const data = await res.json();
      const current = data.current_condition?.[0];
      if (!current) throw new Error('No data');

      const weather = {
        temp: current.temp_C,
        feelsLike: current.FeelsLikeC,
        desc: current.lang_zh?.[0]?.value || current.weatherDesc?.[0]?.value || '',
        humidity: current.humidity,
        wind: current.windspeedKmph,
        windDir: current.winddir16Point,
        visibility: current.visibility,
        uvIndex: current.uvIndex,
        code: current.weatherCode
      };

      this.cache = { ts: Date.now(), data: weather };
      localStorage.setItem(KEYS.weatherCache, JSON.stringify(this.cache));
      return weather;
    } catch (e) {
      return this.cache?.data || null;
    }
  }

  async get7DayForecast() {
    try {
      const res = await fetch('https://wttr.in/Jinan?format=j1&lang=zh');
      const data = await res.json();
      return (data.weather || []).slice(0, 7).map(day => ({
        date: day.date,
        maxTemp: day.maxtempC,
        minTemp: day.mintempC,
        desc: day.hourly?.[4]?.lang_zh?.[0]?.value || '',
        code: day.hourly?.[4]?.weatherCode || ''
      }));
    } catch (e) {
      return [];
    }
  }

  getWeatherIcon(code) {
    const icons = {
      '113': '☀️', '116': '⛅', '119': '☁️', '122': '☁️',
      '143': '🌫️', '176': '🌦️', '179': '🌨️', '182': '🌧️',
      '185': '🌧️', '200': '⛈️', '227': '🌨️', '230': '❄️',
      '248': '🌫️', '260': '🌫️', '263': '🌦️', '266': '🌧️',
      '281': '🌧️', '284': '🌧️', '293': '🌦️', '296': '🌧️',
      '299': '🌧️', '302': '🌧️', '305': '🌧️', '308': '🌧️',
      '311': '🌧️', '314': '🌧️', '317': '🌧️', '320': '🌨️',
      '323': '🌨️', '326': '🌨️', '329': '❄️', '332': '❄️',
      '335': '❄️', '338': '❄️', '350': '🌧️', '353': '🌦️',
      '356': '🌧️', '359': '🌧️', '362': '🌧️', '365': '🌧️',
      '368': '🌨️', '371': '❄️', '374': '🌧️', '377': '🌧️',
      '386': '⛈️', '389': '⛈️', '392': '⛈️', '395': '❄️'
    };
    return icons[code] || '🌤️';
  }

  getTravelAdvice(weather) {
    if (!weather) return '暂无天气建议';
    const temp = parseInt(weather.temp);
    const tips = [];

    // Temperature advice
    if (temp >= 35) tips.push('🥵 高温预警！建议室内活动，注意防暑降温');
    else if (temp >= 28) tips.push('☀️ 天气炎热，注意防晒，多喝水');
    else if (temp >= 20) tips.push('😊 气温宜人，适合户外游玩');
    else if (temp >= 10) tips.push('🧥 早晚偏凉，建议带薄外套');
    else tips.push('🧣 天气较冷，注意保暖');

    // Rain advice
    if (weather.desc.includes('雨')) tips.push('🌧️ 有雨，记得带伞');
    if (weather.desc.includes('雪')) tips.push('❄️ 有雪，注意路面湿滑');

    // Wind advice
    const wind = parseInt(weather.wind);
    if (wind > 30) tips.push('🌬️ 风力较大，注意防风');

    // UV advice
    if (parseInt(weather.uvIndex) > 6) tips.push('🧴 紫外线强，涂抹防晒霜');

    return tips.join(' · ');
  }

  async render() {
    const weather = await this.fetchWeather();
    if (!weather) return '<div class="weather-widget">暂无天气数据</div>';

    const icon = this.getWeatherIcon(weather.code);
    const advice = this.getTravelAdvice(weather);

    return `<div class="weather-widget" role="region" aria-label="济南天气">
      <div class="weather-current">
        <span class="weather-icon">${icon}</span>
        <span class="weather-temp">${weather.temp}°C</span>
        <span class="weather-desc">${weather.desc}</span>
      </div>
      <div class="weather-details">
        <span>🌡️ 体感 ${weather.feelsLike}°C</span>
        <span>💧 湿度 ${weather.humidity}%</span>
        <span>🌬️ ${weather.windDir} ${weather.wind}km/h</span>
      </div>
      <div class="weather-advice">${advice}</div>
    </div>`;
  }
}

// ═══════════════════════════════════════
// 8. ACCESSIBILITY TOOLS
// ═══════════════════════════════════════
export class AccessibilityTools {
  constructor() {
    this.fontSize = parseInt(localStorage.getItem(KEYS.fontSize) || '16');
    this.highContrast = localStorage.getItem(KEYS.highContrast) === 'true';
    this.reducedMotion = localStorage.getItem(KEYS.reducedMotion) === 'true';
    this._apply();
  }

  _apply() {
    document.documentElement.style.fontSize = this.fontSize + 'px';
    document.documentElement.classList.toggle('high-contrast', this.highContrast);
    if (this.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    }
  }

  increaseFontSize() {
    if (this.fontSize < 24) {
      this.fontSize += 2;
      localStorage.setItem(KEYS.fontSize, this.fontSize.toString());
      this._apply();
      showToast(`字体大小: ${this.fontSize}px`);
    }
  }

  decreaseFontSize() {
    if (this.fontSize > 12) {
      this.fontSize -= 2;
      localStorage.setItem(KEYS.fontSize, this.fontSize.toString());
      this._apply();
      showToast(`字体大小: ${this.fontSize}px`);
    }
  }

  resetFontSize() {
    this.fontSize = 16;
    localStorage.setItem(KEYS.fontSize, '16');
    this._apply();
    showToast('字体大小已重置');
  }

  toggleHighContrast() {
    this.highContrast = !this.highContrast;
    localStorage.setItem(KEYS.highContrast, this.highContrast.toString());
    this._apply();
    showToast(this.highContrast ? '高对比度已开启' : '高对比度已关闭');
  }

  toggleReducedMotion() {
    this.reducedMotion = !this.reducedMotion;
    localStorage.setItem(KEYS.reducedMotion, this.reducedMotion.toString());
    this._apply();
    showToast(this.reducedMotion ? '动画已减少' : '动画已恢复');
  }

  renderToolbar() {
    return `<div class="a11y-toolbar" role="toolbar" aria-label="无障碍工具" id="a11yToolbar">
      <button class="a11y-toggle" aria-label="无障碍设置" aria-expanded="false" id="a11yToggle">♿</button>
      <div class="a11y-panel" id="a11yPanel" aria-hidden="true">
        <div class="a11y-title">♿ 无障碍设置</div>
        <div class="a11y-group">
          <span class="a11y-label">字体大小</span>
          <div class="a11y-btn-group">
            <button class="a11y-btn" id="a11yFontDown" aria-label="减小字体">A-</button>
            <span class="a11y-value" id="a11yFontSize">${this.fontSize}px</span>
            <button class="a11y-btn" id="a11yFontUp" aria-label="增大字体">A+</button>
          </div>
        </div>
        <div class="a11y-group">
          <label class="a11y-switch">
            <input type="checkbox" id="a11yContrast" ${this.highContrast ? 'checked' : ''} aria-label="高对比度模式">
            <span class="a11y-switch-slider"></span>
            <span class="a11y-switch-label">高对比度</span>
          </label>
        </div>
        <div class="a11y-group">
          <label class="a11y-switch">
            <input type="checkbox" id="a11yMotion" ${this.reducedMotion ? 'checked' : ''} aria-label="减少动画">
            <span class="a11y-switch-slider"></span>
            <span class="a11y-switch-label">减少动画</span>
          </label>
        </div>
      </div>
    </div>`;
  }

  bindToolbar() {
    const toggle = document.getElementById('a11yToggle');
    const panel = document.getElementById('a11yPanel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      panel.setAttribute('aria-hidden', !open);
    });

    document.getElementById('a11yFontUp')?.addEventListener('click', () => {
      this.increaseFontSize();
      document.getElementById('a11yFontSize').textContent = this.fontSize + 'px';
    });

    document.getElementById('a11yFontDown')?.addEventListener('click', () => {
      this.decreaseFontSize();
      document.getElementById('a11yFontSize').textContent = this.fontSize + 'px';
    });

    document.getElementById('a11yContrast')?.addEventListener('change', () => {
      this.toggleHighContrast();
    });

    document.getElementById('a11yMotion')?.addEventListener('change', () => {
      this.toggleReducedMotion();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!document.getElementById('a11yToolbar')?.contains(e.target)) {
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

// ═══════════════════════════════════════
// 9. INITIALIZATION
// ═══════════════════════════════════════
export async function initInteractive() {
  // Render accessibility toolbar
  const a11y = new AccessibilityTools();
  const toolbarHtml = a11y.renderToolbar();
  const toolbarContainer = document.createElement('div');
  toolbarContainer.innerHTML = toolbarHtml;
  document.body.appendChild(toolbarContainer);
  a11y.bindToolbar();

  // Initialize favorites badge
  const favs = new Favorites();
  favs._updateBadge();

  // Initialize smart search if search input exists
  const searchInput = document.getElementById('heroSearch') ||
    document.querySelector('.hero-search input') ||
    document.querySelector('.food-search');
  const searchContainer = searchInput?.closest('.hero-search') ||
    searchInput?.closest('.food-search-wrap') ||
    searchInput?.parentElement;

  if (searchInput && searchContainer) {
    let spotsData = [], foodsData = [];
    try {
      const [spotsRes, foodRes] = await Promise.all([
        fetch('/jinan-travel-guide/data/spots.json').catch(() => null),
        fetch('/jinan-travel-guide/data/food.json').catch(() => null)
      ]);
      if (spotsRes) spotsData = await spotsRes.json();
      if (foodRes) {
        const fd = await foodRes.json();
        foodsData = fd.foods || fd;
      }
    } catch (e) { /* ignore */ }

    const search = new SmartSearch(spotsData, foodsData);
    search.bind(searchInput, searchContainer);

    // Handle inline search results
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query && searchInput) {
      searchInput.value = query;
      const resultsContainer = document.getElementById('spotGrid') ||
        document.getElementById('foodGrid');
      if (resultsContainer) {
        search.renderInlineResults(query, resultsContainer.parentElement || resultsContainer, spotsData, foodsData);
      }
    }
  }

  // Cache essentials
  const offline = new OfflineManager();
  offline.cacheEssentials();
}
