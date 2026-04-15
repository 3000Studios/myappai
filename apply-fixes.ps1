<#
.SYNOPSIS
  Automated build stabilization and fix application script.

.DESCRIPTION
  This script:
  1. Writes an embedded git patch to disk.
  2. Ensures environment tools (git, pnpm, node) are available.
  3. Detects and optionally removes stray parent lockfiles.
  4. Applies the patch to a new branch.
  5. Installs dependencies and runs validation scripts (prebuild, type-check).
  6. Executes a full build.
  7. Optionally merging and pushing to main.
  8. Optionally running smoke tests on a local production server.

.EXAMPLE
  # Full run, interactively confirm destructive steps
  .\apply-fixes.ps1

  # Full run and push without interactive confirmation
  .\apply-fixes.ps1 -PushDirectly

#>

param(
    [switch]$PatchOnly = $false,
    [switch]$AutoRemoveParentLockfile = $false,
    [switch]$PushDirectly = $false
)

set-strictmode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = (Get-Date).ToString("s")
    Write-Host "[$timestamp] [$Level] $Message"
}

function Ensure-Command {
    param([string]$cmd)
    try {
        & $cmd --version > $null 2>&1
        return $true
    }
    catch {
        return $false
    }
}

# Embedded patch content (mbox-style).
$patchPath = Join-Path -Path (Get-Location) -ChildPath "0001-fix-stabilize-build.patch"
$patchContent = @'
From 0000000000000000000000000000000000000000 Mon Sep 17 00:00:00 2001
From: Copilot <copilot@github.com>
Date: Sat, 10 Jan 2026 00:00:00 +0000
Subject: [PATCH] fix: stabilize build, add admin voice-logs API, env validation, CI updates

- Fix TypeScript catch-variable and logging issues across multiple files
- Add Cloudinary typing fix to avoid never[] inference
- Ensure Mongo service functions return on all code paths
- Add a minimal file-backed admin voice-logs API for dev/prod fallback
- Add env validation helper and .env.example
- Add outputFileTracingRoot to next.config.js to silence multi-lockfile warning
- Add GitHub Actions workflow for build/deploy (example using Vercel)
---
 components/webeditor/EditorMain.tsx   |  12 ++++---------
 lib/apiClients.ts                      |  68 ++++++++++++++++++++++++++++++++++++++-------
 lib/cloudinary.ts                      |  28 ++++++++++++++++----
 lib/env.ts                             |  34 ++++++++++++++++++++++++++
 lib/services/mongodb.ts                |  78 ++++++++++++++++++++++++++++++++++++++++++-------
 app/api/admin/voice-logs/route.ts      | 151 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 next.config.js                         |   9 +++++++++
 .env.example                           |  12 ++++++++++
 .github/workflows/deploy.yml           | 118 +++++++++++++++++++++++++++++++++++++++++++++
 9 files changed, 549 insertions(+), 41 deletions(-)
 create mode 100644 app/api/admin/voice-logs/route.ts
 create mode 100644 lib/env.ts
 create mode 100644 .env.example
 create mode 100644 .github/workflows/deploy.yml

diff --git a/components/webeditor/EditorMain.tsx b/components/webeditor/EditorMain.tsx
index e69de29..0000000 100644
--- a/components/webeditor/EditorMain.tsx
+++ b/components/webeditor/EditorMain.tsx
@@ -1,12 +1,12 @@
 'use client';
 
 /**
  * Web Editor Main
  *
  * NOTE: only the relevant try/catch change is applied here to avoid "Cannot find name 'e'".
  */
 
-import React from 'react';
+import React from 'react';
 
 export default function EditorMain(props: any) {
-  async function syncIfNeeded(config: any, memory: any) {
-    try {
-      await syncMemory(config, memory);
-    } catch (_e) {
-      console.error("", e);
-    }
-  }
+  async function syncIfNeeded(config: any, memory: any) {
+    try {
+      await syncMemory(config, memory);
+    } catch (_e) {
+      // Use the caught variable name (_e). This prevents a TS error referencing `e`.
+      console.error('syncMemory failed', _e);
+    }
+  }
 
   return <div>{/* Editor UI... */}</div>;
 }
diff --git a/lib/apiClients.ts b/lib/apiClients.ts
index 0000000..0000000 100644
--- a/lib/apiClients.ts
+++ b/lib/apiClients.ts
@@ -1,6 +1,71 @@
+/**
+ * API clients and connection helpers.
+ *
+ * This file centralizes Mongo client logic with safe error handling so
+ * the build will not fail due to undefined catch variable usage.
+ */
+
+import { MongoClient } from 'mongodb';
+
+let mongoClient: MongoClient | null = null;
+let isConnecting = false;
+
+export async function getMongoClient(uri?: string) {
+  const mongoUri = uri || process.env.MONGO_URI || process.env.MONGODB_URI;
+  if (!mongoUri) {
+    throw new Error('MONGO_URI or MONGODB_URI environment variable is required');
+  }
+
+  if (mongoClient) return mongoClient;
+  if (isConnecting) {
+    // Wait for existing connect to complete (simple backoff)
+    let tries = 0;
+    while (!mongoClient && tries < 50) {
+      // eslint-disable-next-line no-await-in-loop
+      await new Promise((r) => setTimeout(r, 100));
+      tries++;
+    }
+    if (mongoClient) return mongoClient;
+  }
+
+  isConnecting = true;
+  try {
+    mongoClient = new MongoClient(mongoUri, { connectTimeoutMS: 10000 });
+    await mongoClient.connect();
+    return mongoClient;
+  } catch (err: unknown) {
+    console.error('Failed to connect to MongoDB', err);
+    mongoClient = null;
+    throw err;
+  } finally {
+    isConnecting = false;
+  }
+}
+
+export async function closeMongoClient() {
+  if (mongoClient) {
+    try {
+      await mongoClient.close();
+    } catch (err: unknown) {
+      console.warn('Error closing Mongo client', err);
+    } finally {
+      mongoClient = null;
+    }
+  }
+}
+
+// NOTE: other API client helpers (Stripe, Cloudinary, etc.) live in their own modules.
+
+export default {};
diff --git a/lib/cloudinary.ts b/lib/cloudinary.ts
index 0000000..0000000 100644
--- a/lib/cloudinary.ts
+++ b/lib/cloudinary.ts
@@ -1,17 +1,33 @@
-/**
- * Cloudinary helpers
- */
-
-export function buildCloudinaryUrl(publicId: string, opts: any = {}) {
-  const { width, height, crop = 'fill', gravity = 'auto' } = opts;
-  const transforms = [];
-
-  if (width || height || crop || gravity) {
-    const w = width ? `w_${width}` : '';
-    const h = height ? `h_${height}` : '';
-    transforms.push([w, h, `c_${crop}`, `g_${gravity}`].filter(Boolean).join(','));
-  }
-
-  const transformation = transforms.join('/');
-  return `https://res.cloudinary.com/your-cloud-name/image/upload/${transformation}/${publicId}`;
-}
+/**
+ * Cloudinary helpers
+ *
+ * Ensure transforms array has an explicit element type so TypeScript does not infer never[].
+ */
+
+export function buildCloudinaryUrl(
+  publicId: string,
+  opts: { width?: number; height?: number; crop?: string; gravity?: string } = {}
+) {
+  const { width, height, crop = 'fill', gravity = 'auto' } = opts;
+  const transforms: string[] = [];
+
+  if (width || height || crop || gravity) {
+    const w = width ? `w_${width}` : '';
+    const h = height ? `h_${height}` : '';
+    transforms.push([w, h, `c_${crop}`, `g_${gravity}`].filter(Boolean).join(','));
+  }
+
+  const transformation = transforms.join('/');
+  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'}/image/upload/${transformation}/${publicId}`;
+}
diff --git a/lib/env.ts b/lib/env.ts
new file mode 100644
index 0000000..0000000
--- /dev/null
+++ b/lib/env.ts
@@ -0,0 +1,34 @@
+/**
+ * lib/env.ts
+ *
+ * Simple environment validation helper used in CI and at runtime to fail fast
+ * when required environment variables are missing.
+ */
+
+export function validateEnv(required: string[] = []) {
+  const missing: string[] = [];
+  for (const k of required) {
+    const v = process.env[k];
+    if (!v || String(v).trim() === '') missing.push(k);
+  }
+
+  if (missing.length > 0) {
+    const message = `Missing required environment variables: ${missing.join(', ')}`;
+    if (process.env.NODE_ENV === 'production') {
+      throw new Error(message);
+    } else {
+      // In dev warn rather than throwing
+      // eslint-disable-next-line no-console
+      console.warn(message);
+    }
+  }
+
+  return missing;
+}
diff --git a/lib/services/mongodb.ts b/lib/services/mongodb.ts
index e69de29..0000000 100644
--- a/lib/services/mongodb.ts
+++ b/lib/services/mongodb.ts
@@ -1,1 +1,79 @@
+/**
+ * Mongo-backed services
+ *
+ * Provides getProduct with consistent return values and safe error handling.
+ */
+
+import { getMongoClient } from '../apiClients';
+
+export type Product = {
+  id: string;
+  title: string;
+  price: number;
+  // extend with additional fields if necessary
+};
+
+export async function getProduct(productId: string): Promise<Product | null> {
+  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
+  if (!mongoUri) {
+    // No DB configured; return null so callers can handle absence gracefully.
+    console.warn('getProduct: no Mongo URI provided');
+    return null;
+  }
+
+  try {
+    const client = await getMongoClient(mongoUri);
+    const dbName = process.env.MONGO_DB_NAME || undefined;
+    const db = dbName ? client.db(dbName) : client.db();
+    const doc = await db.collection('products').findOne({ _id: productId });
+    if (!doc) return null;
+
+    const product: Product = {
+      id: String(doc._id),
+      title: String(doc.title ?? ''),
+      price: Number(doc.price ?? 0),
+    };
+
+    return product;
+  } catch (err: unknown) {
+    console.error('getProduct error', err);
+    return null;
+  }
+}
+
+// You can add additional Mongo-backed helpers below (createProduct, listProducts, etc.)
+
+export default {};
diff --git a/app/api/admin/voice-logs/route.ts b/app/api/admin/voice-logs/route.ts
new file mode 100644
index 0000000..0000000
--- /dev/null
+++ b/app/api/admin/voice-logs/route.ts
@@ -0,0 +1,151 @@
+import { NextRequest, NextResponse } from 'next/server';
+import { promises as fs } from 'fs';
+import path from 'path';
+
+/**
+ * Minimal admin voice-logs API.
+ *
+ * - GET: returns last N logs (default 100)
+ * - POST: { action: 'clear' } to remove logs
+ *         { action: 'append', entry: {...} } to append a log (dev)
+ *
+ * Persisted to .data/voice-logs.json in project root for simplicity.
+ * Replace with DB-backed storage (Prisma/Mongo) for production.
+ */
+
+const DATA_DIR = path.join(process.cwd(), '.data');
+const LOG_FILE = path.join(DATA_DIR, 'voice-logs.json');
+
+async function ensureStore() {
+  try {
+    await fs.mkdir(DATA_DIR, { recursive: true });
+    try {
+      await fs.access(LOG_FILE);
+    } catch {
+      await fs.writeFile(LOG_FILE, JSON.stringify([], null, 2), 'utf-8');
+    }
+  } catch (err) {
+    // ignore; read/write will fail later if needed
+    console.warn('ensureStore warning', err);
+  }
+}
+
+async function readLogs(): Promise<any[]> {
+  await ensureStore();
+  try {
+    const raw = await fs.readFile(LOG_FILE, 'utf-8');
+    return JSON.parse(raw || '[]');
+  } catch (err) {
+    console.error('readLogs error', err);
+    return [];
+  }
+}
+
+async function writeLogs(logs: any[]) {
+  await ensureStore();
+  await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
+}
+
+export async function GET(request: NextRequest) {
+  try {
+    const url = new URL(request.url);
+    const limit = Number(url.searchParams.get('limit') || '100');
+    const logs = await readLogs();
+    return NextResponse.json({ logs: logs.slice(0, limit) });
+  } catch (err) {
+    console.error('GET /api/admin/voice-logs failed', err);
+    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
+  }
+}
+
+export async function POST(request: NextRequest) {
+  try {
+    const body = await request.json().catch(() => null);
+    if (!body || !body.action) {
+      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
+    }
+
+    if (body.action === 'clear') {
+      await writeLogs([]);
+      return NextResponse.json({ success: true });
+    }
+
+    if (body.action === 'append' && body.entry) {
+      const logs = await readLogs();
+      logs.unshift(body.entry);
+      await writeLogs(logs);
+      return NextResponse.json({ success: true });
+    }
+
+    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
+  } catch (err) {
+    console.error('POST /api/admin/voice-logs failed', err);
+    return NextResponse.json({ error: 'Failed to write logs' }, { status: 500 });
+  }
+}
+diff --git a/next.config.js b/next.config.js
+new file mode 100644
+index 0000000..0000000
+--- /dev/null
++++ b/next.config.js
@@ -0,0 +1,9 @@
+const path = require('path');
+
+/** @type {import('next').NextConfig} */
+module.exports = {
+  // This helps Next.js correctly infer the workspace root when multiple lockfiles exist
+  outputFileTracingRoot: path.resolve(__dirname),
+  // Keep other Next.js config values (e.g., experimental) in your existing file if present.
+};
+diff --git a/.env.example b/.env.example
+new file mode 100644
+index 0000000..0000000
+--- /dev/null
++++ b/.env.example
@@ -0,0 +1,12 @@
+# Example environment variables for local development
+DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
+MONGO_URI=mongodb://localhost:27017
+MONGO_DB_NAME=3000studios
+NEXT_PUBLIC_API_URL=http://localhost:3000
+NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
+NEXTAUTH_SECRET=dev-secret
+# Add provider keys below:
+# STRIPE_SECRET_KEY=
+# OPENAI_API_KEY=
+diff --git fix: stabilize build b/.github/workflows/deploy.yml
+new file mode 100644
+index 0000000..0000000
+--- /dev/null
++++ b/.github/workflows/deploy.yml
@@ -0,0 +1,118 @@
+name: CI / Build / Deploy
+
+on:
+  push:
+    branches: [ main ]
+  pull_request:
+    branches: [ main ]
+
+jobs:
+  build:
+    runs-on: ubuntu-latest
+    env:
+      CI: true
+    steps:
+      - name: Checkout repo
+        uses: actions/checkout@v4
+
+      - name: Setup Node.js
+        uses: actions/setup-node@v4
+        with:
+          node-version: '20'
+          cache: 'pnpm'
+
+      - name: Setup pnpm
+        uses: pnpm/action-setup@v2
+        with:
+          version: 8
+
+      - name: Install dependencies
+        run: pnpm install --frozen-lockfile
+
+      - name: Validate env variables
+        run: |
+          node -e "const { validateEnv } = require('./lib/env'); const missing = validateEnv(['DATABASE_URL','NEXTAUTH_SECRET']); if (missing && missing.length) { console.error('Missing envs:', missing); process.exit(1); }"
+        env:
+          DATABASE_URL: ${{ secrets.DATABASE_URL }}
+          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
+
+      - name: Run prebuild validations
+        run: pnpm run prebuild
+
+      - name: Type check
+        run: pnpm run type-check
+
+      - name: Build
+        run: pnpm run build
+
+      - name: Upload build artifact
+        uses: actions/upload-artifact@v4
+        with:
+          name: next-build
+          path: .next
+
+  deploy:
+    needs: build
+    runs-on: ubuntu-latest
+    if: github.ref == 'refs/heads/main'
+    steps:
+      - name: Checkout code
+        uses: actions/checkout@v4
+
+      - name: Download build artifact
+        uses: actions/download-artifact@v4
+        with:
+          name: next-build
+          path: .next
+
+      # Example deployment step. Replace with your hosting provider (Vercel/Netlify/Fly/etc.)
+      - name: Deploy to Vercel (if VERCEL_TOKEN provided)
+        if: ${{ secrets.VERCEL_TOKEN != '' }}
+        env:
+          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
+        run: |
+          npm i -g vercel
+          vercel --prod --token $VERCEL_TOKEN
+
+      - name: Deployment completed notice
+        run: echo "Deployment job finished (check logs for deploy provider status)."
+
+# Note:
+# - Set required secrets (DATABASE_URL, NEXTAUTH_SECRET, VERCEL_TOKEN) in the repository settings.
+# - Replace the Vercel deploy step with any provider-specific CLI you use in production.
+
+-- 
+2.42.0
+'@

try {
  # Basic environment checks
  Write-Log "Starting apply-fixes script" "START"

  if (-not (Test-Path -Path ".git")) {
    throw "This script must be run from the repository root (where .git and package.json are located)."
  }

  if ($PatchOnly) {
    Write-Log "Writing patch file to $patchPath and exiting (PatchOnly requested)" "INFO"
    $patchContent | Out-File -FilePath $patchPath -Encoding utf8 -Force
    Write-Log "Patch written. You can inspect/modify and apply manually: git am $patchPath" "DONE"
    exit 0
  }

  # Write the patch file
  Write-Log "Writing patch file to $patchPath" "INFO"
  $patchContent | Out-File -FilePath $patchPath -Encoding utf8 -Force

  # Ensure required tools exist
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "git is required but not found in PATH."
  }
  if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    throw "pnpm is required but not found in PATH. Install pnpm first: npm i -g pnpm"
  }
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "node is required but not found in PATH."
  }

  # Save current branch and working tree state
  $currentBranch = (& git rev-parse --abbrev-ref HEAD).Trim()
  Write-Log "Current git branch: $currentBranch" "INFO"

  $status = (& git status --porcelain)
  if ($status) {
    Write-Log "Working tree is not clean. Please commit or stash changes before running this script." "ERROR"
    throw "Working tree must be clean."
  }

  # Fetch and update local main
  Write-Log "Fetching origin and updating main" "INFO"
  & git fetch origin --prune
  if (-not (& git show-ref --verify --quiet refs/heads/main)) {
    Write-Log "Local main branch not found. Creating from origin/main" "INFO"
    & git checkout -b main origin/main
  } else {
    & git checkout main
    & git pull origin main --rebase
  }

  # Detect stray pnpm-lock.yaml in parent folders (up to drive root)
  $repoRoot = Get-Location
  $parent = Split-Path -Parent $repoRoot
  $strayLockfiles = @()
  while ($parent -and ($parent -ne $repoRoot) -and (Test-Path $parent)) {
    $candidate = Join-Path $parent "pnpm-lock.yaml"
    if (Test-Path $candidate) {
      $strayLockfiles += $candidate
    }
    # move up
    $repoRoot = $parent
    $parent = Split-Path -Parent $repoRoot
  }

  if ($strayLockfiles.Count -gt 0) {
    Write-Log "Found potential stray pnpm-lock.yaml files:" "WARN"
    $strayLockfiles | ForEach-Object { Write-Host " - $_" }

    if ($AutoRemoveParentLockfile) {
      foreach ($f in $strayLockfiles) {
        Write-Log "Removing stray lockfile $f (AutoRemoveParentLockfile enabled)" "INFO"
        Remove-Item -Path $f -Force -ErrorAction SilentlyContinue
      }
    } else {
      $remove = Read-Host "Remove these stray lockfiles? (y/N)"
      if ($remove -match '^(y|Y)') {
        foreach ($f in $strayLockfiles) {
          Write-Log "Removing $f" "INFO"
          Remove-Item -Path $f -Force -ErrorAction SilentlyContinue
        }
      } else {
        Write-Log "Skipping removal of stray lockfiles. You may still see Next.js warning. Continue? (y/N)" "WARN"
        $cont = Read-Host "Continue despite stray lockfiles?"
        if ($cont -notmatch '^(y|Y)') {
          throw "User aborted due to stray lockfiles."
        }
      }
    }
  } else {
    Write-Log "No stray pnpm-lock.yaml files found in parent directories" "INFO"
  }

  # Create a branch to apply changes. We'll apply patches on a branch then allow push to main optionally.
  $workBranch = "fix/stabilize-build-0001"
  if (& git show-ref --verify --quiet "refs/heads/$workBranch") {
    Write-Log "Branch $workBranch already exists locally; deleting to recreate." "INFO"
    & git branch -D $workBranch
  }
  Write-Log "Creating and checking out $workBranch" "INFO"
  & git checkout -b $workBranch

  # Apply the patch using git am
  Write-Log "Applying patch $patchPath with git am" "INFO"
  try {
    & git am $patchPath
    Write-Log "Patch applied cleanly via git am" "INFO"
  } catch {
    Write-Log "git am failed. Attempting git am --abort and fallback apply" "WARN"
    try { & git am --abort } catch {}
    # fallback to git apply
    try {
      & git apply --index --reject --whitespace=fix $patchPath
      Write-Log "git apply succeeded (with possible .rej files). Now adding and committing changes." "INFO"
      & git add -A
      & git commit -m "chore: apply stabilization patch (fallback apply)"
    } catch {
      Write-Log "git apply also failed. You must resolve conflicts manually." "ERROR"
      throw "Patch application failed. Resolve conflicts manually with 'git am' or 'git apply'."
    }
  }

  # Run dependency install
  Write-Log "Installing dependencies with pnpm" "INFO"
  & pnpm install --frozen-lockfile

  # Run prebuild validation if present
  if ((Get-Command pnpm -ErrorAction SilentlyContinue) -and (Test-Path "package.json")) {
    $scriptList = (& pnpm -s -c "run") -split "`n" | Out-String
    # Just run prebuild if it's a script in package.json
    $pkg = Get-Content package.json -Raw | ConvertFrom-Json
    if ($pkg.scripts -and $pkg.scripts.prebuild) {
      Write-Log "Running pnpm run prebuild" "INFO"
      & pnpm run prebuild
    } else {
      Write-Log "No prebuild script found, skipping" "INFO"
    }
  }

  # Type-check
  if ($pkg.scripts -and $pkg.scripts.'type-check') {
    Write-Log "Running pnpm run type-check" "INFO"
    & pnpm run type-check
  } else {
    Write-Log "No type-check script defined, skipping ts type-check step" "WARN"
  }

  # Build
  Write-Log "Running pnpm run build" "INFO"
  try {
    & pnpm run build 2>&1 | Tee-Object -Variable buildOutput -FilePath ".apply-fixes-build.log"
    Write-Log "Build finished. Log written to .\apply-fixes-build.log" "INFO"
  } catch {
    Write-Log "Build failed. Tail of recent logs:" "ERROR"
    Get-Content .\apply-fixes-build.log -Tail 200 | ForEach-Object { Write-Host $_ }
    throw "Build failed. Check .\apply-fixes-build.log for details."
  }

  # Commit (if any uncommitted changes remain)
  $postStatus = (& git status --porcelain)
  if ($postStatus) {
    Write-Log "Staged/Unstaged changes detected after build; committing them to $workBranch" "INFO"
    & git add -A
    & git commit -m "fix: stabilization, add admin voice-logs API, env validation, next config, CI workflow"
  } else {
    Write-Log "No additional uncommitted changes after build" "INFO"
  }

  # Offer to push branch or merge to main
  if ($PushDirectly) {
    Write-Log "PushDirectly enabled - will merge branch into main and push" "WARN"
    & git checkout main
    & git merge --no-ff $workBranch -m "chore: merge stabilization fixes from $workBranch"
    Write-Log "Pushing main to origin" "INFO"
    & git push origin main
  } else {
    Write-Log "By default we will push the working branch and leave main untouched." "INFO"
    $pushBranch = Read-Host "Push branch $workBranch to origin and open a PR? (y = push only, m = merge to main & push, n = don't push)"
    if ($pushBranch -match '^(y|Y)') {
      & git push -u origin $workBranch
      Write-Log "Branch pushed: origin/$workBranch" "INFO"
      Write-Log "Open a PR from $workBranch -> main in GitHub to review and merge." "DONE"
    } elseif ($pushBranch -match '^(m|M)') {
      Write-Log "Merging $workBranch into main locally and pushing origin/main" "WARN"
      & git checkout main
      & git merge --no-ff $workBranch -m "chore: merge stabilization fixes from $workBranch"
      & git push origin main
      Write-Log "Pushed merged main to origin/main" "DONE"
    } else {
      Write-Log "Skipping push. Local branch $workBranch contains the changes." "INFO"
    }
  }

  # Start production server for smoke tests if next start is available
  $doSmoke = Read-Host "Run quick smoke tests by starting the production server (requires NEXT_PUBLIC_API_URL or default http://localhost:3000)? (y/N)"
  if ($doSmoke -match '^(y|Y)') {
    # Ensure .env or environment variables exist
    if (-not (Test-Path ".env")) {
      Write-Log ".env not found. Creating a temporary .env from .env.example if present" "WARN"
      if (Test-Path ".env.example") {
        Copy-Item -Path ".env.example" -Destination ".env" -Force
        Write-Log "Copied .env.example -> .env (you may want to edit secrets before starting server)" "INFO"
      } else {
        Write-Log "No .env.example available; server may require secrets to run. Continuing anyway." "WARN"
      }
    }

    # Start production server (pnpm start)
    Write-Log "Starting production server: pnpm start" "INFO"
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = "pnpm"
    $startInfo.Arguments = "start"
    $startInfo.WorkingDirectory = (Get-Location).Path
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $startInfo.UseShellExecute = $false
    $startInfo.CreateNoWindow = $true

    $proc = New-Object System.Diagnostics.Process
    $proc.StartInfo = $startInfo
    $proc.Start() | Out-Null

    # Give server some time to boot and poll root URL
    $maxAttempts = 60
    $attempt = 0
    $ok = $false
    while ($attempt -lt $maxAttempts) {
      Start-Sleep -Seconds 2
      try {
        $resp = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:3000/" -TimeoutSec 3 -ErrorAction Stop
        if ($resp.StatusCode -eq 200) {
          $ok = $true
          break
        }
      } catch {
        # continue
      }
      $attempt++
    }

    if (-not $ok) {
      Write-Log "Server did not respond on http://localhost:3000 after $($maxAttempts*2) seconds. Check logs." "ERROR"
      # Capture some of server stdout/stderr
      try {
        $out = $proc.StandardOutput.ReadToEnd()
        $err = $proc.StandardError.ReadToEnd()
        $out | Out-File -FilePath ".apply-fixes-server-out.log" -Encoding utf8
        $err | Out-File -FilePath ".apply-fixes-server-err.log" -Encoding utf8
        Write-Log "Server stdout/stderr saved to .apply-fixes-server-*.log" "INFO"
      } catch {
        Write-Log "Unable to capture server logs." "WARN"
      }
      # Stop process
      try { $proc.Kill() } catch {}
      throw "Smoke test failed: server not responding"
    }

    Write-Log "Server responded. Performing simple smoke tests..." "INFO"
    $tests = @(
      @{ Name = "GET /api/admin/voice-logs"; Url = "http://localhost:3000/api/admin/voice-logs" },
      @{ Name = "GET /admin/voice-logs page"; Url = "http://localhost:3000/admin/voice-logs" },
      @{ Name = "GET /admin page"; Url = "http://localhost:3000/admin" }
    )

    foreach ($t in $tests) {
      try {
        $r = Invoke-WebRequest -UseBasicParsing -Uri $t.Url -TimeoutSec 5 -ErrorAction Stop
        Write-Log "$($t.Name): HTTP $($r.StatusCode)" "INFO"
      } catch {
        Write-Log "$($t.Name) failed: $($_.Exception.Message)" "ERROR"
      }
    }

    Write-Log "Stopping production server" "INFO"
    try {
      $proc.Kill()
    } catch {
      Write-Log "Failed to stop server process: $($_.Exception.Message)" "WARN"
    }
  } else {
    Write-Log "Skipping smoke tests as requested" "INFO"
  }

  Write-Log "apply-fixes script completed successfully" "DONE"
  exit 0

} catch {
  Write-Log "Fatal error: $($_.Exception.Message)" "FATAL"
  Write-Host "StackTrace:" -ForegroundColor Red
  $_.Exception.StackTrace
  # Keep patch file for manual investigation
  Write-Log "Patch file left at $patchPath for manual application/inspection" "INFO"
  exit 1
}
