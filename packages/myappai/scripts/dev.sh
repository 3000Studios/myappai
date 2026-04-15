#!/usr/bin/env bash
set -e

echo "Starting myappai development environment"

cd /workspace/myappai

npm install

if [ -f requirements.txt ]; then
pip install -r requirements.txt
fi

npm run dev
