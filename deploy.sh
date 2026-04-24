#!/bin/bash
# ══════════════════════════════════════
# 济南旅游攻略 · 一键部署脚本
# 支持 --token / --ssh / 自动检测 / CI 友好
# ══════════════════════════════════════
set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

# ── 解析参数 ──
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
USE_SSH=false
DEPLOY_BRANCH="gh-pages"

show_help() {
  echo "用法: bash deploy.sh [选项]"
  echo ""
  echo "选项:"
  echo "  --token TOKEN   使用 GitHub Token 认证"
  echo "  --ssh           使用 SSH Key 认证"
  echo "  --help          显示此帮助"
  echo ""
  echo "认证优先级:"
  echo "  1. --token 参数"
  echo "  2. GITHUB_TOKEN 环境变量"
  echo "  3. SSH Key (~/.ssh/id_ed25519)"
  echo "  4. Git Credential Store"
  echo ""
  echo "示例:"
  echo "  bash deploy.sh                          # 自动检测认证"
  echo "  bash deploy.sh --token ghp_xxxx         # 使用 Token"
  echo "  bash deploy.sh --ssh                    # 使用 SSH"
  echo "  GITHUB_TOKEN=ghp_xxx bash deploy.sh     # 环境变量"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --token) GITHUB_TOKEN="$2"; shift 2 ;;
    --ssh) USE_SSH=true; shift ;;
    --help|-h) show_help ;;
    *) echo -e "${RED}未知参数: $1${NC}"; show_help ;;
  esac
done

echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🏛️ 济南旅游攻略 · 部署工具       ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""

# ── [1/5] 检查环境 ──
echo -e "${YELLOW}[1/5] 检查环境...${NC}"
for cmd in git node npx; do
  if ! command -v $cmd &>/dev/null; then
    echo -e "${RED}  ❌ 未安装 $cmd${NC}"; exit 1
  fi
done
echo -e "${GREEN}  ✓ git $(git --version | cut -d' ' -f3)${NC}"
echo -e "${GREEN}  ✓ node $(node -v)${NC}"

# ── [2/5] 配置认证 ──
echo ""
echo -e "${YELLOW}[2/5] 配置 GitHub 认证...${NC}"

ORIGIN_URL=$(git remote get-url origin 2>/dev/null || echo "")

# 方式 1: --token 参数或环境变量
if [ -n "$GITHUB_TOKEN" ]; then
  REMOTE_REPO=$(echo "$ORIGIN_URL" | sed -E 's|git@github.com:|https://github.com/|; s|\.git$||')
  git remote set-url origin "https://${GITHUB_TOKEN}@github.com/$(echo "$ORIGIN_URL" | sed -E 's|.*github.com[:/](.*)\.git$|\1|; s|.*github.com[:/](.*)$|\1|')"
  if git ls-remote origin &>/dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Token 认证成功${NC}"
  else
    echo -e "${RED}  ❌ Token 认证失败${NC}"; exit 1
  fi

# 方式 2: --ssh 标志
elif [ "$USE_SSH" = true ]; then
  if [ -f "$HOME/.ssh/id_ed25519" ] || [ -f "$HOME/.ssh/id_rsa" ]; then
    REPO_PATH=$(echo "$ORIGIN_URL" | sed -E 's|https://github.com/||; s|git@github.com:||; s|\.git$||')
    git remote set-url origin "git@github.com:${REPO_PATH}.git"
    if git ls-remote origin &>/dev/null 2>&1; then
      echo -e "${GREEN}  ✓ SSH 认证成功${NC}"
    else
      echo -e "${RED}  ❌ SSH 认证失败${NC}"; exit 1
    fi
  else
    echo -e "${RED}  ❌ 未找到 SSH Key${NC}"; exit 1
  fi

# 方式 3: 自动检测
else
  if git ls-remote origin &>/dev/null 2>&1; then
    echo -e "${GREEN}  ✓ 认证可用 (自动检测)${NC}"
  elif ssh -T git@github.com 2>&1 | grep -q "successfully"; then
    REPO_PATH=$(echo "$ORIGIN_URL" | sed -E 's|https://github.com/||; s|git@github.com:||; s|\.git$||')
    git remote set-url origin "git@github.com:${REPO_PATH}.git"
    echo -e "${GREEN}  ✓ SSH 认证成功${NC}"
  else
    echo -e "${RED}  ❌ 未找到认证方式${NC}"
    echo -e "${YELLOW}  请使用 --token 或 --ssh 参数，或设置 GITHUB_TOKEN 环境变量${NC}"
    echo -e "${YELLOW}  运行 bash deploy-env.sh 查看详细配置指南${NC}"
    exit 1
  fi
fi

# ── [3/5] 构建 ──
echo ""
echo -e "${YELLOW}[3/5] 构建项目...${NC}"
if [ ! -d "node_modules" ]; then
  echo -e "  安装依赖..."
  npm install 2>&1 | tail -3
fi
npx vite build 2>&1 | tail -5
if [ ! -d "dist" ]; then
  echo -e "${RED}  ❌ 构建失败${NC}"; exit 1
fi
echo -e "${GREEN}  ✓ 构建完成 ($(du -sh dist/ | cut -f1))${NC}"

# ── [4/5] 推送 main ──
echo ""
echo -e "${YELLOW}[4/5] 推送 main 分支...${NC}"
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
  git add -A
  git commit -m "auto: 部署前自动提交 $(date +%Y-%m-%d_%H:%M)" 2>/dev/null || true
fi
git push origin main 2>&1
echo -e "${GREEN}  ✓ main 已推送${NC}"

# ── [5/5] 部署 gh-pages ──
echo ""
echo -e "${YELLOW}[5/5] 部署到 gh-pages...${NC}"
cd dist/
git init -q
git config user.name "$(cd .. && git config user.name 2>/dev/null || echo 'Deploy Bot')"
git config user.email "$(cd .. && git config user.email 2>/dev/null || echo 'bot@deploy.local')"
git add -A
git commit -q -m "deploy: $(date +%Y-%m-%d_%H:%M) $(cd .. && git log --oneline -1)"
git branch -M gh-pages
ORIGIN_URL=$(cd .. && git remote get-url origin)
git remote add origin "$ORIGIN_URL" 2>/dev/null || git remote set-url origin "$ORIGIN_URL"
git push -fq origin gh-pages 2>&1
cd ..
echo -e "${GREEN}  ✓ gh-pages 已部署${NC}"

# ── 完成 ──
echo ""
echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   ✅ 部署完成！                      ║${NC}"
echo -e "${CYAN}║                                      ║${NC}"
echo -e "${CYAN}║   🌐 https://opennowing.github.io/  ║${NC}"
echo -e "${CYAN}║       jinan-travel-guide/             ║${NC}"
echo -e "${CYAN}║                                      ║${NC}"
echo -e "${CYAN}║   📝 后续更新: bash deploy.sh       ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
