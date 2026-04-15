#!/bin/bash

###############################################################################
# Vercel Environment Variable Fix Script
# Fixes NEXT_PUBLIC_SITE_URL circular reference issue
# Usage: ./scripts/fix-vercel-env.sh
###############################################################################

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   VERCEL ENVIRONMENT VARIABLE FIX                      ║${NC}"
echo -e "${BLUE}║   Fixing NEXT_PUBLIC_SITE_URL circular reference       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    echo -e "${YELLOW}💡 Install with: npm install -g vercel${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI found${NC}"
echo ""

# Step 1: Check current authentication
echo -e "${YELLOW}🔐 Step 1: Checking authentication...${NC}"
VERCEL_USER=$(vercel whoami 2>&1 || echo "")
if [ -z "$VERCEL_USER" ] || [[ "$VERCEL_USER" == *"Error"* ]]; then
    echo -e "${RED}❌ Not authenticated with Vercel${NC}"
    echo -e "${YELLOW}💡 Run: vercel login${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Authenticated as: ${VERCEL_USER}${NC}"
echo ""

# Step 2: List current environment variables
echo -e "${YELLOW}📋 Step 2: Checking current environment variables...${NC}"
echo -e "${BLUE}Current variables:${NC}"
vercel env ls || true
echo ""

# Step 3: Remove broken reference
echo -e "${YELLOW}🗑️  Step 3: Removing NEXT_PUBLIC_SITE_URL (if exists)...${NC}"
vercel env rm NEXT_PUBLIC_SITE_URL production --yes 2>&1 || echo -e "${YELLOW}⚠️  Variable may not exist (that's okay)${NC}"
echo -e "${GREEN}✅ Removed old reference${NC}"
echo ""

# Step 4: Add correct value
echo -e "${YELLOW}➕ Step 4: Adding NEXT_PUBLIC_SITE_URL with literal value...${NC}"
echo -e "${BLUE}ℹ️  When prompted:${NC}"
echo -e "${BLUE}   - Enter: https://3000studios.com${NC}"
echo -e "${BLUE}   - Mark as sensitive? NO${NC}"
echo ""

# Use echo to provide the value
echo "https://3000studios.com" | vercel env add NEXT_PUBLIC_SITE_URL production

echo -e "${GREEN}✅ Added NEXT_PUBLIC_SITE_URL${NC}"
echo ""

# Step 5: Verify
echo -e "${YELLOW}🔍 Step 5: Verifying environment variables...${NC}"
vercel env ls
echo ""

# Step 6: Deploy
echo -e "${YELLOW}🚀 Step 6: Ready to deploy?${NC}"
read -p "Deploy to production now? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🚀 Deploying to production...${NC}"
    vercel --prod --yes
    echo -e "${GREEN}✅ Deployment complete!${NC}"
else
    echo -e "${YELLOW}⏸️  Skipped deployment${NC}"
    echo -e "${BLUE}💡 Deploy manually with: vercel --prod --yes${NC}"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   FIX COMPLETE                                         ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║   ✅ NEXT_PUBLIC_SITE_URL fixed                        ║${NC}"
echo -e "${BLUE}║   ✅ Using literal value (not secret reference)        ║${NC}"
echo -e "${BLUE}║   ✅ Ready for deployment                              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
