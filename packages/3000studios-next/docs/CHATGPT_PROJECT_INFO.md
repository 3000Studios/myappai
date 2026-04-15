# 🎯 ChatGPT Custom GPT - Project & Workspace Information

This document contains ALL the information you need to provide to your Custom GPT so it can understand and manage your 3000Studios project.

---

## 📁 Project Overview

**Project Name:** 3000 Studios
**Website:** <https://3000studios.com>
**Repository:** `3000Studios/3000studios-next`
**Branch:** `main`
**Framework:** Next.js 14 (App Router)
**Language:** TypeScript (strict mode)
**Package Manager:** pnpm
**Deployment:** Vercel

---

## 🗂️ Workspace Structure

### Root Directory

```
c:\3000Studos-Production\3000studios-next-main\3000studios-next\
```

### Key Directories

```
3000studios-next/
├── app/                    # Next.js App Router (routes & pages)
│   ├── api/               # API routes
│   │   ├── voice/         # Voice command endpoint
│   │   ├── gpt-bridge/    # Custom GPT bridge endpoint
│   │   ├── streaming/     # Live streaming API
│   │   ├── stripe/        # Stripe payment integration
│   │   ├── paypal/        # PayPal payment integration
│   │   └── ...
│   ├── admin/             # Admin dashboard pages
│   ├── blog/              # Blog pages
│   ├── store/             # E-commerce store
│   └── components/        # Page-specific components
│
├── components/            # Reusable UI components
│   ├── FemaleAvatar.tsx   # 3D avatar component
│   ├── Navigation.tsx     # Global navigation
│   ├── VoiceListener.tsx  # Voice recognition
│   └── ...
│
├── voice/                 # Voice command system
│   ├── commands.ts        # Command type definitions
│   ├── router.ts          # Command router
│   ├── handlers/          # Command handlers
│   └── logger.ts          # Command logging
│
├── lib/                   # Utility libraries & systems
│   ├── apiClients.ts      # API client configurations
│   ├── mediaRegistry.ts   # Media asset registry
│   ├── uiRegistry.ts      # UI state registry
│   └── services/          # Business logic services
│
├── design/                # Design system
│   └── brand.ts           # Brand colors & tokens
│
├── public/                # Static assets
│   ├── media/             # Images, videos, audio
│   └── models/            # 3D models
│
├── docs/                  # Documentation
│   ├── CUSTOM_GPT_SETUP.md
│   ├── CUSTOM_GPT_QUICKSTART.md
│   ├── CREDENTIALS.md
│   ├── openapi-schema.json
│   └── README.md
│
└── scripts/               # Automation scripts
    ├── test-gpt-bridge.js
    └── validate-app-structure.mjs
```

---

## 🎨 Brand Identity

### Colors

```typescript
{
  primary: "#FFD700",      // Gold
  secondary: "#0EA5E9",    // Sapphire Blue
  tertiary: "#E5E7EB",     // Platinum/Silver

  background: {
    primary: "#000000",    // Black
    secondary: "#0a0a0a",  // Dark Gray
    elevated: "#111111"    // Slightly lighter
  },

  text: {
    primary: "#FFFFFF",    // White
    secondary: "#9CA3AF"   // Gray
  }
}
```

### Typography

- **Primary Font:** Playfair Display (headings)
- **Secondary Font:** Inter (body text)
- **Monospace:** JetBrains Mono (code)

### Design Style

- **Aesthetic:** Luxury, premium, cyberpunk-inspired
- **Effects:** Glassmorphism, neon glows, 3D shadows
- **Animations:** Smooth transitions, micro-interactions
- **Theme:** Dark mode primary, with gold/sapphire accents

---

## 🔌 API Endpoints

### Voice Command API

```
POST /api/voice
Content-Type: application/json

Body: {
  "type": "UPDATE_TEXT" | "ADD_SECTION" | "ADD_MEDIA" | "CHANGE_STYLE" | "PUBLISH_BLOG",
  // ... command-specific fields
}

OR

Body: {
  "transcript": "natural language command"
}
```

### GPT Bridge API

```
POST /api/gpt-bridge
Authorization: Bearer {GPT_BRIDGE_TOKEN}
Content-Type: application/json

Body: Same as /api/voice
```

### Other Key APIs

- `/api/streaming` - Live stream management
- `/api/stripe/checkout` - Stripe payments
- `/api/paypal/checkout` - PayPal payments
- `/api/news` - News feed
- `/api/weather` - Weather data
- `/api/stock` - Stock market data

---

## 🎯 Voice Command Types

### 1. UPDATE_TEXT

Change text content on pages

```json
{
  "type": "UPDATE_TEXT",
  "text": "New headline text",
  "file": "app/page.tsx", // optional
  "search": "old text", // optional
  "replace": "new text" // optional
}
```

### 2. ADD_SECTION

Add new content sections

```json
{
  "type": "ADD_SECTION",
  "title": "Section Title",
  "content": "Section content (markdown supported)",
  "page": "homepage" // optional
}
```

### 3. ADD_MEDIA

Add images, videos, or audio

```json
{
  "type": "ADD_MEDIA",
  "url": "https://example.com/video.mp4",  // or search query for Pexels
  "mediaType": "video" | "image" | "audio",
  "page": "homepage"             // optional
}
```

**Auto-Pexels Integration:**

- If `url` is not a URL, it searches Pexels automatically
- Example: `"url": "sunset"` → searches Pexels for sunset videos/images

### 4. CHANGE_STYLE

Modify CSS properties or theme settings

```json
{
  "type": "CHANGE_STYLE",
  "property": "primary-color" | "theme" | "accent",
  "value": "#FFD700" | "dark" | "gold",
  "target": ".hero-section"      // optional CSS selector
}
```

### 5. PUBLISH_BLOG

Create and publish blog posts

```json
{
  "type": "PUBLISH_BLOG",
  "title": "Blog Post Title",
  "body": "Blog content (markdown supported)",
  "slug": "url-slug", // optional, auto-generated if not provided
  "topic": "AI" // optional category
}
```

---

## 🔐 Environment Variables

### Required for Production

```bash
# Database
MONGODB_URI=mongodb+srv://...

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Media
PEXELS_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Streaming
MUX_TOKEN_ID=...
MUX_TOKEN_SECRET=...

# GPT Bridge
GPT_BRIDGE_TOKEN=540e9ae3671910efee8e89d378c7a0de35a3207d8a043449e41c5a41ec0

# Site
NEXT_PUBLIC_SITE_URL=https://3000studios.com
```

---

## 📦 Tech Stack

### Core

- **Framework:** Next.js 14.2.18
- **React:** 18.3.1
- **TypeScript:** 5.7.2
- **Styling:** Tailwind CSS 3.4.17

### UI/UX

- **Animations:** Framer Motion 11.15.0
- **3D:** Three.js, React Three Fiber
- **Icons:** Lucide React 0.468.0
- **Video:** Mux Player React

### Backend

- **Database:** MongoDB
- **Payments:** Stripe, PayPal
- **Media:** Cloudinary, Pexels
- **Streaming:** Mux

### Development

- **Package Manager:** pnpm
- **Linting:** ESLint
- **Type Checking:** TypeScript strict mode

---

## 🚀 Deployment

### Platform

**Vercel** (<https://vercel.com>)

### Build Command

```bash
pnpm run build
```

### Deploy Command

```bash
git push origin main
```

Auto-deploys to production on push to `main` branch.

### Environment

- **Production:** <https://3000studios.com>
- **Preview:** Auto-generated for PRs
- **Development:** <http://localhost:3000>

---

## 🎤 Natural Language Examples

Your Custom GPT should understand these commands:

### Media Commands

```
"Add a cinematic city video to the homepage"
"Put a sunset photo in the hero section"
"Show me a professional headshot image"
"Add a truck video"
```

### Text Commands

```
"Change the main headline to 'Welcome to 3000 Studios'"
"Update the tagline to 'Innovation Meets Excellence'"
"Replace 'About Us' with 'Our Story'"
```

### Style Commands

```
"Switch to dark theme with gold accents"
"Make the accent color sapphire"
"Change to light mode"
"Set the primary color to gold"
```

### Blog Commands

```
"Publish a blog post about AI innovation in 2026"
"Write a blog titled 'The Future of Web Development'"
"Create a post about Next.js best practices"
```

### Section Commands

```
"Add a new section about our services"
"Create a testimonials section"
"Add a pricing table to the homepage"
```

---

## 🎯 Project Goals

### Monetization

1. **AdSense:** Prepare for Google AdSense approval
2. **Products:** Sell digital products (sound packs, UI kits, etc.)
3. **Subscriptions:** Premium memberships
4. **Affiliate:** Affiliate product integration

### Features

1. **Voice Control:** Full voice-controlled site management
2. **Live Streaming:** Mux-powered live broadcasts
3. **3D Avatar:** Interactive female avatar assistant
4. **Blog:** AI-generated and manual blog posts
5. **E-commerce:** Stripe + PayPal checkout

### Quality

1. **Performance:** Fast page loads, optimized assets
2. **SEO:** Comprehensive SEO optimization
3. **Accessibility:** WCAG 2.1 AA compliance
4. **Security:** Secure payments, data protection

---

## 🔧 File Patterns

### Route Files

- `app/page.tsx` - Homepage
- `app/blog/page.tsx` - Blog listing
- `app/blog/[slug]/page.tsx` - Individual blog post
- `app/api/*/route.ts` - API endpoints

### Component Files

- `components/*.tsx` - Reusable components
- `app/components/*.tsx` - Page-specific components

### Configuration Files

- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

---

## 📝 Coding Standards

### TypeScript

- **Strict mode:** Enabled
- **No `any`:** Use proper types
- **No `@ts-ignore`:** Use `@ts-expect-error` with explanation

### React

- **Functional components:** Use hooks
- **Client components:** Mark with `"use client"`
- **Server components:** Default (no directive)

### Styling

- **Tailwind first:** Use Tailwind classes
- **Custom CSS:** Only when necessary
- **Responsive:** Mobile-first approach

### API Routes

- **Error handling:** Always use try-catch
- **Type safety:** Validate request bodies
- **Status codes:** Use appropriate HTTP codes

---

## 🎨 Component Examples

### Using Brand Colors

```typescript
import { brand } from '@/design/brand';

<div style={{ color: brand.colors.text.primary }}>
  Content
</div>
```

### Voice Command

```typescript
const result = await fetch('/api/voice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'ADD_MEDIA',
    url: 'sunset',
    mediaType: 'video',
  }),
});
```

---

## 🔍 Important Files to Know

### Core Configuration

- `app/layout.tsx` - Root layout with global styles
- `app/globals.css` - Global CSS styles
- `design/brand.ts` - Brand design tokens

### Voice System

- `voice/commands.ts` - Command type definitions
- `voice/router.ts` - Routes commands to handlers
- `voice/handlers/mutations.ts` - Command implementations

### API Endpoints

- `app/api/voice/route.ts` - Main voice API
- `app/api/gpt-bridge/route.ts` - Custom GPT bridge

### Registries

- `lib/mediaRegistry.ts` - Media asset management
- `lib/uiRegistry.ts` - UI state management

---

## 🎯 Custom GPT Instructions Summary

When creating your Custom GPT, tell it:

1. **Project Context:**
   - "You manage 3000Studios.com, a Next.js website"
   - "The project is in TypeScript with Tailwind CSS"
   - "It uses a luxury, cyberpunk-inspired design"

2. **Your Role:**
   - "You translate natural language into API calls"
   - "You execute voice commands to update the site"
   - "You maintain brand consistency (gold/sapphire/platinum)"

3. **Capabilities:**
   - "You can update text, add media, change styles, publish blogs, and add sections"
   - "You auto-search Pexels for media when given keywords"
   - "You always confirm actions and report results"

4. **Constraints:**
   - "Never delete content without explicit confirmation"
   - "Always use brand colors and design tokens"
   - "Follow TypeScript strict mode and coding standards"

---

## 📞 Support & Documentation

- **Full Setup Guide:** `docs/CUSTOM_GPT_SETUP.md`
- **Quick Start:** `docs/CUSTOM_GPT_QUICKSTART.md`
- **OpenAPI Schema:** `docs/openapi-schema.json`
- **Credentials:** `docs/CREDENTIALS.md` (not in git)

---

## ✅ Quick Reference

### Your GPT Bridge Endpoint

```
https://3000studios.com/api/gpt-bridge
```

### Your Authentication Token

```
GPT_BRIDGE_TOKEN=540e9ae3671910efee8e89d378c7a0de35a3207d8a043449e41c5a41ec0
```

### Test Command (cURL)

```bash
curl -X POST https://3000studios.com/api/gpt-bridge \
  -H "Authorization: Bearer 540e9ae3671910efee8e89d378c7a0de35a3207d8a043449e41c5a41ec0" \
  -H "Content-Type: application/json" \
  -d '{"transcript": "switch to dark theme"}'
```

---

**Last Updated:** 2026-01-04
**Version:** 1.0.0
**Status:** ✅ Ready for Custom GPT Integration
