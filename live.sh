#!/bin/bash
# ══════════════════════════════════════
# 济南旅游攻略 · 开发 + 自动部署
# ══════════════════════════════════════
# 用法: bash live.sh
# 功能: 启动开发服务器 + 文件变更时自动构建部署

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

# 检查认证
AUTH_OK=false
if git ls-remote origin &>/dev/null 2>&1; then
  AUTH_OK=true
  echo -e "${GREEN}  ✓ GitHub 认证已配置，自动部署已启用${NC}"
else
  echo -e "${YELLOW}  ⚠ GitHub 未认证，仅本地开发模式${NC}"
fi
echo ""

# 启动 Vite 开发服务器（后台）
npx vite --host &
VITE_PID=$!

# 等待 Vite 启动
sleep 2

# 文件监控 + 自动部署
LAST_BUILD=0
DEBOUNCE=5  # 5秒防抖

monitor_files() {
  if command -v inotifywait &>/dev/null; then
    # Linux: 用 inotifywait
    while inotifywait -r -e modify,create,delete,move \
      --exclude 'node_modules|dist|\.git' \
      --include '\.(html|js|css|json)$' \
      . 2>/dev/null; do
      
      NOW=$(date +%s)
      DIFF=$((NOW - LAST_BUILD))
      if [ $DIFF -ge $DEBOUNCE ]; then
        LAST_BUILD=$NOW
        echo -e "\n${CYAN}[$(date +%H:%M:%S)] 文件变更检测到，构建中...${NC}"
        npx vite build 2>&1 | tail -1
        
        if [ "$AUTH_OK" = true ]; then
          echo -e "${CYAN}[$(date +%H:%M:%S)] 部署中...${NC}"
          cd dist/
          ORIGIN_URL=$(cd .. && git remote get-url origin)
          git init -q && git add -A && git commit -q -m "auto: $(date +%H:%M:%S) 变更部署"
          git branch -M gh-pages
          git remote add origin "$ORIGIN_URL" 2>/dev/null || git remote set-url origin "$ORIGIN_URL"
          git push -fq origin gh-pages 2>/dev/null && \
            echo -e "${GREEN}[$(date +%H:%M:%S)] ✅ 已部署${NC}" || \
            echo -e "${YELLOW}[$(date +%H:%M:%S)] ⚠ 部署失败${NC}"
          cd ..
        fi
      fi
    done
  else
    # macOS/通用: 用轮询
    echo -e "${YELLOW}  使用轮询模式 (每10秒检查一次)${NC}"
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
          
          if [ "$AUTH_OK" = true ]; then
            cd dist/
            ORIGIN_URL=$(cd .. && git remote get-url origin)
            git init -q && git add -A && git commit -q -m "auto: $(date +%H:%M:%S) 变更部署"
            git branch -M gh-pages
            git remote add origin "$ORIGIN_URL" 2>/dev/null || git remote set-url origin "$ORIGIN_URL"
            git push -fq origin gh-pages 2>/dev/null && \
              echo -e "${GREEN}[$(date +%H:%M:%S)] ✅ 已部署${NC}" || \
              echo -e "${YELLOW}[$(date +%H:%M:%S)] ⚠ 部署失败${NC}"
            cd ..
          fi
        fi
      fi
    done
  fi
}

# 捕获 Ctrl+C
trap "echo -e '\n${YELLOW}停止中...${NC}'; kill $VITE_PID 2>/dev/null; exit 0" INT TERM

monitor_files
