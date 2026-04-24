#!/bin/bash
# ══════════════════════════════════════
# 济南旅游攻略 · 一键部署脚本
# ══════════════════════════════════════
set -e

# ── 颜色 ──
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🏛️ 济南旅游攻略 · 部署工具       ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""

# ── 检查环境 ──
check_env() {
  echo -e "${YELLOW}[1/5] 检查环境...${NC}"
  
  if ! command -v git &>/dev/null; then
    echo -e "${RED}❌ 未安装 git${NC}"; exit 1
  fi
  
  if ! command -v node &>/dev/null; then
    echo -e "${RED}❌ 未安装 Node.js${NC}"; exit 1
  fi
  
  if ! command -v npx &>/dev/null; then
    echo -e "${RED}❌ 未安装 npx${NC}"; exit 1
  fi
  
  echo -e "${GREEN}  ✓ git $(git --version | cut -d' ' -f3)${NC}"
  echo -e "${GREEN}  ✓ node $(node -v)${NC}"
  echo ""
}

# ── 检查/配置 GitHub 认证 ──
check_auth() {
  echo -e "${YELLOW}[2/5] 检查 GitHub 认证...${NC}"
  
  # 检查是否已有认证
  if git ls-remote origin &>/dev/null; then
    echo -e "${GREEN}  ✓ GitHub 认证已配置${NC}"
    return 0
  fi
  
  # 检查 SSH
  if ssh -T git@github.com 2>&1 | grep -q "successfully"; then
    echo -e "${GREEN}  ✓ SSH Key 可用${NC}"
    git remote set-url origin git@github.com:Opennowing/jinan-travel-guide.git 2>/dev/null || true
    return 0
  fi
  
  # 需要配置 Token
  echo -e "${YELLOW}  ⚠ GitHub 认证未配置${NC}"
  echo ""
  echo -e "  请提供 GitHub Personal Access Token:"
  echo -e "  ${CYAN}申请地址: https://github.com/settings/tokens/new${NC}"
  echo -e "  ${CYAN}权限勾选: repo (全部)${NC}"
  echo ""
  read -p "  粘贴 Token (ghp_xxxx): " GITHUB_TOKEN
  
  if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}  ❌ Token 为空，跳过部署${NC}"; return 1
  fi
  
  git remote set-url origin "https://${GITHUB_TOKEN}@github.com/Opennowing/jinan-travel-guide.git"
  
  # 验证
  if git ls-remote origin &>/dev/null; then
    echo -e "${GREEN}  ✓ Token 认证成功${NC}"
    # 保存到 git credential
    git config credential.helper store
    return 0
  else
    echo -e "${RED}  ❌ Token 认证失败，请检查${NC}"; return 1
  fi
}

# ── 构建 ──
build() {
  echo ""
  echo -e "${YELLOW}[3/5] 构建项目...${NC}"
  
  if [ ! -d "node_modules" ]; then
    echo -e "  安装依赖..."
    npm install 2>&1 | tail -3
  fi
  
  npx vite build 2>&1 | tail -5
  
  if [ ! -d "dist" ]; then
    echo -e "${RED}  ❌ 构建失败，dist/ 目录不存在${NC}"; exit 1
  fi
  
  local size=$(du -sh dist/ | cut -f1)
  echo -e "${GREEN}  ✓ 构建完成，dist/ 大小: ${size}${NC}"
}

# ── 推送 main 分支 ──
push_main() {
  echo ""
  echo -e "${YELLOW}[4/5] 推送 main 分支...${NC}"
  
  # 检查是否有未提交的更改
  if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "  发现未提交的更改，自动提交..."
    git add -A
    git commit -m "auto: 部署前自动提交 $(date +%Y-%m-%d_%H:%M)" 2>/dev/null || true
  fi
  
  git push origin main 2>&1
  echo -e "${GREEN}  ✓ main 分支已推送${NC}"
}

# ── 部署到 gh-pages ──
deploy_ghpages() {
  echo ""
  echo -e "${YELLOW}[5/5] 部署到 gh-pages...${NC}"
  
  # 创建临时分支
  local TEMP_BRANCH="gh-pages-deploy-$$"
  
  # 使用 git worktree 或 subtree 方式
  cd dist/
  git init
  git add -A
  git commit -m "deploy: $(date +%Y-%m-%d_%H:%M) $(cd .. && git log --oneline -1)"
  git branch -M gh-pages
  git remote add origin "$(cd .. && git remote get-url origin)" 2>/dev/null || \
    git remote set-url origin "$(cd .. && git remote get-url origin)"
  git push -f origin gh-pages 2>&1
  cd ..
  
  echo -e "${GREEN}  ✓ gh-pages 已部署${NC}"
}

# ── 完成 ──
done_msg() {
  echo ""
  echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║   ✅ 部署完成！                      ║${NC}"
  echo -e "${CYAN}║                                      ║${NC}"
  echo -e "${CYAN}║   🌐 线上地址:                       ║${NC}"
  echo -e "${CYAN}║   https://opennowing.github.io/      ║${NC}"
  echo -e "${CYAN}║       jinan-travel-guide/             ║${NC}"
  echo -e "${CYAN}║                                      ║${NC}"
  echo -e "${CYAN}║   📝 后续更新只需运行:               ║${NC}"
  echo -e "${CYAN}║   bash deploy.sh                     ║${NC}"
  echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
}

# ── 主流程 ──
check_env
if check_auth; then
  build
  push_main
  deploy_ghpages
  done_msg
else
  echo -e "${RED}认证失败，无法部署${NC}"
  exit 1
fi
