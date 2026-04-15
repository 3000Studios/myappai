#!/usr/bin/env bash
# ============================================
# 3000 Studios - Safe PR Merge Release Script
# ============================================
# Three-phase controlled merge process with automatic rollback
# 
# PHASE 1: Freeze & Verify (creates backup)
# PHASE 2: Verify PRs Individually (no merges)
# PHASE 3: Controlled Merge (single release branch)

set -euo pipefail

# Configuration
DATE=$(date +%F)
BACKUP_BRANCH="backup/main-before-merge-${DATE}"
BACKUP_TAG="v-pre-merge-${DATE}"
RELEASE_BRANCH="release/merge-${DATE}"
DRY_RUN=false
SKIP_TESTS=false

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Output helpers
phase() { echo -e "\n${CYAN}🔷 $1${NC}"; }
success() { echo -e "   ${GREEN}✅ $1${NC}"; }
warning() { echo -e "   ${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "   ${RED}❌ $1${NC}"; }
step() { echo -e "   ${GRAY}→ $1${NC}"; }

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--dry-run] [--skip-tests]"
            exit 1
            ;;
    esac
done

# ============================================
# PHASE 1: Freeze & Verify
# ============================================
phase1_freeze_and_verify() {
    phase "PHASE 1: Freeze & Verify"
    
    step "Checking current branch..."
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    if [ "$current_branch" != "main" ]; then
        warning "Not on main branch (current: $current_branch)"
        step "Switching to main..."
        git checkout main
    fi
    
    step "Pulling latest changes..."
    git pull origin main
    
    step "Checking working tree status..."
    if [ -n "$(git status --porcelain)" ]; then
        error "Working tree is not clean!"
        echo -e "\n${YELLOW}Uncommitted changes:${NC}"
        git status --short
        echo -e "\n${YELLOW}Please commit or stash changes before continuing.${NC}"
        exit 1
    fi
    success "Working tree is clean"
    
    if [ "$DRY_RUN" = true ]; then
        warning "DRY RUN: Would create backup branch: $BACKUP_BRANCH"
        warning "DRY RUN: Would create backup tag: $BACKUP_TAG"
        return
    fi
    
    step "Creating backup branch: $BACKUP_BRANCH"
    git branch "$BACKUP_BRANCH"
    git push origin "$BACKUP_BRANCH"
    success "Backup branch created"
    
    step "Creating backup tag: $BACKUP_TAG"
    git tag -a "$BACKUP_TAG" -m "Snapshot before PR merge on $DATE"
    git push origin "$BACKUP_TAG"
    success "Backup tag created"
    
    success "PHASE 1 Complete: Backups created successfully"
}

# ============================================
# PHASE 2: Verify PRs Individually
# ============================================
phase2_verify_prs() {
    phase "PHASE 2: Verify PRs Individually"
    
    # PR list: number|name
    prs=(
        "35|ESLint 9 + TS fixes"
        "34|platform hardening"
        "31|nav + pipeline"
        "33|Vercel analytics"
    )
    
    original_branch=$(git rev-parse --abbrev-ref HEAD)
    failed_prs=()
    
    for pr_info in "${prs[@]}"; do
        IFS='|' read -r pr_num pr_name <<< "$pr_info"
        
        echo -e "\n${CYAN}──────────────────────────────────────${NC}"
        echo -e "${CYAN}Testing PR #${pr_num}: ${pr_name}${NC}"
        echo -e "${CYAN}──────────────────────────────────────${NC}"
        
        if [ "$DRY_RUN" = true ]; then
            warning "DRY RUN: Would checkout PR #$pr_num"
            warning "DRY RUN: Would run tests for PR #$pr_num"
            continue
        fi
        
        step "Checking out PR #$pr_num..."
        if ! gh pr checkout "$pr_num"; then
            error "Failed to checkout PR #$pr_num"
            failed_prs+=("$pr_num|$pr_name|checkout")
            continue
        fi
        
        step "Installing dependencies..."
        if ! pnpm install --frozen-lockfile; then
            error "Failed to install dependencies for PR #$pr_num"
            failed_prs+=("$pr_num|$pr_name|install")
            continue
        fi
        
        if [ "$SKIP_TESTS" = false ]; then
            step "Running linter..."
            if ! pnpm lint; then
                error "Lint failed for PR #$pr_num"
                failed_prs+=("$pr_num|$pr_name|lint")
                continue
            fi
            success "Lint passed"
            
            step "Running type check..."
            if ! pnpm typecheck 2>/dev/null && ! pnpm tsc --noEmit 2>/dev/null; then
                error "Type check failed for PR #$pr_num"
                failed_prs+=("$pr_num|$pr_name|typecheck")
                continue
            fi
            success "Type check passed"
            
            step "Building project..."
            if ! pnpm build; then
                error "Build failed for PR #$pr_num"
                failed_prs+=("$pr_num|$pr_name|build")
                continue
            fi
            success "Build passed"
        else
            warning "Tests skipped (--skip-tests flag)"
        fi
        
        success "PR #$pr_num verified successfully"
    done
    
    # Return to original branch
    step "Returning to $original_branch..."
    git checkout "$original_branch"
    
    if [ ${#failed_prs[@]} -gt 0 ]; then
        echo -e "\n${RED}❌ PHASE 2 FAILED: ${#failed_prs[@]} PR(s) did not pass verification${NC}"
        echo -e "\n${YELLOW}Failed PRs:${NC}"
        for failed in "${failed_prs[@]}"; do
            IFS='|' read -r pr_num pr_name stage <<< "$failed"
            echo -e "  ${YELLOW}- PR #${pr_num} (${pr_name}): Failed at ${stage}${NC}"
        done
        echo -e "\n${YELLOW}Please fix the failing PRs before proceeding.${NC}"
        exit 1
    fi
    
    success "PHASE 2 Complete: All PRs verified successfully"
}

# ============================================
# PHASE 3: Controlled Merge
# ============================================
phase3_controlled_merge() {
    phase "PHASE 3: Controlled Merge"
    
    step "Ensuring we're on main..."
    git checkout main
    git pull origin main
    
    step "Creating release branch: $RELEASE_BRANCH"
    if [ "$DRY_RUN" = true ]; then
        warning "DRY RUN: Would create release branch: $RELEASE_BRANCH"
    else
        git checkout -b "$RELEASE_BRANCH"
        success "Release branch created"
    fi
    
    # Define merge order: pr_num|branch|message
    merges=(
        "35|pr-35|Merge PR #35: ESLint 9 + TS fixes"
        "34|pr-34|Merge PR #34: platform hardening"
        "31|pr-31|Merge PR #31: nav + pipeline"
        "33|pr-33|Merge PR #33: Vercel analytics"
    )
    
    for merge_info in "${merges[@]}"; do
        IFS='|' read -r pr_num branch message <<< "$merge_info"
        
        echo -e "\n${CYAN}──────────────────────────────────────${NC}"
        echo -e "${CYAN}Merging PR #${pr_num}${NC}"
        echo -e "${CYAN}──────────────────────────────────────${NC}"
        
        if [ "$DRY_RUN" = true ]; then
            warning "DRY RUN: Would merge $branch with message: $message"
            continue
        fi
        
        step "Fetching PR branch..."
        if ! gh pr checkout "$pr_num"; then
            error "Failed to checkout PR #$pr_num for merge"
            echo -e "\n${YELLOW}Manual intervention required.${NC}"
            rollback_instructions
            exit 1
        fi
        
        pr_branch=$(git rev-parse --abbrev-ref HEAD)
        git checkout "$RELEASE_BRANCH"
        
        step "Merging with --no-ff..."
        if ! git merge --no-ff "$pr_branch" -m "$message"; then
            error "Failed to merge PR #$pr_num"
            echo -e "\n${YELLOW}Merge conflict or error occurred.${NC}"
            echo -e "${YELLOW}Current branch: $(git rev-parse --abbrev-ref HEAD)${NC}"
            echo -e "\n${YELLOW}To abort and rollback:${NC}"
            echo -e "  ${GRAY}git merge --abort${NC}"
            echo -e "  ${GRAY}git checkout main${NC}"
            echo -e "  ${GRAY}git branch -D $RELEASE_BRANCH${NC}"
            exit 1
        fi
        success "Merged PR #$pr_num"
    done
    
    echo -e "\n${CYAN}──────────────────────────────────────${NC}"
    echo -e "${CYAN}Running final verification gate${NC}"
    echo -e "${CYAN}──────────────────────────────────────${NC}"
    
    if [ "$DRY_RUN" = true ]; then
        warning "DRY RUN: Would run final tests"
    elif [ "$SKIP_TESTS" = false ]; then
        step "Installing dependencies..."
        pnpm install --frozen-lockfile
        
        step "Running linter..."
        if ! pnpm lint; then
            error "Final lint check failed!"
            echo -e "\n${YELLOW}Fix issues and recommit before merging to main.${NC}"
            exit 1
        fi
        success "Lint passed"
        
        step "Running type check..."
        if ! pnpm typecheck 2>/dev/null && ! pnpm tsc --noEmit 2>/dev/null; then
            error "Final type check failed!"
            echo -e "\n${YELLOW}Fix issues and recommit before merging to main.${NC}"
            exit 1
        fi
        success "Type check passed"
        
        step "Building project..."
        if ! pnpm build; then
            error "Final build failed!"
            echo -e "\n${YELLOW}Fix issues and recommit before merging to main.${NC}"
            exit 1
        fi
        success "Build passed"
        
        success "All final checks passed!"
    fi
    
    if [ "$DRY_RUN" = true ]; then
        warning "DRY RUN: Would merge release branch to main"
        warning "DRY RUN: Would push to origin/main (triggers Vercel)"
    else
        echo -e "\n${CYAN}──────────────────────────────────────${NC}"
        echo -e "${CYAN}Merging to main${NC}"
        echo -e "${CYAN}──────────────────────────────────────${NC}"
        
        step "Switching to main..."
        git checkout main
        
        step "Merging release branch..."
        git merge --no-ff "$RELEASE_BRANCH"
        success "Release branch merged to main"
        
        step "Pushing to origin/main (this triggers Vercel deployment)..."
        git push origin main
        success "Pushed to main - Vercel deployment initiated"
    fi
    
    success "PHASE 3 Complete: All PRs merged successfully"
}

# ============================================
# Rollback Instructions
# ============================================
rollback_instructions() {
    echo -e "\n${RED}🚨 ROLLBACK PROCEDURE${NC}"
    echo -e "${RED}════════════════════════════════════════${NC}"
    
    echo -e "\n${YELLOW}To rollback to pre-merge state:${NC}"
    echo -e "  ${GRAY}git checkout $BACKUP_TAG${NC}"
    echo -e "  ${GRAY}git push origin ${BACKUP_TAG}:main --force${NC}"
    echo -e "\n${YELLOW}Or use the backup branch:${NC}"
    echo -e "  ${GRAY}git checkout $BACKUP_BRANCH${NC}"
    echo -e "  ${GRAY}git push origin ${BACKUP_BRANCH}:main --force${NC}"
    echo -e "\n${YELLOW}Vercel will automatically redeploy the rollback.${NC}"
}

# ============================================
# Main Execution
# ============================================
main() {
    echo -e "${CYAN}════════════════════════════════════════${NC}"
    echo -e "${CYAN}3000 Studios - Safe PR Merge Script${NC}"
    echo -e "${CYAN}════════════════════════════════════════${NC}"
    echo -e "${GRAY}Date: $DATE${NC}"
    
    if [ "$DRY_RUN" = true ]; then
        warning "DRY RUN MODE: No actual changes will be made"
    fi
    if [ "$SKIP_TESTS" = true ]; then
        warning "SKIP TESTS MODE: Verification tests will be skipped"
    fi
    
    # Execute phases
    phase1_freeze_and_verify
    phase2_verify_prs
    phase3_controlled_merge
    
    # Success summary
    echo -e "\n${GREEN}════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ SUCCESS: All phases completed${NC}"
    echo -e "${GREEN}════════════════════════════════════════${NC}"
    echo -e "\n${CYAN}Backup created:${NC}"
    echo -e "  ${GRAY}Branch: $BACKUP_BRANCH${NC}"
    echo -e "  ${GRAY}Tag: $BACKUP_TAG${NC}"
    echo -e "\n${CYAN}Deployment:${NC}"
    echo -e "  ${GRAY}Vercel will deploy main branch in ~5-7 minutes${NC}"
    echo -e "  ${GRAY}Monitor at: https://vercel.com/dashboard${NC}"
    echo -e "\n${CYAN}To rollback if needed:${NC}"
    echo -e "  ${GRAY}Run: git checkout $BACKUP_TAG && git push origin ${BACKUP_TAG}:main --force${NC}"
}

# Run main with error handling
if ! main; then
    echo -e "\n${RED}❌ SCRIPT FAILED${NC}"
    rollback_instructions
    exit 1
fi
