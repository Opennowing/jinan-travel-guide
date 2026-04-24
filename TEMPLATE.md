# 🏙️ 城市旅游攻略模板

本项目可快速复制为其他城市的旅游攻略站点。

## 快速开始

### 1. 复制项目
```bash
# Fork 本仓库，或直接克隆后修改
git clone https://github.com/你的用户名/你的城市-攻略.git
cd 你的城市-攻略
npm install
```

### 2. 修改城市配置
编辑 `src/data/city-config.json`：
```json
{
  "city": "成都",
  "cityShort": "蓉城",
  "slogan": "一座来了就不想走的城市",
  "emoji": "🐼",
  "themeColor": "#e74c3c",
  "province": "四川",
  "description": "成都旅游攻略...",
  "stats": { "springs": "0", "history": "3000+", "spots": "20+" },
  "mapCenter": [104.07, 30.67],
  "mapZoom": 12
}
```

### 3. 替换景点数据
编辑 `src/data/spots.json`，每个景点格式：
```json
{
  "id": "wuhouci",
  "name": "武侯祠",
  "cat": "history",
  "badge": "must",
  "img": "https://你的图片URL",
  "price": 50,
  "rating": 4.7,
  "reviews": 3000,
  "dur": "2h",
  "open": "08:00-18:00",
  "desc": "三国文化圣地...",
  "lat": 30.65,
  "lng": 104.05,
  "transport": "地铁3号线高升桥站",
  "audience": ["family", "solo"],
  "trust": "本地推荐"
}
```

### 4. 替换美食数据
编辑 `src/data/food.json`。

### 5. 替换图片资源
- 更新 `index.html` 和各页面中的图片 URL
- 更新 `public/icons/` 下的 PWA 图标
- 更新 `manifest.json` 中的名称和颜色

### 6. 修改页面文案
各 HTML 文件中的标题、描述文案需对应替换。

### 7. 配置高德地图
1. 前往 [高德开放平台](https://console.amap.com/dev/key/app) 申请免费 Key
2. 在 `src/data/city-config.json` 中填入 `gaodeKey`
3. 在 `spots.html` 中替换 `YOUR_AMAP_KEY_HERE`

### 8. 配置 CPS 联盟
1. 注册 [携程联盟](https://u.ctrip.com/) 获取 affId
2. 注册 [美团联盟](https://union.meituan.com/) 获取 affId
3. 在 `spots.html` 中替换对应 ID

### 9. 构建部署
```bash
npx vite build
# dist/ 目录即为部署产物
# 推送到 gh-pages 分支即可上线
```

## 数据字段说明

### spots.json 字段
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| name | string | 景点名称 |
| cat | string | 分类: spring/nature/history/food |
| badge | string | 标签: must/hot/free/hidden |
| img | string | 主图 URL |
| price | number | 门票价格（0=免费） |
| rating | number | 评分（1-5） |
| reviews | number | 评价数量 |
| dur | string | 建议游玩时长 |
| open | string | 开放时间 |
| desc | string | 简介 |
| lat/lng | number | 经纬度（高德坐标系） |
| transport | string | 交通方式 |
| audience | array | 适合人群: family/couple/elder/solo |
| photos | array | 景点亮点标签 |
| combo | object | 联票信息 |
| trust | string | 信任背书文案 |

## 技术栈
- Vite 6 + Vanilla JS（无框架依赖）
- CSS 变量设计系统（支持暗色模式）
- 高德地图 JS API 2.0
- PWA 离线支持
- localStorage 本地存储
