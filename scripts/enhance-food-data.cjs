#!/usr/bin/env node
/**
 * 增强 food.json 数据：
 * 1. 为每个美食添加 cookTime（制作时长）、origin（发源地）、recommendedDishes（推荐菜品）
 * 2. 为每个餐厅添加 parking（停车）、wifi（WiFi）、privateRoom（包间）、bestTime（最佳到店时间）
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/food.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// ── 美食级别的增强数据 ──
const foodEnhancements = {
  'tangcu': { cookTime: '25-30分钟', origin: '清代济南府', recommendedDishes: ['糖醋黄河鲤鱼', '糖醋里脊', '松鼠桂鱼'] },
  'jiuzhuan': { cookTime: '40-50分钟', origin: '清光绪年间济南九华林饭庄', recommendedDishes: ['九转大肠', '红烧大肠', '溜肥肠'] },
  'bazirou': { cookTime: '3-4小时慢炖', origin: '古代祭祀传统，蒲草捆扎炖煮', recommendedDishes: ['把子肉', '四喜丸子', '豆腐卷', '鸡蛋'] },
  'naichangpu': { cookTime: '15-20分钟', origin: '大明湖特产，清代袁枚《随园食单》有载', recommendedDishes: ['奶汤蒲菜', '鸡汤蒲菜', '蒲菜水饺'] },
  'youxuan': { cookTime: '8-10分钟/炉', origin: '清代济南独有面食', recommendedDishes: ['原味油旋', '甜油旋', '葱油旋'] },
  'caobao': { cookTime: '15-20分钟/笼', origin: '1937年创始人张文汉', recommendedDishes: ['鲜肉包', '三鲜包', '素三鲜包', '锅贴'] },
  'tianmo': { cookTime: '30-40分钟熬制', origin: '明末清初济南粥铺', recommendedDishes: ['甜沫', '油旋', '烧饼'] },
  'quanshui': { cookTime: '2-3小时', origin: '济南泉水文化复兴', recommendedDishes: ['泉水豆腐', '清炖活鱼', '泉水煮茶', '泉水宴套餐'] },
  'baobizhizha': { cookTime: '3-5分钟大火快炒', origin: '鲁菜传统技艺', recommendedDishes: ['爆炒腰花', '爆炒鸡胗', '爆炒鱿鱼'] },
  'congsao': { cookTime: '2-3小时慢烧', origin: '鲁菜高端代表，章丘大葱配辽参', recommendedDishes: ['葱烧海参', '葱烧蹄筋', '葱烧鹿筋'] },
  'shaokao': { cookTime: '5-10分钟/串', origin: '济南民间烧烤文化', recommendedDishes: ['羊肉串', '烤板筋', '烤蒜瓣肉', '烤腰子'] },
  'quanlaonai': { cookTime: '6-8小时发酵', origin: '济南泉水发酵工艺', recommendedDishes: ['泉水老酸奶', '蜂蜜酸奶', '果酱酸奶'] },
  'quancha': { cookTime: '3-5分钟', origin: '济南泉城文人雅事', recommendedDishes: ['泉水绿茶', '泉水茉莉花茶', '泉水大碗茶'] },
  'huangjia': { cookTime: '6-8小时', origin: '清末章丘黄家', recommendedDishes: ['整猪烤肉', '烤猪蹄', '烤排骨'] },
  'huangmenji': { cookTime: '20-30分钟', origin: '济南本土，后风靡全国', recommendedDishes: ['招牌黄焖鸡', '黄焖排骨', '黄焖鸡米饭'] },
  'sixiniao': { cookTime: '40-50分钟', origin: '鲁菜传统宴席菜', recommendedDishes: ['四喜丸子', '红烧狮子头', '清蒸丸子'] },
  'guotie': { cookTime: '10-15分钟', origin: '济南传统面食', recommendedDishes: ['鲜肉锅贴', '三鲜锅贴', '素菜锅贴'] },
  'jitang': { cookTime: '4-6小时慢炖', origin: '济南民间早餐传统', recommendedDishes: ['老母鸡汤', '鸡汤面', '鸡汤泡饭'] },
  'jitang-pucai': { cookTime: '20-25分钟', origin: '比奶汤蒲菜更家常的做法', recommendedDishes: ['鸡汤蒲菜', '鸡汤豆腐', '鸡汤粉丝'] },
  'kaorou-mian': { cookTime: '15-20分钟', origin: '济南年轻人新宠', recommendedDishes: ['烤肉拌面', '烤肉炒饭', '拌面'] },
  'hetang': { cookTime: '30-40分钟', origin: '大明湖荷花文化', recommendedDishes: ['荷叶粥', '荷叶饭', '荷叶鸡'] },
  'zhoucun-shaobing': { cookTime: '5-8分钟/炉', origin: '淄博周村，百年历史', recommendedDishes: ['芝麻烧饼', '甜烧饼', '咸烧饼'] },
  'dezhou-baji': { cookTime: '6-8小时卤制', origin: '明代德州，300年历史', recommendedDishes: ['五香扒鸡', '麻辣扒鸡', '原味扒鸡'] },
  'mian-sha-bao': { cookTime: '2-3小时', origin: '济南80年代流行面包', recommendedDishes: ['棉纱包', '老式蛋糕', '桃酥'] },
  'jitui-fan': { cookTime: '10-15分钟', origin: '超意兴招牌套餐', recommendedDishes: ['鸡腿饭', '把子肉饭', '四喜丸子饭'] },
  'suan-cu-ou-pian': { cookTime: '5-8分钟', origin: '大明湖莲藕文化', recommendedDishes: ['酸醋藕片', '凉拌藕片', '糖醋藕片'] },
  'zhurou-shuijianbao': { cookTime: '10-15分钟', origin: '济南传统早餐', recommendedDishes: ['猪肉水煎包', '韭菜鸡蛋煎包', '茴香煎包'] },
  'lian-ou-cha': { cookTime: '5分钟', origin: '大明湖莲藕饮品', recommendedDishes: ['鲜藕汁', '蜂蜜藕汁', '桂花藕汁'] },
  'huang-he-li-yu-tang': { cookTime: '40-60分钟', origin: '黄河鲤鱼传统食材', recommendedDishes: ['黄河鲤鱼汤', '清炖鲤鱼', '豆腐鲤鱼汤'] },
  'laodu-fen-tang': { cookTime: '15-20分钟', origin: '济南传统早餐', recommendedDishes: ['老醋粉汤', '酸辣粉汤', '鸡蛋粉汤'] },
  'chao-bian-rou': { cookTime: '5-8分钟', origin: '济南回民家常菜', recommendedDishes: ['炒边肉', '炒牛肉', '洋葱炒肉'] },
  'zhangqiu-cong': { cookTime: '即食', origin: '章丘大葱，中国最著名品种', recommendedDishes: ['大葱蘸酱', '大葱卷饼', '大葱炒蛋'] },
  'ji-dan-guan-bing': { cookTime: '3-5分钟/个', origin: '源自河南，济南早餐标配', recommendedDishes: ['鸡蛋灌饼', '加生菜版', '加辣酱版'] },
  'rou-jia-mo': { cookTime: '5-8分钟', origin: '源自陕西，济南本地化', recommendedDishes: ['腊汁肉夹馍', '牛肉夹馍', '鸡肉夹馍'] },
  'dongpo': { cookTime: '2-3小时慢炖', origin: '源自苏轼，鲁菜做法', recommendedDishes: ['东坡肉', '东坡肘子', '东坡豆腐'] },
  'cuipi': { cookTime: '30-40分钟', origin: '鲁菜传统宴席菜', recommendedDishes: ['脆皮鸡', '脆皮鸭', '炸鸡翅'] },
  'luhuoshao': { cookTime: '10-15分钟', origin: '济南传统果木炭火', recommendedDishes: ['果木烤串', '烤羊肉', '烤鸡翅'] },
  'jitang-mian': { cookTime: '15-20分钟', origin: '济南冬季早餐', recommendedDishes: ['鸡汤面', '鸡汤馄饨', '鸡汤米线'] },
  'mala': { cookTime: '15-20分钟', origin: '近十年从南方传入', recommendedDishes: ['麻辣小龙虾', '蒜蓉小龙虾', '十三香小龙虾'] },
  'doupi': { cookTime: '即食', origin: '济南街头小吃', recommendedDishes: ['豆腐皮卷', '豆腐皮卷大葱', '豆腐皮卷黄瓜'] },
  'hongshao': { cookTime: '2-3小时', origin: '鲁菜传统硬菜', recommendedDishes: ['红烧肘子', '红烧排骨', '红烧肉'] },
  'qingzheng': { cookTime: '12-15分钟', origin: '鲁菜清蒸代表', recommendedDishes: ['清蒸鲈鱼', '清蒸多宝鱼', '清蒸鲤鱼'] },
  'luwei': { cookTime: '2-4小时卤制', origin: '济南传统卤味', recommendedDishes: ['卤牛肉', '卤鸡爪', '卤鸭脖', '卤豆干'] },
  'tangyuan': { cookTime: '10-15分钟', origin: '元宵节传统', recommendedDishes: ['黑芝麻汤圆', '花生汤圆', '豆沙汤圆'] },
  'zongzi': { cookTime: '2-3小时', origin: '端午节传统', recommendedDishes: ['红枣粽', '肉粽', '豆沙粽'] },
  'mianjin': { cookTime: '15-20分钟', origin: '济南特色早餐', recommendedDishes: ['面筋汤', '鸡蛋面筋汤', '面筋泡'] },
  'baicai': { cookTime: '3-5分钟', origin: '鲁菜家常', recommendedDishes: ['醋溜白菜', '白菜炖豆腐', '白菜炖粉条'] },
  'tudou': { cookTime: '5-8分钟', origin: '鲁菜家常', recommendedDishes: ['酸辣土豆丝', '醋溜土豆丝', '炝拌土豆丝'] },
  'fanqie': { cookTime: '5-8分钟', origin: '国民家常菜', recommendedDishes: ['番茄炒蛋', '番茄蛋汤', '番茄炖牛腩'] },
  'mifan': { cookTime: '10-15分钟', origin: '超意兴招牌', recommendedDishes: ['把子肉盖饭', '四喜丸子盖饭', '鸡腿盖饭'] },
  'jitui': { cookTime: '30-40分钟', origin: '鲁菜酱卤', recommendedDishes: ['酱鸡腿', '酱鸡翅', '酱鸡爪'] },
  'doufu': { cookTime: '即食/10分钟', origin: '济南泉水豆腐', recommendedDishes: ['泉水豆腐', '凉拌豆腐', '红烧豆腐'] },
  'baozi': { cookTime: '10-15分钟', origin: '济南早餐传统', recommendedDishes: ['猪肉水煎包', '韭菜煎包', '茴香煎包'] },
  'lvdagun': { cookTime: '即食', origin: '北方传统甜品', recommendedDishes: ['驴打滚', '豆沙卷', '糯米糍'] },
  'tanghulu': { cookTime: '即食', origin: '北方冬季传统小吃', recommendedDishes: ['山楂糖葫芦', '草莓糖葫芦', '橘子糖葫芦'] },
  'baojiang': { cookTime: '5-8分钟', origin: '近年网红小吃', recommendedDishes: ['爆浆鸡排', '芝士鸡排', '香辣鸡排'] },
  'zhengzhou': { cookTime: '2-3小时', origin: '济南传统宴席', recommendedDishes: ['蒸鸡', '蒸鱼', '蒸肉', '蒸碗套餐'] },
  'roujiamo': { cookTime: '5-8分钟', origin: '西安传入，济南改良', recommendedDishes: ['肉夹馍', '牛肉夹馍', '鸡肉夹馍'] },
  'huangmen-pai': { cookTime: '25-30分钟', origin: '黄焖鸡变体', recommendedDishes: ['黄焖排骨', '黄焖鸡', '黄焖鸡腿'] },
  'baipi': { cookTime: '30-40分钟', origin: '鲁菜凉菜', recommendedDishes: ['白斩鸡', '白切鸡', '口水鸡'] },
  'roubing': { cookTime: '8-10分钟', origin: '济南传统面食', recommendedDishes: ['猪肉饼', '牛肉饼', '韭菜饼'] },
  'zhou': { cookTime: '30-60分钟', origin: '济南早餐养生', recommendedDishes: ['小米粥', '八宝粥', '皮蛋瘦肉粥'] },
  'huntun': { cookTime: '10-15分钟', origin: '济南冬季早餐', recommendedDishes: ['鲜肉馄饨', '虾仁馄饨', '荠菜馄饨'] },
  'chuan': { cookTime: '5-10分钟', origin: '四川传入，济南本地化', recommendedDishes: ['串串香', '麻辣串', '清汤串'] },
  'malatang': { cookTime: '10-15分钟', origin: '全国流行，济南偏麻', recommendedDishes: ['麻辣烫', '清汤麻辣烫', '番茄麻辣烫'] },
  'jiu': { cookTime: '即饮', origin: '济南夏日文化', recommendedDishes: ['青岛扎啤', '趵突泉扎啤', '精酿扎啤'] },
  'suanmei': { cookTime: '即饮', origin: '传统解暑饮品', recommendedDishes: ['酸梅汤', '冰镇酸梅汤', '桂花酸梅汤'] },
  'nuomici': { cookTime: '即食', origin: '街头甜品', recommendedDishes: ['糯米糍', '芒果糯米糍', '抹茶糯米糍'] }
};

// ── 餐厅级别的增强数据 ──
const shopEnhancements = {
  '聚丰德(泉城路店)': { parking: '地下停车场，消费满200免费2小时', wifi: true, privateRoom: '有，4-12人包间', bestTime: '工作日11:00前' },
  '燕喜堂': { parking: '路边停车位，较紧张', wifi: true, privateRoom: '有，6-10人包间', bestTime: '工作日11:30前' },
  '会仙楼饭庄': { parking: '附近商场停车场', wifi: true, privateRoom: '有，4-8人包间', bestTime: '工作日不排队' },
  '聚丰德(经十路店)': { parking: '大型停车场，免费', wifi: true, privateRoom: '有，6-16人包间', bestTime: '任何时段' },
  '闫府私房菜': { parking: '专属停车场', wifi: true, privateRoom: '有，4-20人包间，需预约', bestTime: '需提前1天预约' },
  '超意兴(遍布全城)': { parking: '部分门店有停车位', wifi: false, privateRoom: '无', bestTime: '11:30前或13:00后' },
  '老城区把子肉店': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '11:00前' },
  '明湖楼': { parking: '大明湖景区停车场', wifi: true, privateRoom: '有，4-10人包间', bestTime: '工作日11:00前' },
  '油旋张(泉城路店)': { parking: '无，建议步行', wifi: false, privateRoom: '无', bestTime: '工作日早上' },
  '大观园油旋': { parking: '大观园商场停车场', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '草包包子铺(泉城路总店)': { parking: '路边停车位', wifi: true, privateRoom: '有，6-8人包间', bestTime: '工作日11:00前' },
  '草包包子铺(大观园店)': { parking: '大观园商场停车场', wifi: true, privateRoom: '有，4-6人包间', bestTime: '比总店人少' },
  '草包包子铺': { parking: '路边停车位', wifi: true, privateRoom: '有，6-8人包间', bestTime: '工作日11:00前' },
  '春江饭店': { parking: '路边停车', wifi: true, privateRoom: '无', bestTime: '07:00前' },
  '超意兴': { parking: '部分门店有停车位', wifi: false, privateRoom: '无', bestTime: '11:30前或13:00后' },
  '泉城大酒店': { parking: '大型地下停车场，免费', wifi: true, privateRoom: '有，4-30人包间', bestTime: '需提前预订' },
  '舜耕山庄': { parking: '大型停车场，免费', wifi: true, privateRoom: '有，6-20人包间', bestTime: '需提前预订' },
  '杨铭宇黄焖鸡(总店)': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '老济南黄焖鸡': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '回民小区烧烤一条街': { parking: '路边停车，较紧张', wifi: false, privateRoom: '无', bestTime: '18:00前到' },
  '老金烧烤': { parking: '路边停车位', wifi: true, privateRoom: '无', bestTime: '17:30前' },
  '趵突泉酸奶坊': { parking: '趵突泉景区停车场', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '黑虎泉酸奶铺': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '趵突泉茶社': { parking: '趵突泉景区停车场', wifi: true, privateRoom: '有，茶室包间', bestTime: '工作日早上' },
  '黑虎泉茶摊': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '早上打水人多' },
  '黄家烤肉(章丘总店)': { parking: '门前免费停车', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '回民小区面馆': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '11:00前' },
  '芙蓉街烧饼摊': { parking: '无，建议步行', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '济南火车站德州扒鸡店': { parking: '火车站停车场', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '大观园老式糕点铺': { parking: '大观园商场停车场', wifi: false, privateRoom: '无', bestTime: '早上最新鲜' },
  '泉城路早餐摊': { parking: '无，建议步行', wifi: false, privateRoom: '无', bestTime: '07:00-08:00' },
  '大明湖畔饮品店': { parking: '大明湖景区停车场', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '大观园早点铺': { parking: '大观园商场停车场', wifi: false, privateRoom: '无', bestTime: '06:00-07:00' },
  '回民小区家常菜馆': { parking: '路边停车', wifi: true, privateRoom: '无', bestTime: '11:00前' },
  '章丘大葱专卖店(济南)': { parking: '超市停车场', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '泉城路小摊': { parking: '无，建议步行', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '芙蓉街小摊': { parking: '无，建议步行', wifi: false, privateRoom: '无', bestTime: '工作日人少' },
  '芙蓉街肉夹馍摊': { parking: '无，建议步行', wifi: false, privateRoom: '无', bestTime: '工作日人少' },
  '聚丰德': { parking: '地下停车场，消费满200免费2小时', wifi: true, privateRoom: '有，4-12人包间', bestTime: '工作日11:00前' },
  '会仙楼': { parking: '附近商场停车场', wifi: true, privateRoom: '有，4-8人包间', bestTime: '工作日不排队' },
  '老城区卤味店': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '老字号甜品店': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '老字号糕点铺': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '老城区早点铺': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '06:00-07:00' },
  '老城区肉饼店': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '早上最新鲜' },
  '泉城粥铺': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '07:00-08:00' },
  '老城区馄饨店': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '07:00-08:00' },
  '宽厚里串串店': { parking: '宽厚里地下停车场', wifi: true, privateRoom: '无', bestTime: '17:30前' },
  '芙蓉街麻辣烫': { parking: '无，建议步行', wifi: false, privateRoom: '无', bestTime: '工作日人少' },
  '回民小区': { parking: '路边停车，较紧张', wifi: false, privateRoom: '无', bestTime: '18:00前到' },
  '趵突泉小卖部': { parking: '趵突泉景区停车场', wifi: false, privateRoom: '无', bestTime: '任何时段' },
  '泉城老鸡汤': { parking: '路边停车', wifi: false, privateRoom: '无', bestTime: '07:00前' }
};

// ── 应用增强 ──
let enhancedCount = 0;
let shopEnhancedCount = 0;

data.foods.forEach(food => {
  const enhancement = foodEnhancements[food.id];
  if (enhancement) {
    if (!food.cookTime) food.cookTime = enhancement.cookTime;
    if (!food.origin) food.origin = enhancement.origin;
    if (!food.recommendedDishes) food.recommendedDishes = enhancement.recommendedDishes;
    enhancedCount++;
  }

  // 增强餐厅数据
  if (food.shops) {
    food.shops.forEach(shop => {
      const shopEnh = shopEnhancements[shop.name];
      if (shopEnh) {
        if (!shop.parking) shop.parking = shopEnh.parking;
        if (shop.wifi === undefined) shop.wifi = shopEnh.wifi;
        if (!shop.privateRoom) shop.privateRoom = shopEnh.privateRoom;
        if (!shop.bestTime) shop.bestTime = shopEnh.bestTime;
        shopEnhancedCount++;
      }
    });
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

// 同步更新 public/data/food.json
const publicPath = path.join(__dirname, '../public/data/food.json');
if (fs.existsSync(publicPath)) {
  fs.writeFileSync(publicPath, JSON.stringify(data, null, 2), 'utf8');
}

// 生成 minified 版本
const minPath = path.join(__dirname, '../src/data/food.min.json');
fs.writeFileSync(minPath, JSON.stringify(data), 'utf8');

console.log(`✅ 增强完成:`);
console.log(`   - ${enhancedCount} 个美食添加了 cookTime/origin/recommendedDishes`);
console.log(`   - ${shopEnhancedCount} 个餐厅添加了 parking/wifi/privateRoom/bestTime`);
