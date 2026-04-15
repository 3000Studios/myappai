# 🎯 Secure Development Workflow Guide

## Your Daily Workflow (5 Minutes to Production)

### **STEP 1: Start Development Server** (Once)
```powershell
cd "C:\Users\MrJws\OneDrive\WorkSpaces\3000studios-next\3000studios-next"
pnpm dev
```

**VS Code will detect the server and show preview at `http://localhost:3000`**

Leave this terminal running. It auto-reloads on file save.

---

### **STEP 2: Edit Code & Save**
- Open any file in VS Code
- Make your changes
- **Save** (`Ctrl+S`)
- **Prettier auto-formats**
- **Dev server instantly reloads**
- **See changes at `http://localhost:3000`**

---

### **STEP 3: Review Your Changes**
```powershell
# In a NEW terminal, check what you've modified
git status

# See the exact changes
git diff
```

**Take 30 seconds to review.** This prevents accidents.

---

### **STEP 4: Commit & Push** (When Ready)
```powershell
# Stage your changes
git add .

# Commit with a clear message
git commit -m "feat: add feature description"

# Push to GitHub (no password prompt)
git push origin main
```

**That's it. GitHub Actions automatically:**
1. ✅ Runs tests (if configured)
2. ✅ Builds your app
3. ✅ Deploys to Vercel
4. ✅ Your site goes live

---

## 🔒 How Secrets Are Handled

### **Local Development (.env.local)**
```bash
# .env.local (NEVER commit this)
NEXT_PUBLIC_MAPS_API=your_maps_key_here
OPENAI_API_KEY=your_openai_key
# etc...
```

**Setup once, forget about it:**
1. Copy keys to `.env.local`
2. Git ignores it automatically
3. Dev server reads it automatically
4. Never commit it

### **Production (GitHub Secrets)**
```
GitHub Settings → Secrets → Actions
├── VERCEL_TOKEN
├── GOOGLE_MAPS_API
├── OPENAI_API_KEY
└── ... (all other keys)
```

**Vercel deploys automatically:**
1. GitHub Actions reads secrets securely
2. Injects them during build
3. Never exposed in code
4. Encrypted at rest

---

## 📋 VS Code Setup

Your `.vscode/settings.json` now includes:

✅ **Auto-formatting** (Prettier on save)  
✅ **ESLint enforcement** (catches errors)  
✅ **Tailwind IntelliSense** (autocomplete)  
✅ **Git integration** (see changes in editor)  
✅ **GitHub Copilot** (code suggestions)  
✅ **DotENV support** (autocomplete env vars)  

**No auto-commit. No auto-push. You stay in control.**

---

## 🚀 GitHub Actions Pipeline

### What Happens When You Push:

```
┌─────────────────────────────────────────┐
│ You: git push origin main               │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ GitHub detects push                     │
│ Triggers: .github/workflows/deploy.yml  │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ GitHub Actions Runner (Ubuntu)          │
├─────────────────────────────────────────┤
│ 1. Checkout code                        │
│ 2. Setup Node.js + PNPM                 │
│ 3. Install dependencies                 │
│ 4. Run build                            │
│ 5. Vercel deploy                        │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ Vercel                                  │
├─────────────────────────────────────────┤
│ 1. Receives code                        │
│ 2. Injects secrets                      │
│ 3. Builds Next.js app                   │
│ 4. Deploys to edge network              │
│ 5. Updates DNS                          │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│ ✅ YOUR SITE IS LIVE (5-7 minutes)      │
└─────────────────────────────────────────┘
```

---

## 🔑 Environment Variable Setup (One-Time)

### For Local Development:

1. **Create `.env.local` in project root:**
```bash
NEXT_PUBLIC_MAPS_API=AIz...your_maps_key
OPENAI_API_KEY=sk-...your_openai_key
ANTHROPIC_API_KEY=sk-ant-...your_claude_key
GOOGLE_GEMINI_API_KEY=AIz...your_gemini_key
PAYPAL_CLIENT_ID=A...your_paypal_id
PAYPAL_SECRET=E...your_paypal_secret
STRIPE_SECRET_KEY=sk_live_...your_stripe_key
```

2. **Git automatically ignores it** (see `.gitignore`)

3. **Dev server reads it** (you can use env vars in code)

### For Production:

1. **Go to GitHub → Settings → Secrets and variables → Actions**

2. **Add each secret** (copy values from your local `.env.local`)

3. **GitHub Actions injects them** during build

4. **Vercel uses them** during deployment

---

## 💻 Daily Commands Reference

### Development
```powershell
# Start dev server
pnpm dev

# Build locally to test
pnpm build

# Run production build locally
pnpm start
```

### Git Workflow
```powershell
# See what changed
git status

# See exact changes
git diff

# Stage all changes
git add .

# Commit with message
git commit -m "feat: description"

# Push to GitHub (triggers deployment)
git push origin main

# Pull latest from GitHub
git pull origin main
```

### Troubleshooting
```powershell
# See recent commits
git log --oneline -5

# See git branches
git branch -a

# Undo last local commit (keep changes)
git reset --soft HEAD~1

# Undo all local changes
git checkout .
```

---

## ✅ What NOT to Do

❌ **Don't:**
- Run `git commit --no-verify` (skips safety checks)
- Use `git push --force` (overwrites history)
- Store API keys in version control
- Commit `.env.local` file
- Run auto-sync scripts (causes commit spam)
- Set `git.confirmSync` to false (auto-syncs without review)

✅ **Do:**
- Review changes with `git diff` before committing
- Use clear, descriptive commit messages
- Test locally before pushing (`pnpm build`)
- Keep `.env.local` in `.gitignore`
- Push only working code
- Let GitHub Actions handle deployment

---

## 🎯 Full Example Workflow

### **Scenario: Add a new feature**

```powershell
# 1. Make sure you have latest code
git pull origin main

# 2. Start dev server
pnpm dev
# Server runs at http://localhost:3000

# 3. Edit files
# (VS Code will auto-save and reload preview)

# 4. Test your changes
# (View them live at http://localhost:3000)

# 5. Review what you changed
git status
git diff

# 6. Stage changes
git add .

# 7. Commit
git commit -m "feat: add new feature"

# 8. Push (GitHub Actions takes it from here)
git push origin main

# 9. Watch deployment
# (Go to: https://github.com/3000Studios/3000studios-next/actions)

# 10. Visit your site
# (Go to: https://3000studios.com - it's updated!)
```

---

## 🔐 Security Checklist

✅ Credentials never in code  
✅ GitHub Secrets are encrypted  
✅ GitHub Actions runs in isolated runners  
✅ Vercel handles environment variables securely  
✅ No auto-commit loops  
✅ No root/admin privilege escalation  
✅ All changes reviewed before commit  
✅ Audit trail of all deployments  

---

## 📞 If Something Goes Wrong

### "Build failed in GitHub Actions"
1. Go to: https://github.com/3000Studios/3000studios-next/actions
2. Click the failed workflow
3. Expand the "Build" step to see the error
4. Common issues: Missing env vars, linting errors

### "Dev server won't start locally"
```powershell
pnpm install
pnpm dev
```

### "Git won't push"
```powershell
# Check git status
git status

# Pull any remote changes
git pull origin main

# Try push again
git push origin main
```

### "Secrets not working"
1. Verify secret is added in GitHub
2. Check secret name matches exactly (case-sensitive)
3. Rebuild and redeploy in Vercel

---

## 🎓 Learning Resources

- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Actions:** https://docs.github.com/actions
- **Vercel Docs:** https://vercel.com/docs
- **Git Basics:** https://git-scm.com/book/en/v2

---

## 🚀 You're All Set!

Your workflow is now:
- ✅ Secure (no exposed credentials)
- ✅ Automated (GitHub → Vercel)
- ✅ Reviewable (you control commits)
- ✅ Production-grade
- ✅ Zero manual deployment

**Just edit, save, push. The rest is automatic.**

---

**Last Updated:** December 10, 2025  
**Status:** ✅ Production Ready
