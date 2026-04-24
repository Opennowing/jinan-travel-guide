#!/bin/bash
# ══════════════════════════════════════
# 济南旅游攻略 · 开发 + 自动部署
# 用法: bash live.sh
# ══════════════════════════════════════

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🏛️ 济南旅游攻略 · Live 模式       ║${NC}"
echo -e "${CYAN}║   开发 + 自动部署                    ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "  🌐 开发服务器: http://localhost:3000"
echo -e "  📦 保存文件 → 自动构建 → 自动部署"
echo -e "  按 Ctrl+C 停止"
echo ""

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# 检查认证
AUTH_OK=false
if git ls-remote origin &>/dev/null 2>&1; then
  AUTH_OK=true
  echo -e "${GREEN}  ✓ GitHub 认证已配置，自动部署已启用${NC}"
else
  echo -e "${YELLOW}  ⚠ GitHub 未认证，仅本地开发模式${NC}"
  echo -e "${YELLOW}  提示: 运行 bash deploy-env.sh 配置认证${NC}"
fi

# 部署函数 — 统一处理 dist/ git 配置
deploy_dist() {
  if [ "$AUTH_OK" != true ]; then return; fi

  cd "$PROJECT_DIR/dist/"

  # 获取父仓库信息
  ORIGIN_URL=$(cd "$PROJECT_DIR" && git remote get-url origin 2>/dev/null)
  GIT_NAME=$(cd "$PROJECT_DIR" && git config user.name 2>/dev/null || echo "Deploy Bot")
  GIT_EMAIL=$(cd "$PROJECT_DIR" && git config user.email 2>/dev/null || echo "bot@deploy.local")

  git init -q
  git config user.name "$GIT_NAME"
  git config user.email "$GIT_EMAIL"
  git add -A
  git commit -q -m "auto: $(date +%H:%M:%S) 变更部署" 2>/dev/null || true
  git branch -M gh-pages
  git remote add origin "$ORIGIN_URL" 2>/dev/null || git remote set-url origin "$ORIGIN_URL"

  if git push -fq origin gh-pages 2>/dev/null; then
    echo -e "${GREEN}[$(date +%H:%M:%S)] ✅ 已部署${NC}"
    echo -e "${GREEN}  🌐 https://opennowing.github.io/jinan-travel-guide/${NC}"
  else
    echo -e "${YELLOW}[$(date +%H:%M:%S)] ⚠ 部署失败${NC}"
  fi

  cd "$PROJECT_DIR"
}

# 启动 Vite 开发服务器
npx vite --host &
VITE_PID=$!
sleep 2

# 文件监控 + 自动部署
LAST_BUILD=0
DEBOUNCE=5

monitor_files() {
  if command -v inotifywait &>/dev/null; then
    while inotifywait -r -e modify,create,delete,move \
      --exclude 'node_modules|dist|\.git' \
      --include '\.(html|js|css|json)$' \
      . 2>/dev/null; do

      NOW=$(date +%s)
      DIFF=$((NOW - LAST_BUILD))
      if [ $DIFF -ge $DEBOUNCE ]; then
        LAST_BUILD=$NOW
        echo -e "\n${CYAN}[$(date +%H:%M:%S)] 文件变更，构建中...${NC}"
        npx vite build 2>&1 | tail -1
        deploy_dist
      fi
    done
  else
    echo -e "${YELLOW}  使用轮询模式 (每10秒检查)${NC}"
    while true; do
      sleep 10
      CHANGED=$(find . -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.json' \
        -newer dist/index.html \
        ! -path './node_modules/*' ! -path './dist/*' ! -path './.git/*' 2>/dev/null | head -1)

      if [ -n "$CHANGED" ]; then
        NOW=$(date +%s)
        DIFF=$((NOW - LAST_BUILD))
        if [ $DIFF -ge $DEBOUNCE ]; then
          LAST_BUILD=$NOW
          echo -e "\n${CYAN}[$(date +%H:%M:%S)] 文件变更: ${CHANGED}${NC}"
          npx vite build 2>&1 | tail -1
          deploy_dist
        fi
      fi
    done
  fi
}

trap "echo -e '\n${YELLOW}停止中...${NC}'; kill $VITE_PID 2>/dev/null; exit 0" INT TERM
monitor_files
