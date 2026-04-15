# 🔐 Shadow Secure Development Guide

## Overview

Your secrets are now **loaded into memory only**, never written to disk, never committed to GitHub.

### Architecture:
```
Windows Credential Manager (encrypted, system-managed)
        ↓
shadow-secrets.ps1 (loads into PowerShell memory)
        ↓
Your dev environment ($env:OPENAI_API_KEY, etc)
        ↓
Next.js reads from environment (process.env)
        ↓
Never touches disk, never in Git
```

---

## 🚀 Quick Start: First Time Setup

### Step 1: Store Your API Keys (One-Time)

Open PowerShell **as Administrator** and run:

```powershell
# Option A: Interactive (VS Code task)
# Ctrl+Shift+B → Select "Shadow: Store API Key"

# Option B: Command line
cmdkey /generic:OPENAI_API_KEY /user:dev /pass:YOUR_ACTUAL_KEY
cmdkey /generic:CLAUDE_API_KEY /user:dev /pass:YOUR_ACTUAL_KEY
cmdkey /generic:GEMINI_API_KEY /user:dev /pass:YOUR_ACTUAL_KEY
cmdkey /generic:PAYPAL_CLIENT_ID /user:dev /pass:YOUR_ACTUAL_ID
cmdkey /generic:PAYPAL_SECRET /user:dev /pass:YOUR_ACTUAL_SECRET
cmdkey /generic:STRIPE_KEY /user:dev /pass:YOUR_ACTUAL_KEY
cmdkey /generic:GOOGLE_MAPS_API /user:dev /pass:YOUR_ACTUAL_KEY
```

**Keys are now stored in Windows Credential Manager (encrypted by Windows).**

### Step 2: Verify Keys Are Stored

Open PowerShell and run:

```powershell
C:\3000Studios\shadow\shadow-secrets.ps1 -List
```

You should see:
```
Stored Shadow Credentials:
=========================
  ✓ OPENAI_API_KEY
  ✓ CLAUDE_API_KEY
  ✓ GEMINI_API_KEY
  ... etc
```

### Step 3: Start Development

**Option A: From VS Code (Easiest)**
1. Open VS Code
2. Press `Ctrl+Shift+B`
3. Select "🚀 Shadow: Start Dev Server"
4. Dev server starts with secrets loaded

**Option B: From Terminal**
```powershell
C:\3000Studios\shadow\shadow-dev.ps1
```

---

## 📝 Daily Workflow

### 1. Start Development
```powershell
# Press Ctrl+Shift+B in VS Code
# Or run: C:\3000Studios\shadow\shadow-dev.ps1

# Dev server starts at http://localhost:3000
# Secrets are loaded into memory
```

### 2. Edit Code
- Make changes in VS Code
- File auto-saves
- Dev server auto-reloads
- Changes visible at http://localhost:3000

### 3. Commit & Push
```powershell
git add .
git commit -m "feat: your change"
git push origin main

# GitHub Actions automatically deploys to Vercel
```

### 4. Check Production
- GitHub Actions log: https://github.com/3000Studios/3000studios-next/actions
- Vercel dashboard: https://vercel.com/3000studios
- Live site: https://3000studios.com

---

## 🔑 Managing Credentials

### View Stored Credentials
```powershell
# VS Code task: Ctrl+Shift+B → "Shadow: List Stored Keys"
# Or: C:\3000Studios\shadow\shadow-secrets.ps1 -List
```

### Add a New Credential
```powershell
# VS Code task: Ctrl+Shift+B → "Shadow: Store API Key"
# Or: cmdkey /generic:KEY_NAME /user:dev /pass:ACTUAL_KEY
```

### Remove a Credential
```powershell
# VS Code task: Ctrl+Shift+B → "Shadow: Clear API Key"
# Or: cmdkey /delete:KEY_NAME
```

### Update an Existing Credential
```powershell
# Remove the old one
cmdkey /delete:OPENAI_API_KEY

# Add the new one
cmdkey /generic:OPENAI_API_KEY /user:dev /pass:NEW_KEY
```

---

## 🔒 Security Model

### ✅ What's Secure

| Layer | Method | Safe? |
|-------|--------|-------|
| **Storage** | Windows Credential Manager (encrypted) | ✅ Yes |
| **Loading** | PowerShell environment variables (memory only) | ✅ Yes |
| **Transit** | HTTPS to APIs | ✅ Yes |
| **Code** | Environment variables (never hardcoded) | ✅ Yes |
| **Git** | Never committed (in .gitignore) | ✅ Yes |
| **Disk** | Never written to disk | ✅ Yes |

### ❌ What's NOT Secure

- Storing secrets in `.env.local` (if you forget to add to `.gitignore`)
- Storing secrets in plaintext anywhere
- Committing credentials to GitHub
- Running auto-commit scripts
- Opening ports for GitHub webhooks

### ✅ Our System

```
Credentials are:
✓ Encrypted at rest (Windows Credential Manager)
✓ In memory during dev (PowerShell $env: variables)
✓ Never on disk
✓ Never in Git
✓ Isolated per user/machine
✓ Windows manages security
```

---

## 🛠️ VS Code Integration

### Available Tasks (Ctrl+Shift+B)

| Task | What It Does |
|------|-------------|
| **🚀 Shadow: Start Dev Server** | Load secrets + start pnpm dev |
| **🔑 Shadow: Store API Key** | Interactive credential storage |
| **📋 Shadow: List Stored Keys** | Show all stored credentials |
| **🗑️ Shadow: Clear API Key** | Remove a credential |
| **✅ Git: Sync & Push** | Stage, commit, push |

### How to Run a Task

1. **Keyboard:** `Ctrl+Shift+B` or `Ctrl+Shift+P` → "Tasks: Run Task"
2. **Menu:** Terminal → Run Task
3. **Command Palette:** Type the task name

---

## 🚨 Troubleshooting

### "Credential not found" Error

**Cause:** You haven't stored the API key yet

**Fix:**
```powershell
# Store the missing key
cmdkey /generic:OPENAI_API_KEY /user:dev /pass:YOUR_KEY

# Or use VS Code task:
# Ctrl+Shift+B → "Shadow: Store API Key"
```

### Dev Server Won't Start

**Cause:** Dependencies not installed

**Fix:**
```powershell
cd "C:\Users\MrJws\OneDrive\WorkSpaces\3000studios-next\3000studios-next"
pnpm install
pnpm dev
```

### API Keys Not Working in Code

**Make sure code reads from environment:**

```typescript
// ❌ WRONG - hardcoded
const apiKey = "sk-...";

// ✅ RIGHT - from environment
const apiKey = process.env.OPENAI_API_KEY;
```

### Can't Access Windows Credential Manager

**Cause:** PowerShell doesn't have administrator rights

**Fix:** Run PowerShell as Administrator:
1. Right-click PowerShell
2. "Run as administrator"
3. Run the shadow scripts

---

## 🔄 How the System Works

### When You Start Dev:

```
1. shadow-dev.ps1 runs
2. Calls shadow-secrets.ps1
3. Reads from Credential Manager
4. Sets $env:OPENAI_API_KEY, etc (in memory)
5. Starts pnpm dev
6. Next.js reads process.env variables
7. Everything works with zero disk exposure
```

### When You Push Code:

```
1. git push origin main
2. GitHub detects push
3. Triggers .github/workflows/deploy.yml
4. GitHub Actions builds in isolated container
5. Vercel reads secrets from GitHub Secrets
6. Deploys with full credentials
7. Your site goes live
```

### When You Shut Down:

```
1. Close dev server
2. PowerShell closes
3. Environment variables are gone
4. Credentials remain in Credential Manager
5. Next time you start: repeat from step 1
```

---

## 📊 Credential Manager Locations

### Windows Credential Manager UI
- Control Panel → Credential Manager → Windows Credentials
- Search for credentials starting with "OPENAI_", "GOOGLE_", etc

### PowerShell Command
```powershell
cmdkey /list
```

### Where They're Stored (on disk, encrypted)
```
C:\Users\[YourUsername]\AppData\Local\Microsoft\Credentials
```

**These are encrypted by Windows using your login credentials.**

---

## 🎯 Best Practices

✅ **Do:**
- Store all API keys in Credential Manager
- Load them at dev startup
- Use environment variables in code
- Keep secrets in GitHub Secrets for production
- Log out of VS Code when done (if on shared machine)

❌ **Don't:**
- Write `.env.local` files
- Commit credentials to GitHub
- Hardcode API keys in code
- Share PowerShell session with others
- Store credentials outside Credential Manager

---

## 🔗 Production Deployment

For Vercel, secrets come from GitHub Secrets (not your local machine):

1. **Add to GitHub Secrets** (Settings → Secrets → Actions)
2. **Workflow reads them** (.github/workflows/deploy.yml)
3. **Vercel injects them** during build
4. **Your app uses them** in production

This keeps production secrets completely separate from your machine.

---

## 📞 Reference

### Quick Commands
```powershell
# List all credentials
cmdkey /list

# Show specific credential
cmdkey /list | Select-String "OPENAI"

# Delete a credential
cmdkey /delete:OPENAI_API_KEY

# View stored value (via GUI)
# Control Panel → Credential Manager → Windows Credentials → Edit
```

### Useful Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+B` | Run default task (Start Dev Server) |
| `Ctrl+Shift+P` | Open command palette |
| `Terminal` → `Run Task` | List all VS Code tasks |

---

## ✨ Summary

Your development environment is now:

- ✅ **Secure** - Credentials encrypted, memory-only
- ✅ **Professional** - No accidental commits
- ✅ **Automated** - GitHub Actions handles deployment
- ✅ **Scalable** - Vercel manages production
- ✅ **Safe** - Windows manages encryption

**Just start the dev server and code. Everything else is automatic.**

---

**Last Updated:** December 10, 2025  
**Status:** ✅ Secure & Production Ready
