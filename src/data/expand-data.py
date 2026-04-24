#!/usr/bin/env python3
"""
Expand spots.json and food.json with massive new data.
Run before build-data.py.
"""
import json, os

DATA_DIR = os.path.dirname(os.path.abspath(__file__))

# ══════════════════════════════════════
# LOAD EXISTING
# ══════════════════════════════════════
with open(os.path.join(DATA_DIR, 'spots.json'), 'r') as f:
    spots = json.load(f)
with open(os.path.join(DATA_DIR, 'food.json'), 'r') as f:
    food_data = json.load(f)
    foods = food_data.get('foods', [])
    categories = food_data.get('categories', [])

existing_spot_ids = {s['id'] for s in spots}
existing_food_ids = {f['id'] for f in foods}

# ══════════════════════════════════════
# NEW SPOTS
# ══════════════════════════════════════
NEW_SPOTS = [
  # ── 泉水类 ──
  {
    "id": "baishi-spring",
    "name": "白石泉",
    "cat": "spring",
    "badge": "hidden",
    "img": "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.3, "reviews": 312,
    "dur": "20min",
    "open": "全天开放",
    "book": "无需预约",
    "discount": "免费",
    "bestTime": "清晨看泉水涌动",
    "crowd": "人极少·本地人私藏",
    "desc": "护城河畔的无名泉眼，泉水从白色砂岩中涌出，清澈冰凉。本地人常来此打水泡茶。",
    "meta": "⏱ 20min · 🎫 免费 · 人少清净",
    "trust": "本地人私藏 · 原生态泉眼",
    "combo": None,
    "audience": ["solo"],
    "lat": 36.6595, "lng": 117.0345,
    "transport": "步行可达，黑虎泉东侧护城河边",
    "photos": ["白石泉泉眼", "护城河步道"],
    "tips": "泉眼不大，容易错过。和黑虎泉一起逛，沿护城河往东走5分钟。",
    "bestPhoto": "泉水从白色砂岩中涌出的特写，水质清澈见底",
    "nearby": ["黑虎泉", "解放阁", "护城河游船"]
  },
  {
    "id": "man-spring",
    "name": "满井泉",
    "cat": "spring",
    "badge": "hidden",
    "img": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.2, "reviews": 189,
    "dur": "15min",
    "open": "全天开放",
    "book": "无需预约",
    "discount": "免费",
    "bestTime": "雨后水量最大",
    "crowd": "几乎无人",
    "desc": "泉水水量极大，雨后会溢出井口。位于老城区巷子深处，是最原始的济南泉水。",
    "meta": "⏱ 15min · 🎫 免费 · 隐秘泉眼",
    "trust": "隐秘泉眼 · 原生态",
    "combo": None,
    "audience": ["solo"],
    "lat": 36.6715, "lng": 117.0208,
    "transport": "步行可达，老城区巷子内",
    "photos": ["满井泉井口"],
    "tips": "在老城区深处，导航可能不准，问附近居民。",
    "bestPhoto": "雨后泉水溢出井口的瞬间",
    "nearby": ["王府池子", "芙蓉街", "曲水亭街"]
  },
  {
    "id": "palm-spring",
    "name": "琵琶泉",
    "cat": "spring",
    "badge": "hidden",
    "img": "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.4, "reviews": 267,
    "dur": "20min",
    "open": "全天开放",
    "book": "无需预约",
    "discount": "免费",
    "bestTime": "傍晚护城河灯光亮起时",
    "crowd": "人不多",
    "desc": "护城河畔的名泉，泉水涌出时发出琵琶般的声响。夜间灯光映照下格外迷人。",
    "meta": "⏱ 20min · 🎫 免费 · 泉声如琵琶",
    "trust": "护城河名泉 · 夜景绝佳",
    "combo": None,
    "audience": ["couple", "solo"],
    "lat": 36.6598, "lng": 117.0355,
    "transport": "步行可达，护城河东段",
    "photos": ["琵琶泉", "护城河夜景"],
    "tips": "傍晚去最佳，护城河灯光亮起后泉水更美。",
    "bestPhoto": "灯光下的琵琶泉，水面波光粼粼",
    "nearby": ["黑虎泉", "解放阁", "宽厚里"]
  },
  {
    "id": "yushi-spring",
    "name": "玉漱泉(漱玉泉)",
    "cat": "spring",
    "badge": "hidden",
    "img": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.5, "reviews": 445,
    "dur": "20min",
    "open": "全天开放(趵突泉公园内)",
    "book": "无需额外预约",
    "discount": "免费(趵突泉公园内)",
    "bestTime": "春夏泉水最旺时",
    "crowd": "比趵突泉主泉人少",
    "desc": "趵突泉公园内的名泉，传为李清照梳妆处。泉水清冽，四周绿树环绕，清幽雅致。",
    "meta": "⏱ 20min · 🎫 含在趵突泉门票内 · 清幽",
    "trust": "李清照遗址 · 文化名泉",
    "combo": None,
    "audience": ["solo", "elder"],
    "lat": 36.6640, "lng": 116.9980,
    "transport": "趵突泉公园内步行可达",
    "photos": ["漱玉泉", "李清照纪念堂"],
    "tips": "逛趵突泉时顺路看，不用额外安排时间。",
    "bestPhoto": "泉水清澈见底，配古建筑倒影",
    "nearby": ["趵突泉", "李清照纪念堂", "万竹园"]
  },

  # ── 自然类 ──
  {
    "id": "wufeng-mountain",
    "name": "五峰山",
    "cat": "nature",
    "badge": "hidden",
    "img": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    "price": 40, "priceOld": 0,
    "rating": 4.3, "reviews": 456,
    "dur": "4h",
    "open": "08:00-17:00",
    "book": "现场购票",
    "discount": "学生半价",
    "bestTime": "秋季红叶·春季踏青",
    "crowd": "人少清净",
    "desc": "济南南部山区的道教名山，五峰并列如莲花。清幽静谧，适合徒步和登山。",
    "meta": "⏱ 4h · 🎫 ¥40 · 自驾40min",
    "trust": "道教名山 · 徒步胜地",
    "combo": None,
    "audience": ["solo", "couple"],
    "lat": 36.4585, "lng": 117.0285,
    "transport": "自驾约40分钟",
    "photos": ["五峰全景", "道教宫观"],
    "tips": "离市区较远，建议自驾。山上道观有素斋可以吃。",
    "bestPhoto": "五峰并列全景，云雾缭绕时如仙境",
    "nearby": ["灵岩寺", "莲台山", "长清"]
  },
  {
    "id": "lotus-mountain",
    "name": "莲台山",
    "cat": "nature",
    "badge": "hidden",
    "img": "https://images.unsplash.com/photo-1432405972618-c6b0cfbae538?w=600&h=400&fit=crop",
    "price": 30, "priceOld": 0,
    "rating": 4.2, "reviews": 234,
    "dur": "3h",
    "open": "08:00-17:00",
    "book": "现场购票",
    "discount": "学生半价",
    "bestTime": "春夏山花烂漫",
    "crowd": "人极少",
    "desc": "长清区的小众山峰，山形如莲花盛开。有唐代石窟造像，是小众的登山探古好去处。",
    "meta": "⏱ 3h · 🎫 ¥30 · 自驾50min",
    "trust": "小众秘境 · 唐代石窟",
    "combo": None,
    "audience": ["solo"],
    "lat": 36.4285, "lng": 116.9185,
    "transport": "自驾约50分钟",
    "photos": ["莲台山全景", "石窟造像"],
    "tips": "非常小众，几乎没有游客。适合喜欢安静和历史的人。",
    "bestPhoto": "唐代石窟造像特写",
    "nearby": ["灵岩寺", "五峰山"]
  },
  {
    "id": "baihuazhou-park",
    "name": "百花公园",
    "cat": "nature",
    "badge": "free",
    "img": "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.1, "reviews": 567,
    "dur": "1h",
    "open": "全天开放",
    "book": "无需预约",
    "discount": "免费",
    "bestTime": "春季百花盛开",
    "crowd": "本地人散步公园",
    "desc": "济南东部的城市公园，春季百花盛开时很美。有湖泊、花园、儿童乐园，适合休闲散步。",
    "meta": "⏱ 1h · 🎫 免费 · 公交K50",
    "trust": "本地人休闲 · 赏花好去处",
    "combo": None,
    "audience": ["family", "elder"],
    "lat": 36.6785, "lng": 117.0685,
    "transport": "公交K50路百花公园站",
    "photos": ["百花盛开", "湖心亭"],
    "tips": "春天去最美，各种花卉竞相开放。本地人遛弯的地方，不用专门去。",
    "bestPhoto": "春季花海全景",
    "nearby": ["洪家楼教堂", "山东大学"]
  },

  # ── 历史/文化类 ──
  {
    "id": "shandong-art",
    "name": "山东省美术馆",
    "cat": "culture",
    "badge": "free",
    "img": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.4, "reviews": 876,
    "dur": "2h",
    "open": "09:00-17:00(16:00停止入馆)·周一闭馆",
    "book": "微信公众号免费预约",
    "discount": "免费",
    "bestTime": "工作日人少",
    "crowd": "周末需预约·工作日宽松",
    "desc": "山东省级美术馆，常年有高质量展览。建筑本身也很有设计感，适合拍照。",
    "meta": "⏱ 2h · 🎫 免费(预约) · 公交K51",
    "trust": "省级美术馆 · 免费参观",
    "combo": None,
    "audience": ["solo", "couple"],
    "lat": 36.6490, "lng": 116.9790,
    "transport": "公交K51路省博物馆站步行5分钟",
    "photos": ["美术馆外观", "展厅"],
    "tips": "和省博物馆安排同一天，步行可达。周一闭馆。",
    "bestPhoto": "美术馆建筑外观，现代设计感十足",
    "nearby": ["山东省博物馆", "千佛山"]
  },
  {
    "id": "licheng-museum",
    "name": "济南考古博物馆",
    "cat": "culture",
    "badge": "free",
    "img": "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.3, "reviews": 345,
    "dur": "1.5h",
    "open": "09:00-17:00·周一闭馆",
    "book": "现场免费参观",
    "discount": "免费",
    "bestTime": "工作日清净",
    "crowd": "人很少",
    "desc": "展示济南地下出土文物，从龙山文化到明清。人少清净，适合历史爱好者。",
    "meta": "⏱ 1.5h · 🎫 免费 · 小众博物馆",
    "trust": "小众博物馆 · 历史爱好者",
    "combo": None,
    "audience": ["solo", "elder"],
    "lat": 36.6655, "lng": 117.0255,
    "transport": "公交K51路",
    "photos": ["出土文物", "龙山文化展品"],
    "tips": "人很少，可以安静看展。和省博物馆互补，这里更本地化。",
    "bestPhoto": "龙山文化黑陶展品",
    "nearby": ["山东省博物馆", "千佛山"]
  },
  {
    "id": "xiaoqinghe",
    "name": "小清河湿地公园",
    "cat": "nature",
    "badge": "free",
    "img": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.0, "reviews": 234,
    "dur": "1.5h",
    "open": "全天开放",
    "book": "无需预约",
    "discount": "免费",
    "bestTime": "傍晚日落",
    "crowd": "人不多",
    "desc": "小清河畔的湿地公园，有栈道、观鸟台。傍晚日落时分景色很美，是本地人遛弯的好去处。",
    "meta": "⏱ 1.5h · 🎫 免费 · 公交K5",
    "trust": "本地人遛弯 · 日落胜地",
    "combo": None,
    "audience": ["family", "elder"],
    "lat": 36.6985, "lng": 117.0015,
    "transport": "公交K5路小清河站",
    "photos": ["湿地栈道", "日落"],
    "tips": "傍晚去最佳，日落时分小清河金光闪闪。",
    "bestPhoto": "小清河日落全景",
    "nearby": ["济南动物园"]
  },
  {
    "id": "fuxue-wenmiao",
    "name": "府学文庙",
    "cat": "culture",
    "badge": "hidden",
    "img": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.4, "reviews": 567,
    "dur": "45min",
    "open": "09:00-17:00",
    "book": "无需预约",
    "discount": "免费",
    "bestTime": "上午光线好",
    "crowd": "人少清净",
    "desc": "济南府学文庙，始建于宋代。大成殿气势恢宏，古树参天。比曲阜孔庙人少太多。",
    "meta": "⏱ 45min · 🎫 免费 · 步行可达",
    "trust": "千年文庙 · 人少清净",
    "combo": None,
    "audience": ["solo", "elder"],
    "lat": 36.6700, "lng": 117.0260,
    "transport": "步行可达，大明湖西侧",
    "photos": ["大成殿", "古树"],
    "tips": "比曲阜孔庙小但人少清净，适合安静参观。",
    "bestPhoto": "大成殿正面，古树掩映下的红墙黄瓦",
    "nearby": ["大明湖", "芙蓉街", "曲水亭街"]
  },

  # ── 亲子/游乐类 ──
  {
    "id": "jinan-scitech",
    "name": "济南科技馆",
    "cat": "family",
    "badge": "kid",
    "img": "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=600&h=400&fit=crop",
    "price": 30, "priceOld": 0,
    "rating": 4.3, "reviews": 1234,
    "dur": "3h",
    "open": "09:00-17:00·周一闭馆",
    "book": "微信预约",
    "discount": "学生半价·1.2m以下免费",
    "bestTime": "工作日人少",
    "crowd": "周末爆满",
    "desc": "山东省最大的科技馆，互动体验丰富。有球幕影院、4D影院，适合带孩子寓教于乐。",
    "meta": "⏱ 3h · 🎫 ¥30 · 公交K51",
    "trust": "亲子首选 · 寓教于乐",
    "combo": None,
    "audience": ["family"],
    "lat": 36.6480, "lng": 116.9800,
    "transport": "公交K51路省科技馆站",
    "photos": ["球幕影院", "互动展厅"],
    "tips": "工作日去人少很多。球幕影院值得看。可以和省博物馆安排同一天。",
    "bestPhoto": "球幕影院全景",
    "nearby": ["山东省博物馆", "千佛山"]
  },
  {
    "id": "quancheng-park",
    "name": "泉城公园",
    "cat": "nature",
    "badge": "free",
    "img": "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.2, "reviews": 1567,
    "dur": "1.5h",
    "open": "全天开放",
    "book": "无需预约",
    "discount": "免费",
    "bestTime": "春秋季节",
    "crowd": "本地人常去",
    "desc": "济南最大的城市公园，有湖泊、花园、儿童乐园。春季樱花、秋季银杏都很美。",
    "meta": "⏱ 1.5h · 🎫 免费 · 公交K51",
    "trust": "城市绿肺 · 四季皆美",
    "combo": None,
    "audience": ["family", "elder"],
    "lat": 36.6380, "lng": 117.0100,
    "transport": "公交K51路泉城公园站",
    "photos": ["樱花大道", "湖心亭"],
    "tips": "本地人遛弯的地方，春天樱花很美。可以和千佛山安排同一天。",
    "bestPhoto": "春季樱花大道",
    "nearby": ["千佛山", "山东省博物馆"]
  },
  {
    "id": "minghu-wetland",
    "name": "明湖湿地公园",
    "cat": "nature",
    "badge": "free",
    "img": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.3, "reviews": 678,
    "dur": "1h",
    "open": "全天开放",
    "book": "无需预约",
    "discount": "免费",
    "bestTime": "夏季荷花盛开",
    "crowd": "比大明湖人少",
    "desc": "大明湖北岸的湿地公园，有栈道、观鸟台。夏季荷花盛开，是拍荷花的好地方。",
    "meta": "⏱ 1h · 🎫 免费 · 步行",
    "trust": "小众湿地 · 荷花胜地",
    "combo": None,
    "audience": ["solo", "couple"],
    "lat": 36.6800, "lng": 117.0220,
    "transport": "大明湖北岸步行可达",
    "photos": ["荷花", "湿地栈道"],
    "tips": "夏季去拍荷花，比大明湖主湖区人少很多。",
    "bestPhoto": "夏季荷花特写，露珠晶莹",
    "nearby": ["大明湖", "济南动物园"]
  },
  {
    "id": "huashan",
    "name": "华山风景区",
    "cat": "nature",
    "badge": "free",
    "img": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.1, "reviews": 890,
    "dur": "2h",
    "open": "全天开放",
    "book": "无需预约",
    "discount": "免费",
    "bestTime": "傍晚看日落",
    "crowd": "本地人爬山",
    "desc": "济南东北部的小山，免费开放。登顶可远眺黄河，是本地人周末爬山的好去处。",
    "meta": "⏱ 2h · 🎫 免费 · 公交K12",
    "trust": "本地人爬山 · 免费开放",
    "combo": None,
    "audience": ["family", "solo"],
    "lat": 36.7085, "lng": 117.0585,
    "transport": "公交K12路华山站",
    "photos": ["华山全景", "黄河远眺"],
    "tips": "山不高，1小时可登顶。傍晚看日落很美。",
    "bestPhoto": "山顶远眺黄河",
    "nearby": ["黄河"]
  },
  {
    "id": "quancheng-bookstore",
    "name": "泉城路新华书店",
    "cat": "culture",
    "badge": "free",
    "img": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.2, "reviews": 456,
    "dur": "1h",
    "open": "09:00-21:00",
    "book": "无需预约",
    "discount": "免费阅读",
    "bestTime": "午后安静阅读",
    "crowd": "周末人多",
    "desc": "济南最大的书店，有泉水主题阅读区。可以免费阅读，买杯咖啡坐一下午。",
    "meta": "⏱ 1h · 🎫 免费 · 泉城路",
    "trust": "文化地标 · 免费阅读",
    "combo": None,
    "audience": ["solo", "couple"],
    "lat": 36.6695, "lng": 117.0250,
    "transport": "地铁2号线泉城广场站步行5分钟",
    "photos": ["书店内景", "泉水阅读区"],
    "tips": "逛累了可以进来歇歇脚，免费阅读。泉水主题阅读区很有特色。",
    "bestPhoto": "泉水主题阅读区",
    "nearby": ["泉城广场", "趵突泉", "芙蓉街"]
  },

  # ── 美食街区 ──
  {
    "id": "huimin-xiaoqu",
    "name": "回民小区美食街",
    "cat": "food",
    "badge": "hot",
    "img": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.4, "reviews": 2345,
    "dur": "2h",
    "open": "全天(店铺10:00-02:00)",
    "book": "无需预约",
    "discount": "免费逛街·小吃人均40-80元",
    "bestTime": "傍晚烧烤最热闹",
    "crowd": "夏天晚上爆满",
    "desc": "济南最有烟火气的美食街，烧烤一条街。酱牛肉、羊肉串、烤板筋，回民美食集中地。",
    "meta": "⏱ 2h · 🎫 免费 · 回民美食",
    "trust": "回民美食 · 烟火气十足",
    "combo": None,
    "audience": ["solo", "couple"],
    "lat": 36.6630, "lng": 117.0180,
    "transport": "步行可达，老城区内",
    "photos": ["烧烤一条街", "酱牛肉摊"],
    "tips": "夏天傍晚去最热闹。认准炭火烤的。酱牛肉可以买真空包装带走。",
    "bestPhoto": "烧烤一条街夜景，炭火通明",
    "nearby": ["芙蓉街", "大观园", "老商埠区"]
  },
  {
    "id": "yingxiongshan-market",
    "name": "英雄山文化市场",
    "cat": "culture",
    "badge": "hidden",
    "img": "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.0, "reviews": 567,
    "dur": "2h",
    "open": "周六周日06:00-14:00",
    "book": "无需预约",
    "discount": "免费入场",
    "bestTime": "周末上午",
    "crowd": "周末人多",
    "desc": "济南最大的旧货和文化市场，古玩、字画、旧书、老物件。周末上午最热闹。",
    "meta": "⏱ 2h · 🎫 免费 · 周末限定",
    "trust": "文化市场 · 淘货胜地",
    "combo": None,
    "audience": ["solo", "elder"],
    "lat": 36.6385, "lng": 117.0085,
    "transport": "公交K51路英雄山站",
    "photos": ["古玩摊位", "旧书市场"],
    "tips": "只有周末开。早上去货最多。不懂行的看看就好，别乱买。",
    "bestPhoto": "周末上午的热闹市场全景",
    "nearby": ["千佛山", "泉城公园"]
  },
  {
    "id": "wenzhao-memorial",
    "name": "辛弃疾纪念祠",
    "cat": "culture",
    "badge": "hidden",
    "img": "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.3, "reviews": 234,
    "dur": "30min",
    "open": "08:30-17:00",
    "book": "无需预约",
    "discount": "免费",
    "bestTime": "上午光线好",
    "crowd": "人极少",
    "desc": "纪念南宋词人辛弃疾的祠堂，位于大明湖南岸。小巧精致，适合文学爱好者。",
    "meta": "⏱ 30min · 🎫 免费 · 大明湖南岸",
    "trust": "文学圣地 · 人少清净",
    "combo": None,
    "audience": ["solo", "elder"],
    "lat": 36.6750, "lng": 117.0230,
    "transport": "大明湖南岸步行可达",
    "photos": ["辛弃疾塑像", "祠堂内景"],
    "tips": "很小的祠堂，10分钟就能看完。和大明湖一起逛。",
    "bestPhoto": "辛弃疾塑像配大明湖背景",
    "nearby": ["大明湖", "百花洲", "超然楼"]
  },
  {
    "id": "jiu-ru-shan-viewpoint",
    "name": "九如山观景台",
    "cat": "nature",
    "badge": "hidden",
    "img": "https://images.unsplash.com/photo-1432405972618-c6b0cfbae538?w=600&h=400&fit=crop",
    "price": 0, "priceOld": 0,
    "rating": 4.5, "reviews": 345,
    "dur": "30min",
    "open": "全天开放",
    "book": "无需预约",
    "discount": "免费",
    "bestTime": "日出或日落时分",
    "crowd": "人极少",
    "desc": "九如山景区外的免费观景台，可以远眺整个南部山区。日出日落时分景色壮丽。",
    "meta": "⏱ 30min · 🎫 免费 · 自驾1h",
    "trust": "免费观景 · 日出胜地",
    "combo": None,
    "audience": ["solo", "couple"],
    "lat": 36.4890, "lng": 117.1090,
    "transport": "自驾约1小时",
    "photos": ["日出全景", "南部山区远眺"],
    "tips": "免费的，在九如山景区外面。日出时分去最佳。",
    "bestPhoto": "日出时分的南部山区全景",
    "nearby": ["九如山瀑布群", "红叶谷"]
  },
]

# ══════════════════════════════════════
# NEW FOODS
# ══════════════════════════════════════
NEW_FOODS = [
  {
    "id": "zhoucun-shaobing",
    "name": "周村烧饼",
    "cat": "xiaochi",
    "tag": "山东名吃 · 薄如蝉翼",
    "desc": "薄如纸、酥如雪的芝麻烧饼。一口下去咔嚓脆，芝麻香满口。山东最有名的烧饼。",
    "history": "周村烧饼起源于淄博周村，距今已有百年历史。薄如蝉翼，正面贴满芝麻，背面酥脆。传入济南后成为常见小吃。",
    "season": "四季皆宜",
    "tips": "买的时候轻轻摇晃，能听到沙沙声的才是正宗的。配甜沫吃。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "芙蓉街烧饼摊",
        "avg": "¥5",
        "addr": "芙蓉街中段",
        "rating": 4.3,
        "hours": "09:00-21:00",
        "phone": "无",
        "bestDish": "周村烧饼",
        "wait": "一般不排队",
        "lat": 36.6695,
        "lng": 117.023
      }
    ],
    "price": "人均¥5",
    "difficulty": "简单",
    "where": "芙蓉街、各大超市"
  },
  {
    "id": "dezhou-baji",
    "name": "德州扒鸡",
    "cat": "laozihao",
    "tag": "山东名吃 · 百年老字号",
    "desc": "五香脱骨扒鸡，色泽金黄，肉质酥烂。轻轻一抖骨肉分离，是山东最有名的熟食。",
    "history": "德州扒鸡始于明代，距今300多年历史。选用本地小公鸡，经多道工序卤制。传入济南后成为伴手礼首选。",
    "season": "四季皆宜",
    "tips": "真空包装的可以带走。火车站附近很多卖的，认准老字号。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "济南火车站德州扒鸡店",
        "avg": "¥35",
        "addr": "济南站广场",
        "rating": 4.2,
        "hours": "06:00-22:00",
        "phone": "无",
        "bestDish": "五香扒鸡",
        "wait": "不排队",
        "lat": 36.6680,
        "lng": 117.0020
      }
    ],
    "price": "人均¥35",
    "difficulty": "困难",
    "where": "济南火车站、各大超市"
  },
  {
    "id": "mian-sha-bao",
    "name": "棉纱包(老面包)",
    "cat": "xiaochi",
    "tag": "济南怀旧 · 童年味道",
    "desc": "济南特有的老式面包，松软如棉纱。没有花哨的馅料，就是最朴素的麦香和甜味。",
    "history": "棉纱包是济南上世纪80年代的流行面包，因松软如棉纱而得名。如今在老式糕点铺还能找到，是很多济南人的童年回忆。",
    "season": "四季皆宜",
    "tips": "要找老式糕点铺才有。新式面包店没有这种。买当天的最松软。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "大观园老式糕点铺",
        "avg": "¥3",
        "addr": "大观园附近",
        "rating": 4.1,
        "hours": "07:00-18:00",
        "phone": "无",
        "bestDish": "棉纱包",
        "wait": "不排队",
        "lat": 36.6583,
        "lng": 117.0148
      }
    ],
    "price": "人均¥3",
    "difficulty": "中等",
    "where": "大观园老式糕点铺"
  },
  {
    "id": "jitui-fan",
    "name": "鸡腿饭(超意兴)",
    "cat": "xiaochi",
    "tag": "济南快餐 · 打工人之光",
    "desc": "超意兴的招牌快餐，大鸡腿配米饭浇卤汁。¥12管饱，是济南打工人的午餐首选。",
    "history": "超意兴是济南本土快餐品牌，遍布全城。鸡腿饭是其招牌套餐，以分量大、价格实惠著称。",
    "season": "四季皆宜",
    "tips": "中午11:30前去不用排队。米饭管够，可以加饭。",
    "must": True,
    "img": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "超意兴(遍布全城)",
        "avg": "¥12",
        "addr": "各区域均有",
        "rating": 4.3,
        "hours": "06:00-21:00",
        "phone": "多家分店",
        "bestDish": "鸡腿饭、把子肉",
        "wait": "中午高峰期约10分钟",
        "lat": 36.668,
        "lng": 117.026
      }
    ],
    "price": "人均¥12",
    "difficulty": "简单",
    "where": "全城连锁（超意兴）"
  },
  {
    "id": "suan-cu-ou-pian",
    "name": "酸醋藕片",
    "cat": "xiaochi",
    "tag": "济南凉菜 · 爽口开胃",
    "desc": "脆藕切片，浇酸醋汁凉拌。酸甜爽脆，是济南夏天的开胃小菜。",
    "history": "济南大明湖盛产莲藕，酸醋藕片是济南人夏天最爱的凉菜之一。简单朴素，但考验藕的新鲜度。",
    "season": "夏季最佳",
    "tips": "要选脆藕才好吃，粉藕不适合凉拌。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "明湖楼",
        "avg": "¥18",
        "addr": "大明湖南门",
        "rating": 4.5,
        "hours": "11:00-14:00 / 17:00-20:30",
        "phone": "0531-86088088",
        "bestDish": "酸醋藕片",
        "wait": "不排队",
        "lat": 36.677,
        "lng": 117.02
      }
    ],
    "price": "人均¥18",
    "difficulty": "简单",
    "where": "大明湖畔餐馆"
  },
  {
    "id": "zhurou-shuijianbao",
    "name": "猪肉水煎包",
    "cat": "xiaochi",
    "tag": "济南小吃 · 底脆馅嫩",
    "desc": "比锅贴更大的水煎包，底部金黄酥脆，内馅鲜嫩多汁。配一碗甜沫是济南人的早餐标配。",
    "history": "水煎包在济南早餐摊很常见，比南方的小笼包大，比北方的包子小。煎至底部金黄，加水焖熟，底部焦脆。",
    "season": "四季皆宜",
    "tips": "趁热吃，凉了底部就不脆了。蘸醋和辣椒油。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "泉城路早餐摊",
        "avg": "¥8",
        "addr": "泉城路小巷",
        "rating": 4.2,
        "hours": "06:00-10:00",
        "phone": "无",
        "bestDish": "猪肉水煎包",
        "wait": "早高峰约5分钟",
        "lat": 36.6695,
        "lng": 117.0250
      }
    ],
    "price": "人均¥8",
    "difficulty": "中等",
    "where": "泉城路早餐摊"
  },
  {
    "id": "lian-ou-cha",
    "name": "莲藕茶",
    "cat": "yinpin",
    "tag": "饮品 · 大明湖特产",
    "desc": "大明湖鲜藕榨汁，加蜂蜜调味。清甜爽口，是济南夏天的特色饮品。",
    "history": "大明湖盛产莲藕，济南人用鲜藕榨汁饮用。近年在景区周边流行起来，成为特色饮品。",
    "season": "夏季最佳",
    "tips": "景区门口的价格偏贵。鲜榨的最好喝，别买预包装的。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "大明湖畔饮品店",
        "avg": "¥15",
        "addr": "大明湖南门",
        "rating": 4.2,
        "hours": "09:00-18:00",
        "phone": "无",
        "bestDish": "鲜藕汁",
        "wait": "不排队",
        "lat": 36.677,
        "lng": 117.020
      }
    ],
    "price": "人均¥15",
    "difficulty": "简单",
    "where": "大明湖畔饮品店"
  },
  {
    "id": "huang-he-li-yu-tang",
    "name": "黄河鲤鱼汤",
    "cat": "lucai",
    "tag": "鲁菜 · 汤鲜味美",
    "desc": "黄河鲤鱼慢炖成汤，汤色奶白，鱼肉鲜嫩。比糖醋鲤鱼更清淡，适合不爱甜口的人。",
    "history": "黄河鲤鱼是济南传统食材，炖汤是另一种经典做法。奶白色的鱼汤鲜美无比，是鲁菜汤品的代表。",
    "season": "四季皆宜，秋冬暖身",
    "tips": "要现杀现炖的才鲜。2人点一份足够。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "明湖楼",
        "avg": "¥88",
        "addr": "大明湖南门",
        "rating": 4.5,
        "hours": "11:00-14:00 / 17:00-20:30",
        "phone": "0531-86088088",
        "bestDish": "黄河鲤鱼汤",
        "wait": "不排队",
        "lat": 36.677,
        "lng": 117.02
      },
      {
        "name": "燕喜堂",
        "avg": "¥95",
        "addr": "趵突泉南路19号",
        "rating": 4.5,
        "hours": "11:00-14:00 / 17:00-21:00",
        "phone": "0531-86913888",
        "bestDish": "黄河鲤鱼汤",
        "wait": "工作日不排队",
        "lat": 36.662,
        "lng": 117.001
      }
    ],
    "price": "人均¥88",
    "difficulty": "中等",
    "where": "大明湖南门（明湖楼）"
  },
  {
    "id": "laodu-fen-tang",
    "name": "老醋粉汤",
    "cat": "zaocan",
    "tag": "早餐 · 济南传统",
    "desc": "粉丝汤加老醋调味，酸辣开胃。配油条或烧饼，是济南冬天的暖身早餐。",
    "history": "老醋粉汤是济南传统早餐，用绿豆粉丝、鸡蛋花、香菜，加老醋和胡椒粉调味。酸辣暖胃，冬天喝一碗从头暖到脚。",
    "season": "秋冬最佳",
    "tips": "醋和辣椒可以自己加。配油条泡着吃。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "大观园早点铺",
        "avg": "¥6",
        "addr": "大观园附近",
        "rating": 4.1,
        "hours": "05:30-09:30",
        "phone": "无",
        "bestDish": "老醋粉汤",
        "wait": "不排队",
        "lat": 36.6582,
        "lng": 117.0148
      }
    ],
    "price": "人均¥6",
    "difficulty": "简单",
    "where": "大观园早点铺"
  },
  {
    "id": "chao-bian-rou",
    "name": "炒边肉",
    "cat": "lucai",
    "tag": "鲁菜 · 家常硬菜",
    "desc": "牛肉边角料大火快炒，配青椒洋葱。肉质嫩滑，酱香浓郁，是济南家常菜的代表。",
    "history": "炒边肉是济南人最熟悉的家常菜之一。用牛肉边角料切片，大火快炒。看似简单，但火候和调味很考验功夫。",
    "season": "四季皆宜",
    "tips": "要趁热吃，凉了肉会变硬。配米饭一绝。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "回民小区家常菜馆",
        "avg": "¥45",
        "addr": "回民小区",
        "rating": 4.3,
        "hours": "11:00-14:00 / 17:00-21:00",
        "phone": "无",
        "bestDish": "炒边肉",
        "wait": "不排队",
        "lat": 36.663,
        "lng": 117.018
      }
    ],
    "price": "人均¥45",
    "difficulty": "中等",
    "where": "回民小区家常菜馆"
  },
  {
    "id": "zhangqiu-cong",
    "name": "章丘大葱蘸酱",
    "cat": "xiaochi",
    "tag": "章丘特产 · 甜脆爽口",
    "desc": "章丘大葱蘸甜面酱，清甜爽脆。章丘大葱高可达2米，葱白甜度堪比水果。",
    "history": "章丘大葱是中国最著名的大葱品种，以高、白、脆、甜著称。蘸甜面酱吃是山东最朴素的吃法，也是最能体现大葱本味的吃法。",
    "season": "秋冬最佳(10-2月)",
    "tips": "一定要蘸甜面酱，单吃太辣。葱白部分最甜。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "章丘大葱专卖店(济南)",
        "avg": "¥10",
        "addr": "各大超市",
        "rating": 4.4,
        "hours": "08:00-20:00",
        "phone": "无",
        "bestDish": "章丘大葱",
        "wait": "不排队",
        "lat": 36.6690,
        "lng": 117.0240
      }
    ],
    "price": "人均¥10",
    "difficulty": "简单",
    "where": "各大超市、章丘特产店"
  },
  {
    "id": "ji-dan-guan-bing",
    "name": "鸡蛋灌饼",
    "cat": "zaocan",
    "tag": "早餐 · 街头经典",
    "desc": "面饼煎至鼓起，灌入鸡蛋液，配生菜和酱料。外酥内嫩，是济南最常见的早餐之一。",
    "history": "鸡蛋灌饼源自河南，传入济南后成为早餐摊的标配。做法简单但考验手艺——面饼要煎到鼓起才能灌蛋。",
    "season": "四季皆宜",
    "tips": "要现做的才好吃，提前做好的口感差。加生菜和辣酱。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "泉城路早餐摊",
        "avg": "¥6",
        "addr": "泉城路沿街",
        "rating": 4.2,
        "hours": "06:00-10:00",
        "phone": "无",
        "bestDish": "鸡蛋灌饼",
        "wait": "早高峰约5分钟",
        "lat": 36.6695,
        "lng": 117.0250
      }
    ],
    "price": "人均¥6",
    "difficulty": "简单",
    "where": "全城早餐摊"
  },
  {
    "id": "rou-jia-mo",
    "name": "肉夹馍",
    "cat": "xiaochi",
    "tag": "市井小吃 · 馍香肉烂",
    "desc": "白吉馍夹腊汁肉，馍酥肉烂。虽源自陕西，但济南的肉夹馍有自己的味道。",
    "history": "肉夹馍源自陕西，传入济南后融入本地口味。济南版馍更薄更酥，肉汁更多。",
    "season": "四季皆宜",
    "tips": "要肥瘦相间的才香。配一碗粉丝汤。",
    "must": False,
    "img": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    "shops": [
      {
        "name": "芙蓉街肉夹馍摊",
        "avg": "¥12",
        "addr": "芙蓉街中段",
        "rating": 4.2,
        "hours": "09:00-21:00",
        "phone": "无",
        "bestDish": "腊汁肉夹馍",
        "wait": "周末约10分钟",
        "lat": 36.6695,
        "lng": 117.023
      }
    ],
    "price": "人均¥12",
    "difficulty": "中等",
    "where": "芙蓉街、各大美食街"
  },
]

# ══════════════════════════════════════
# ADD NEW DATA (avoid duplicates)
# ══════════════════════════════════════
added_spots = 0
for s in NEW_SPOTS:
    if s['id'] not in existing_spot_ids:
        spots.append(s)
        existing_spot_ids.add(s['id'])
        added_spots += 1

added_foods = 0
for f in NEW_FOODS:
    if f['id'] not in existing_food_ids:
        foods.append(f)
        existing_food_ids.add(f['id'])
        added_foods += 1

# Also add new categories
new_cats = [
    {"id": "tesu", "name": "地方特产", "icon": "🎁", "desc": "可以带走的济南味道"},
    {"id": "mianlei", "name": "面食", "icon": "🥟", "desc": "北方人离不开的面食"}
]
existing_cat_ids = {c['id'] for c in categories}
for c in new_cats:
    if c['id'] not in existing_cat_ids:
        categories.append(c)

# Write back
with open(os.path.join(DATA_DIR, 'spots.json'), 'w') as f:
    json.dump(spots, f, ensure_ascii=False, indent=2)

with open(os.path.join(DATA_DIR, 'food.json'), 'w') as f:
    json.dump({'categories': categories, 'foods': foods}, f, ensure_ascii=False, indent=2)

print(f"✅ Added {added_spots} new spots (total: {len(spots)})")
print(f"✅ Added {added_foods} new foods (total: {len(foods)})")
print(f"✅ Categories: {len(categories)}")
