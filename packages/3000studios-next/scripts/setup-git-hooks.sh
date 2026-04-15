#!/usr/bin/env bash

# Setup Git Hooks for Branch Protection
# This script installs git hooks that help enforce code quality before pushing

set -e

echo "🔧 Setting up Git hooks for branch protection..."
echo ""

# Ensure we're in the repository root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
  echo "❌ Error: Not in a git repository"
  exit 1
fi

# Get the git hooks directory
HOOKS_DIR="$REPO_ROOT/.git/hooks"

if [ ! -d "$HOOKS_DIR" ]; then
  echo "❌ Error: .git/hooks directory not found"
  echo "Make sure you're in the root of a git repository"
  exit 1
fi

# Install pre-push hook
PRE_PUSH_HOOK="$HOOKS_DIR/pre-push"
PRE_PUSH_SCRIPT="$REPO_ROOT/scripts/pre-push-hook.sh"

if [ ! -f "$PRE_PUSH_SCRIPT" ]; then
  echo "❌ Error: Pre-push script not found at $PRE_PUSH_SCRIPT"
  exit 1
fi

if [ -f "$PRE_PUSH_HOOK" ]; then
  echo "⚠️  Pre-push hook already exists"
  echo "Creating backup at $PRE_PUSH_HOOK.backup"
  mv "$PRE_PUSH_HOOK" "$PRE_PUSH_HOOK.backup"
fi

# Create symlink to our hook script
ln -s "$PRE_PUSH_SCRIPT" "$PRE_PUSH_HOOK"
chmod +x "$PRE_PUSH_HOOK"

echo "✅ Pre-push hook installed"
echo ""

# Verify installation
if [ -L "$PRE_PUSH_HOOK" ]; then
  echo "✅ Git hooks setup complete!"
  echo ""
  echo "The following validations will run before each push:"
  echo "  • TypeScript type checking"
  echo "  • ESLint validation"
  echo "  • Large file detection"
  echo "  • Secret detection"
  echo "  • Main branch push warning"
  echo ""
  echo "To bypass hooks (not recommended):"
  echo "  git push --no-verify"
  echo ""
else
  echo "❌ Hook installation failed"
  exit 1
fi

# Test if we can run the verification script
if command -v node &> /dev/null; then
  echo "📋 Additional commands available:"
  echo "  npm run verify-branch-protection - Check branch protection status"
  echo ""
fi

echo "🎉 Setup complete!"
