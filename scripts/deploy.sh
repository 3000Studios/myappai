#!/usr/bin/env bash
set -e

echo "Deploying myappai..."

cd /workspace/myappai

npm run build

git add .
git commit -m "deploy update"
git push

echo "Deployment pushed to Cloudflare Pages"
