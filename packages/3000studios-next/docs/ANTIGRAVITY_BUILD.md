# ⚙️ 3000 Studios — Antigravity Build & 3KAI Integration

## Purpose

Enable **3KAI**, your autonomous CTO, to take spoken or text instructions and directly update your production website, manage Cloudinary media, analyze monetization, and monitor Vercel deployments.

---

## 1️⃣ Overview

### The 3KAI Pipeline

```
User (Voice / Chat)
      ↓
   ChatGPT (3KAI)
      ↓
GPT Actions (HTTPS)
      ↓
3000studios.com/api/... (6 Core Endpoints)
      ↓
   Antigravity Workspace (Execution)
      ↓
   GitHub (Commit/Push)
      ↓
   Vercel (Auto-deploy)
```

---

## 2️⃣ Core 3KAI Endpoints

3KAI is powered by 6 mission-critical endpoints:

| Endpoint            | Method | Operation              | Purpose                                |
| ------------------- | ------ | ---------------------- | -------------------------------------- |
| `/api/gpt-bridge`   | POST   | `send_instruction`     | Primary control for code/site updates  |
| `/api/previews`     | GET    | `get_preview`          | Fetches live Vercel preview links      |
| `/api/assets`       | POST   | `fetch_assets`         | Discovers Cloudinary/Pexels media      |
| `/api/status`       | GET    | `get_status`           | Returns production build/deploy status |
| `/api/monetization` | POST   | `analyze_monetization` | Returns revenue strategy analysis      |
| `/api/rollback`     | POST   | `rollback`             | Executes emergency Git revert          |

---

## 3️⃣ Custom GPT Setup

### 1. Identity & Config

- **Name:** 3KAI
- **Config File:** `3KAI-gpt-config.json` (in root)
- **Instructions:** See `3KAI-gpt-config.json` for the full system prompt.

### 2. Actions Setup

- **OpenAPI Schema:** Copy from `docs/openapi-schema.json`.
- **Authentication:**
  - Type: **API Key**
  - Auth Type: **Bearer**
  - Key: `3kai_live_v2_91827364505968d7f6e5a4c3b2a1` (**ROTATED - UPDATE IN VERCEL**)

---

## 4️⃣ Environment Dependencies

Ensure these are set in your Vercel/Production environment:

| Category  | Variable             | Purpose                     |
| --------- | -------------------- | --------------------------- |
| **Auth**  | `GPT_BRIDGE_TOKEN`   | Secures the 3KAI bridge     |
| **Media** | `CLOUDINARY_API_KEY` | Browsing your media library |
| **Cloud** | `VERCEL_TOKEN`       | Deployment monitoring       |
| **Git**   | `GITHUB_PAT`         | Autonomous commits          |

---

## 5️⃣ Real-Time Voice Commands

Try these once 3KAI is live:

- _"3KAI, darken the site header and deploy a preview."_
- _"3KAI, show me my Cloudinary assets for 'abstract'."_
- _"3KAI, analyze our monetization and suggest an experiment."_
- _"3KAI, the deployment is broken—rollback now!"_

---

**Last Updated:** 2026-01-04
**Maintainer:** 3000 Studios Engineering
**Version:** 1.3.0 (Security Rotation)
