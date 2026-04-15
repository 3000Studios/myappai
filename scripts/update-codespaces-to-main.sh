#!/usr/bin/env bash
# Non-destructive: attempts to fast-forward 'main' inside each Codespace
# Requires: the repository admin runs this locally with an account that can list & exec into codespaces and with jq installed.
set -euo pipefail

REPO="3000Studios/3000studios-next"

echo "Listing codespaces for repo: $REPO"
codespaces_json=$(gh codespace list --repo "$REPO" --json name,branch --limit 500)
if [ -z "$codespaces_json" ] || [ "$codespaces_json" = "[]" ]; then
  echo "No codespaces returned for $REPO"
  exit 0
fi

echo "$codespaces_json" | jq -c '.[]' | while read -r cs; do
  name=$(echo "$cs" | jq -r '.name')
  branch=$(echo "$cs" | jq -r '.branch')
  echo "Processing codespace: $name (branch: $branch)"

  gh codespace exec -c "$name" -- bash -lc '
    set -euo pipefail
    git remote show origin >/dev/null 2>&1 || { echo "No origin remote"; exit 0; }
    git fetch origin main
    if git rev-parse --verify main >/dev/null 2>&1; then
      git checkout main
    else
      git checkout -b main
    fi
    if git merge --ff-only origin/main; then
      echo "Fast-forwarded main in codespace: '"$name"'"
    else
      echo "Could not fast-forward main in codespace: '"$name"'. Manual intervention may be required."
    fi
  '
done

echo "Done."
