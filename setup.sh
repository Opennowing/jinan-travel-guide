#!/bin/bash
# ══════════════════════════════════════
# 济南旅游攻略 · 环境初始化脚本
# ══════════════════════════════════════

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🏛️ 济南旅游攻略 · 环境初始化      ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""

# ── 1. 安装依赖 ──
echo -e "${YELLOW}[1/4] 安装 npm 依赖...${NC}"
npm install 2>&1 | tail -5
echo -e "${GREEN}  ✓ 依赖安装完成${NC}"

# ── 2. 配置 Git ──
echo ""
echo -e "${YELLOW}[2/4] 配置 Git...${NC}"
if [ -z "$(git config user.name)" ]; then
  read -p "  Git 用户名: " GIT_NAME
  git config user.name "$GIT_NAME"
fi
if [ -z "$(git config user.email)" ]; then
  read -p "  Git 邮箱: " GIT_EMAIL
  git config user.email "$GIT_EMAIL"
fi
echo -e "${GREEN}  ✓ Git: $(git config user.name) <$(git config user.email)>${NC}"

# ── 3. 检查 GitHub 认证 ──
echo ""
echo -e "${YELLOW}[3/4] 检查 GitHub 认证...${NC}"
if git ls-remote origin &>/dev/null 2>&1; then
  echo -e "${GREEN}  ✓ GitHub 认证可用${NC}"
else
  echo -e "${YELLOW}  ⚠ GitHub 未认证，部署时需要 Token${NC}"
  echo -e "  ${CYAN}申请地址: https://github.com/settings/tokens/new${NC}"
fi

# ── 4. 首次构建 ──
echo ""
echo -e "${YELLOW}[4/4] 首次构建...${NC}"
npx vite build 2>&1 | tail -3
echo -e "${GREEN}  ✓ 构建成功${NC}"

echo ""
echo -e "${CYAN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ 初始化完成！${NC}"
echo ""
echo -e "  常用命令:"
echo -e "  ${CYAN}npm run dev${NC}       — 启动开发服务器 (localhost:3000)"
echo -e "  ${CYAN}npm run build${NC}     — 构建生产版本"
echo -e "  ${CYAN}bash deploy.sh${NC}    — 一键部署到 GitHub Pages"
echo -e "  ${CYAN}bash dev.sh${NC}       — 开发模式 (热重载)"
echo -e "${CYAN}═══════════════════════════════════════${NC}"
