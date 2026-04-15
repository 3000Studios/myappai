# 3000 Studios Architecture Documentation

## Overview

3000 Studios is a modern Next.js 16 application built with TypeScript, TailwindCSS 4, and integrated with multiple third-party services for AI, payments, analytics, and deployment.

## Tech Stack

### Core

- **Framework**: Next.js 16.0.7 (App Router)
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4 with PostCSS
- **Package Manager**: pnpm 10.25.0

### Key Dependencies

- **AI Services**: OpenAI, Anthropic Claude, Google Gemini
- **Payments**: PayPal, Stripe
- **Database**: MongoDB Atlas
- **3D Graphics**: Three.js, React Three Fiber
- **Animation**: Framer Motion
- **Real-time**: Socket.io, WebRTC (Simple Peer)
- **CMS**: WordPress API integration
- **Analytics**: Vercel Analytics
- **Version Control**: GitHub API integration via Octokit

## Project Structure

```
/src
  /app              # Next.js 16 App Router
    /api            # API Routes
    /components     # Shared UI Components
    /[pages]        # Route pages (blog, store, matrix, etc.)
  /hooks            # Custom React Hooks
  /lib              # Utilities and Services
    /services       # Third-party service integrations
```

## API Routes

### Products & E-Commerce

- `GET /api/products` - Fetch products from MongoDB
- `POST /api/paypal/create-order` - Create PayPal order
- `POST /api/paypal/capture-order` - Capture PayPal payment

### Content Generation

- `POST /api/content/generate-product` - Generate product descriptions with AI
- `POST /api/content/generate-blog` - Generate blog posts with AI

### Live Streaming

- `POST /api/streaming/start` - Initialize WebRTC stream
- `GET /api/streaming/status` - Get stream status
- `POST /api/streaming/stop` - Stop stream

### Deployment & Analytics

- `POST /api/deployment/trigger` - Trigger Vercel deployment
- `GET /api/deployment/status` - Check deployment status
- `GET /api/analytics` - Fetch MongoDB analytics

### AI & Automation

- `POST /api/voice-to-code` - Voice-to-code generation with OpenAI

## Services Integration

### AI Services

- **OpenAI**: Voice-to-code, content generation, transcription
- **Claude**: Code review, advanced generation
- **Gemini**: Multimodal AI for image analysis

### Payment Processing

- **PayPal**: Primary payment processor with affiliate tracking
- **Stripe**: Alternative payment method (configured)

### Database

- **MongoDB Atlas**: Main database for products, orders, analytics, and user activities

### Hosting & Deployment

- **Vercel**: Automated deployments with preview/production
- **IONOS**: Backup hosting configuration

### Communication

- **Twilio**: SMS and voice notifications
- **WebRTC**: Real-time video streaming

## Environment Variables

All required environment variables are documented in `.env.example`. Copy to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Key variables include:

- Admin credentials
- AI API keys (OpenAI, Claude, Gemini)
- Payment processors (PayPal, Stripe)
- MongoDB connection strings
- WordPress CMS credentials
- Twilio communication
- Vercel deployment tokens
- GitHub PAT for automation

## Build & Deploy

### Local Development

```bash
pnpm install
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

### Linting

```bash
npx eslint src --ext .ts,.tsx
```

## CI/CD Workflows

All GitHub Actions workflows use **pnpm** for consistency:

1. **CI** (`ci.yml`) - Runs on PRs: lint, test, build
2. **Deploy** (`deploy.yml`) - Staging and production deployment
3. **Vercel Deploy** (`vercel-deploy.yml`) - Production deploys via Vercel
4. **Vercel Preview** (`vercel-preview.yml`) - PR preview deploys
5. **Daily Rebuild** (`daily-rebuild.yml`) - Scheduled daily rebuilds
6. **Watchdog** (`watchdog.yml`) - Monitors deployment health
7. **Sync Main** (`sync-main-to-branches.yml`) - Branch synchronization

## Features

### Premium UI Components

- Video wallpaper backgrounds
- Gravity-physics footer
- Background music engine
- Smooth scroll behavior
- Interactive sound effects
- Particle effects

### Business Features

- Real-time analytics dashboard (Matrix)
- AI-powered content generation
- Live streaming with WebRTC
- E-commerce with PayPal/Stripe
- Affiliate product tracking
- Newsletter subscriptions
- Blog with auto-generated content

### Performance & SEO

- Static optimization where possible
- Image optimization
- Code splitting
- Meta tags for all pages
- Sitemap generation (recommended)

## Security Best Practices

1. **Never commit** `.env.local` or secrets
2. **Use environment variables** for all API keys
3. **Validate inputs** on all API routes
4. **Sanitize user data** before database insertion
5. **Use HTTPS** in production
6. **Rate limiting** on sensitive endpoints (recommended)

## Maintenance

### Regular Tasks

- Update dependencies: `pnpm update`
- Security audit: `pnpm audit`
- Build verification: `pnpm build`
- TypeScript check: `pnpm tsc --noEmit`

### Monitoring

- Check Vercel deployment logs
- Monitor MongoDB usage and performance
- Review API rate limits (OpenAI, PayPal, etc.)
- Track error logs in Vercel dashboard

## Contributing

1. Create feature branch from `main`
2. Make changes following TypeScript and ESLint rules
3. Run `pnpm build` to verify build success
4. Submit PR for review
5. All CI checks must pass

## Support

For issues or questions:

- Review documentation in `/docs`
- Check GitHub Issues
- Contact: mr.jwswain@gmail.com (Boss Man J)

---

**Shadow Overlord** maintains this architecture and ensures production stability.
