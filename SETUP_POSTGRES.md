# ✅ INSTRUCTIONS: Set up Neon PostgreSQL for this project

## Step 1: Create Free Neon Account

1. Go to: https://console.neon.tech/
2. Sign up (free tier available)
3. Create a new project

## Step 2: Get Connection String

1. In Neon dashboard, go to your project
2. Click "Connection String"
3. Copy the full `postgresql://...` string

## Step 3: Update .env.local

Replace the current DATABASE_URL line with:

```
DATABASE_URL="your-neon-connection-string-here"
```

## Step 4: Run These Commands

```bash
npx prisma generate
npx prisma migrate deploy
node scripts/create-admin.mjs
```

## Why Neon?

✅ Free PostgreSQL (no credit card needed for free tier)
✅ Instant connection string
✅ Works perfectly with Prisma
✅ Can upgrade anytime

## Alternative: Use Supabase

Same steps, but go to https://supabase.com instead

---

Once DATABASE_URL is set to a real PostgreSQL database, all the auth will work!
