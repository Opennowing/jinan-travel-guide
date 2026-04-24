#!/usr/bin/env node
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');
const existingSpots = JSON.parse(readFileSync(join(DATA_DIR, 'spots.json'), 'utf-8'));
const existingFoods = JSON.parse(readFileSync(join(DATA_DIR, 'food.json'), 'utf-8'));

const MORE = {
  spots: [
    { id: "shunyu", name: "舜玉公园", cat: "nature", badge: "free", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop", price: 0, rating: 3.9, reviews: 89, dur: "40min", open: "全天", desc: "千佛山附近的小公园，有舜帝庙。安静清幽。", audience: ["solo"], lat: 36.6396, lng: 117.0416, transport: "步行", tips: "千佛山出来可以顺路逛逛。", bestPhoto: "舜帝庙古建筑", nearby: ["千佛山"] },
    { id: "ligong", name: "济南美术馆", cat: "history", badge: "free", img: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600&h=400&fit=crop", price: 0, rating: 4.2, reviews: 234, dur: "1.5h", open: "09:00-17:00·周一闭馆", desc: "济南市属美术馆，有山东籍画家作品和当代艺术展。", audience: ["solo"], lat: 36.6516, lng: 116.9856, transport: "公交可达", tips: "周一闭馆。免费开放。", bestPhoto: "展厅内部", nearby: ["山东省博物馆"] },
    { id: "shansheng", name: "山东省科技馆", cat: "history", badge: "free", img: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600&h=400&fit=crop", price: 0, rating: 4.3, reviews: 567, dur: "2h", open: "09:00-17:00·周一闭馆", desc: "适合带小朋友，有各种互动科技展品。免费开放。", audience: ["family"], lat: 36.6546, lng: 116.9886, transport: "公交可达", tips: "带小朋友必去。免费但要预约。", bestPhoto: "科技馆外景", nearby: ["山东省博物馆"] },
    { id: "minghu", name: "明湖秀(灯光秀)", cat: "nature", badge: "hot", img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop", price: 0, rating: 4.5, reviews: 1234, dur: "30min", open: "20:00(夏季周末)", desc: "大明湖南岸的水幕灯光秀，免费观看。灯光+音乐+喷泉，非常震撼。", audience: ["couple", "family"], lat: 36.6766, lng: 117.0215, transport: "步行", tips: "夏季周末晚上8点开始。提前占位置。", bestPhoto: "灯光秀全景", nearby: ["大明湖", "超然楼"] },
    { id: "quanshui-bath", name: "五龙潭泉水浴场", cat: "spring", badge: "free", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop", price: 0, rating: 4.1, reviews: 345, dur: "1h", open: "06:00-21:00(夏季)", desc: "五龙潭公园内的天然泉水浴场，泉水恒温18°C。夏天消暑好去处。", audience: ["family"], lat: 36.6621, lng: 116.9901, transport: "步行", tips: "夏天开放。水温18°C，清凉但不刺骨。", bestPhoto: "浴场全景", nearby: ["五龙潭", "趵突泉"] },
    { id: "baoteng-night", name: "趵突泉夜游", cat: "spring", badge: "hot", img: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop", price: 20, rating: 4.6, reviews: 789, dur: "1.5h", open: "18:00-21:00(夏季)", desc: "趵突泉夜间开放，灯光映照下的三股水别有韵味。比白天人少很多。", audience: ["couple"], lat: 36.6636, lng: 116.9975, transport: "地铁2号线", tips: "夏天才有夜场。灯光下的趵突泉很梦幻。", bestPhoto: "夜间趵突泉灯光", nearby: ["趵突泉"] },
    { id: "huchenghe", name: "护城河游船", cat: "nature", badge: "hot", img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop", price: 75, rating: 4.5, reviews: 1567, dur: "1h", open: "09:00-20:00", desc: "全国唯一泉水护城河游船。从黑虎泉出发，途经趵突泉、五龙潭到大明湖。", audience: ["couple", "family"], lat: 36.6601, lng: 117.034, transport: "步行", tips: "夜游船¥75，灯光映水很浪漫。白天¥50。", bestPhoto: "游船夜景", nearby: ["黑虎泉", "趵突泉"] },
    { id: "quanshui-gu", name: "趵突泉万竹园", cat: "spring", badge: "hidden", img: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop", price: 0, rating: 4.3, reviews: 234, dur: "30min", open: "含在趵突泉门票", desc: "趵突泉公园内的园林，有万竿翠竹。比主景区人少很多，非常清幽。", audience: ["solo"], lat: 36.6636, lng: 116.9975, transport: "地铁2号线", tips: "趵突泉门票已含。人少清幽，适合拍照。", bestPhoto: "竹林小径", nearby: ["趵突泉"] },
    { id: "minghu-south", name: "大明湖南岸步道", cat: "nature", badge: "free", img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop", price: 0, rating: 4.4, reviews: 456, dur: "1h", open: "全天", desc: "沿大明湖南岸散步的步道，可以看到超然楼全景。傍晚时分最美。", audience: ["couple", "solo"], lat: 36.6746, lng: 117.0215, transport: "步行", tips: "傍晚来拍超然楼亮灯。", bestPhoto: "步道看超然楼", nearby: ["大明湖", "超然楼"] },
    { id: "jinan-university", name: "山东大学(洪家楼校区)", cat: "history", badge: "free", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop", price: 0, rating: 4.0, reviews: 123, dur: "30min", open: "全天", desc: "百年名校，校园内有老建筑。洪家楼教堂就在旁边。", audience: ["solo"], lat: 36.6786, lng: 117.0586, transport: "公交K55路", tips: "和洪家楼教堂一起逛。校园很美。", bestPhoto: "校园老建筑", nearby: ["洪家楼教堂"] }
  ],
  foods: [
    { id: "huangmen-pai", name: "黄焖排骨", cat: "lucai", tag: "鲁菜 · 硬菜", desc: "和黄焖鸡类似，但用排骨。酱汁浓郁，排骨酥烂。", must: false, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop", shops: [{ name: "老济南黄焖鸡", avg: "¥30", addr: "泉城路附近", rating: 4.2, hours: "10:00-21:00", bestDish: "黄焖排骨", wait: "不排队", lat: 36.669, lng: 117.024 }], price: "人均¥30", difficulty: "中等", where: "全城连锁" },
    { id: "baipi", name: "白斩鸡", cat: "lucai", tag: "鲁菜 · 凉菜", desc: "白水煮鸡，蘸料吃。鸡肉鲜嫩，原汁原味。", must: false, img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop", shops: [{ name: "聚丰德", avg: "¥58", addr: "泉城路288号", rating: 4.6, hours: "11:00-21:00", bestDish: "白斩鸡", wait: "不排队", lat: 36.669, lng: 117.024 }], price: "人均¥58", difficulty: "中等", where: "泉城路（聚丰德）" },
    { id: "roubing", name: "济南肉饼", cat: "xiaochi", tag: "面食 · 传统", desc: "肉馅饼，外皮酥脆，肉馅鲜香。济南传统面食。", must: false, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop", shops: [{ name: "老城区肉饼店", avg: "¥10", addr: "老城区", rating: 4.2, hours: "06:00-20:00", bestDish: "猪肉饼", wait: "早高峰约5分钟", lat: 36.669, lng: 117.024 }], price: "人均¥10", difficulty: "中等", where: "老城区" },
    { id: "zhou", name: "济南粥铺", cat: "zaocan", tag: "早餐 · 养生", desc: "各种杂粮粥，小米粥、八宝粥、皮蛋瘦肉粥。济南人早餐的温润选择。", must: false, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop", shops: [{ name: "泉城粥铺", avg: "¥8", addr: "泉城路", rating: 4.1, hours: "06:00-10:00", bestDish: "小米粥", wait: "不排队", lat: 36.669, lng: 117.024 }], price: "人均¥8", difficulty: "简单", where: "全城早餐店" },
    { id: "huntun", name: "济南馄饨", cat: "zaocan", tag: "早餐 · 汤食", desc: "薄皮大馅的馄饨，配紫菜虾皮汤底。济南人冬天的暖胃早餐。", must: false, img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop", shops: [{ name: "老城区馄饨店", avg: "¥10", addr: "老城区", rating: 4.2, hours: "06:00-10:00", bestDish: "鲜肉馄饨", wait: "早高峰约5分钟", lat: 36.669, lng: 117.024 }], price: "人均¥10", difficulty: "简单", where: "老城区" },
    { id: "chuan", name: "济南串串", cat: "yexiao", tag: "夜宵 · 新兴", desc: "从四川传入的串串香，济南本地化后口味偏咸鲜。", must: false, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop", shops: [{ name: "宽厚里串串店", avg: "¥40", addr: "宽厚里", rating: 4.2, hours: "17:00-02:00", bestDish: "串串香", wait: "周末约15分钟", lat: 36.658, lng: 117.037 }], price: "人均¥40", difficulty: "简单", where: "宽厚里" },
    { id: "malatang", name: "麻辣烫", cat: "yexiao", tag: "夜宵 · 快餐", desc: "自选食材煮熟的麻辣烫。济南的麻辣烫口味偏麻。", must: false, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop", shops: [{ name: "芙蓉街麻辣烫", avg: "¥25", addr: "芙蓉街", rating: 4.0, hours: "10:00-22:00", bestDish: "麻辣烫", wait: "不排队", lat: 36.669, lng: 117.023 }], price: "人均¥25", difficulty: "简单", where: "芙蓉街" },
    { id: "jiu", name: "济南扎啤", cat: "yinpin", tag: "饮品 · 夏日", desc: "济南夏天的灵魂饮品。路边小桌，三五好友，扎啤配烧烤。", must: true, img: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&h=400&fit=crop", shops: [{ name: "回民小区", avg: "¥15/扎", addr: "回民小区", rating: 4.3, hours: "17:00-02:00", bestDish: "扎啤", wait: "不排队", lat: 36.663, lng: 117.018 }], price: "人均¥15", difficulty: "简单", where: "回民小区" },
    { id: "suanmei", name: "酸梅汤", cat: "yinpin", tag: "饮品 · 解暑", desc: "夏天的解暑饮品，酸甜可口。济南各景区都有卖。", must: false, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop", shops: [{ name: "趵突泉小卖部", avg: "¥8", addr: "趵突泉公园", rating: 4.0, hours: "08:00-18:00", bestDish: "酸梅汤", wait: "不排队", lat: 36.6636, lng: 116.9975 }], price: "人均¥8", difficulty: "简单", where: "各景区" },
    { id: "nuomici", name: "糯米糍", cat: "xiaochi", tag: "甜品 · 软糯", desc: "糯米皮包各种馅料，软糯香甜。济南街头常见。", must: false, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop", shops: [{ name: "芙蓉街小摊", avg: "¥5", addr: "芙蓉街", rating: 4.0, hours: "10:00-22:00", bestDish: "糯米糍", wait: "不排队", lat: 36.669, lng: 117.023 }], price: "人均¥5", difficulty: "简单", where: "芙蓉街" }
  ]
};

const existingSpotIds = new Set(existingSpots.map(s => s.id));
const newSpots = MORE.spots.filter(s => !existingSpotIds.has(s.id));
const allSpots = [...existingSpots, ...newSpots].map(s => ({ ...s, meta: s.meta || `⏱ ${s.dur} · 🎫 ${s.price === 0 ? '免费' : '¥' + s.price}` }));

const existingFoodIds = new Set(existingFoods.foods.map(f => f.id));
const newFoods = MORE.foods.filter(f => !existingFoodIds.has(f.id));
const allFoods = { categories: existingFoods.categories, foods: [...existingFoods.foods, ...newFoods] };

writeFileSync(join(DATA_DIR, 'spots.json'), JSON.stringify(allSpots, null, 2), 'utf-8');
writeFileSync(join(DATA_DIR, 'food.json'), JSON.stringify(allFoods, null, 2), 'utf-8');

console.log(`✅ V4 完成: ${allSpots.length} 景点 + ${allFoods.foods.length} 美食 (+${newSpots.length} 景点, +${newFoods.length} 美食)`);
