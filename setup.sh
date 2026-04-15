#!/usr/bin/env bash
set -e

echo "Initializing myappai environment..."

cd /workspace/myappai

echo "Updating container..."
apt-get update -y

echo "Installing tools..."
apt-get install -y \
git \
curl \
wget \
build-essential \
jq \
unzip

echo "Installing node tools..."
npm install -g \
pnpm \
yarn \
typescript \
tsx \
eslint \
prettier

echo "Installing project dependencies..."

if [ -f package.json ]; then
    npm install
    npm install --save-dev eslint prettier typescript tsx
fi

if [ -f requirements.txt ]; then
    pip install -r requirements.txt
fi

mkdir -p logs
mkdir -p temp
mkdir -p build

echo "Environment ready."
