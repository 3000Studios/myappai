#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/_audit/env"
TMP="/tmp/env-audit-$$"

mkdir -p "$OUT"
mkdir -p "$TMP"

echo "🔍 Scanning repo for environment variables..."

# Raw scan → TEMP ONLY (never committed)
if command -v rg >/dev/null 2>&1; then
  rg -n --no-heading --hidden --glob '!.git/**' --glob '!node_modules/**' \
    -e 'process\.env\.[A-Z0-9_]+' \
    -e 'process\.env\[\s*["\'"'][A-Z0-9_]+["\'"']\s*\]' \
    -e 'NEXT_PUBLIC_[A-Z0-9_]+' \
    "$ROOT" | sed -E 's/.*process\.env\.([A-Z0-9_]+).*/\1/;t; s/.*\b(NEXT_PUBLIC_[A-Z0-9_]+)\b.*/\1/' | sort -u > "$TMP/raw_vars.txt"
else
  git -C "$ROOT" grep -n -I -E 'process\.env\.[A-Z0-9_]+|NEXT_PUBLIC_[A-Z0-9_]+' -- . \
    | sed -E 's/.*process\.env\.([A-Z0-9_]+).*/\1/;t; s/.*\b(NEXT_PUBLIC_[A-Z0-9_]+)\b.*/\1/' | sort -u > "$TMP/raw_vars.txt" || true
fi

# CSV inventory (safe, small)
{
  echo "variable,source"
  awk '{print $0 ",code"}' "$TMP/raw_vars.txt"
} > "$OUT/env_required.csv"

# Optional diagnostics (small, safe)
head -n 500 "$TMP/raw_vars.txt" > "$OUT/raw_preview.txt"

rm -rf "$TMP"

echo "✅ Env audit complete"
echo "• Raw scan kept in /tmp"
echo "• CSV summaries written to _audit/env"
