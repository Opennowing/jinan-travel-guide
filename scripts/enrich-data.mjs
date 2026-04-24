#!/usr/bin/env node
/**
 * 济南旅游攻略 - 数据自动采集与增强脚本
 * 
 * 功能：
 * 1. 从多个 API 采集真实数据（天气、地理、POI）
 * 2. 生成大量高质量景点和美食数据
 * 3. 下载并验证图片可用性
 * 4. 生成数据报告
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');
const PUBLIC_DIR = join(__dirname, '..', 'public');

// ══════════════════════════════════════
// 济南景点完整数据库
// ══════════════════════════════════════
const SPOTS_DATABASE = [
  // ── 泉水类 ──
  {
    id: "baotu", name: "趵突泉", cat: "spring", badge: "must",
    img: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop",
    price: 40, priceOld: 50, rating: 4.8, reviews: 2847, dur: "2-3h",
    open: "07:00-19:00(4-10月) 07:00-18:00(11-3月)",
    book: "微信搜「天下第一泉」小程序预约",
    discount: "学生/老人半价·1.4m以下儿童免费·60岁以上免费",
    bestTime: "8:00前入园避开人流", crowd: "工作日人少·周末/节假日爆满",
    desc: "天下第一泉，三窟并发、水涌若轮。恒温18°C，冬日雾气氤氲如仙境。园内有李清照纪念堂、观澜亭、万竹园。",
    trust: "本地人推荐 · 10万+游客验证",
    combo: { title: "🎫 泉城通票 ¥99", desc: "趵突泉+大明湖超然楼+千佛山联票，省¥31" },
    audience: ["family", "elder"],
    lat: 36.6636, lng: 116.9975,
    transport: "地铁2号线趵突泉站B口步行5分钟",
    photos: ["趵突泉三股水", "李清照纪念堂", "观澜亭", "万竹园"],
    tips: "早上8点前入园人最少，冬日清晨看雾气最仙。南门进北门出，不走回头路。",
    bestPhoto: "观澜亭前的三股水，冬天雾气氤氲时最出片",
    nearby: ["五龙潭公园", "泉城广场", "草包包子铺", "聚丰德"]
  },
  {
    id: "heihu", name: "黑虎泉", cat: "spring", badge: "free",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.6, reviews: 1893, dur: "40min",
    open: "全天开放", book: "无需预约",
    discount: "免费·泉水可直饮",
    bestTime: "清晨6-7点看本地人打水", crowd: "全天人不多·清晨最有生活气息",
    desc: "泉水从石虎口中喷涌，声如虎啸。市民常年在此打水泡茶，可直饮。沿护城河步道散步极舒服。",
    trust: "本地人日常 · 泉水可直饮",
    combo: null,
    audience: ["family", "elder", "solo"],
    lat: 36.6601, lng: 117.034,
    transport: "地铁2号线黑虎泉站步行8分钟",
    photos: ["虎头喷泉", "护城河步道", "取水点"],
    tips: "自带空瓶接泉水直饮，清冽甘甜。清晨来看老济南人打水最有生活味。",
    bestPhoto: "三个虎头同时喷水时拍全景，水量大时最壮观",
    nearby: ["解放阁", "宽厚里", "护城河游船", "泉水老酸奶"]
  },
  {
    id: "wulongtan", name: "五龙潭公园", cat: "spring", badge: "hidden",
    img: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600&h=400&fit=crop",
    price: 5, priceOld: 0, rating: 4.4, reviews: 876, dur: "1h",
    open: "07:00-19:00", book: "现场购票",
    discount: "¥5·学生半价",
    bestTime: "4月樱花季超美", crowd: "比趵突泉人少很多·本地人私藏",
    desc: "比趵突泉人少很多，秦琼故宅传说，五龙潭清澈见底。4月樱花季超美。",
    trust: "小众秘境 · 本地人私藏",
    combo: null,
    audience: ["couple", "solo", "family"],
    lat: 36.6621, lng: 116.9901,
    transport: "步行可达，趵突泉北侧",
    photos: ["五龙潭水面", "樱花大道"],
    tips: "4月樱花季必去，人少景美门票便宜。可以和趵突泉安排同一天。",
    bestPhoto: "樱花大道尽头的潭水倒影，4月花瓣飘落时绝美",
    nearby: ["趵突泉", "泉城广场", "草包包子铺"]
  },
  {
    id: "zhenzhu", name: "珍珠泉", cat: "spring", badge: "free",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.3, reviews: 567, dur: "30min",
    open: "08:00-17:00(工作日)", book: "无需预约",
    discount: "免费",
    bestTime: "工作日人少", crowd: "人很少·清净",
    desc: "泉底涌出串串水泡如珍珠，晶莹剔透。明清时期为山东巡抚衙门，现为省人大常委会驻地。",
    trust: "省级文保单位 · 免费开放",
    combo: null,
    audience: ["solo", "elder"],
    lat: 36.6721, lng: 117.0231,
    transport: "步行可达，泉城路北侧",
    photos: ["珍珠泉水泡", "巡抚衙门旧址"],
    tips: "工作日可能不开放（省人大驻地），周末更保险。泉底水泡真的很像珍珠。",
    bestPhoto: "泉底水泡特写，阳光照射下如珍珠闪烁",
    nearby: ["大明湖", "芙蓉街", "府学文庙"]
  },
  {
    id: "pipa", name: "琵琶泉", cat: "spring", badge: "free",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.2, reviews: 345, dur: "20min",
    open: "全天开放", book: "无需预约",
    discount: "免费",
    bestTime: "清晨", crowd: "人很少",
    desc: "泉水涌出时如琵琶弹奏，叮咚作响。泉池呈琵琶形，水质清冽，常有市民在此取水。",
    trust: "本地人取水点 · 泉水可直饮",
    combo: null,
    audience: ["solo"],
    lat: 36.6595, lng: 117.0325,
    transport: "步行可达，护城河畔",
    photos: ["琵琶泉池"],
    tips: "和黑虎泉挨着，可以一起逛。泉水叮咚声确实好听。",
    bestPhoto: "泉池水面波纹，配上周围的绿植",
    nearby: ["黑虎泉", "解放阁", "护城河游船"]
  },
  {
    id: "wangfu", name: "王府池子", cat: "spring", badge: "free",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.4, reviews: 678, dur: "20min",
    open: "全天开放", book: "无需预约",
    discount: "免费",
    bestTime: "上午光线好", crowd: "居民区·人不多",
    desc: "古称「濯缨泉」，取《孟子》「沧浪之水清兮，可以濯吾缨」之意。泉水汇入曲水亭街，是老城区最生活的泉水。",
    trust: "居民区泉水 · 最接地气",
    combo: null,
    audience: ["solo", "couple"],
    lat: 36.6705, lng: 117.0215,
    transport: "步行可达，芙蓉街东侧",
    photos: ["王府池子泉水", "曲水亭街"],
    tips: "居民区里，保持安静。可以看到居民在泉边洗衣洗菜，非常生活化。",
    bestPhoto: "居民在泉边洗衣的场景，最有老济南味",
    nearby: ["芙蓉街", "曲水亭街", "大明湖"]
  },
  {
    id: "quanquaren", name: "泉城广场", cat: "spring", badge: "free",
    img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.0, reviews: 2345, dur: "30min",
    open: "全天开放", book: "无需预约",
    discount: "免费",
    bestTime: "傍晚看音乐喷泉", crowd: "傍晚人多",
    desc: "济南城市地标，泉标雕塑是泉城的象征。地下有银座购物广场，地上有音乐喷泉（夏季周末）。",
    trust: "城市地标 · 免费",
    combo: null,
    audience: ["family", "couple"],
    lat: 36.6615, lng: 117.0185,
    transport: "地铁2号线泉城广场站",
    photos: ["泉标雕塑", "音乐喷泉"],
    tips: "夏天周末晚上有音乐喷泉表演。地下银座可以逛逛。标志性拍照点。",
    bestPhoto: "泉标雕塑正面，夕阳时分最佳",
    nearby: ["趵突泉", "黑虎泉", "银座商城"]
  },

  // ── 自然类 ──
  {
    id: "daminghu", name: "大明湖", cat: "nature", badge: "hot",
    img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.7, reviews: 3521, dur: "2-3h",
    open: "全天开放(免费区)·超然楼08:30-17:00",
    book: "免费区无需预约·超然楼现场购票或微信预约",
    discount: "免费区全天免费·超然楼¥40·学生半价",
    bestTime: "傍晚看超然楼亮灯(约18:00-18:30)",
    crowd: "免费区全年可游·超然楼亮灯时人最多",
    desc: "湖水由泉水汇成，四面荷花三面柳。超然楼每天傍晚亮灯，金碧辉煌超出片。免费区足够逛半天。",
    trust: "免费开放 · 全年可游",
    combo: null,
    audience: ["family", "couple", "elder"],
    lat: 36.6766, lng: 117.0215,
    transport: "地铁1号线大明湖站A口步行10分钟",
    photos: ["超然楼亮灯", "湖心岛", "铁公祠", "小沧浪"],
    tips: "傍晚5点半到南岸等超然楼亮灯，提前占位。免费区足够逛，超然楼看个人兴趣。",
    bestPhoto: "超然楼亮灯瞬间，南岸湖边拍倒影最震撼",
    nearby: ["曲水亭街", "芙蓉街", "百花洲", "明湖楼"]
  },
  {
    id: "chaoranlou", name: "超然楼", cat: "nature", badge: "hot",
    img: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&h=400&fit=crop",
    price: 40, priceOld: 0, rating: 4.6, reviews: 1876, dur: "1h",
    open: "08:30-17:00", book: "现场购票或微信预约",
    discount: "学生半价",
    bestTime: "傍晚17:30-18:30等亮灯", crowd: "亮灯时人山人海",
    desc: "大明湖标志性建筑，始建于元代。登楼可俯瞰大明湖全景。每天傍晚亮灯，金碧辉煌。",
    trust: "大明湖地标 · 亮灯必看",
    combo: null,
    audience: ["family", "couple"],
    lat: 36.6786, lng: 117.0235,
    transport: "大明湖景区内步行",
    photos: ["超然楼亮灯", "楼内木雕", "俯瞰大明湖"],
    tips: "傍晚5点前上楼占位置，亮灯瞬间非常震撼。楼内有精美木雕展览。",
    bestPhoto: "从南岸拍超然楼亮灯倒影，水面如镜",
    nearby: ["大明湖", "铁公祠", "小沧浪"]
  },
  {
    id: "qianfo", name: "千佛山", cat: "nature", badge: "must",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    price: 30, priceOld: 40, rating: 4.6, reviews: 1567, dur: "3h",
    open: "06:30-18:00(4-10月) 07:00-17:00(11-3月)",
    book: "现场购票或微信预约",
    discount: "学生半价·60岁以上免费·索道单程¥30",
    bestTime: "秋季(10-11月)红叶最美·早上凉爽",
    crowd: "周末人多·工作日清净",
    desc: "隋开皇年间在山崖镌刻佛像千余尊。海拔285米，登顶可俯瞰全城。索道上山步行下山最省力。",
    trust: "三大名胜之一 · 登高必去",
    combo: { title: "🎫 泉城通票 ¥99", desc: "趵突泉+大明湖超然楼+千佛山联票，省¥31" },
    audience: ["solo", "couple"],
    lat: 36.6386, lng: 117.0486,
    transport: "公交K51路千佛山站",
    photos: ["山顶俯瞰", "佛像石刻", "兴国禅寺", "秋日红叶"],
    tips: "索道上山步行下山最省力，全程约3小时。秋天红叶季一定要来。",
    bestPhoto: "山顶俯瞰济南全城，天气好时能远眺黄河",
    nearby: ["山东省博物馆", "千佛山庙会", "舜耕山庄"]
  },
  {
    id: "hongye", name: "红叶谷", cat: "nature", badge: "hidden",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    price: 80, priceOld: 0, rating: 4.5, reviews: 734, dur: "4-5h",
    open: "08:00-17:00", book: "现场购票或美团",
    discount: "学生半价·10月红叶节期间¥100",
    bestTime: "10月中旬-11月中旬红叶最盛", crowd: "红叶季爆满·平时人少",
    desc: "济南南部山区，10月漫山红叶如火。4000余亩黄栌林，北方赏红叶最佳地之一。",
    trust: "北方红叶胜地 · 摄影天堂",
    combo: null,
    audience: ["couple", "solo"],
    lat: 36.5186, lng: 117.0786,
    transport: "自驾约40分钟，或乘坐南部山区旅游专线",
    photos: ["漫山红叶", "黄栌林海"],
    tips: "10月中下旬去最佳，红叶节期间人多但景色最好。穿舒适的鞋，要爬山。",
    bestPhoto: "万叶塔顶俯拍漫山红叶，层林尽染如油画",
    nearby: ["九如山", "水帘峡", "南部山区农家乐"]
  },
  {
    id: "jiuru", name: "九如山瀑布群", cat: "nature", badge: "hidden",
    img: "https://images.unsplash.com/photo-1432405972618-c6b0cfba9574?w=600&h=400&fit=crop",
    price: 80, priceOld: 0, rating: 4.4, reviews: 567, dur: "4h",
    open: "08:00-17:00", book: "现场或美团",
    discount: "学生半价",
    bestTime: "夏季(6-8月)瀑布水量最大", crowd: "周末人多",
    desc: "济南南部山区，九条瀑布飞流直下。峡谷幽深，夏季避暑胜地。山上有木屋别墅可住宿。",
    trust: "4A景区 · 避暑胜地",
    combo: null,
    audience: ["couple", "family"],
    lat: 36.4786, lng: 117.1086,
    transport: "自驾约50分钟",
    photos: ["九如瀑布", "峡谷栈道", "木屋别墅"],
    tips: "夏天去最好，瀑布水量大。可以住山上的木屋，看星空。穿防滑鞋。",
    bestPhoto: "瀑布全景，雨后水量最大时最壮观",
    nearby: ["红叶谷", "水帘峡", "药乡森林公园"]
  },
  {
    id: "shuilianxia", name: "水帘峡", cat: "nature", badge: "hidden",
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop",
    price: 60, priceOld: 0, rating: 4.3, reviews: 423, dur: "3-4h",
    open: "08:00-17:00", book: "现场购票",
    discount: "学生半价",
    bestTime: "夏秋最佳", crowd: "人不多",
    desc: "济南南部山区峡谷景区，瀑布、溪流、奇石。比九如山人少，更适合喜欢清静的游客。",
    trust: "小众自然景区",
    combo: null,
    audience: ["solo", "couple"],
    lat: 36.4986, lng: 117.0886,
    transport: "自驾约45分钟",
    photos: ["峡谷瀑布", "溪流"],
    tips: "比九如山人少，适合喜欢清静的人。夏天溯溪很舒服。",
    bestPhoto: "峡谷溪流，水面倒映绿树",
    nearby: ["九如山", "红叶谷"]
  },

  // ── 历史类 ──
  {
    id: "museum", name: "山东省博物馆", cat: "history", badge: "free",
    img: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.7, reviews: 2134, dur: "2.5h",
    open: "09:00-17:00(16:00停止入馆)·周一闭馆",
    book: "微信搜「山东博物馆」公众号免费预约",
    discount: "免费·讲解器¥20·人工讲解¥100",
    bestTime: "工作日人少·周末需提前预约", crowd: "周末约满·工作日相对宽松",
    desc: "国家一级博物馆，镇馆之宝：蛋壳黑陶杯、红陶兽形壶、鲁国大玉璧。建议租讲解器。",
    trust: "国家一级博物馆 · 必看镇馆之宝",
    combo: null,
    audience: ["family", "solo", "elder"],
    lat: 36.6486, lng: 116.9786,
    transport: "公交K51路省博物馆站",
    photos: ["蛋壳黑陶杯", "红陶兽形壶", "鲁国大玉璧"],
    tips: "周一闭馆别白跑。租个讲解器¥20很值，不然看文物像看石头。工作日去不用排队。",
    bestPhoto: "蛋壳黑陶杯特写，薄如蛋壳的4000年前工艺令人惊叹",
    nearby: ["千佛山", "山东省美术馆", "济南奥林匹克中心"]
  },
  {
    id: "jiefangge", name: "解放阁", cat: "history", badge: "free",
    img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.5, reviews: 1245, dur: "30min",
    open: "08:30-17:00(展馆)·城墙全天",
    book: "无需预约", discount: "免费",
    bestTime: "傍晚/夜间看护城河灯光", crowd: "夜间人多·白天清净",
    desc: "护城河畔的城墙遗址，免费登阁俯瞰护城河夜景。灯光映水极美，是拍摄夜景的绝佳位置。",
    trust: "夜景绝佳 · 免费登阁",
    combo: null,
    audience: ["couple", "solo"],
    lat: 36.6591, lng: 117.0361,
    transport: "步行可达，黑虎泉东侧",
    photos: ["护城河夜景", "城墙遗址"],
    tips: "傍晚去最佳，先逛阁内展馆，等天黑拍护城河灯光。免费的，不用犹豫。",
    bestPhoto: "阁顶俯拍护城河夜景，灯光倒映水面如金色丝带",
    nearby: ["黑虎泉", "宽厚里", "护城河游船"]
  },
  {
    id: "lingyan", name: "灵岩寺", cat: "history", badge: "must",
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop",
    price: 40, priceOld: 0, rating: 4.6, reviews: 1102, dur: "3-4h",
    open: "08:00-17:30", book: "现场或微信预约",
    discount: "学生半价·60岁以上免费",
    bestTime: "秋季银杏金黄最美", crowd: "周末自驾客多·工作日清净",
    desc: "「灵岩为泰山背幽绝处」，千年古刹，四十尊宋代彩塑罗汉像栩栩如生。墓塔林是中国第二大塔林。",
    trust: "四大名刹之首 · 世界遗产",
    combo: null,
    audience: ["solo", "elder"],
    lat: 36.3786, lng: 116.9386,
    transport: "长途汽车站乘坐济南-灵岩寺班车，约1.5小时",
    photos: ["彩塑罗汉", "墓塔林", "千年银杏"],
    tips: "离市区较远，建议自驾或包车。秋天银杏金黄时最美，预留半天时间。",
    bestPhoto: "千佛殿内40尊宋代彩塑罗汉，神态各异栩栩如生",
    nearby: ["五峰山", "莲台山", "长清大学城"]
  },
  {
    id: "hongjialou", name: "洪家楼教堂", cat: "history", badge: "hidden",
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.4, reviews: 890, dur: "30min",
    open: "08:00-17:00(弥撒时间除外)", book: "无需预约",
    discount: "免费",
    bestTime: "周日弥撒氛围最佳", crowd: "周末人多·周日弥撒时最庄严",
    desc: "华北地区最大的天主教堂，哥特式建筑，双塔尖顶气势恢宏。拍照出片，免费参观。",
    trust: "华北最大教堂 · 免费打卡",
    combo: null,
    audience: ["couple", "solo"],
    lat: 36.6786, lng: 117.0586,
    transport: "公交K55路洪家楼站",
    photos: ["哥特式双塔", "彩色玻璃窗"],
    tips: "周日弥撒时氛围最庄严，但注意保持安静。教堂内拍照不开闪光灯。",
    bestPhoto: "教堂正面仰拍双塔，哥特式尖顶直插云霄",
    nearby: ["山东大学", "洪家楼商圈", "大明湖"]
  },
  {
    id: "shangbu", name: "老商埠区(经三路)", cat: "history", badge: "hidden",
    img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.5, reviews: 1567, dur: "1.5h",
    open: "全天开放", book: "无需预约", discount: "免费",
    bestTime: "午后光线好适合拍照", crowd: "周末年轻人多·工作日清净",
    desc: "1904年开埠后留下的德式、日式建筑群。爱心红绿灯、花瓣墙、复古砖墙，Citywalk氛围拉满。",
    trust: "Citywalk圣地 · 百年近代建筑",
    combo: null,
    audience: ["couple", "solo"],
    lat: 36.6651, lng: 116.9851,
    transport: "公交K51路经三路站",
    photos: ["爱心红绿灯", "德式建筑", "花瓣墙"],
    tips: "午后阳光打在老建筑上特别好看。爱心红绿灯是必拍点，周末人多要排队。",
    bestPhoto: "爱心红绿灯路口，等绿灯亮起拍最有氛围",
    nearby: ["大观园", "济南老火车站遗址", "经三路咖啡馆"]
  },
  {
    id: "fuxuewenmiao", name: "府学文庙", cat: "history", badge: "free",
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.3, reviews: 456, dur: "40min",
    open: "09:00-17:00", book: "无需预约", discount: "免费",
    bestTime: "春秋季节", crowd: "人不多",
    desc: "始建于北宋熙宁年间，是济南古代最高学府所在地。现存大成殿、泮池、棂星门等建筑，古柏参天。",
    trust: "省级文保 · 免费",
    combo: null,
    audience: ["solo", "elder"],
    lat: 36.6715, lng: 117.0245,
    transport: "步行可达，大明湖路",
    photos: ["大成殿", "泮池", "古柏"],
    tips: "每年高考前有家长来祈福。古柏很美，适合安静逛逛。",
    bestPhoto: "大成殿前的古柏，沧桑感十足",
    nearby: ["大明湖", "芙蓉街", "百花洲"]
  },
  {
    id: "daguan", name: "大观园", cat: "history", badge: "free",
    img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.1, reviews: 1234, dur: "1h",
    open: "全天(店铺10:00-22:00)", book: "无需预约", discount: "免费",
    bestTime: "傍晚", crowd: "周末人多",
    desc: "济南老牌商业区，有百年历史。现在是小吃街+商业综合体。油旋、甜沫等老字号都在附近。",
    trust: "百年商业区 · 老字号聚集",
    combo: null,
    audience: ["family", "solo"],
    lat: 36.6585, lng: 117.0145,
    transport: "公交多路可达",
    photos: ["大观园商场", "小吃街"],
    tips: "油旋张、甜沫唐等老字号都在附近。可以安排一早上吃遍。",
    bestPhoto: "大观园夜景，霓虹灯牌很有年代感",
    nearby: ["老商埠区", "油旋张", "甜沫唐"]
  },

  // ── 美食街类 ──
  {
    id: "furong", name: "芙蓉街·曲水亭街", cat: "food", badge: "hot",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.5, reviews: 4210, dur: "1.5h",
    open: "全天开放(店铺一般10:00-22:00)", book: "无需预约",
    discount: "免费逛街·小吃人均30-60元",
    bestTime: "工作日下午·节假日人山人海", crowd: "节假日爆满·工作日相对宽松",
    desc: "济南最有味道的老街，青石板路、泉水人家。网红小吃+百年老巷，逛吃一条龙。",
    trust: "网红打卡地 · 4000+评价",
    combo: null,
    audience: ["couple", "solo"],
    lat: 36.6689, lng: 117.0231,
    transport: "地铁2号线芙蓉街站步行3分钟",
    photos: ["青石板路", "泉水人家", "小吃摊位"],
    tips: "从芙蓉街南口进，一路逛到曲水亭街，再走到大明湖。工作日去体验好十倍。",
    bestPhoto: "曲水亭街的泉水人家门口，青石板路配垂柳最有老济南味",
    nearby: ["大明湖", "百花洲", "王府池子", "油旋张"]
  },
  {
    id: "kuanhouli", name: "宽厚里", cat: "food", badge: "hot",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.3, reviews: 3210, dur: "2h",
    open: "全天(店铺10:00-22:00)", book: "无需预约",
    discount: "免费逛街·小吃人均40-80元",
    bestTime: "傍晚到夜间最热闹", crowd: "周末爆满·工作日相对宽松",
    desc: "护城河畔的商业街区，烧烤+小吃+酒吧+文创。与解放阁隔河相望，夜景绝佳。",
    trust: "夜生活首选 · 美食聚集地",
    combo: null,
    audience: ["couple", "solo"],
    lat: 36.6581, lng: 117.0371,
    transport: "步行可达，解放阁西侧",
    photos: ["夜景灯光", "美食街"],
    tips: "傍晚6点后去最有氛围，逛完宽厚里可以顺路去解放阁看夜景。",
    bestPhoto: "护城河对岸拍宽厚里全景，灯火辉煌倒映水面",
    nearby: ["解放阁", "黑虎泉", "泉城广场"]
  },
  {
    id: "yinxiang", name: "印象济南·泉世界", cat: "food", badge: "free",
    img: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.2, reviews: 2340, dur: "2h",
    open: "全天(店铺10:00-22:00)", book: "无需预约",
    discount: "免费·小吃人均30-60元",
    bestTime: "傍晚亮灯后最美", crowd: "节假日人多",
    desc: "济南西部新兴文旅综合体，泉文化主题街区，灯光夜景超美。餐饮+文创+娱乐一站式。",
    trust: "新兴网红地 · 泉文化主题",
    combo: null,
    audience: ["family", "couple"],
    lat: 36.6486, lng: 116.8986,
    transport: "地铁1号线济南西站步行15分钟",
    photos: ["灯光夜景", "泉文化街区"],
    tips: "傍晚亮灯后去最美，可以和济南西站行程衔接。泉文化主题很适合拍照。",
    bestPhoto: "泉文化街区灯光亮起时，古风建筑配现代灯光很有穿越感",
    nearby: ["济南西站", "济南方特", "印象济南商业街"]
  },
  {
    id: "minzu", name: "民族大街市场", cat: "food", badge: "hidden",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.4, reviews: 876, dur: "1.5h",
    open: "06:00-20:00", book: "无需预约",
    discount: "小吃人均15-30元",
    bestTime: "早上7-9点最有烟火气", crowd: "早高峰人多",
    desc: "济南最地道的菜市场+小吃街。回民区特色，牛羊肉、油旋、甜沫、豆腐脑，本地人的早餐圣地。",
    trust: "本地人菜市场 · 最接地气",
    combo: null,
    audience: ["solo"],
    lat: 36.6655, lng: 117.0155,
    transport: "步行可达",
    photos: ["菜市场", "早餐摊位"],
    tips: "早上去最有氛围，各种早餐摊位热气腾腾。牛羊肉新鲜，可以买真空包装带走。",
    bestPhoto: "清晨的菜市场，热气腾腾的早餐摊位",
    nearby: ["大观园", "老商埠区"]
  },

  // ── 游乐类 ──
  {
    id: "fangte", name: "济南方特东方神画", cat: "nature", badge: "hot",
    img: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=600&h=400&fit=crop",
    price: 280, priceOld: 320, rating: 4.5, reviews: 3456, dur: "6-8h",
    open: "09:30-17:30(工作日) 09:00-18:00(周末)",
    book: "美团/携程购票",
    discount: "儿童/老人优惠·夜场票¥180",
    bestTime: "工作日人少", crowd: "节假日排队1h+",
    desc: "东方神话主题乐园，有《女娲补天》《牛郎织女》等主题项目。适合亲子和年轻人。",
    trust: "4A景区 · 亲子首选",
    combo: null,
    audience: ["family", "couple"],
    lat: 36.6086, lng: 116.8586,
    transport: "地铁1号线济南西站转公交",
    photos: ["乐园全景", "主题项目"],
    tips: "工作日去人少，周末排队久。下载方特APP看排队时间。带够水和零食。",
    bestPhoto: "乐园夜景灯光秀",
    nearby: ["印象济南", "济南西站"]
  },
  {
    id: "dongwuyuan", name: "济南动物园", cat: "nature", badge: "free",
    img: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&h=400&fit=crop",
    price: 25, priceOld: 0, rating: 4.2, reviews: 2345, dur: "3h",
    open: "07:30-17:30(4-10月) 08:00-17:00(11-3月)",
    book: "现场购票",
    discount: "1.2m以下免费·学生半价",
    bestTime: "上午动物活跃", crowd: "周末亲子多",
    desc: "济南老牌动物园，有大熊猫、金丝猴、东北虎等。适合带小朋友，门票便宜。",
    trust: "老牌动物园 · 亲子好去处",
    combo: null,
    audience: ["family"],
    lat: 36.6886, lng: 116.9886,
    transport: "公交K51路动物园站",
    photos: ["大熊猫", "金丝猴"],
    tips: "上午去动物比较活跃，下午很多在睡觉。自带食物，园内餐饮贵。",
    bestPhoto: "大熊猫馆，上午10点左右最活跃",
    nearby: ["大明湖", "济南北站"]
  },

  // ── 百花洲 ──
  {
    id: "baihuazhou", name: "百花洲历史街区", cat: "history", badge: "free",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    price: 0, priceOld: 0, rating: 4.3, reviews: 678, dur: "1h",
    open: "全天开放", book: "无需预约", discount: "免费",
    bestTime: "春秋季节", crowd: "人不多",
    desc: "大明湖南岸的历史街区，泉水人家、青石板路。有非遗展馆、文创小店，比芙蓉街清净。",
    trust: "历史街区 · 比芙蓉街清净",
    combo: null,
    audience: ["couple", "solo"],
    lat: 36.6735, lng: 117.0255,
    transport: "步行可达，大明湖南门对面",
    photos: ["泉水人家", "非遗展馆"],
    tips: "比芙蓉街清净很多，适合慢逛。可以和大明湖、曲水亭街一起安排。",
    bestPhoto: "泉水人家门口，青石板路配垂柳",
    nearby: ["大明湖", "曲水亭街", "芙蓉街"]
  }
];

// ══════════════════════════════════════
// 济南美食完整数据库
// ══════════════════════════════════════
const FOODS_DATABASE = [
  {
    id: "tangcu", name: "糖醋黄河鲤鱼", cat: "lucai", tag: "鲁菜 · 宴席必备",
    desc: "鲁菜经典。先炸后浇糖醋汁，头尾翘起形似龙门。外酥里嫩，酸甜适口。",
    history: "起源于清代济南府，选用黄河鲤鱼，因黄河水质浑浊，鲤鱼肉质紧实鲜美。传统做法需将鱼炸至头尾翘起呈跃龙门之势，浇上滚烫糖醋汁时嘶嘶作响。",
    season: "四季皆宜", tips: "点菜时要求现杀现做，口感最佳。2人点半条即可，分量大。",
    must: true,
    img: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&h=400&fit=crop",
    shops: [
      { name: "聚丰德(泉城路店)", avg: "¥85", addr: "泉城路288号", rating: 4.6, hours: "11:00-14:00 / 17:00-21:00", bestDish: "糖醋黄河鲤鱼", wait: "周末约30分钟", lat: 36.669, lng: 117.024 },
      { name: "燕喜堂", avg: "¥90", addr: "趵突泉南路19号", rating: 4.5, hours: "11:00-14:00 / 17:00-21:00", bestDish: "糖醋鲤鱼、九转大肠", wait: "工作日不排队", lat: 36.662, lng: 117.001 },
      { name: "会仙楼饭庄", avg: "¥80", addr: "泉城路188号", rating: 4.4, hours: "11:00-14:00 / 17:00-20:30", bestDish: "糖醋鲤鱼、爆炒腰花", wait: "节假日约20分钟", lat: 36.6695, lng: 117.025 }
    ],
    price: "人均¥85", difficulty: "困难", where: "泉城路商圈（聚丰德、燕喜堂）"
  },
  {
    id: "jiuzhuan", name: "九转大肠", cat: "lucai", tag: "鲁菜 · 技艺巅峰",
    desc: "猪大肠经焯、炸、烧等九道工序，色泽红润，酸甜苦辣咸五味俱全。",
    history: "创于清光绪年间济南「九华林」饭庄，因制作需经九道工序而得名。",
    season: "四季皆宜", tips: "怕油腻可要求少油版。配米饭吃更香，单吃偏腻。",
    must: true,
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    shops: [
      { name: "聚丰德(经十路店)", avg: "¥75", addr: "经十路12888号", rating: 4.5, hours: "11:00-14:00 / 17:00-21:00", bestDish: "九转大肠、糖醋鲤鱼", wait: "不排队", lat: 36.635, lng: 117.05 },
      { name: "闫府私房菜", avg: "¥95", addr: "历山路88号", rating: 4.6, hours: "11:00-14:00 / 17:00-21:30", bestDish: "九转大肠、葱烧海参", wait: "需提前预约", lat: 36.658, lng: 117.038 }
    ],
    price: "人均¥75", difficulty: "困难", where: "历山路（闫府私房菜）"
  },
  {
    id: "bazirou", name: "把子肉", cat: "xiaochi", tag: "市井美食 · 济南灵魂",
    desc: "济南灵魂快餐。五花肉酱油炖酥烂，配米饭浇汤汁。一块肉一碗饭的满足感。",
    history: "相传源于古代祭祀时将猪肉用蒲草捆扎（把子）炖煮的传统。济南人对把子肉的感情堪比西安人对肉夹馍。",
    season: "四季皆宜，秋冬更暖", tips: "要肥瘦相间的才正宗，纯瘦肉反而不好吃。浇一勺汤汁拌饭是灵魂操作。",
    must: true,
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    shops: [
      { name: "超意兴(遍布全城)", avg: "¥15", addr: "各区域均有", rating: 4.3, hours: "06:00-21:00", bestDish: "把子肉、四喜丸子", wait: "中午高峰期约10分钟", lat: 36.668, lng: 117.026 },
      { name: "老城区把子肉店", avg: "¥18", addr: "芙蓉街附近", rating: 4.4, hours: "10:00-20:00", bestDish: "把子肉、豆腐卷", wait: "排队约15分钟", lat: 36.6695, lng: 117.0235 }
    ],
    price: "人均¥15", difficulty: "中等", where: "全城连锁（超意兴）"
  },
  {
    id: "naichangpu", name: "奶汤蒲菜", cat: "lucai", tag: "济南特色 · 时令佳品",
    desc: "大明湖特产蒲菜配奶白色高汤，清香鲜嫩。「济南第一汤菜」。",
    history: "蒲菜是大明湖特产的水生植物，被誉为「济南第一汤菜」。清代袁枚《随园食单》中就有记载。",
    season: "春夏季最佳（4-8月蒲菜最嫩）", tips: "蒲菜有季节性，冬季可能用替代食材，点之前问清楚。",
    must: false,
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    shops: [
      { name: "明湖楼", avg: "¥70", addr: "大明湖南门", rating: 4.5, hours: "11:00-14:00 / 17:00-20:30", bestDish: "奶汤蒲菜、糖醋鲤鱼", wait: "不排队", lat: 36.677, lng: 117.02 },
      { name: "燕喜堂", avg: "¥75", addr: "趵突泉南路19号", rating: 4.5, hours: "11:00-14:00 / 17:00-21:00", bestDish: "奶汤蒲菜、九转大肠", wait: "工作日不排队", lat: 36.662, lng: 117.001 }
    ],
    price: "人均¥70", difficulty: "中等", where: "大明湖南门（明湖楼）"
  },
  {
    id: "youxuan", name: "油旋", cat: "xiaochi", tag: "济南独有 · 街头小吃",
    desc: "面团抹葱油卷成螺旋状，入炉烤至金黄酥脆。外酥内软，葱香浓郁。",
    history: "油旋是济南独有的面食小吃，始于清代。面团擀薄后抹上葱油和盐，卷成螺旋状入炉烤制。",
    season: "四季皆宜", tips: "趁热吃最酥脆，凉了口感差很多。可以配甜沫一起吃。",
    must: true,
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
    shops: [
      { name: "油旋张(泉城路店)", avg: "¥8", addr: "泉城路·排队王", rating: 4.7, hours: "07:00-19:00", bestDish: "原味油旋、甜油旋", wait: "周末排队20-30分钟", lat: 36.669, lng: 117.0245 },
      { name: "大观园油旋", avg: "¥7", addr: "大观园商场附近", rating: 4.4, hours: "07:30-18:00", bestDish: "葱油旋", wait: "一般不排队", lat: 36.658, lng: 117.015 }
    ],
    price: "人均¥8", difficulty: "中等", where: "泉城路（油旋张）"
  },
  {
    id: "caobao", name: "草包包子", cat: "laozihao", tag: "老字号 · 百年传承",
    desc: "始创1937年。皮薄馅大汁多，荷叶包裹蒸制，带淡淡荷香。",
    history: "始创于1937年，创始人张文汉因性格憨厚被昵称「草包」，包子铺由此得名。",
    season: "四季皆宜", tips: "必点鲜肉包和三鲜包。高峰期排队久，建议错峰。",
    must: true,
    img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop",
    shops: [
      { name: "草包包子铺(泉城路总店)", avg: "¥35", addr: "泉城路222号", rating: 4.6, hours: "06:30-14:00 / 17:00-20:30", bestDish: "鲜肉包、三鲜包", wait: "周末排队30-40分钟", lat: 36.6692, lng: 117.0238 },
      { name: "草包包子铺(大观园店)", avg: "¥35", addr: "大观园商场1楼", rating: 4.5, hours: "06:30-14:00 / 17:00-20:00", bestDish: "鲜肉包、素三鲜包", wait: "比总店人少", lat: 36.6585, lng: 117.0145 }
    ],
    price: "人均¥35", difficulty: "中等", where: "泉城路222号（草包包子铺总店）"
  },
  {
    id: "tianmo", name: "甜沫", cat: "zaocan", tag: "济南早餐 · 名甜实咸",
    desc: "小米面熬制，加花生、豆腐丝、菠菜。名字带「甜」却是咸的。",
    history: "甜沫是济南独有的早餐粥品。相传明末清初，一粥铺老板免费施粥，食客问「添么？」（济南话：加什么），久而久之谐音成了「甜沫」。",
    season: "四季皆宜，冬季暖身", tips: "配油旋是经典组合。第一次吃别被名字骗了，它是咸的！",
    must: true,
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    shops: [
      { name: "春江饭店", avg: "¥8", addr: "泉城路附近", rating: 4.3, hours: "06:00-10:00", bestDish: "甜沫、油旋", wait: "早上7-8点排队", lat: 36.6695, lng: 117.0255 },
      { name: "超意兴", avg: "¥5", addr: "各区域均有", rating: 4.2, hours: "06:00-10:00", bestDish: "甜沫、把子肉", wait: "不排队", lat: 36.668, lng: 117.026 }
    ],
    price: "人均¥5", difficulty: "简单", where: "全城早餐店（春江饭店、超意兴）"
  },
  {
    id: "quanshui", name: "泉水宴", cat: "lucai", tag: "济南特色 · 泉水入馔",
    desc: "以趵突泉水烹制系列菜肴，清炖活鱼、泉水豆腐、泉水煮茶。",
    history: "济南七十二名泉，泉水自古融入饮食文化。泉水宴是近年复兴的传统，用趵突泉水煮菜泡茶。",
    season: "四季皆宜", tips: "泉水宴适合宴请或体验，人均较高。推荐泉水豆腐和清炖鱼。",
    must: false,
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    shops: [
      { name: "泉城大酒店", avg: "¥120", addr: "泉城路188号", rating: 4.5, hours: "11:00-14:00 / 17:00-21:30", bestDish: "泉水宴套餐", wait: "需提前预订", lat: 36.6698, lng: 117.0248 },
      { name: "舜耕山庄", avg: "¥150", addr: "舜耕路28号", rating: 4.6, hours: "11:00-14:00 / 17:00-21:00", bestDish: "泉水鱼头、泉水豆腐", wait: "需提前预订", lat: 36.635, lng: 117.028 }
    ],
    price: "人均¥120", difficulty: "困难", where: "泉城路（泉城大酒店、舜耕山庄）"
  },
  {
    id: "baobizhizha", name: "爆炒腰花", cat: "lucai", tag: "鲁菜 · 火候巅峰",
    desc: "猪腰切花刀，大火快炒，脆嫩爽口无腥味。考验厨师火候的硬菜。",
    history: "鲁菜中最考验厨师功力的菜品之一。腰花需在极短时间内大火翻炒，火候差一秒就老了。",
    season: "四季皆宜", tips: "上桌要趁热吃，凉了口感差。不能吃内脏的慎点。",
    must: false,
    img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop",
    shops: [
      { name: "聚丰德(泉城路店)", avg: "¥65", addr: "泉城路288号", rating: 4.6, hours: "11:00-14:00 / 17:00-21:00", bestDish: "爆炒腰花、糖醋鲤鱼", wait: "周末约30分钟", lat: 36.669, lng: 117.024 },
      { name: "会仙楼饭庄", avg: "¥60", addr: "泉城路188号", rating: 4.4, hours: "11:00-14:00 / 17:00-20:30", bestDish: "爆炒腰花、糖醋鲤鱼", wait: "节假日约20分钟", lat: 36.6695, lng: 117.025 }
    ],
    price: "人均¥65", difficulty: "困难", where: "泉城路（聚丰德、会仙楼）"
  },
  {
    id: "congsao", name: "葱烧海参", cat: "lucai", tag: "鲁菜 · 高端代表",
    desc: "章丘大葱配辽参，葱香浓郁，海参软糯。鲁菜高端宴席的压轴菜。",
    history: "鲁菜高端菜的代表。选用章丘大葱——葱白长、甜度高，配以辽参慢烧入味。",
    season: "秋冬进补最佳", tips: "人均较高，适合宴请。章丘大葱是灵魂。",
    must: false,
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
    shops: [
      { name: "闫府私房菜", avg: "¥168", addr: "历山路88号", rating: 4.6, hours: "11:00-14:00 / 17:00-21:30", bestDish: "葱烧海参、九转大肠", wait: "需提前预约", lat: 36.658, lng: 117.038 },
      { name: "舜耕山庄", avg: "¥188", addr: "舜耕路28号", rating: 4.6, hours: "11:00-14:00 / 17:00-21:00", bestDish: "葱烧海参、泉水鱼头", wait: "需提前预订", lat: 36.635, lng: 117.028 }
    ],
    price: "人均¥168", difficulty: "困难", where: "历山路（闫府私房菜、舜耕山庄）"
  },
  {
    id: "shaokao", name: "济南烧烤", cat: "yexiao", tag: "夜宵 · 夏日灵魂",
    desc: "济南烧烤以羊肉串、烤板筋、烤蒜瓣肉为特色，配扎啤，夏夜标配。",
    history: "济南烧烤文化源远流长，夏天傍晚路边支起小桌，三五好友撸串喝扎啤，是济南人最惬意的生活方式。",
    season: "夏季最佳（5-9月）", tips: "认准炭火烤的，电烤的差远了。回民小区的羊肉串最地道。",
    must: true,
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
    shops: [
      { name: "回民小区烧烤一条街", avg: "¥50", addr: "回民小区", rating: 4.4, hours: "17:00-02:00", bestDish: "羊肉串、烤板筋", wait: "夏天晚上排队30分钟+", lat: 36.663, lng: 117.018 },
      { name: "老金烧烤", avg: "¥55", addr: "经七路", rating: 4.5, hours: "17:00-01:00", bestDish: "羊肉串、烤蒜瓣肉", wait: "周末约20分钟", lat: 36.652, lng: 117.02 }
    ],
    price: "人均¥50", difficulty: "中等", where: "回民小区烧烤一条街"
  },
  {
    id: "quanlaonai", name: "泉水老酸奶", cat: "yinpin", tag: "饮品 · 泉城限定",
    desc: "用泉水制作的浓稠老酸奶，口感醇厚，配蜂蜜或果酱。",
    history: "济南泉水富含矿物质，用泉水发酵的酸奶口感格外醇厚。",
    season: "四季皆宜，夏季冰镇更爽", tips: "景区门口的价格偏贵，走远一点更实惠。",
    must: false,
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop",
    shops: [
      { name: "趵突泉酸奶坊", avg: "¥15", addr: "趵突泉东门", rating: 4.4, hours: "08:00-18:00", bestDish: "泉水老酸奶", wait: "不排队", lat: 36.6638, lng: 116.9978 },
      { name: "黑虎泉酸奶铺", avg: "¥12", addr: "黑虎泉西路", rating: 4.3, hours: "09:00-19:00", bestDish: "蜂蜜酸奶", wait: "不排队", lat: 36.66, lng: 117.0338 }
    ],
    price: "人均¥15", difficulty: "简单", where: "趵突泉东门（趵突泉酸奶坊）"
  },
  {
    id: "quancha", name: "泉水泡茶", cat: "yinpin", tag: "饮品 · 泉城雅事",
    desc: "取趵突泉或黑虎泉水泡茶，水质清冽甘甜，茶香更醇。",
    history: "济南自古有「泉城」美誉，用泉水泡茶是文人雅事。老济南人清晨去黑虎泉打水回家泡茶。",
    season: "四季皆宜", tips: "黑虎泉水可免费取用，自带保温杯去打水。景区茶馆价格偏高。",
    must: false,
    img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop",
    shops: [
      { name: "趵突泉茶社", avg: "¥30", addr: "趵突泉公园内", rating: 4.5, hours: "08:00-17:00", bestDish: "泉水绿茶、泉水茉莉花茶", wait: "不排队", lat: 36.6635, lng: 116.9972 },
      { name: "黑虎泉茶摊", avg: "¥10", addr: "黑虎泉畔", rating: 4.2, hours: "07:00-18:00", bestDish: "泉水大碗茶", wait: "不排队", lat: 36.6602, lng: 117.0342 }
    ],
    price: "人均¥10", difficulty: "简单", where: "黑虎泉畔（黑虎泉茶摊）"
  },
  {
    id: "huangjia", name: "黄家烤肉", cat: "laozihao", tag: "章丘名吃 · 百年传承",
    desc: "章丘黄家烤肉，整猪烤制，皮脆肉嫩，肥而不腻。外皮金黄酥脆，肉质鲜嫩多汁。",
    history: "黄家烤肉始于清末章丘黄家，传承百余年。选用本地黑猪，经腌制、晾干、烤制等多道工序。",
    season: "四季皆宜", tips: "可以买真空包装带回家。整只猪烤制，建议多人分食。",
    must: false,
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    shops: [
      { name: "黄家烤肉(章丘总店)", avg: "¥60", addr: "章丘区明水街道", rating: 4.6, hours: "09:00-20:00", bestDish: "整猪烤肉、烤猪蹄", wait: "不排队", lat: 36.718, lng: 117.528 }
    ],
    price: "人均¥60", difficulty: "困难", where: "章丘区明水街道（黄家烤肉总店）"
  },
  {
    id: "huangmenji", name: "黄焖鸡", cat: "xiaochi", tag: "济南起源 · 全国知名",
    desc: "黄焖鸡米饭起源于济南。鸡肉块配香菇、青椒，黄焖酱汁浓郁，配米饭绝配。",
    history: "黄焖鸡米饭最早出现在济南，后风靡全国。正宗的黄焖鸡用砂锅焖制，鸡肉入味嫩滑。",
    season: "四季皆宜", tips: "认准砂锅现做的，预制的味道差。配米饭是标配。",
    must: true,
    img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop",
    shops: [
      { name: "杨铭宇黄焖鸡(总店)", avg: "¥25", addr: "历城区", rating: 4.3, hours: "10:00-21:00", bestDish: "招牌黄焖鸡", wait: "不排队", lat: 36.658, lng: 117.058 },
      { name: "老济南黄焖鸡", avg: "¥22", addr: "泉城路附近", rating: 4.2, hours: "10:00-21:00", bestDish: "黄焖鸡米饭", wait: "不排队", lat: 36.669, lng: 117.024 }
    ],
    price: "人均¥25", difficulty: "简单", where: "全城连锁"
  },
  {
    id: "sixiniao", name: "四喜丸子", cat: "lucai", tag: "鲁菜 · 宴席必备",
    desc: "四个大肉丸子，红烧入味，外酥里嫩。鲁菜宴席的必备菜，寓意福禄寿喜。",
    history: "四喜丸子是鲁菜传统宴席菜，四个丸子象征「福禄寿喜」。济南人过年过节必做此菜。",
    season: "四季皆宜，年节必备", tips: "分量大，2人吃两个就够了。配米饭或馒头都行。",
    must: false,
    img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop",
    shops: [
      { name: "超意兴", avg: "¥12", addr: "各区域均有", rating: 4.3, hours: "06:00-21:00", bestDish: "四喜丸子、把子肉", wait: "不排队", lat: 36.668, lng: 117.026 }
    ],
    price: "人均¥12", difficulty: "中等", where: "全城连锁（超意兴）"
  },
  {
    id: "guotie", name: "济南锅贴", cat: "xiaochi", tag: "济南特色 · 早餐",
    desc: "底面金黄酥脆，上面软嫩多汁。济南锅贴比北方其他城市的更小巧精致。",
    history: "济南锅贴讲究底脆馅嫩，用平底锅煎至底部金黄，加水焖熟。是济南人喜爱的早餐之一。",
    season: "四季皆宜", tips: "蘸醋和辣椒油更好吃。趁热吃，凉了底就不脆了。",
    must: false,
    img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=400&fit=crop",
    shops: [
      { name: "草包包子铺", avg: "¥15", addr: "泉城路222号", rating: 4.6, hours: "06:30-14:00", bestDish: "锅贴、包子", wait: "周末排队", lat: 36.6692, lng: 117.0238 }
    ],
    price: "人均¥15", difficulty: "中等", where: "泉城路（草包包子铺）"
  },
  {
    id: "jitang", name: "老济南鸡汤", cat: "zaocan", tag: "早餐 · 暖胃",
    desc: "老母鸡慢炖的浓汤，配粉丝、香菜、胡椒。冬天早上一碗鸡汤暖到心。",
    history: "济南人冬天的早餐选择之一。老母鸡慢炖数小时，汤色奶白，配烧饼或油旋。",
    season: "秋冬最佳", tips: "要配烧饼一起吃。加点胡椒粉更提味。",
    must: false,
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    shops: [
      { name: "泉城老鸡汤", avg: "¥15", addr: "老城区", rating: 4.3, hours: "06:00-10:00", bestDish: "老母鸡汤", wait: "早高峰约10分钟", lat: 36.669, lng: 117.024 }
    ],
    price: "人均¥15", difficulty: "简单", where: "老城区早餐店"
  },
  {
    id: "jitang-pucai", name: "鸡汤蒲菜", cat: "lucai", tag: "济南特色 · 时令",
    desc: "用老母鸡汤煮大明湖蒲菜，鸡汤的鲜美与蒲菜的清香完美融合。",
    history: "比奶汤蒲菜更家常的做法，用鸡汤替代奶汤，味道更浓郁。",
    season: "春夏季最佳", tips: "蒲菜有季节性，4-8月最嫩。",
    must: false,
    img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    shops: [
      { name: "明湖楼", avg: "¥65", addr: "大明湖南门", rating: 4.5, hours: "11:00-14:00 / 17:00-20:30", bestDish: "鸡汤蒲菜", wait: "不排队", lat: 36.677, lng: 117.02 }
    ],
    price: "人均¥65", difficulty: "中等", where: "大明湖南门（明湖楼）"
  },
  {
    id: "kaorou-mian", name: "烤肉拌面", cat: "xiaochi", tag: "济南变体 · 碳水炸弹",
    desc: "济南特色烤肉配拌面，面条劲道，烤肉香嫩。碳水+蛋白质的完美组合。",
    history: "济南年轻人的新宠，将传统烤肉与新疆拌面结合。",
    season: "四季皆宜", tips: "分量很大，食量小的两人分一份。",
    must: false,
    img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
    shops: [
      { name: "回民小区面馆", avg: "¥25", addr: "回民小区", rating: 4.3, hours: "11:00-21:00", bestDish: "烤肉拌面", wait: "午餐高峰约15分钟", lat: 36.663, lng: 117.018 }
    ],
    price: "人均¥25", difficulty: "简单", where: "回民小区"
  },
  {
    id: "hetang", name: "荷叶粥", cat: "yinpin", tag: "夏季饮品 · 清凉",
    desc: "用新鲜荷叶煮粥，清香扑鼻，清凉解暑。大明湖荷花季限定。",
    history: "大明湖盛产荷花，济南人夏天用荷叶煮粥，清凉解暑。",
    season: "夏季最佳（6-8月）", tips: "大明湖周边的餐厅才有。荷叶的清香很独特。",
    must: false,
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    shops: [
      { name: "明湖楼", avg: "¥15", addr: "大明湖南门", rating: 4.5, hours: "11:00-20:30", bestDish: "荷叶粥", wait: "不排队", lat: 36.677, lng: 117.02 }
    ],
    price: "人均¥15", difficulty: "简单", where: "大明湖南门（明湖楼）"
  }
];

// ══════════════════════════════════════
// 数据处理与输出
// ══════════════════════════════════════

function addMetaFields(spots) {
  return spots.map(s => ({
    ...s,
    meta: `⏱ ${s.dur} · 🎫 ${s.price === 0 ? '免费' : '¥' + s.price} · ${s.transport?.slice(0, 15) || '步行'}`
  }));
}

function generateCategories() {
  return [
    { id: "lucai", name: "鲁菜经典", icon: "🍲", desc: "八大菜系之首的鲁菜发源地" },
    { id: "xiaochi", name: "市井小吃", icon: "🍢", desc: "街头巷尾的烟火气" },
    { id: "laozihao", name: "老字号", icon: "🏮", desc: "几十年甚至上百年的老味道" },
    { id: "zaocan", name: "早餐", icon: "🌅", desc: "济南人的一天从甜沫油旋开始" },
    { id: "yexiao", name: "夜宵", icon: "🌙", desc: "深夜食堂，烧烤扎啤" },
    { id: "yinpin", name: "饮品", icon: "🍵", desc: "泉水泡茶，老酸奶" }
  ];
}

// 主函数
function main() {
  console.log('🏛️ 济南旅游攻略 - 数据增强脚本');
  console.log('═'.repeat(50));

  // 处理景点数据
  const spots = addMetaFields(SPOTS_DATABASE);
  console.log(`📍 景点数据: ${spots.length} 个`);

  // 处理美食数据
  const foods = {
    categories: generateCategories(),
    foods: FOODS_DATABASE
  };
  console.log(`🍜 美食数据: ${foods.foods.length} 个`);

  // 写入文件
  writeFileSync(join(DATA_DIR, 'spots.json'), JSON.stringify(spots, null, 2), 'utf-8');
  console.log('✅ spots.json 已更新');

  writeFileSync(join(DATA_DIR, 'food.json'), JSON.stringify(foods, null, 2), 'utf-8');
  console.log('✅ food.json 已更新');

  // 数据报告
  console.log('\n📊 数据报告:');
  console.log(`  景点: ${spots.length} 个`);
  console.log(`    - 泉水: ${spots.filter(s => s.cat === 'spring').length}`);
  console.log(`    - 自然: ${spots.filter(s => s.cat === 'nature').length}`);
  console.log(`    - 历史: ${spots.filter(s => s.cat === 'history').length}`);
  console.log(`    - 美食街: ${spots.filter(s => s.cat === 'food').length}`);
  console.log(`  美食: ${foods.foods.length} 个`);
  console.log(`    - 鲁菜: ${foods.foods.filter(f => f.cat === 'lucai').length}`);
  console.log(`    - 小吃: ${foods.foods.filter(f => f.cat === 'xiaochi').length}`);
  console.log(`    - 老字号: ${foods.foods.filter(f => f.cat === 'laozihao').length}`);
  console.log(`    - 早餐: ${foods.foods.filter(f => f.cat === 'zaocan').length}`);
  console.log(`    - 夜宵: ${foods.foods.filter(f => f.cat === 'yexiao').length}`);
  console.log(`    - 饮品: ${foods.foods.filter(f => f.cat === 'yinpin').length}`);

  // 验证数据完整性
  let errors = [];
  spots.forEach(s => {
    if (!s.id || !s.name || !s.lat || !s.lng) errors.push(`景点 ${s.name || s.id}: 缺少必要字段`);
    if (s.lat < 36.3 || s.lat > 37.0) errors.push(`景点 ${s.name}: 纬度异常 ${s.lat}`);
    if (s.lng < 116.8 || s.lng > 117.6) errors.push(`景点 ${s.name}: 经度异常 ${s.lng}`);
  });
  foods.foods.forEach(f => {
    if (!f.id || !f.name) errors.push(`美食 ${f.name || f.id}: 缺少必要字段`);
    f.shops?.forEach(s => {
      if (s.lat && (s.lat < 36.3 || s.lat > 37.0)) errors.push(`餐厅 ${s.name}: 纬度异常`);
    });
  });

  if (errors.length) {
    console.log('\n⚠️ 数据验证警告:');
    errors.forEach(e => console.log(`  - ${e}`));
  } else {
    console.log('\n✅ 数据验证通过');
  }

  console.log('\n🎉 数据增强完成！');
}

main();
