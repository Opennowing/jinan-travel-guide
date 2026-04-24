#!/usr/bin/env node
/**
 * 济南旅游攻略 - 数据增强 V2
 * 追加更多景点和美食，达到 40+ 景点、35+ 美食
 */

import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');

// 读取现有数据
const existingSpots = JSON.parse(readFileSync(join(DATA_DIR, 'spots.json'), 'utf-8'));
const existingFoods = JSON.parse(readFileSync(join(DATA_DIR, 'food.json'), 'utf-8'));

// ═══ 追加景点 ═══
const MORE_SPOTS = [
  {
    id: "baiguoyuan", name: "百果园", cat: "nature", badge: "free",
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.1, reviews: 234, dur: "1h",
    open: "全天开放", book: "无需预约", discount: "免费",
    bestTime: "秋季果实成熟", crowd: "人不多",
    desc: "千佛山脚下的果园公园，有各种果树。秋天可以采摘，春天可以赏花。免费开放。",
    trust: "免费公园 · 亲子好去处",
    combo: null, audience: ["family"],
    lat: 36.6356, lng: 117.0456,
    transport: "公交K51路",
    photos: ["果园", "花卉"],
    tips: "秋天苹果和柿子成熟时可以采摘，适合带小朋友。",
    bestPhoto: "果园全景，秋天五彩斑斓",
    nearby: ["千佛山", "山东省博物馆"]
  },
  {
    id: "mingshui", name: "明水古城(章丘)", cat: "history", badge: "hidden",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.3, reviews: 567, dur: "2h",
    open: "全天开放", book: "无需预约", discount: "免费",
    bestTime: "春夏泉水旺", crowd: "人不多",
    desc: "章丘老城区，泉水穿城而过。百脉泉群就在附近，古城风貌保存完好。",
    trust: "章丘古城 · 泉水穿城",
    combo: null, audience: ["couple", "solo"],
    lat: 36.7186, lng: 117.5286,
    transport: "济南东站高铁15分钟到章丘",
    photos: ["古城街巷", "泉水"],
    tips: "可以和百脉泉一起安排。高铁15分钟到章丘，很方便。",
    bestPhoto: "古城街巷，泉水从门前流过",
    nearby: ["百脉泉", "章丘铁锅", "朱家峪"]
  },
  {
    id: "zhujiazhai", name: "朱家峪古村", cat: "history", badge: "hidden",
    img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop",
    price: 30, priceOld: 0, rating: 4.2, reviews: 345, dur: "2h",
    open: "08:00-17:00", book: "现场购票", discount: "学生半价",
    bestTime: "春秋季节", crowd: "人不多",
    desc: "章丘区的明清古村，石头房子、古桥流水。电视剧《闯关东》取景地。",
    trust: "齐鲁第一古村 · 闯关东取景地",
    combo: null, audience: ["solo", "couple"],
    lat: 36.7386, lng: 117.5486,
    transport: "章丘打车30分钟",
    photos: ["石头房子", "古桥"],
    tips: "保存完好的古村，石头房子很有特色。适合慢逛拍照。",
    bestPhoto: "石头房子配古桥，古朴沧桑",
    nearby: ["百脉泉", "明水古城"]
  },
  {
    id: "wufengshan", name: "五峰山", cat: "nature", badge: "hidden",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    price: 40, priceOld: 0, rating: 4.3, reviews: 234, dur: "3h",
    open: "08:00-17:00", book: "现场购票", discount: "学生半价",
    bestTime: "秋季", crowd: "人很少",
    desc: "长清区的道教名山，五座山峰环绕。比千佛山人少很多，适合喜欢清静的人。",
    trust: "道教名山 · 小众清净",
    combo: null, audience: ["solo"],
    lat: 36.4086, lng: 116.8886,
    transport: "自驾约40分钟",
    photos: ["五峰全景", "道观"],
    tips: "离灵岩寺不远，可以一起安排。人很少，适合喜欢清静的人。",
    bestPhoto: "五峰环绕全景，云雾缭绕时最美",
    nearby: ["灵岩寺", "莲台山"]
  },
  {
    id: "liantai", name: "莲台山", cat: "nature", badge: "hidden",
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop",
    price: 30, priceOld: 0, rating: 4.1, reviews: 123, dur: "2h",
    open: "08:00-17:00", book: "现场购票", discount: "学生半价",
    bestTime: "春秋", crowd: "人很少",
    desc: "长清区的小众山景，有天然溶洞。比灵岩寺人少，适合探险爱好者。",
    trust: "小众秘境 · 天然溶洞",
    combo: null, audience: ["solo"],
    lat: 36.3986, lng: 116.9186,
    transport: "自驾约45分钟",
    photos: ["溶洞", "山景"],
    tips: "溶洞内温度低，夏天去很凉爽。人很少，适合探险。",
    bestPhoto: "溶洞内钟乳石，灯光照射下如梦如幻",
    nearby: ["灵岩寺", "五峰山"]
  },
  {
    id: "yingxiongshan", name: "英雄山", cat: "nature", badge: "free",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.2, reviews: 567, dur: "1.5h",
    open: "全天开放", book: "无需预约", discount: "免费",
    bestTime: "清晨/傍晚", crowd: "早晚锻炼人多",
    desc: "济南城区内的山体公园，有济南战役纪念馆。山顶可俯瞰城区，是市民晨练的好去处。",
    trust: "红色教育 · 市民公园",
    combo: null, audience: ["elder", "solo"],
    lat: 36.6486, lng: 117.0086,
    transport: "公交多路可达",
    photos: ["山顶俯瞰", "纪念馆"],
    tips: "早上6-7点去，可以看到很多市民晨练。济南战役纪念馆值得一看。",
    bestPhoto: "山顶俯瞰济南城区，日出时分最佳",
    nearby: ["山东省博物馆", "千佛山"]
  },
  {
    id: "dashming", name: "大明湖新区", cat: "nature", badge: "free",
    img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.4, reviews: 1234, dur: "2h",
    open: "全天开放", book: "无需预约", discount: "免费",
    bestTime: "傍晚", crowd: "比老区人少",
    desc: "大明湖扩建的新区域，有荷花池、湿地公园。比老区人少很多，适合散步。",
    trust: "免费开放 · 比老区清净",
    combo: null, audience: ["family", "elder"],
    lat: 36.6816, lng: 117.0285,
    transport: "步行可达",
    photos: ["荷花池", "湿地"],
    tips: "比老区人少很多，荷花季很美。可以和老区一起逛。",
    bestPhoto: "荷花池全景，夏天荷花盛开时",
    nearby: ["大明湖", "超然楼"]
  },
  {
    id: "jishilu", name: "济南老火车站遗址", cat: "history", badge: "free",
    img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.0, reviews: 456, dur: "20min",
    open: "全天(外观)", book: "无需预约", discount: "免费",
    bestTime: "午后光线好", crowd: "人不多",
    desc: "原济南站老站房，德式建筑。1992年被拆除后重建的仿制品，但仍是济南近代史的见证。",
    trust: "近代建筑 · 历史见证",
    combo: null, audience: ["solo"],
    lat: 36.6651, lng: 116.9901,
    transport: "步行可达",
    photos: ["老站房外观"],
    tips: "现在看到的是重建的仿制品，原建筑1992年被拆。历史爱好者可以来看看。",
    bestPhoto: "站房正面，德式建筑风格",
    nearby: ["老商埠区", "大观园"]
  },
  {
    id: "quanbo", name: "泉城公园", cat: "nature", badge: "free",
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.1, reviews: 789, dur: "1h",
    open: "全天开放", book: "无需预约", discount: "免费",
    bestTime: "春秋季节", crowd: "早晚人多",
    desc: "济南市区内的大型公园，有湖泊、草坪、花卉。市民休闲好去处，免费开放。",
    trust: "市民公园 · 免费",
    combo: null, audience: ["family"],
    lat: 36.6486, lng: 117.0286,
    transport: "公交多路可达",
    photos: ["公园湖泊", "花卉"],
    tips: "适合散步和野餐。春天樱花和秋天银杏很美。",
    bestPhoto: "公园湖泊倒影，秋天银杏金黄",
    nearby: ["千佛山", "山东省博物馆"]
  },
  {
    id: "jiuxian", name: "九仙山", cat: "nature", badge: "hidden",
    img: "https://images.unsplash.com/photo-1432405972618-c6b0cfba9574?w=600&h=400&fit=crop",
    price: 50, priceOld: 0, rating: 4.2, reviews: 178, dur: "4h",
    open: "08:00-17:00", book: "现场购票", discount: "学生半价",
    bestTime: "秋季", crowd: "人很少",
    desc: "济南南部山区的道教名山，有九座山峰。比千佛山人少，适合登山爱好者。",
    trust: "道教名山 · 小众",
    combo: null, audience: ["solo"],
    lat: 36.4586, lng: 117.0686,
    transport: "自驾约50分钟",
    photos: ["九仙山全景"],
    tips: "离市区较远，建议自驾。人很少，适合喜欢清静的登山者。",
    bestPhoto: "山顶云海，秋季最常见",
    nearby: ["红叶谷", "九如山"]
  },
  {
    id: "meiyuan", name: "济南梅园", cat: "nature", badge: "hidden",
    img: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=400&fit=crop",
    price: 20, priceOld: 0, rating: 4.0, reviews: 123, dur: "1h",
    open: "08:00-17:00", book: "现场购票", discount: "学生半价",
    bestTime: "2-3月梅花盛开", crowd: "花期人多",
    desc: "济南赏梅胜地，有各种品种的梅花。每年2-3月梅花盛开，是济南最早的春花。",
    trust: "赏梅胜地 · 早春限定",
    combo: null, audience: ["couple"],
    lat: 36.6286, lng: 117.0386,
    transport: "公交可达",
    photos: ["梅花"],
    tips: "2-3月去最佳，其他季节没什么可看的。梅花品种很多。",
    bestPhoto: "梅花特写，雪后梅花最清雅",
    nearby: ["千佛山"]
  }
];

// ═══ 追加美食 ═══
const MORE_FOODS = [
  {
    id: "dongpo", name: "东坡肉", cat: "lucai", tag: "鲁菜 · 经典",
    desc: "五花肉慢炖至酥烂，入口即化。虽源自苏轼，但济南做法更偏北方口味。",
    history: "东坡肉源自苏轼，传入济南后融入鲁菜做法，口味偏咸鲜。",
    season: "四季皆宜", tips: "配米饭吃最佳，单吃偏腻。",
    must: false,
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    shops: [{ name: "聚丰德", avg: "¥68", addr: "泉城路288号", rating: 4.6, hours: "11:00-21:00", bestDish: "东坡肉", wait: "不排队", lat: 36.669, lng: 117.024 }],
    price: "人均¥68", difficulty: "中等", where: "泉城路（聚丰德）"
  },
  {
    id: "cuipi", name: "脆皮鸡", cat: "lucai", tag: "鲁菜 · 招牌",
    desc: "整鸡炸至外皮金黄酥脆，肉质鲜嫩多汁。鲁菜宴席的压轴菜之一。",
    history: "鲁菜传统宴席菜，讲究皮脆肉嫩。好的脆皮鸡皮要酥到掉渣。",
    season: "四季皆宜", tips: "上桌趁热吃，凉了皮就不脆了。",
    must: false,
    img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop",
    shops: [{ name: "会仙楼", avg: "¥78", addr: "泉城路188号", rating: 4.4, hours: "11:00-20:30", bestDish: "脆皮鸡", wait: "不排队", lat: 36.6695, lng: 117.025 }],
    price: "人均¥78", difficulty: "困难", where: "泉城路（会仙楼）"
  },
  {
    id: "luhuoshao", name: "炉火烧烤", cat: "yexiao", tag: "夜宵 · 炭火灵魂",
    desc: "济南传统炉火烧烤，用果木炭火慢烤。和普通烧烤相比，更有烟火气。",
    history: "济南传统烧烤用果木炭火，现在大部分改成机制炭，但老店还是坚持果木。",
    season: "四季皆宜，夏季最佳", tips: "认准果木炭火的，味道更香。",
    must: false,
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
    shops: [{ name: "老金烧烤", avg: "¥55", addr: "经七路", rating: 4.5, hours: "17:00-01:00", bestDish: "果木烤串", wait: "周末约20分钟", lat: 36.652, lng: 117.02 }],
    price: "人均¥55", difficulty: "中等", where: "经七路（老金烧烤）"
  },
  {
    id: "jitang-mian", name: "鸡汤面", cat: "zaocan", tag: "早餐 · 暖胃",
    desc: "老母鸡汤配手擀面，面条劲道，汤鲜味美。冬天的暖胃早餐。",
    history: "济南冬天的早餐选择，老母鸡汤配手擀面，暖身又暖胃。",
    season: "秋冬最佳", tips: "要趁热吃，面条凉了会坨。",
    must: false,
    img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
    shops: [{ name: "泉城老鸡汤", avg: "¥18", addr: "老城区", rating: 4.3, hours: "06:00-10:00", bestDish: "鸡汤面", wait: "早高峰约10分钟", lat: 36.669, lng: 117.024 }],
    price: "人均¥18", difficulty: "简单", where: "老城区早餐店"
  },
  {
    id: "mala", name: "麻辣小龙虾", cat: "yexiao", tag: "夜宵 · 夏季限定",
    desc: "济南夏天的夜宵新宠，麻辣鲜香。配扎啤是济南年轻人的夏夜标配。",
    history: "近十年兴起的夜宵，从南方传入后迅速风靡济南。",
    season: "夏季最佳（5-9月）", tips: "要活虾现做的才新鲜。配扎啤绝配。",
    must: false,
    img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop",
    shops: [{ name: "回民小区龙虾摊", avg: "¥80", addr: "回民小区", rating: 4.3, hours: "18:00-02:00", bestDish: "麻辣小龙虾", wait: "夏天排队30分钟+", lat: 36.663, lng: 117.018 }],
    price: "人均¥80", difficulty: "中等", where: "回民小区"
  },
  {
    id: "doupi", name: "豆腐皮", cat: "xiaochi", tag: "济南小吃 · 街头",
    desc: "济南街头小吃，豆腐皮卷各种配菜，蘸酱吃。简单但很有味道。",
    history: "济南街头常见的小吃，豆腐皮卷大葱、黄瓜、酱料。",
    season: "四季皆宜", tips: "路边摊的最正宗。",
    must: false,
    img: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&h=400&fit=crop",
    shops: [{ name: "芙蓉街小摊", avg: "¥5", addr: "芙蓉街", rating: 4.0, hours: "10:00-22:00", bestDish: "豆腐皮卷", wait: "不排队", lat: 36.669, lng: 117.023 }],
    price: "人均¥5", difficulty: "简单", where: "芙蓉街"
  },
  {
    id: "hongshao", name: "红烧肘子", cat: "lucai", tag: "鲁菜 · 硬菜",
    desc: "猪肘子红烧至酥烂，皮糯肉嫩。鲁菜宴席的硬菜，分量十足。",
    history: "鲁菜传统硬菜，宴席必备。好的红烧肘子皮要糯到入口即化。",
    season: "四季皆宜", tips: "分量很大，3-4人吃一个。",
    must: false,
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    shops: [{ name: "聚丰德", avg: "¥88", addr: "泉城路288号", rating: 4.6, hours: "11:00-21:00", bestDish: "红烧肘子", wait: "不排队", lat: 36.669, lng: 117.024 }],
    price: "人均¥88", difficulty: "困难", where: "泉城路（聚丰德）"
  },
  {
    id: "qingzheng", name: "清蒸鲈鱼", cat: "lucai", tag: "鲁菜 · 清淡",
    desc: "鲁菜清蒸代表，鱼肉鲜嫩，清淡爽口。适合不吃辣的人。",
    history: "鲁菜讲究原味清蒸，鲈鱼是最常见的清蒸食材。",
    season: "四季皆宜", tips: "要活鱼现蒸的才鲜。",
    must: false,
    img: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&h=400&fit=crop",
    shops: [{ name: "明湖楼", avg: "¥75", addr: "大明湖南门", rating: 4.5, hours: "11:00-20:30", bestDish: "清蒸鲈鱼", wait: "不排队", lat: 36.677, lng: 117.02 }],
    price: "人均¥75", difficulty: "中等", where: "大明湖南门（明湖楼）"
  },
  {
    id: "luwei", name: "济南卤味", cat: "xiaochi", tag: "市井小吃 · 下酒菜",
    desc: "各种卤制的肉类和内脏，酱香浓郁。是济南人下酒和下饭的常备菜。",
    history: "济南卤味历史悠久，各家都有自己的秘方。",
    season: "四季皆宜", tips: "买回去配啤酒或米饭都行。",
    must: false,
    img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop",
    shops: [{ name: "老城区卤味店", avg: "¥25", addr: "老城区", rating: 4.2, hours: "10:00-20:00", bestDish: "卤牛肉、卤鸡爪", wait: "不排队", lat: 36.669, lng: 117.024 }],
    price: "人均¥25", difficulty: "简单", where: "老城区"
  },
  {
    id: "tangyuan", name: "济南汤圆", cat: "xiaochi", tag: "甜品 · 节日",
    desc: "济南汤圆个头大，馅料丰富。黑芝麻、花生、豆沙都有。",
    history: "元宵节必吃，但济南的汤圆平时也有卖。",
    season: "四季皆宜，元宵节最旺", tips: "黑芝麻馅最经典。",
    must: false,
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    shops: [{ name: "老字号甜品店", avg: "¥10", addr: "泉城路", rating: 4.1, hours: "09:00-21:00", bestDish: "黑芝麻汤圆", wait: "不排队", lat: 36.669, lng: 117.024 }],
    price: "人均¥10", difficulty: "简单", where: "泉城路"
  },
  {
    id: "zongzi", name: "济南粽子", cat: "xiaochi", tag: "端午 · 时令",
    desc: "济南粽子偏甜口，红枣粽最常见。也有咸口的肉粽。",
    history: "端午节必吃，济南的粽子以红枣馅为主。",
    season: "端午前后（5-6月）", tips: "红枣粽是济南特色，别处少见。",
    must: false,
    img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop",
    shops: [{ name: "老字号糕点铺", avg: "¥8", addr: "泉城路", rating: 4.2, hours: "09:00-18:00", bestDish: "红枣粽", wait: "端午节排队", lat: 36.669, lng: 117.024 }],
    price: "人均¥8", difficulty: "简单", where: "泉城路老字号"
  },
  {
    id: "mianjin", name: "面筋汤", cat: "zaocan", tag: "早餐 · 济南特色",
    desc: "济南特色早餐汤，面筋配鸡蛋花、香菜，清淡爽口。",
    history: "济南人早餐的选择之一，面筋汤配油条是经典组合。",
    season: "四季皆宜", tips: "配油条吃最搭。",
    must: false,
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    shops: [{ name: "老城区早点铺", avg: "¥5", addr: "老城区", rating: 4.1, hours: "06:00-09:00", bestDish: "面筋汤", wait: "不排队", lat: 36.669, lng: 117.024 }],
    price: "人均¥5", difficulty: "简单", where: "老城区早餐店"
  }
];

// ═══ 合并数据 ═══

// 去重合并景点
const existingIds = new Set(existingSpots.map(s => s.id));
const newSpots = MORE_SPOTS.filter(s => !existingIds.has(s.id));
const allSpots = [...existingSpots, ...newSpots].map(s => ({
  ...s,
  meta: s.meta || `⏱ ${s.dur} · 🎫 ${s.price === 0 ? '免费' : '¥' + s.price} · ${s.transport?.slice(0, 15) || '步行'}`
}));

// 去重合并美食
const existingFoodIds = new Set(existingFoods.foods.map(f => f.id));
const newFoods = MORE_FOODS.filter(f => !existingFoodIds.has(f.id));
const allFoods = {
  categories: existingFoods.categories,
  foods: [...existingFoods.foods, ...newFoods]
};

// 写入
writeFileSync(join(DATA_DIR, 'spots.json'), JSON.stringify(allSpots, null, 2), 'utf-8');
writeFileSync(join(DATA_DIR, 'food.json'), JSON.stringify(allFoods, null, 2), 'utf-8');

console.log(`✅ 数据增强 V2 完成`);
console.log(`  景点: ${existingSpots.length} → ${allSpots.length} (+${newSpots.length})`);
console.log(`  美食: ${existingFoods.foods.length} → ${allFoods.foods.length} (+${newFoods.length})`);

// 验证
let errors = [];
allSpots.forEach(s => {
  if (!s.id || !s.name) errors.push(`景点缺少字段: ${JSON.stringify(s)}`);
  if (s.lat && (s.lat < 36.3 || s.lat > 37.0)) errors.push(`景点 ${s.name}: 纬度异常`);
  if (s.lng && (s.lng < 116.8 || s.lng > 117.6)) errors.push(`景点 ${s.name}: 经度异常`);
});
if (errors.length) {
  console.log('\n⚠️ 验证警告:');
  errors.forEach(e => console.log(`  - ${e}`));
} else {
  console.log('✅ 数据验证通过');
}
