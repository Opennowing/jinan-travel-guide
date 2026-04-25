#!/bin/bash
set -e
cd /root/.openclaw/workspace/jinan-travel-guide
echo "📦 Building..."
npm run build 2>/dev/null || echo "No build script, using source files directly"
echo "📝 Committing changes..."
git add -A
git diff --cached --quiet && echo "No changes to commit" && exit 0
git commit -m "feat: 更新景点和美食卡片布局与图片

- 修复卡片排版错乱问题
- 替换 Unsplash 外链为本地 SVG 图片
- 确保图片与语义内容匹配
- 优化响应式布局"
echo "🚀 Pushing to GitHub..."
git push origin main
echo "✅ Done! GitHub Pages will auto-deploy."
