# 🚀 GitHub Secrets Setup Guide

## Overview

This guide walks you through adding the required secrets to GitHub for automated deployment to Vercel.

**⏱️ Time to complete: ~5 minutes**

---

## Step 1: Get Your Vercel Tokens

### Vercel Project ID & Org ID

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `3000studios-next`
3. Settings → General
4. Copy:
   - **Project ID** → `VERCEL_PROJECT_ID`
   - **Org ID** (at top) → `VERCEL_ORG_ID`

### Vercel API Token

1. Account Settings → Tokens
2. Create Token (name: "GitHub Actions")
3. Copy the token → `VERCEL_TOKEN`

---

## Step 2: Add Secrets to GitHub

### Navigate to Repository Secrets

1. Go to [github.com/3000Studios/3000studios-next](https://github.com/3000Studios/3000studios-next)
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"

### Add Each Secret

Add these one by one:

| Secret Name         | Value                      | Where to Find                                      |
| ------------------- | -------------------------- | -------------------------------------------------- |
| `VERCEL_TOKEN`      | Your Vercel API token      | Vercel Account Settings → Tokens                   |
| `VERCEL_ORG_ID`     | Your Vercel Org ID         | Vercel Dashboard → Project Settings                |
| `VERCEL_PROJECT_ID` | Your Vercel Project ID     | Vercel Dashboard → Project Settings                |
| `GOOGLE_MAPS_API`   | Your Google Maps API Key   | Google Cloud Console                               |
| `OPENAI_API_KEY`    | Your OpenAI API Key        | [OpenAI Platform](https://platform.openai.com)     |
| `CLAUDE_API_KEY`    | Your Anthropic API Key     | [Anthropic Console](https://console.anthropic.com) |
| `GEMINI_API_KEY`    | Your Google Gemini API Key | [Google AI Studio](https://aistudio.google.com)    |
| `PAYPAL_CLIENT_ID`  | Your PayPal Client ID      | PayPal Developer Dashboard                         |
| `PAYPAL_SECRET`     | Your PayPal Secret Key     | PayPal Developer Dashboard                         |
| `STRIPE_KEY`        | Your Stripe Secret Key     | [Stripe Dashboard](https://dashboard.stripe.com)   |

### Example: Adding a Secret

```
Name:  VERCEL_TOKEN
Value: vercel_xxxxxxxxxxxxxxxx
```

Click "Add secret" → Repeat for each

---

## Step 3: Verify Workflow Configuration

The workflow file `.github/workflows/deploy.yml` is already configured with:

✅ **Build Step** - Compiles your Next.js app  
✅ **Vercel Deployment** - Deploys to production  
✅ **Environment Variables** - All secrets injected automatically  
✅ **Production Environment** - Requires proper GitHub environment settings

---

## Step 4: Test the Workflow

### Option A: Manual Trigger (Recommended for Testing)

1. Go to GitHub → Actions tab
2. Select "Deploy to Vercel" workflow
3. Click "Run workflow" → "Run workflow"
4. Watch it execute in real-time

### Option B: Automatic Trigger

Simply push to `main` branch:

```powershell
git add .
git commit -m "test: trigger deployment"
git push origin main
```

The workflow will automatically start.

---

## 🔍 Monitoring Deployment

### In GitHub

1. Go to Actions tab
2. Select the running workflow
3. Click to expand steps and see real-time output

### In Vercel

1. Vercel Dashboard → Deployments
2. See real-time build logs
3. View preview/production URLs

---

## ✅ Success Indicators

- ✅ All steps pass (green checkmarks)
- ✅ Vercel shows deployment complete
- ✅ Your site is live at production URL
- ✅ Environment variables are injected

---

## 🚨 Troubleshooting

### "Unrecognized project format"

- Verify `VERCEL_PROJECT_ID` is correct
- Re-login to Vercel from command line: `vercel login`

### "No authorization provided"

- Check `VERCEL_TOKEN` is valid
- Generate new token from Vercel Dashboard

### Build fails with missing env vars

- Ensure all required secrets are added
- Check secret names match exactly (case-sensitive)

### Deployment successful but site shows errors

- Check Vercel deployment logs
- Verify all API keys are valid
- Run local build: `pnpm build`

---

## 📝 Manual Secret Setup (If UI is Slow)

Using GitHub CLI:

```powershell
gh secret set VERCEL_TOKEN --body "your_token_here"
gh secret set GOOGLE_MAPS_API --body "your_key_here"
# ... repeat for each secret
```

---

## 🔒 Security Best Practices

✅ **Do:**

- Store secrets in GitHub (encrypted at rest)
- Use separate keys for dev/prod
- Rotate tokens monthly
- Use narrowly-scoped API keys

❌ **Don't:**

- Commit secrets to the repo
- Share tokens in chat/email
- Reuse tokens across services
- Store plaintext credentials

---

## 🎯 Next: Auto-Deployment on Every Push

Once you've added all secrets:

1. Commit your changes locally
2. Push to `main` branch
3. GitHub automatically triggers the workflow
4. Your site deploys to Vercel within minutes
5. Check deployment status in Actions/Vercel tabs

**That's it!** Your CI/CD pipeline is now fully automated. 🚀

---

**Last Updated:** December 10, 2025  
**Status:** ✅ Production Ready
