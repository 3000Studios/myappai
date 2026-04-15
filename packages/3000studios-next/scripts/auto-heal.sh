#!/bin/bash
# Auto-Heal Script
echo "🏥 Starting Auto-Heal Process..."

# Clean dependencies
if [ -d "node_modules" ]; then
  echo "🧹 Cleaning node_modules..."
  rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
  echo "🧹 Removing package-lock.json..."
  rm package-lock.json
fi

# Reinstall
echo "📦 Installing dependencies..."
npm install

# Fix Lint Errors
echo "✨ Auto-fixing lint errors..."
npm run lint:fix

# Build
echo "🏗️  Attempting build..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Auto-Heal Complete: System Healthy"
else
  echo "❌ Auto-Heal Failed: Build Error"
  exit 1
fi
