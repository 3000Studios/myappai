# 🔐 GitHub CLI Setup - Quick Reference

## ✅ What's Been Configured

Your machine now has **secure GitHub authentication** with:

### 1. **Windows Credential Manager** ✅

- PAT stored securely in Windows Credential Manager
- Encrypted by Windows and isolated per user
- No plaintext tokens in environment variables or files

### 2. **GitHub CLI** ✅

```
✓ Logged in to github.com account 3000Studios
✓ Token: Securely stored in keyring
✓ Git operations protocol: HTTPS
```

### 3. **Git Configuration** ✅

```bash
git config --global user.name "3000Studios"
git config --global user.email "mr.jwswain@gmail.com"
git config --global credential.helper wincred
git config --global push.default current
git config --global pull.rebase true
```

---

## 🚀 Daily Workflow

### **Option 1: Manual Git Commands (No Prompts)**

```powershell
# Pull latest
git pull origin main

# Make changes...

# Push (no prompt needed - uses credential manager)
git add .
git commit -m "Your message"
git push origin main
```

### **Option 2: Automated Sync Script**

```powershell
# Run the secure auto-sync script
.\scripts\secure-sync.ps1

# Or use PowerShell alias
Set-Alias -Name sync -Value ".\scripts\secure-sync.ps1" -Scope CurrentUser
sync
```

---

## 🔒 Security Benefits

✅ **Token Never Exposed**

- Stored in Windows Credential Manager (encrypted)
- Not in environment variables
- Not in `.env` files
- Not in terminal history

✅ **No Plaintext Storage**

- Credentials isolated to your user profile
- Windows handles encryption automatically
- Token masked in `gh auth status` output

✅ **Automatic Authentication**

- All git/GitHub operations use credentials automatically
- Zero prompts or browser redirects needed

✅ **Easy Revocation**

- Control Panel → Credential Manager → Windows Credentials → Delete github.com entry
- Immediately revokes access on this machine

---

## 🛠️ Useful Commands

### Check GitHub CLI Status

```bash
gh auth status
```

### List Your Repositories

```bash
gh repo list 3000Studios
```

### Create a Branch and Push

```bash
git checkout -b feature/my-feature
git push -u origin feature/my-feature
```

### View Repository Info

```bash
gh repo view 3000Studios/3000studios-next
```

### Check Git Configuration

```bash
git config --global --list | grep github
```

---

## 📝 Credential Manager Management

### View Stored Credentials

```powershell
cmdkey /list | findstr github
```

### Remove GitHub Credential (if needed)

```powershell
cmdkey /delete:github.com
```

### Re-authenticate

```powershell
gh auth login
```

---

## ⚠️ What NOT to Do

❌ Do NOT:

- Copy the PAT into environment variables
- Store the PAT in plaintext files
- Commit `.env.local` with secrets
- Share the PAT in chat or logs
- Run git with `--no-verify` flags

✅ DO:

- Let Windows Credential Manager handle it
- Use `gh` commands for GitHub operations
- Run automated scripts through scheduled tasks
- Keep Windows updated for security patches

---

## 🔄 CI/CD Integration (GitHub Actions)

For automated deployments to Vercel/cloud:

### Create `.github/workflows/deploy.yml`

```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: pnpm install && pnpm build
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

**Add secrets in GitHub:**

1. Settings → Secrets and variables → Actions
2. Create new secret: `VERCEL_TOKEN`
3. GitHub Actions handles auth securely

---

## 📞 Support

Having issues? Check:

- `gh auth status` - Verify authentication
- `git remote -v` - Verify remote URL
- Windows Credential Manager → Check github.com entry exists
- Run `git push -v origin main` for verbose output

---

**Setup Date:** December 10, 2025  
**Status:** ✅ Production Ready  
**Security Level:** 🔐 Enterprise Grade
