#!/bin/bash
# ══════════════════════════════════════
# 济南旅游攻略 · 部署环境检测
# 检测认证方式并输出配置摘要
# ══════════════════════════════════════

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🔍 部署环境检测                    ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# 获取 remote URL（用于显示，需要脱敏）
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")

# 脱敏函数：隐藏 token
mask_url() {
  echo "$1" | sed 's#//[^@]*@#//***@#'
}

# 检测认证方式
AUTH_METHOD="none"
AUTH_STATUS="${RED}未配置${NC}"

# 1. 检查 GITHUB_TOKEN 环境变量
if [ -n "$GITHUB_TOKEN" ]; then
  AUTH_METHOD="token"
  AUTH_STATUS="${GREEN}Token (环境变量)${NC}"
  MASKED="${GITHUB_TOKEN:0:4}****${GITHUB_TOKEN: -4}"
  echo -e "${GREEN}  ✓ GITHUB_TOKEN 已设置: ${MASKED}${NC}"
fi

# 2. 检查 SSH Key
if [ "$AUTH_METHOD" = "none" ]; then
  SSH_KEY=""
  [ -f "$HOME/.ssh/id_ed25519" ] && SSH_KEY="$HOME/.ssh/id_ed25519"
  [ -f "$HOME/.ssh/id_rsa" ] && SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_rsa}"

  if [ -n "$SSH_KEY" ]; then
    if ssh -T git@github.com 2>&1 | grep -q "successfully"; then
      AUTH_METHOD="ssh"
      AUTH_STATUS="${GREEN}SSH Key${NC}"
      echo -e "${GREEN}  ✓ SSH Key 可用 ($SSH_KEY)${NC}"
    else
      echo -e "${YELLOW}  ⚠ SSH Key 存在但 GitHub 验证失败${NC}"
    fi
  fi
fi

# 3. 检查 remote URL 中是否嵌入了 token
if [ "$AUTH_METHOD" = "none" ] && [ -n "$REMOTE_URL" ]; then
  if echo "$REMOTE_URL" | grep -qE 'ghp_|gho_|github_pat_'; then
    AUTH_METHOD="embedded"
    AUTH_STATUS="${GREEN}Token (嵌入 URL)${NC}"
    echo -e "${GREEN}  ✓ Remote URL 中包含 Token${NC}"
  fi
fi

# 4. 检查 git credential（仅 HTTPS remote）
if [ "$AUTH_METHOD" = "none" ] && echo "$REMOTE_URL" | grep -q '^https'; then
  if git ls-remote origin &>/dev/null 2>&1; then
    AUTH_METHOD="credential"
    AUTH_STATUS="${GREEN}Git Credential${NC}"
    echo -e "${GREEN}  ✓ Git Credential Store 可用${NC}"
  fi
fi

# 5. 尝试 SSH（即使没有标准 key 文件，可能有 agent 或 config）
if [ "$AUTH_METHOD" = "none" ]; then
  if ssh -T git@github.com 2>&1 | grep -q "successfully"; then
    AUTH_METHOD="ssh"
    AUTH_STATUS="${GREEN}SSH Agent${NC}"
    echo -e "${GREEN}  ✓ SSH Agent 认证可用${NC}"
  fi
fi

if [ "$AUTH_METHOD" = "none" ]; then
  echo -e "${RED}  ❌ 未检测到任何 GitHub 认证方式${NC}"
  echo ""
  echo -e "${YELLOW}  请选择认证方式:${NC}"
  echo ""
  echo -e "  ${CYAN}方式 1: 设置 GITHUB_TOKEN 环境变量${NC}"
  echo -e "    export GITHUB_TOKEN=ghp_xxxxxxxxxxxx"
  echo -e "    申请地址: https://github.com/settings/tokens/new"
  echo -e "    权限: repo (全部)"
  echo ""
  echo -e "  ${CYAN}方式 2: 使用 SSH Key${NC}"
  echo -e "    ssh-keygen -t ed25519 -C 'your@email.com'"
  echo -e "    然后添加公钥到: https://github.com/settings/keys"
  echo ""
  echo -e "  ${CYAN}方式 3: 运行 deploy.sh --token <TOKEN>${NC}"
  echo ""
fi

# 配置摘要
echo ""
echo -e "${CYAN}──────────── 配置摘要 ────────────${NC}"
echo -e "  项目目录:  ${PROJECT_DIR}"
echo -e "  Remote:    $(mask_url "$REMOTE_URL")"
echo -e "  Git User:  $(git config user.name 2>/dev/null || echo '未设置') <$(git config user.email 2>/dev/null || echo '未设置')>"
echo -e "  认证方式:  $(echo -e "$AUTH_STATUS")"
echo -e "  Node:      $(node -v 2>/dev/null || echo '未安装')"
echo -e "  构建工具:  $(npx vite --version 2>/dev/null || echo '未安装')"
echo -e "${CYAN}────────────────────────────────────${NC}"

if [ "$AUTH_METHOD" != "none" ]; then
  echo ""
  echo -e "${GREEN}  ✅ 环境就绪，可以运行 bash deploy.sh${NC}"
  exit 0
else
  exit 1
fi
