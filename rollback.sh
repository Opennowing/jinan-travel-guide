#!/usr/bin/env bash
# rollback.sh - gh-pages 回滚工具

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

usage() {
  echo ""
  echo "🔄 gh-pages 回滚工具"
  echo ""
  echo "用法:"
  echo "  bash rollback.sh                查看最近 5 次部署"
  echo "  bash rollback.sh <commit>       回滚到指定 commit"
  echo ""
  echo "示例:"
  echo "  bash rollback.sh abc1234        回滚到 commit abc1234"
  echo ""
}

show_history() {
  echo ""
  echo "📜 gh-pages 最近 5 次部署:"
  echo "────────────────────────────────────────"
  git log origin/gh-pages --oneline -5 --format='  %h  %s  (%cr)' 2>/dev/null || {
    echo "  ❌ 无法获取 gh-pages 历史"
    return 1
  }
  echo "────────────────────────────────────────"
  echo ""
  echo "使用 bash rollback.sh <commit-hash> 回滚到指定版本"
  echo ""
}

rollback() {
  local TARGET="$1"

  # 验证 commit 是否存在于 gh-pages
  if ! git cat-file -e "origin/gh-pages:$TARGET" 2>/dev/null && \
     ! git merge-base --is-ancestor "$TARGET" origin/gh-pages 2>/dev/null; then
    # 尝试在 gh-pages 分支中查找
    if ! git log origin/gh-pages --oneline | grep -q "^${TARGET}"; then
      echo "❌ commit ${TARGET} 在 gh-pages 分支中未找到"
      echo ""
      echo "可用的 commit:"
      git log origin/gh-pages --oneline -5
      exit 1
    fi
  fi

  echo ""
  echo "🔄 准备回滚到 ${TARGET}"
  echo ""

  # 备份当前 gh-pages HEAD
  BACKUP_BRANCH="gh-pages-backup-$(date +%Y%m%d-%H%M%S)"
  echo "📦 创建备份分支: ${BACKUP_BRANCH}"
  git branch "$BACKUP_BRANCH" origin/gh-pages 2>/dev/null || {
    echo "⚠️  备份分支创建失败（可能已存在），继续..."
  }

  # 获取 gh-pages 上该 commit 的 tree
  echo "🚀 强制回滚 gh-pages 到 ${TARGET}..."
  
  # 切换到 gh-pages 并 reset
  git fetch origin gh-pages
  git checkout gh-pages 2>/dev/null || git checkout -b gh-pages origin/gh-pages
  git reset --hard "$TARGET"
  git push origin gh-pages --force

  echo ""
  echo "✅ 回滚完成!"
  echo "   目标: ${TARGET}"
  echo "   备份: ${BACKUP_BRANCH}"
  echo ""
  echo "如需恢复: git push origin ${BACKUP_BRANCH}:gh-pages --force"
  echo ""

  # 切回原分支
  ORIGINAL_BRANCH=$(git branch --show-current 2>/dev/null || git rev-parse --abbrev-ref HEAD)
  if [ "$ORIGINAL_BRANCH" = "gh-pages" ]; then
    git checkout main 2>/dev/null || true
  fi
}

# 主逻辑
case "${1:-}" in
  -h|--help|"")
    if [ -z "${1:-}" ]; then
      show_history
    else
      usage
    fi
    ;;
  *)
    rollback "$1"
    ;;
esac
