# 🏛️ 济南旅游攻略 · 泉城

[![Deploy to GitHub Pages](https://github.com/Opennowing/jinan-travel-guide/actions/workflows/deploy.yml/badge.svg)](https://github.com/Opennowing/jinan-travel-guide/actions/workflows/deploy.yml)

> 72泉涌，千年文脉 — 济南旅游一站式攻略

🌐 **线上地址**: https://opennowing.github.io/jinan-travel-guide/

## 📸 项目截图

- 🏠 首页：搜索框 + 当季推荐 + 精选路线 + 游客评价
- 🏛️ 景点：筛选排序 + Quick View 弹窗 + 高德地图 + 评论系统
- 🍜 美食：必吃榜 + 17道菜 + 时令推荐 + 美食地图
- 📋 行程：5条精选路线 + 精确时间轴 + 费用明细
- 📖 指南：预算计算器 + 行李清单 + 天气 + FAQ
- 📚 文化：济南历史文化介绍

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/Opennowing/jinan-travel-guide.git
cd jinan-travel-guide

# 初始化环境
bash setup.sh

# 启动开发服务器
npm run dev
# → http://localhost:3000

# 构建生产版本
npm run build

# 一键部署到 GitHub Pages
bash deploy.sh
```

## 🛠️ 技术栈

- **构建工具**: Vite 6
- **前端**: Vanilla JS (零框架依赖)
- **样式**: CSS 变量设计系统 + 暗色模式
- **地图**: 高德地图 JS API 2.0
- **PWA**: Service Worker + Manifest
- **部署**: GitHub Pages

## 📁 项目结构

```
├── index.html          # 首页
├── spots.html          # 景点页（筛选/地图/Quick View）
├── food.html           # 美食页（必吃榜/时令/地图）
├── itinerary.html      # 行程页（5条路线/时间轴）
├── guide.html          # 指南页（工具/FAQ）
├── culture.html        # 文化页
├── src/
│   ├── components/
│   │   └── shared.js   # 共享组件（暗色模式/菜单/弹窗）
│   ├── data/
│   │   ├── spots.json  # 景点数据（15个）
│   │   ├── food.json   # 美食数据（17道菜）
│   │   └── city-config.json # 城市配置
│   └── styles/
│       └── main.css    # 设计系统
├── deploy.sh           # 一键部署脚本
├── setup.sh            # 环境初始化
├── dev.sh              # 开发模式启动
└── manifest.json       # PWA 配置
```

## 🔧 配置项

### 高德地图 Key
在 `spots.html` 和 `food.html` 中搜索 `YOUR_AMAP_KEY_HERE`，替换为你自己的 Key。
→ 免费申请: https://console.amap.com/dev/key/app

### CPS 联盟 ID
在 `spots.html` 中搜索 `YOUR_CTRIP_AFF_ID` 和 `YOUR_MEITUAN_AFF_ID`。
→ 携程联盟: https://u.ctrip.com/
→ 美团联盟: https://union.meituan.com/

## 📋 更新日志

### v3.0 (2026-04-24)
- ✅ P0: Quick View 弹窗优化（画廊/地图/评价/分享）
- ✅ P1: 高德地图 SDK 集成
- ✅ P1: 评论/评分系统
- ✅ P1: CPS 分销链接（携程/美团）
- ✅ P2: PWA 离线支持
- ✅ P2: 城市扩展模板
- ✅ 美食页全面升级（17道菜/必吃榜/时令/地图）
- ✅ 行程页全面升级（5条路线/时间轴/费用）
- ✅ 指南页全面升级（计算器/清单/FAQ）
- ✅ 首页全面升级（搜索/季节/路线/评价/SEO）

## 🚦 CI/CD 自动部署

本项目使用 GitHub Actions 实现自动部署，无需手动操作。

### 自动部署流程

1. **推送到 `main` 分支** → 自动触发 `deploy.yml`
2. **工作流步骤**：Checkout → Node.js 18 → npm install → npm run build → 部署 `dist/` 到 `gh-pages` 分支
3. **访问地址**：https://opennowing.github.io/jinan-travel-guide/

### PR 预览

1. **创建 PR 到 `main`** → 自动触发 `pr-preview.yml`
2. **构建并部署** 到 `gh-pages-preview` 分支
3. **自动在 PR 中评论** 预览链接

### 工作流文件

- `.github/workflows/deploy.yml` — 主部署工作流（push 到 main 触发）
- `.github/workflows/pr-preview.yml` — PR 预览工作流（PR 到 main 触发）

## 📄 License

MIT
