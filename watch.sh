#!/usr/bin/env bash
# watch.sh - 监听文件变更并自动构建
# 使用轮询方式（兼容 Linux/macOS），5秒防抖

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
EXTENSIONS="html|js|css|json"
POLL_INTERVAL=2
DEBOUNCE=5
LAST_BUILD=0
LAST_CHANGE=""

cd "$PROJECT_DIR"

if ! command -v npx &>/dev/null; then
  echo "❌ npx 未找到，请先安装 Node.js"
  exit 1
fi

echo "👀 文件监听已启动"
echo "   目录: $PROJECT_DIR"
echo "   监听: *.html *.js *.css *.json"
echo "   防抖: ${DEBOUNCE}s"
echo "   按 Ctrl+C 停止"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

get_snapshot() {
  find "$PROJECT_DIR" \
    -path '*/node_modules' -prune -o \
    -path '*/.git' -prune -o \
    -path '*/dist' -prune -o \
    -type f -regextype posix-extended \
    -regex ".*\.($EXTENSIONS)" \
    -printf '%T@ %p\n' 2>/dev/null | sort
}

now() { date +%s; }
fmt_time() { date '+%H:%M:%S'; }

OLD_SNAPSHOT=$(get_snapshot)

while true; do
  sleep "$POLL_INTERVAL"
  NEW_SNAPSHOT=$(get_snapshot)

  if [ "$OLD_SNAPSHOT" != "$NEW_SNAPSHOT" ]; then
    CHANGED=$(diff <(echo "$OLD_SNAPSHOT") <(echo "$NEW_SNAPSHOT") 2>/dev/null \
      | grep '^[<>]' \
      | sed 's|^.*/||' \
      | sort -u \
      | head -5)

    if [ -n "$CHANGED" ]; then
      CHANGE_TIME=$(fmt_time)
      echo ""
      echo "📝 [${CHANGE_TIME}] 检测到变更:"
      echo "$CHANGED" | while read -r f; do
        echo "   → $f"
      done

      LAST_CHANGE="$CHANGED"
      CURRENT=$(now)
      ELAPSED=$((CURRENT - LAST_BUILD))

      if [ "$ELAPSED" -ge "$DEBOUNCE" ]; then
        echo "🔨 [$(fmt_time)] 开始构建..."
        if npx vite build 2>&1 | tail -3; then
          echo "✅ [$(fmt_time)] 构建完成"
        else
          echo "❌ [$(fmt_time)] 构建失败"
        fi
        LAST_BUILD=$(now)
      else
        echo "⏳ 防抖中，${DEBOUNCE}s 后触发构建..."
        (
          sleep "$DEBOUNCE"
          CURRENT2=$(now)
          ELAPSED2=$((CURRENT2 - LAST_BUILD))
          if [ "$ELAPSED2" -ge "$DEBOUNCE" ]; then
            echo ""
            echo "🔨 [$(fmt_time)] 防抖结束，开始构建..."
            if npx vite build 2>&1 | tail -3; then
              echo "✅ [$(fmt_time)] 构建完成"
            else
              echo "❌ [$(fmt_time)] 构建失败"
            fi
            LAST_BUILD=$(now)
          fi
        ) &
      fi
    fi
    OLD_SNAPSHOT="$NEW_SNAPSHOT"
  fi
done
