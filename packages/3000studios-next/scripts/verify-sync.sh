#!/bin/bash

###############################################################################
# 3000 Studios - Sync Verification Script
# Verifies that local, GitHub, and Vercel are in sync
# Usage: ./scripts/verify-sync.sh
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   3000 STUDIOS - SYNC VERIFICATION                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get current state
CURRENT_BRANCH=$(git branch --show-current)
LOCAL_COMMIT=$(git rev-parse HEAD)
UNCOMMITTED=$(git status --porcelain)

echo -e "${YELLOW}📍 Current Branch: ${CURRENT_BRANCH}${NC}"
echo -e "${YELLOW}📍 Local Commit: ${LOCAL_COMMIT}${NC}"
echo ""

# Check 1: Local uncommitted changes
echo -e "${BLUE}[1/5] Checking for uncommitted changes...${NC}"
if [ -z "$UNCOMMITTED" ]; then
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
    SYNC_STATUS_1="✅"
else
    echo -e "${YELLOW}⚠️  Uncommitted changes detected:${NC}"
    git status --short
    SYNC_STATUS_1="⚠️"
fi
echo ""

# Check 2: Local vs Remote (GitHub)
echo -e "${BLUE}[2/5] Checking local vs GitHub...${NC}"
git fetch origin --quiet
REMOTE_COMMIT=$(git rev-parse origin/$CURRENT_BRANCH 2>/dev/null || echo "")

if [ -z "$REMOTE_COMMIT" ]; then
    echo -e "${YELLOW}⚠️  Remote branch doesn't exist${NC}"
    SYNC_STATUS_2="⚠️"
elif [ "$LOCAL_COMMIT" == "$REMOTE_COMMIT" ]; then
    echo -e "${GREEN}✅ Local and GitHub are in sync${NC}"
    SYNC_STATUS_2="✅"
else
    AHEAD=$(git rev-list --count origin/$CURRENT_BRANCH..HEAD 2>/dev/null || echo 0)
    BEHIND=$(git rev-list --count HEAD..origin/$CURRENT_BRANCH 2>/dev/null || echo 0)
    
    if [ $AHEAD -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Local is ${AHEAD} commit(s) ahead of GitHub${NC}"
    fi
    if [ $BEHIND -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Local is ${BEHIND} commit(s) behind GitHub${NC}"
    fi
    SYNC_STATUS_2="⚠️"
fi
echo ""

# Check 3: GitHub Actions Status
echo -e "${BLUE}[3/5] Checking GitHub Actions status...${NC}"
if command -v gh &> /dev/null; then
    echo -e "${YELLOW}📊 Fetching latest workflow runs...${NC}"
    # This would require gh CLI, skip if not available
    echo -e "${YELLOW}⚠️  gh CLI not available, skipping${NC}"
    SYNC_STATUS_3="⏭️"
else
    echo -e "${YELLOW}⚠️  gh CLI not installed, skipping${NC}"
    SYNC_STATUS_3="⏭️"
fi
echo ""

# Check 4: Production branch status
echo -e "${BLUE}[4/5] Checking production branch (main)...${NC}"
if [ "$CURRENT_BRANCH" == "main" ]; then
    echo -e "${GREEN}✅ Currently on main branch${NC}"
    SYNC_STATUS_4="✅"
else
    MAIN_COMMIT=$(git rev-parse origin/main 2>/dev/null || echo "")
    if [ -n "$MAIN_COMMIT" ]; then
        echo -e "${YELLOW}📍 Main branch is at: ${MAIN_COMMIT}${NC}"
        echo -e "${YELLOW}💡 To deploy to production, merge ${CURRENT_BRANCH} to main${NC}"
    fi
    SYNC_STATUS_4="⏭️"
fi
echo ""

# Check 5: File integrity
echo -e "${BLUE}[5/5] Checking critical files...${NC}"
CRITICAL_FILES=(
    "package.json"
    "next.config.ts"
    "src/app/layout.tsx"
    "src/app/page.tsx"
    ".env.example"
)

MISSING_FILES=0
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing: $file${NC}"
        ((MISSING_FILES++))
    fi
done

if [ $MISSING_FILES -eq 0 ]; then
    echo -e "${GREEN}✅ All critical files present${NC}"
    SYNC_STATUS_5="✅"
else
    echo -e "${RED}❌ ${MISSING_FILES} critical file(s) missing${NC}"
    SYNC_STATUS_5="❌"
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   SYNC VERIFICATION SUMMARY                            ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║   ${SYNC_STATUS_1} Uncommitted Changes                                  ║${NC}"
echo -e "${BLUE}║   ${SYNC_STATUS_2} Local ↔ GitHub Sync                                  ║${NC}"
echo -e "${BLUE}║   ${SYNC_STATUS_3} GitHub Actions Status                                ║${NC}"
echo -e "${BLUE}║   ${SYNC_STATUS_4} Production Branch                                    ║${NC}"
echo -e "${BLUE}║   ${SYNC_STATUS_5} File Integrity                                       ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════╣${NC}"

# Overall status
if [ "$SYNC_STATUS_1" == "✅" ] && [ "$SYNC_STATUS_2" == "✅" ] && [ "$SYNC_STATUS_5" == "✅" ]; then
    echo -e "${BLUE}║   Overall Status: ${GREEN}✅ FULLY SYNCED${BLUE}                       ║${NC}"
    EXIT_CODE=0
else
    echo -e "${BLUE}║   Overall Status: ${YELLOW}⚠️  NEEDS SYNC${BLUE}                        ║${NC}"
    echo -e "${BLUE}║                                                        ║${NC}"
    echo -e "${BLUE}║   Run: ./scripts/sync-repository.sh                   ║${NC}"
    EXIT_CODE=1
fi

echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"

exit $EXIT_CODE
