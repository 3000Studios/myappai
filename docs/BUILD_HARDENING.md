# 🧠 3000 Studios — Build Hardening & Error-Safety Configuration

## Purpose

Guarantee that all TypeScript, Next.js, and API code in `3000studios-next` compiles, deploys, and runs without unsafe error handling or type violations. This document is the authoritative configuration for production reliability.

---

## 1️⃣ Global Principles

- **Strict typing only** — no `any`, no unchecked `error.message`.
- **Automatic self-healing** — codemods and lint rules repair violations before build.
- **Zero-downtime deploys** — push to `main` = auto-deploy to Vercel.
- **Predictable safety** — all runtime exceptions are narrowed via `instanceof Error`.

---

## 2️⃣ Type-Safe Catch Pattern (Canonical)

Always use the following pattern in `try/catch` blocks to ensure TypeScript compatibility and runtime safety:

```typescript
catch (error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "Unknown error occurred";

  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}
```

- ✅ Works with TS ≥ 4.4
- ✅ App Router-safe
- ✅ Build-safe
- ✅ No silent runtime failures

---

## 3️⃣ Automatic Repair Script

Use the provided maintenance script to automatically patch unsafe catch blocks across the repository.

**File:** `scripts/fix-catch-unknown.js`

```bash
node scripts/fix-catch-unknown.js
```

---

## 4️⃣ Project Lint & Compiler Enforcement

### `.eslintrc.js`

```javascript
rules: {
  "@typescript-eslint/no-unsafe-member-access": "error",
  "@typescript-eslint/no-unsafe-assignment": "error"
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "useUnknownInCatchVariables": true,
    "noImplicitAny": true,
    "strict": true
  }
}
```

---

## 5️⃣ Verification Checklist

Run these checks before committing to ensure no regressions:

### A. Unsafe catch blocks

```bash
grep -R "catch (error" app lib components pages | grep -v "unknown"
```

### B. Loose any types

```bash
grep -R ":\s*any\b" app lib components pages
```

### C. Raw object returns in routes

```bash
grep -R "return\s\+{" app/api
```

---

## 6️⃣ Clean Build & Deployment Procedure

Always run a clean build locally before pushing critical changes:

```bash
rm -rf .next
pnpm run build
git add -A
git commit -m "fix: type-safe catch blocks and build hardening"
git push origin main
```

---

## 7️⃣ Continuous Protection (CI/CD)

The pre-build hook ensures the repository remains in a healthy state:

```json
{
  "scripts": {
    "prebuild": "node scripts/fix-catch-unknown.js"
  }
}
```

---

**Last Updated:** 2026-01-04
**Maintainer:** 3000 Studios Engineering
**Version:** 1.0.0
