#!/usr/bin/env bash
set -e

echo "🔒 HARDENING REPO..."
echo ""

echo "1️⃣ Fixing route structure..."
node scripts/autofix-routes.mjs

echo ""
echo "2️⃣ Validating app structure..."
node scripts/validate-app-structure.mjs

echo ""
echo "3️⃣ Visualizing routes..."
node scripts/visualize-routes.mjs

echo ""
echo "✅ REPO HARDENED. Safe to build."
