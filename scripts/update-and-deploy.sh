#!/bin/bash
# ══════════════════════════════════════
# 济南旅游攻略 · 一键更新+验证+部署
# ══════════════════════════════════════
set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🏛️ 济南旅游攻略 · 一键更新部署    ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"

# ── [1/4] 数据验证 ──
echo ""
echo -e "${YELLOW}[1/4] 数据验证...${NC}"
node scripts/validate-data.mjs
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ 数据验证失败，中止部署${NC}"
  exit 1
fi

# ── [2/4] 构建 ──
echo ""
echo -e "${YELLOW}[2/4] 构建项目...${NC}"
if [ ! -d "node_modules" ]; then
  npm install 2>&1 | tail -3
fi
npx vite build 2>&1 | tail -5
if [ ! -d "dist" ]; then
  echo -e "${RED}❌ 构建失败${NC}"
  exit 1
fi
echo -e "${GREEN}  ✓ 构建完成 ($(du -sh dist/ | cut -f1))${NC}"

# ── [3/4] Git 提交 ──
echo ""
echo -e "${YELLOW}[3/4] Git 提交...${NC}"
git add -A
CHANGES=$(git diff --cached --stat | tail -1)
git commit -m "update: 数据更新+功能增强 $(date +%Y-%m-%d_%H:%M)

- 景点数据更新
- 美食数据更新
- 功能增强
- ${CHANGES}" 2>/dev/null || echo "  无新变更"

# ── [4/4] 部署 ──
echo ""
echo -e "${YELLOW}[4/4] 部署到 GitHub Pages...${NC}"
bash deploy.sh --token "${GITHUB_TOKEN}"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   ✅ 更新部署完成！                  ║${NC}"
echo -e "${CYAN}║                                      ║${NC}"
echo -e "${CYAN}║   🌐 https://opennowing.github.io/  ║${NC}"
echo -e "${CYAN}║       jinan-travel-guide/             ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
