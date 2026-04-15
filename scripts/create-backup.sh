#!/bin/bash

###############################################################################
# 3000 Studios - Automated Backup System
# Creates timestamped backups before deployments or major changes
# Usage: ./scripts/create-backup.sh [backup-name]
###############################################################################

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="${1:-pre-deployment}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}_${TIMESTAMP}"

echo -e "${YELLOW}🔄 Creating backup: ${BACKUP_NAME}${NC}"

# Create backups directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup subdirectory
mkdir -p "$BACKUP_PATH"

echo -e "${GREEN}📁 Backup directory created: ${BACKUP_PATH}${NC}"

# Backup critical files and directories
echo -e "${YELLOW}📦 Backing up source code...${NC}"
cp -r src "$BACKUP_PATH/"

echo -e "${YELLOW}📦 Backing up configuration files...${NC}"
cp package.json "$BACKUP_PATH/" 2>/dev/null || true
cp pnpm-lock.yaml "$BACKUP_PATH/" 2>/dev/null || true
cp next.config.ts "$BACKUP_PATH/" 2>/dev/null || true
cp tsconfig.json "$BACKUP_PATH/" 2>/dev/null || true
cp tailwind.config.js "$BACKUP_PATH/" 2>/dev/null || true
cp .env.example "$BACKUP_PATH/" 2>/dev/null || true

echo -e "${YELLOW}📦 Backing up GitHub workflows...${NC}"
cp -r .github "$BACKUP_PATH/" 2>/dev/null || true

echo -e "${YELLOW}📦 Backing up public assets...${NC}"
cp -r public "$BACKUP_PATH/" 2>/dev/null || true

# Create backup manifest
echo -e "${YELLOW}📝 Creating backup manifest...${NC}"
cat > "$BACKUP_PATH/BACKUP_MANIFEST.md" <<EOF
# Backup Manifest

**Backup Name:** ${BACKUP_NAME}
**Created:** $(date)
**Git Branch:** $(git branch --show-current)
**Git Commit:** $(git rev-parse HEAD)
**Git Commit Message:** $(git log -1 --pretty=%B)

## Backup Contents

- \`src/\` - Complete source code
- \`public/\` - Public assets
- \`.github/\` - GitHub workflows and configurations
- \`package.json\` - Dependencies
- \`pnpm-lock.yaml\` - Locked dependencies
- \`next.config.ts\` - Next.js configuration
- \`tsconfig.json\` - TypeScript configuration
- \`.env.example\` - Environment variables template

## Restore Instructions

To restore from this backup:

\`\`\`bash
# 1. Copy files back to root
cp -r ${BACKUP_PATH}/src ./
cp -r ${BACKUP_PATH}/public ./
cp -r ${BACKUP_PATH}/.github ./
cp ${BACKUP_PATH}/package.json ./
cp ${BACKUP_PATH}/pnpm-lock.yaml ./
cp ${BACKUP_PATH}/next.config.ts ./
cp ${BACKUP_PATH}/tsconfig.json ./

# 2. Reinstall dependencies
pnpm install

# 3. Rebuild
pnpm build
\`\`\`

## Git Restore (Alternative)

If you need to restore to this exact commit:

\`\`\`bash
git checkout $(git rev-parse HEAD)
\`\`\`
EOF

# Create compressed archive
echo -e "${YELLOW}🗜️  Creating compressed archive...${NC}"
cd "$BACKUP_DIR"
tar -czf "${BACKUP_NAME}_${TIMESTAMP}.tar.gz" "${BACKUP_NAME}_${TIMESTAMP}"
ARCHIVE_SIZE=$(du -h "${BACKUP_NAME}_${TIMESTAMP}.tar.gz" | cut -f1)
cd ..

echo -e "${GREEN}✅ Backup complete!${NC}"
echo -e "${GREEN}📍 Location: ${BACKUP_PATH}${NC}"
echo -e "${GREEN}📦 Archive: ${BACKUP_DIR}/${BACKUP_NAME}_${TIMESTAMP}.tar.gz (${ARCHIVE_SIZE})${NC}"
echo ""
echo -e "${YELLOW}📋 Backup Manifest:${NC}"
cat "$BACKUP_PATH/BACKUP_MANIFEST.md"

# Clean up old backups (keep last 10)
echo -e "${YELLOW}🧹 Cleaning up old backups (keeping last 10)...${NC}"
cd "$BACKUP_DIR"
ls -t *.tar.gz 2>/dev/null | tail -n +11 | xargs -r rm -f
cd ..

echo -e "${GREEN}✅ Backup system complete!${NC}"
