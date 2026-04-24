#!/usr/bin/env bash
# status.sh - 项目状态检查

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# 从 git remote 推断 GitHub Pages URL
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
GITHUB_PAGES_URL=""
if [[ "$REMOTE_URL" =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
  REPO_OWNER="${BASH_REMATCH[1]}"
  REPO_NAME="${BASH_REMATCH[2]}"
  GITHUB_PAGES_URL="https://${REPO_OWNER}.github.io/${REPO_NAME}/"
fi

# 颜色
B='\033[1m'   # 粗体
R='\033[0m'   # 重置
G='\033[32m'  # 绿色
Y='\033[33m'  # 黄色
C='\033[36m'  # 青色
DIM='\033[2m'

divider() { echo -e "${DIM}────────────────────────────────────────${R}"; }

echo ""
echo -e "${B}📋 项目状态 — jinan-travel-guide${R}"
echo -e "${DIM}$(date '+%Y-%m-%d %H:%M:%S')${R}"
divider

# ── Git 状态 ──
echo -e "${B}🔀 Git${R}"
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo -e "   分支: ${C}${BRANCH}${R}"

# 未推送 commit
UNPUSHED=$(git log origin/${BRANCH}..HEAD --oneline 2>/dev/null | wc -l | tr -d ' ')
if [ "$UNPUSHED" -gt 0 ]; then
  echo -e "   未推送: ${Y}${UNPUSHED} 个 commit${R}"
else
  echo -e "   未推送: ${G}已同步${R}"
fi

# 未提交变更
DIRTY=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
if [ "$DIRTY" -gt 0 ]; then
  echo -e "   未提交: ${Y}${DIRTY} 个文件${R}"
  git status --short 2>/dev/null | head -5 | sed 's/^/     /'
else
  echo -e "   未提交: ${G}工作区干净${R}"
fi

divider

# ── 构建状态 ──
echo -e "${B}📦 构建${R}"
if [ -d "dist" ]; then
  DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
  DIST_TIME=$(stat -c '%y' dist 2>/dev/null | cut -d'.' -f1 || stat -f '%Sm' dist 2>/dev/null)
  DIST_FILES=$(find dist -type f 2>/dev/null | wc -l | tr -d ' ')
  echo -e "   状态: ${G}已构建${R}"
  echo -e "   大小: ${DIST_SIZE} (${DIST_FILES} 文件)"
  echo -e "   时间: ${DIST_TIME}"
else
  echo -e "   状态: ${Y}未构建${R}"
fi

divider

# ── 部署状态 ──
echo -e "${B}🚀 部署${R}"
GH_PAGES_COMMIT=$(git log origin/gh-pages -1 --format='%h %s (%cr)' 2>/dev/null || echo "无法获取")
if [ "$GH_PAGES_COMMIT" != "无法获取" ]; then
  echo -e "   gh-pages: ${G}${GH_PAGES_COMMIT}${R}"
else
  echo -e "   gh-pages: ${Y}${GH_PAGES_COMMIT}${R}"
fi

# gh-pages 分支最近5次部署
echo -e "   最近部署:"
git log origin/gh-pages --oneline -5 --format='     %h %s (%cr)' 2>/dev/null || echo "     无法获取历史"

divider

# ── 线上状态 ──
echo -e "${B}🌐 线上${R}"
if [ -n "$GITHUB_PAGES_URL" ]; then
  echo -e "   地址: ${C}${GITHUB_PAGES_URL}${R}"
  HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 5 "$GITHUB_PAGES_URL" 2>/dev/null || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "   状态: ${G}✅ 可访问 (HTTP $HTTP_CODE)${R}"
  elif [ "$HTTP_CODE" = "000" ]; then
    echo -e "   状态: ${Y}⚠️  无法连接${R}"
  else
    echo -e "   状态: ${Y}⚠️  HTTP $HTTP_CODE${R}"
  fi
else
  echo -e "   地址: ${Y}无法推断 GitHub Pages URL${R}"
fi

divider
echo ""
