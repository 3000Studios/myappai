#!/bin/bash
# Auto-commit script for 3000Studios

while true; do
  if [[ -n $(git status -s) ]]; then
    echo "Changes detected, auto-committing..."
    git add .
    git commit -m "🤖 Auto-commit: $(date)"
    git push origin main
  fi
  sleep 300 # Wait for 5 minutes
done
