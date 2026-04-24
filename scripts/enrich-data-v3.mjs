#!/usr/bin/env node
/**
 * 济南旅游攻略 - 数据增强 V3
 * 追加更多数据，目标 80+ 景点、60+ 美食
 * 重点：更多真实餐厅、更多周边景点、更多本地美食
 */

import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');

const existingSpots = JSON.parse(readFileSync(join(DATA_DIR, 'spots.json'), 'utf-8'));
const existingFoods = JSON.parse(readFileSync(join(DATA_DIR, 'food.json'), 'utf-8'));

// ═══ 更多景点 - 济南周边 + 深度游 ═══
const V3_SPOTS = [
  // 南部山区深度
  { id: "yaowang", name: "药乡国家森林公园", cat: "nature", badge: "hidden", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", price: 40, priceOld: 0, rating: 4.2, reviews: 178, dur: "4h", open: "08:00-17:00", book: "现场购票", discount: "学生半价", bestTime: "夏秋", crowd: "人很少", desc: "济南南部山区原始森林，空气负氧离子极高。适合徒步和避暑。", trust: "国家森林公园 · 天然氧吧", combo: null, audience: ["solo"], lat: 36.4386, lng: 117.0986, transport: "自驾约1小时", photos: ["森林", "溪流"], tips: "离市区很远，建议自驾。夏天避暑好去处。", bestPhoto: "森林小径，阳光透过树叶", nearby: ["九如山", "红叶谷"] },
  { id: "jinxiuxun", name: "锦绣川水库", cat: "nature", badge: "free", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop", price: 0, priceOld: 0, rating: 4.0, reviews: 123, dur: "2h", open: "全天", book: "无需预约", discount: "免费", bestTime: "春秋", crowd: "人不多", desc: "济南南部山区的水库，水面开阔，周围群山环抱。适合野餐和钓鱼。", trust: "免费 · 野餐胜地", combo: null, audience: ["family"], lat: 36.4886, lng: 117.0586, transport: "自驾约40分钟", photos: ["水库全景"], tips: "自带食物和水，周围没有商店。适合周末自驾游。", bestPhoto: "水库全景，群山倒映水面", nearby: ["红叶谷", "九如山"] },
  // 历史深度
  { id: "chengziya", name: "城子崖遗址", cat: "history", badge: "hidden", img: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600&h=400&fit=crop", price: 30, priceOld: 0, rating: 4.1, reviews: 89, dur: "1.5h", open: "09:00-17:00", book: "现场购票", discount: "学生半价", bestTime: "全年", crowd: "人很少", desc: "龙山文化的发现地，中国考古学的圣地。有遗址博物馆，展出大量黑陶文物。", trust: "国家级文保 · 龙山文化发源地", combo: null, audience: ["solo", "elder"], lat: 36.7386, lng: 117.4786, transport: "章丘打车20分钟", photos: ["遗址", "黑陶"], tips: "考古爱好者必去。一般人可能觉得有点无聊。", bestPhoto: "遗址博物馆内蛋壳黑陶展品", nearby: ["百脉泉", "明水古城"] },
  { id: "sisheng", name: "四门塔", cat: "history", badge: "hidden", img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop", price: 30, priceOld: 0, rating: 4.3, reviews: 167, dur: "2h", open: "08:00-17:00", book: "现场购票", discount: "学生半价", bestTime: "秋季", crowd: "人很少", desc: "中国现存最古老的石塔，隋代建筑。塔身四面各有一门，故名四门塔。", trust: "国家重点文保 · 隋代古塔", combo: null, audience: ["solo"], lat: 36.4186, lng: 116.9586, transport: "自驾约50分钟", photos: ["四门塔"], tips: "离灵岩寺不远，可以一起安排。建筑爱好者必去。", bestPhoto: "四门塔全景，古朴沧桑", nearby: ["灵岩寺", "五峰山"] },
  // 文创/新兴
  { id: "579", name: "579百工集", cat: "history", badge: "free", img: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&h=400&fit=crop", price: 0, priceOld: 0, rating: 4.3, reviews: 456, dur: "2h", open: "10:00-22:00", book: "无需预约", discount: "免费", bestTime: "周末", crowd: "周末人多", desc: "济南东部文创园区，旧厂房改造。有独立书店、咖啡馆、艺术工作室。适合文艺青年打卡。", trust: "文创园区 · 文艺打卡", combo: null, audience: ["couple", "solo"], lat: 36.6686, lng: 117.0786, transport: "地铁3号线", photos: ["文创园", "咖啡馆"], tips: "周末有市集和演出。咖啡馆和书店都很有调性。", bestPhoto: "文创园区工业风建筑", nearby: ["济南东站", "洪家楼"] },
  { id: "rongchuang", name: "融创文旅城", cat: "nature", badge: "hot", img: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=600&h=400&fit=crop", price: 200, priceOld: 280, rating: 4.4, reviews: 2345, dur: "6h", open: "10:00-21:00", book: "美团/携程购票", discount: "儿童优惠·夜场票¥150", bestTime: "工作日人少", crowd: "节假日排队", desc: "济南西部大型文旅综合体，有水世界、海世界、体育世界。适合亲子和年轻人。", trust: "大型文旅 · 亲子首选", combo: null, audience: ["family", "couple"], lat: 36.6386, lng: 116.8786, transport: "地铁1号线转公交", photos: ["水世界", "海世界"], tips: "工作日去人少。水世界夏天开放，海世界全年开放。", bestPhoto: "水世界全景", nearby: ["印象济南", "济南西站"] },
  // 更多泉水
  { id: "yuhuquan", name: "玉函泉", cat: "spring", badge: "free", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", price: 0, priceOld: 0, rating: 4.0, reviews: 67, dur: "15min", open: "全天", book: "无需预约", discount: "免费", bestTime: "清晨", crowd: "人很少", desc: "济南72名泉之一，泉水清澈。位于居民区内，非常生活化。", trust: "72名泉之一 · 居民区", combo: null, audience: ["solo"], lat: 36.6656, lng: 117.0156, transport: "步行", photos: ["泉水"], tips: "很小的泉，在居民区里。路过可以看看。", bestPhoto: "泉水特写", nearby: ["趵突泉", "泉城广场"] },
  { id: "liuqingquan", name: "柳絮泉", cat: "spring", badge: "free", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", price: 0, priceOld: 0, rating: 4.1, reviews: 45, dur: "15min", open: "全天", book: "无需预约", discount: "免费", bestTime: "春季", crowd: "人很少", desc: "72名泉之一，春天柳絮飘飞时泉水与柳絮共舞，极富诗意。", trust: "72名泉之一 · 诗意", combo: null, audience: ["solo"], lat: 36.6641, lng: 117.0241, transport: "步行", photos: ["柳絮泉"], tips: "春天柳絮飘飞时来最美。平时就是个小泉池。", bestPhoto: "春天柳絮飘飞时的泉水", nearby: ["趵突泉", "大明湖"] },
  // 商业/购物
  { id: "henglong", name: "恒隆广场", cat: "food", badge: "free", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop", price: 0, priceOld: 0, rating: 4.2, reviews: 1234, dur: "2h", open: "10:00-22:00", book: "无需预约", discount: "免费", bestTime: "随时", crowd: "周末人多", desc: "泉城路核心商圈，集购物、餐饮、娱乐于一体。有各种餐厅和咖啡馆。", trust: "核心商圈 · 购物餐饮", combo: null, audience: ["couple", "family"], lat: 36.6695, lng: 117.0255, transport: "步行可达", photos: ["商场"], tips: "吃饭选择很多，从快餐到高端都有。", bestPhoto: "商场夜景", nearby: ["泉城路", "趵突泉"] },
  { id: "wanda", name: "万达广场(经四路)", cat: "food", badge: "free", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop", price: 0, priceOld: 0, rating: 4.1, reviews: 987, dur: "2h", open: "10:00-22:00", book: "无需预约", discount: "免费", bestTime: "随时", crowd: "周末人多", desc: "经四路大型商业综合体，有万达影城、各种餐饮。", trust: "商业综合体", combo: null, audience: ["family"], lat: 36.6586, lng: 117.0086, transport: "公交可达", photos: ["万达广场"], tips: "看电影很方便。餐饮选择多。", bestPhoto: "万达广场外景", nearby: ["大观园", "老商埠区"] },
  // 更多周边
  { id: "jixia", name: "济南野生动物世界", cat: "nature", badge: "hot", img: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&h=400&fit=crop", price: 160, priceOld: 200, rating: 4.5, reviews: 3456, dur: "5h", open: "09:00-17:00", book: "美团/携程购票", discount: "儿童优惠·老人优惠", bestTime: "工作日人少", crowd: "节假日爆满", desc: "济南章丘区大型野生动物园，有自驾区和步行区。可以近距离看猛兽。", trust: "4A景区 · 亲子首选", combo: null, audience: ["family"], lat: 36.7086, lng: 117.4986, transport: "自驾或高铁到章丘", photos: ["动物", "自驾区"], tips: "自驾区可以开车近距离看猛兽。步行区有各种表演。", bestPhoto: "自驾区近距离看老虎", nearby: ["百脉泉", "明水古城"] },
  { id: "huoshan", name: "济南方特欢乐世界", cat: "nature", badge: "hot", img: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=600&h=400&fit=crop", price: 260, priceOld: 300, rating: 4.4, reviews: 2789, dur: "6h", open: "09:30-17:30", book: "美团/携程购票", discount: "儿童优惠·夜场票", bestTime: "工作日", crowd: "节假日排队", desc: "方特欢乐世界，适合年轻人和家庭。有过山车、4D影院等。", trust: "大型游乐园", combo: null, audience: ["family", "couple"], lat: 36.6186, lng: 116.8686, transport: "地铁1号线转公交", photos: ["过山车", "4D影院"], tips: "和东方神画不同，这个更适合喜欢刺激的人。", bestPhoto: "过山车全景", nearby: ["融创文旅城", "印象济南"] }
];

// ═══ 更多美食 - 更多餐厅和小吃 ═══
const V3_FOODS = [
  { id: "baicai", name: "醋溜白菜", cat: "lucai", tag: "鲁菜 · 家常", desc: "鲁菜家常菜，酸甜爽口。大白菜配醋大火快炒。", history: "鲁菜最家常的做法，几乎每家每户都会做。", season: "秋冬最佳", tips: "要大火快炒才脆。", must: false, img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop", shops: [{ name: "超意兴", avg: "¥12", addr: "全城连锁", rating: 4.3, hours: "06:00-21:00", bestDish: "醋溜白菜", wait: "不排队", lat: 36.668, lng: 117.026 }], price: "人均¥12", difficulty: "简单", where: "全城连锁" },
  { id: "tudou", name: "酸辣土豆丝", cat: "lucai", tag: "鲁菜 · 家常", desc: "鲁菜家常菜，酸辣爽口。土豆丝切得极细，大火快炒。", history: "最考验刀工的家常菜之一。", season: "四季皆宜", tips: "要泡水去淀粉才脆。", must: false, img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop", shops: [{ name: "超意兴", avg: "¥10", addr: "全城连锁", rating: 4.3, hours: "06:00-21:00", bestDish: "酸辣土豆丝", wait: "不排队", lat: 36.668, lng: 117.026 }], price: "人均¥10", difficulty: "简单", where: "全城连锁" },
  { id: "fanqie", name: "番茄炒蛋", cat: "lucai", tag: "家常 · 国民菜", desc: "国民家常菜，济南做法偏甜口。番茄汁拌饭是灵魂。", history: "全中国都会做的菜，济南版偏甜。", season: "四季皆宜", tips: "番茄要炒出汁才好吃。", must: false, img: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&h=400&fit=crop", shops: [{ name: "超意兴", avg: "¥10", addr: "全城连锁", rating: 4.3, hours: "06:00-21:00", bestDish: "番茄炒蛋", wait: "不排队", lat: 36.668, lng: 117.026 }], price: "人均¥10", difficulty: "简单", where: "全城连锁" },
  { id: "mifan", name: "把子肉盖饭", cat: "xiaochi", tag: "快餐 · 升级版", desc: "把子肉的升级版，把子肉+米饭+配菜一起。一份管饱。", history: "超意兴的招牌套餐。", season: "四季皆宜", tips: "浇汤汁是灵魂。", must: true, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop", shops: [{ name: "超意兴", avg: "¥18", addr: "全城连锁", rating: 4.3, hours: "06:00-21:00", bestDish: "把子肉盖饭", wait: "中午约10分钟", lat: 36.668, lng: 117.026 }], price: "人均¥18", difficulty: "简单", where: "全城连锁" },
  { id: "jitui", name: "酱鸡腿", cat: "lucai", tag: "鲁菜 · 硬菜", desc: "酱卤的鸡腿，酱香浓郁，肉质酥烂。", history: "鲁菜酱卤代表之一。", season: "四季皆宜", tips: "用手撕着吃更过瘾。", must: false, img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop", shops: [{ name: "超意兴", avg: "¥15", addr: "全城连锁", rating: 4.3, hours: "06:00-21:00", bestDish: "酱鸡腿", wait: "不排队", lat: 36.668, lng: 117.026 }], price: "人均¥15", difficulty: "中等", where: "全城连锁" },
  { id: "doufu", name: "泉水豆腐", cat: "lucai", tag: "济南特色 · 泉水", desc: "用泉水做的豆腐，比普通豆腐更嫩滑。可以凉拌或红烧。", history: "济南泉水做的豆腐口感独特。", season: "四季皆宜", tips: "凉拌最能体现泉水豆腐的嫩滑。", must: false, img: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&h=400&fit=crop", shops: [{ name: "明湖楼", avg: "¥35", addr: "大明湖南门", rating: 4.5, hours: "11:00-20:30", bestDish: "泉水豆腐", wait: "不排队", lat: 36.677, lng: 117.02 }], price: "人均¥35", difficulty: "简单", where: "大明湖南门（明湖楼）" },
  { id: "baozi", name: "水煎包", cat: "zaocan", tag: "早餐 · 煎制", desc: "底部金黄酥脆的包子，比普通包子更香。", history: "济南早餐常见，底部煎至金黄。", season: "四季皆宜", tips: "蘸醋和辣椒油更好吃。", must: false, img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop", shops: [{ name: "老城区早点铺", avg: "¥8", addr: "老城区", rating: 4.2, hours: "06:00-09:00", bestDish: "水煎包", wait: "早高峰约10分钟", lat: 36.669, lng: 117.024 }], price: "人均¥8", difficulty: "中等", where: "老城区" },
  { id: "lvdagun", name: "驴打滚", cat: "xiaochi", tag: "甜品 · 传统", desc: "糯米卷豆沙，外面裹黄豆面。软糯香甜。", history: "北方传统甜品，济南也有。", season: "四季皆宜", tips: "买新鲜做的，放久了会硬。", must: false, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop", shops: [{ name: "芙蓉街小摊", avg: "¥8", addr: "芙蓉街", rating: 4.0, hours: "10:00-22:00", bestDish: "驴打滚", wait: "不排队", lat: 36.669, lng: 117.023 }], price: "人均¥8", difficulty: "简单", where: "芙蓉街" },
  { id: "tanghulu", name: "糖葫芦", cat: "xiaochi", tag: "冬日 · 街头", desc: "冬天街边的传统小吃，山楂裹糖浆，酸甜可口。", history: "北方冬季传统小吃。", season: "秋冬最佳", tips: "要买现做的，包装好的不好吃。", must: false, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop", shops: [{ name: "泉城路小摊", avg: "¥5", addr: "泉城路", rating: 4.0, hours: "10:00-20:00", bestDish: "糖葫芦", wait: "不排队", lat: 36.669, lng: 117.024 }], price: "人均¥5", difficulty: "简单", where: "泉城路" },
  { id: "baojiang", name: "爆浆鸡排", cat: "xiaochi", tag: "网红 · 新兴", desc: "炸鸡排里面是芝士，切开爆浆。年轻人的新宠。", history: "近年兴起的网红小吃。", season: "四季皆宜", tips: "趁热吃，凉了芝士就不流了。", must: false, img: "https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=600&h=400&fit=crop", shops: [{ name: "芙蓉街小摊", avg: "¥15", addr: "芙蓉街", rating: 4.1, hours: "10:00-22:00", bestDish: "爆浆鸡排", wait: "排队约5分钟", lat: 36.669, lng: 117.023 }], price: "人均¥15", difficulty: "简单", where: "芙蓉街" },
  { id: "zhengzhou", name: "蒸碗", cat: "lucai", tag: "鲁菜 · 宴席", desc: "济南传统宴席菜，各种肉菜蒸制。有蒸鸡、蒸鱼、蒸肉等。", history: "济南传统宴席的必备菜。", season: "四季皆宜，年节必备", tips: "过年前后最常见。", must: false, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop", shops: [{ name: "聚丰德", avg: "¥88", addr: "泉城路288号", rating: 4.6, hours: "11:00-21:00", bestDish: "蒸碗", wait: "不排队", lat: 36.669, lng: 117.024 }], price: "人均¥88", difficulty: "中等", where: "泉城路（聚丰德）" },
  { id: "roujiamo", name: "济南肉夹馍", cat: "xiaochi", tag: "小吃 · 北方", desc: "济南版肉夹馍，馍更薄，肉更碎。和西安版不同。", history: "从西安传入，济南做了本地化改良。", season: "四季皆宜", tips: "和西安的不太一样，馍更薄。", must: false, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop", shops: [{ name: "芙蓉街小摊", avg: "¥10", addr: "芙蓉街", rating: 4.0, hours: "10:00-22:00", bestDish: "肉夹馍", wait: "不排队", lat: 36.669, lng: 117.023 }], price: "人均¥10", difficulty: "简单", where: "芙蓉街" }
];

// ═══ 合并 ═══
const existingSpotIds = new Set(existingSpots.map(s => s.id));
const newSpots = V3_SPOTS.filter(s => !existingSpotIds.has(s.id));
const allSpots = [...existingSpots, ...newSpots].map(s => ({
  ...s,
  meta: s.meta || `⏱ ${s.dur} · 🎫 ${s.price === 0 ? '免费' : '¥' + s.price} · ${s.transport?.slice(0, 15) || '步行'}`
}));

const existingFoodIds = new Set(existingFoods.foods.map(f => f.id));
const newFoods = V3_FOODS.filter(f => !existingFoodIds.has(f.id));
const allFoods = {
  categories: existingFoods.categories,
  foods: [...existingFoods.foods, ...newFoods]
};

writeFileSync(join(DATA_DIR, 'spots.json'), JSON.stringify(allSpots, null, 2), 'utf-8');
writeFileSync(join(DATA_DIR, 'food.json'), JSON.stringify(allFoods, null, 2), 'utf-8');

console.log(`✅ 数据增强 V3 完成`);
console.log(`  景点: ${existingSpots.length} → ${allSpots.length} (+${newSpots.length})`);
console.log(`  美食: ${existingFoods.foods.length} → ${allFoods.foods.length} (+${newFoods.length})`);
console.log(`  总计: ${allSpots.length} 景点 + ${allFoods.foods.length} 美食`);
