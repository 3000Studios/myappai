#!/usr/bin/env bash

# Git Pre-Push Hook
# This hook runs before pushing to remote to validate code quality
# Helps catch issues before they reach the protected branch

set -e

echo "🔍 Running pre-push validation..."

# Get the branch being pushed to
current_branch=$(git branch --show-current)
remote_ref="$2"

# Extract target branch name
if [[ "$remote_ref" == *"main"* ]]; then
  echo ""
  echo "⚠️  WARNING: Attempting to push to 'main' branch"
  echo ""
  echo "The main branch is protected. Direct pushes are blocked by GitHub."
  echo ""
  echo "Please follow the proper workflow:"
  echo "  1. Create a feature branch: git checkout -b feature/my-changes"
  echo "  2. Push your feature branch: git push origin feature/my-changes"
  echo "  3. Open a Pull Request on GitHub"
  echo "  4. Wait for approval and CI checks"
  echo "  5. Merge via GitHub UI"
  echo ""
  
  # Ask for confirmation
  read -p "Do you want to continue anyway? (This will likely fail) [y/N]: " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Push cancelled"
    exit 1
  fi
fi

# Run validations
echo ""
echo "📋 Running code quality checks..."
echo ""

# 1. Check for TypeScript errors
echo "🔵 TypeScript validation..."
if command -v pnpm &> /dev/null; then
  pnpm type-check || {
    echo ""
    echo "❌ TypeScript validation failed"
    echo "Fix type errors before pushing"
    exit 1
  }
elif command -v npm &> /dev/null; then
  npm run type-check || {
    echo ""
    echo "❌ TypeScript validation failed"
    echo "Fix type errors before pushing"
    exit 1
  }
fi
echo "✅ TypeScript OK"
echo ""

# 2. Run linter
echo "🔵 ESLint validation..."
if command -v pnpm &> /dev/null; then
  pnpm lint || {
    echo ""
    echo "❌ Lint validation failed"
    echo "Fix linting errors before pushing"
    exit 1
  }
elif command -v npm &> /dev/null; then
  npm run lint || {
    echo ""
    echo "❌ Lint validation failed"
    echo "Fix linting errors before pushing"
    exit 1
  }
fi
echo "✅ ESLint OK"
echo ""

# 4. Check for large files
echo "🔵 Checking for large files..."
# Get list of files being pushed (compare with remote)
remote_ref=$(git rev-parse @{u} 2>/dev/null || echo "")
if [ -n "$remote_ref" ]; then
  compare_range="$remote_ref..HEAD"
else
  # If no upstream, check last commit
  compare_range="HEAD~1..HEAD"
fi

large_files=$(git diff --name-only --diff-filter=ACM $compare_range | while read file; do
  if [ -f "$file" ]; then
    size=$(wc -c < "$file")
    if [ $size -gt 5242880 ]; then  # 5MB
      echo "$file ($((size/1024/1024))MB)"
    fi
  fi
done)

if [ -n "$large_files" ]; then
  echo ""
  echo "⚠️  WARNING: Large files detected:"
  echo "$large_files"
  echo ""
  echo "Consider:"
  echo "  - Adding to .gitignore if it's a build artifact"
  echo "  - Using Git LFS for large binary files"
  echo "  - Compressing the file"
  echo ""
  read -p "Continue anyway? [y/N]: " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Push cancelled"
    exit 1
  fi
fi
echo "✅ No large files"
echo ""

# 4. Check for secrets
echo "🔵 Checking for potential secrets..."
secrets_patterns=(
  "PRIVATE.*KEY"
  "SECRET.*KEY"
  "API.*KEY"
  "PASSWORD"
  "TOKEN"
  "CREDENTIALS"
)

# Get list of files being pushed
remote_ref=$(git rev-parse @{u} 2>/dev/null || echo "")
if [ -n "$remote_ref" ]; then
  compare_range="$remote_ref..HEAD"
else
  compare_range="HEAD~1..HEAD"
fi

found_secrets=false
for pattern in "${secrets_patterns[@]}"; do
  if git diff $compare_range | grep -iE "$pattern" > /dev/null 2>&1; then
    if git diff $compare_range | grep -iE "$pattern" | grep -vE "(\.example|\.sample|\.md|\.txt|SETUP|README)" > /dev/null 2>&1; then
      echo "⚠️  Potential secret found matching pattern: $pattern"
      found_secrets=true
    fi
  fi
done

if [ "$found_secrets" = true ]; then
  echo ""
  echo "❌ Potential secrets detected in staged changes"
  echo ""
  echo "Please verify:"
  echo "  - Remove any actual secrets"
  echo "  - Use environment variables instead"
  echo "  - Add .env files to .gitignore"
  echo ""
  read -p "Continue anyway? (NOT RECOMMENDED) [y/N]: " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Push cancelled"
    exit 1
  fi
else
  echo "✅ No secrets detected"
fi
echo ""

echo "✅ All pre-push validations passed!"
echo ""
echo "🚀 Pushing to remote..."
echo ""

exit 0
