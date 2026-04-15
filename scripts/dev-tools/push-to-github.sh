#!/bin/bash
# 3000 Studios - Push to GitHub Script
# This script pushes the verified and ready changes to GitHub

echo "🚀 3000 Studios - Pushing Deployment-Ready Changes"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

# Check if we're on the right branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "copilot/check-ui-links-and-deploy" ]; then
    echo "⚠️  Warning: Not on expected branch (current: $CURRENT_BRANCH)"
fi

# Show what will be pushed
echo "📋 Commits to be pushed:"
git log origin/copilot/check-ui-links-and-deploy..HEAD --oneline
echo ""

echo "📁 Files changed:"
git diff origin/copilot/check-ui-links-and-deploy --stat
echo ""

# Confirm
echo "🤔 Ready to push these changes to GitHub?"
read -p "Press Enter to continue or Ctrl+C to cancel... "

# Push to GitHub
echo ""
echo "⬆️  Pushing to GitHub..."
git push origin copilot/check-ui-links-and-deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Changes pushed to GitHub"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Import the repository"
    echo "3. Deploy to production"
    echo "4. Your site will be live! 🚀"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo ""
    echo "❌ Push failed. Check your GitHub credentials and try again."
    exit 1
fi
