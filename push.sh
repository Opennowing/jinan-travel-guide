#!/bin/bash
# ══════════════════════════════════════
# 快速提交 + 自动部署
# ══════════════════════════════════════
# 用法: bash push.sh "commit message"

MSG="${1:-update: $(date +%m-%d_%H:%M)}"

git add -A
git commit -m "$MSG"

# post-commit hook 会自动触发构建和部署
echo ""
echo "📝 Commit: $MSG"
echo "⏳ post-commit hook 将自动构建并部署..."
