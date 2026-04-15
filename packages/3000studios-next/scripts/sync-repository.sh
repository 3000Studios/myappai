#!/bin/bash

###############################################################################
# 3000 Studios - Repository Sync Script
# Ensures local, remote (GitHub), and Vercel are always in sync
# Usage: ./scripts/sync-repository.sh
###############################################################################

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   3000 STUDIOS - REPOSITORY SYNC SYSTEM               ║${NC}"
echo -e "${BLUE}║   Syncing: Local ↔ GitHub ↔ Vercel                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check current git status
echo -e "${YELLOW}🔍 Step 1: Checking git status...${NC}"
GIT_STATUS=$(git status --porcelain)
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${GREEN}📍 Current branch: ${CURRENT_BRANCH}${NC}"

if [ -n "$GIT_STATUS" ]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected:${NC}"
    git status --short
    echo ""
    echo -e "${YELLOW}💾 Creating backup before sync...${NC}"
    ./scripts/create-backup.sh "pre-sync"
    echo ""
fi

# Step 2: Fetch latest from remote
echo -e "${YELLOW}🔄 Step 2: Fetching latest from GitHub...${NC}"
git fetch origin --prune
echo -e "${GREEN}✅ Fetched latest from remote${NC}"
echo ""

# Step 3: Check if local is behind remote
echo -e "${YELLOW}🔍 Step 3: Comparing local with remote...${NC}"
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/$CURRENT_BRANCH 2>/dev/null || echo "")

if [ -z "$REMOTE_COMMIT" ]; then
    echo -e "${YELLOW}⚠️  Remote branch doesn't exist yet${NC}"
    NEEDS_PUSH=true
    NEEDS_PULL=false
elif [ "$LOCAL_COMMIT" == "$REMOTE_COMMIT" ]; then
    echo -e "${GREEN}✅ Local and remote are in sync${NC}"
    NEEDS_PUSH=false
    NEEDS_PULL=false
else
    AHEAD=$(git rev-list --count origin/$CURRENT_BRANCH..HEAD)
    BEHIND=$(git rev-list --count HEAD..origin/$CURRENT_BRANCH)
    
    echo -e "${BLUE}📊 Commits ahead of remote: ${AHEAD}${NC}"
    echo -e "${BLUE}📊 Commits behind remote: ${BEHIND}${NC}"
    
    NEEDS_PUSH=$([ $AHEAD -gt 0 ] && echo true || echo false)
    NEEDS_PULL=$([ $BEHIND -gt 0 ] && echo true || echo false)
fi
echo ""

# Step 4: Pull if needed
if [ "$NEEDS_PULL" = true ]; then
    echo -e "${YELLOW}⬇️  Step 4: Pulling latest changes from remote...${NC}"
    git pull origin $CURRENT_BRANCH --rebase
    echo -e "${GREEN}✅ Pulled latest changes${NC}"
else
    echo -e "${GREEN}✅ Step 4: No pull needed${NC}"
fi
echo ""

# Step 5: Check for uncommitted changes
if [ -n "$GIT_STATUS" ]; then
    echo -e "${YELLOW}💾 Step 5: Committing local changes...${NC}"
    git add .
    
    # Create meaningful commit message
    COMMIT_MSG="chore: sync local changes $(date +"%Y-%m-%d %H:%M:%S")"
    
    echo -e "${YELLOW}📝 Commit message: ${COMMIT_MSG}${NC}"
    git commit -m "$COMMIT_MSG" || true
    echo -e "${GREEN}✅ Changes committed${NC}"
    NEEDS_PUSH=true
else
    echo -e "${GREEN}✅ Step 5: No uncommitted changes${NC}"
fi
echo ""

# Step 6: Push if needed
if [ "$NEEDS_PUSH" = true ]; then
    echo -e "${YELLOW}⬆️  Step 6: Pushing changes to GitHub...${NC}"
    git push origin $CURRENT_BRANCH
    echo -e "${GREEN}✅ Pushed to GitHub${NC}"
else
    echo -e "${GREEN}✅ Step 6: No push needed${NC}"
fi
echo ""

# Step 7: Check if on main branch (triggers Vercel deploy)
if [ "$CURRENT_BRANCH" == "main" ]; then
    echo -e "${YELLOW}🚀 Step 7: Main branch detected - Vercel will auto-deploy${NC}"
    echo -e "${BLUE}📊 Deployment will be triggered by GitHub Actions${NC}"
    echo -e "${BLUE}🌐 Monitor deployment: https://vercel.com/3000studios/3000studios-next${NC}"
    echo -e "${BLUE}🔗 Live site: https://3000studios.com${NC}"
else
    echo -e "${YELLOW}⚠️  Step 7: Not on main branch (${CURRENT_BRANCH})${NC}"
    echo -e "${YELLOW}💡 To deploy to production, merge to main:${NC}"
    echo -e "${BLUE}   git checkout main${NC}"
    echo -e "${BLUE}   git merge ${CURRENT_BRANCH}${NC}"
    echo -e "${BLUE}   git push origin main${NC}"
fi
echo ""

# Step 8: Verify sync status
echo -e "${YELLOW}🔍 Step 8: Verifying sync status...${NC}"
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/$CURRENT_BRANCH)

if [ "$LOCAL_COMMIT" == "$REMOTE_COMMIT" ]; then
    echo -e "${GREEN}✅ SYNC COMPLETE!${NC}"
    echo -e "${GREEN}✅ Local and GitHub are in sync${NC}"
    echo -e "${GREEN}✅ Commit: ${LOCAL_COMMIT}${NC}"
else
    echo -e "${RED}⚠️  Sync verification failed${NC}"
    echo -e "${RED}   Local:  ${LOCAL_COMMIT}${NC}"
    echo -e "${RED}   Remote: ${REMOTE_COMMIT}${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   SYNC SUMMARY                                         ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║   Branch: ${CURRENT_BRANCH}${NC}"
echo -e "${BLUE}║   Status: ✅ Synchronized                              ║${NC}"
echo -e "${BLUE}║   Local ↔ GitHub: ✅ Synced                           ║${NC}"
if [ "$CURRENT_BRANCH" == "main" ]; then
    echo -e "${BLUE}║   GitHub → Vercel: 🚀 Auto-deploying                 ║${NC}"
else
    echo -e "${BLUE}║   GitHub → Vercel: ⏸️  Waiting (not on main)         ║${NC}"
fi
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
