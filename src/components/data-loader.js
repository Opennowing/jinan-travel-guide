/**
 * ═══ 数据加载器 - 带容错和缓存机制 ═══
 * 
 * 功能：
 * 1. 自动重试（最多 3 次）
 * 2. localStorage 缓存（24h 有效）
 * 3. 内置 fallback 数据
 * 4. 加载状态回调
 * 5. 数据验证
 */

const CACHE_PREFIX = 'jinan-cache-';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// ── 缓存管理 ──
function getCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    // Storage full, clear old caches
    clearOldCaches();
  }
}

function clearOldCaches() {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  } catch {}
}

// ── 数据验证 ──
function validateSpots(data) {
  if (!Array.isArray(data)) return false;
  return data.every(s => s.id && s.name && typeof s.lat === 'number' && typeof s.lng === 'number');
}

function validateFoods(data) {
  if (!data?.foods || !Array.isArray(data.foods)) return false;
  return data.foods.every(f => f.id && f.name);
}

// ── 带重试的 fetch ──
async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`[DataLoader] 第 ${i + 1} 次加载失败: ${url}`, e.message);
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, RETRY_DELAY * (i + 1)));
      }
    }
  }
  return null;
}

// ── 内置 fallback 数据（最小可用集）──
const FALLBACK_SPOTS = [
  { id: "baotu", name: "趵突泉", cat: "spring", badge: "must", img: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop", price: 40, rating: 4.8, reviews: 2847, dur: "2-3h", desc: "天下第一泉，三窟并发、水涌若轮。", audience: ["family"], lat: 36.6636, lng: 116.9975, transport: "地铁2号线" },
  { id: "daminghu", name: "大明湖", cat: "nature", badge: "hot", img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop", price: 0, rating: 4.7, reviews: 3521, dur: "2-3h", desc: "湖水由泉水汇成，四面荷花三面柳。", audience: ["family"], lat: 36.6766, lng: 117.0215, transport: "地铁1号线" },
  { id: "qianfo", name: "千佛山", cat: "nature", badge: "must", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", price: 30, rating: 4.6, reviews: 1567, dur: "3h", desc: "隋开皇年间在山崖镌刻佛像千余尊。", audience: ["solo"], lat: 36.6386, lng: 117.0486, transport: "公交K51路" },
  { id: "heihu", name: "黑虎泉", cat: "spring", badge: "free", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", price: 0, rating: 4.6, reviews: 1893, dur: "40min", desc: "泉水从石虎口中喷涌，声如虎啸。", audience: ["family"], lat: 36.6601, lng: 117.034, transport: "步行" },
  { id: "furong", name: "芙蓉街·曲水亭街", cat: "food", badge: "hot", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop", price: 0, rating: 4.5, reviews: 4210, dur: "1.5h", desc: "济南最有味道的老街，青石板路、泉水人家。", audience: ["couple"], lat: 36.6689, lng: 117.0231, transport: "地铁2号线" }
];

const FALLBACK_FOODS = {
  categories: [
    { id: "lucai", name: "鲁菜经典", icon: "🍲" },
    { id: "xiaochi", name: "市井小吃", icon: "🍢" },
    { id: "laozihao", name: "老字号", icon: "🏮" },
    { id: "zaocan", name: "早餐", icon: "🌅" },
    { id: "yexiao", name: "夜宵", icon: "🌙" },
    { id: "yinpin", name: "饮品", icon: "🍵" }
  ],
  foods: [
    { id: "tangcu", name: "糖醋黄河鲤鱼", cat: "lucai", tag: "鲁菜经典", desc: "鲁菜经典。先炸后浇糖醋汁，外酥里嫩。", must: true, img: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&h=400&fit=crop", shops: [{ name: "聚丰德", avg: "¥85", addr: "泉城路288号", rating: 4.6 }] },
    { id: "bazirou", name: "把子肉", cat: "xiaochi", tag: "市井美食", desc: "济南灵魂快餐。五花肉酱油炖酥烂，配米饭浇汤汁。", must: true, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop", shops: [{ name: "超意兴", avg: "¥15", addr: "全城连锁", rating: 4.3 }] },
    { id: "youxuan", name: "油旋", cat: "xiaochi", tag: "济南独有", desc: "面团抹葱油卷成螺旋状，入炉烤至金黄酥脆。", must: true, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop", shops: [{ name: "油旋张", avg: "¥8", addr: "泉城路", rating: 4.7 }] },
    { id: "tianmo", name: "甜沫", cat: "zaocan", tag: "济南早餐", desc: "小米面熬制，名字带「甜」却是咸的。", must: true, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop", shops: [{ name: "春江饭店", avg: "¥8", addr: "泉城路", rating: 4.3 }] },
    { id: "caobao", name: "草包包子", cat: "laozihao", tag: "老字号", desc: "始创1937年。皮薄馅大汁多，荷叶包裹蒸制。", must: true, img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop", shops: [{ name: "草包包子铺", avg: "¥35", addr: "泉城路222号", rating: 4.6 }] }
  ]
};

// ═══ 主要导出 API ═══

/**
 * 加载景点数据
 * @param {Function} onLoading - 加载状态回调 (boolean)
 * @param {Function} onError - 错误回调 (string)
 * @returns {Promise<Array>} 景点数组
 */
export async function loadSpots(onLoading, onError) {
  onLoading?.(true);

  // 1. 尝试缓存
  const cached = getCache('spots');
  if (cached && validateSpots(cached)) {
    console.log('[DataLoader] 使用缓存的景点数据');
    onLoading?.(false);
    return cached;
  }

  // 2. 尝试网络加载（带重试）
  const data = await fetchWithRetry('/src/data/spots.json');
  if (data && validateSpots(data)) {
    setCache('spots', data);
    onLoading?.(false);
    return data;
  }

  // 3. 使用 fallback
  console.warn('[DataLoader] 网络加载失败，使用 fallback 数据');
  onError?.('数据加载中，显示部分景点…');
  onLoading?.(false);
  return FALLBACK_SPOTS;
}

/**
 * 加载美食数据
 * @param {Function} onLoading - 加载状态回调
 * @param {Function} onError - 错误回调
 * @returns {Promise<Object>} { categories, foods }
 */
export async function loadFoods(onLoading, onError) {
  onLoading?.(true);

  // 1. 尝试缓存
  const cached = getCache('foods');
  if (cached && validateFoods(cached)) {
    console.log('[DataLoader] 使用缓存的美食数据');
    onLoading?.(false);
    return cached;
  }

  // 2. 尝试网络加载
  const data = await fetchWithRetry('/src/data/food.json');
  if (data && validateFoods(data)) {
    setCache('foods', data);
    onLoading?.(false);
    return data;
  }

  // 3. 使用 fallback
  console.warn('[DataLoader] 网络加载失败，使用 fallback 数据');
  onError?.('数据加载中，显示部分美食…');
  onLoading?.(false);
  return FALLBACK_FOODS;
}

/**
 * 清除所有缓存
 */
export function clearCache() {
  clearOldCaches();
}

/**
 * 获取缓存状态
 */
export function getCacheStatus() {
  const spots = getCache('spots');
  const foods = getCache('foods');
  return {
    spotsCached: !!spots,
    foodsCached: !!foods,
    spotsCount: spots?.length || 0,
    foodsCount: foods?.foods?.length || 0
  };
}
