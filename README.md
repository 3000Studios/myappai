# 3000 Studios — Professional Creative Studio Platform

A modern Next.js 16 application with a luxury design theme, robust page structure, and fully automated CI/CD pipeline. Features Shadow AI avatars, voice-to-code editing, live streaming, and self-healing deployments.

## 🤖 Automation

This repository is fully automated.

All commits are validated, fixed, and deployed automatically via CI/CD.
Manual deployment steps are not required.

See:

- [AUTOMATION.md](./AUTOMATION.md)
- [TRANSFORMATION_COMPLETE.md](./TRANSFORMATION_COMPLETE.md)
- [VOICE_API_SPEC.md](./VOICE_API_SPEC.md)

## 🚀 Features

### Current Implementation (v1.0)

- **Professional UI/UX**: Luxury gold/platinum/sapphire color scheme with glass morphism effects
- **Responsive Design**: Mobile-first approach with smooth animations and transitions
- **Complete Page Structure**:
  - **Home**: Hero section with feature highlights
  - **Store**: Product catalog with filtering and search
  - **Projects**: Portfolio showcase with categories
  - **Portfolio**: Professional work display with testimonials
  - **Blog**: Content management with articles
  - **Live**: Livestream viewer page
  - **Contact**: Form with contact information
  - **Login**: Secure authentication gateway
  - **Matrix**: Admin dashboard (command center)

### Advanced Features (In Development)

- 🤖 **Shadow AI Avatar**: 3D conversational AI assistant for visitors
- 🎙️ **Voice-to-Code Editor**: AI-powered site editing via voice commands
- 📺 **Live Streaming**: Full broadcast system with chat integration
- 🛒 **10,000+ Product Store**: AI-powered product generation and management
- 💳 **Payment Integration**: Stripe and PayPal checkout
- 📊 **Real-time Analytics**: Visitor tracking, heatmaps, and insights
- 🎨 **Dynamic Theming**: Live video backgrounds and music rotation

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4, Tailwind Animate
- **UI/Icons**: Lucide React, Framer Motion, GSAP
- **Database**: PostgreSQL + Prisma (pgvector enabled)
- **Auth**: NextAuth
- **AI**: OpenAI, Anthropic, Google GenAI SDKs
- **Streaming**: Mux player + server SDK
- **Payments**: Stripe + PayPal SDKs
- **Testing**: Vitest (+ UI)
- **Deployment**: Vercel (CLI + project config)

## 📦 Prerequisites

- Node.js 20.x (see `engines` in package.json)
- A Postgres database (local or hosted)
- Vercel account (for production deployment)

## 🧰 Installation & Setup

Install dependencies:

```bash
npm install
```

Create environment variables file:

```bash
cp .env.example .env.local
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

### Common Scripts

- `npm run dev`: Start local dev server
- `npm run build`: Build the app
- `npm start`: Serve a production build
- `npm run lint`: Lint `src/**/*.{ts,tsx}`
- `npm run type-check`: TypeScript type checking
- `npm run test`: Run tests (Vitest)
- `npm run test:ui`: Run tests with UI
- `npm run deploy`: Deploy via Vercel CLI
- `npm run db:seed`: Seed database (requires `DATABASE_URL`)

## 🔐 Environment Variables

Create a `.env.local` file at the repo root. See `.env.example` if present. Common variables:

```env
# Database
DATABASE_URL="postgresql://USER:PASS@HOST:5432/DBNAME?schema=public"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-strong-secret"

# Payments (optional)
STRIPE_SECRET_KEY="sk_live_or_test"
PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."

# Streaming (optional)
MUX_TOKEN_ID="..."
MUX_TOKEN_SECRET="..."

# Admin bootstrap (optional)
ADMIN_EMAIL="your-admin-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

Notes:

- The `postinstall` script runs `prisma generate` and respects `DATABASE_URL`.
- Add production environment variables in Vercel Project Settings.
- ⚠️ Never commit real credentials.

## 📁 Project Structure (key folders)

```txt
app/                    # Next.js App Router pages
  ├─ page.tsx           # Home
  ├─ store/             # Storefront
  ├─ projects/          # Projects showcase
  ├─ blog/              # Blog
  ├─ live/              # Livestream viewer
  ├─ login/             # Auth gateway
  ├─ dashboard/         # Admin / production dashboard
  ├─ studio/            # Studio tooling
  ├─ experience/        # Experience pages
  ├─ shadow-login/      # Shadow auth entry
  └─ api/               # Route handlers

components/             # Reusable UI components
brain/                  # LLM fusion, voice, neural core modules
shadow-engine/          # Shadow system engine
shadow/                 # Shadow system UI and utilities
prisma/                 # Prisma schema & seeds
public/                 # Static assets
scripts/                # CLI / automation scripts
src/                    # Additional source modules
types/                  # Shared TypeScript types
```

See also:

- [QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md)
- [DEPLOYMENT_INSTRUCTIONS.md](DEPLOYMENT_INSTRUCTIONS.md)
- [TASK_COMPLETION_SUMMARY.md](TASK_COMPLETION_SUMMARY.md)

## 🎨 Customization Guide

### Colors and Theme

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --gold: #ffd700; /* Primary accent */
  --platinum: #e5e4e2; /* Secondary accent */
  --sapphire: #0f52ba; /* Highlight color */
}
```

### Navigation Links

Update navigation links within the relevant header/nav components under `components/`.

```typescript
const navLinks = [
  { href: '/', label: 'Home' },
  // Add or remove links as needed
];
```

### Admin Dashboard Stats

Customize stats in `app/dashboard/` views.

```typescript
// Update values in the StatCard components
```

## 🚧 Development Roadmap

### Phase 1: Foundation ✅ (Completed)

- [x] Project setup and configuration
- [x] All core pages implemented
- [x] Navigation and routing
- [x] Professional UI/UX design
- [x] Responsive layouts

### Phase 2: Integration (Next)

- [ ] Backend API routes
- [ ] Database integration (Prisma + Postgres)
- [ ] Authentication system (NextAuth)
- [ ] Payment processing (Stripe/PayPal)
- [ ] Email service integration

### Phase 3: Advanced Features

- [ ] Shadow AI Avatar (3D model integration)
- [ ] Voice-to-code editor
- [ ] Live streaming infrastructure
- [ ] Real-time analytics dashboard
- [ ] AI product generation

### Phase 4: Polish & Scale

- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Accessibility enhancements
- [ ] Comprehensive testing
- [ ] Load testing for high traffic

## 📝 File Naming Convention

All files include descriptive header comments explaining:

- Purpose of the file
- Key features included
- Customization sections (where applicable)
- Future enhancement notes

Example:

```typescript
/**
 * Navigation Component
 * Main site navigation bar with responsive design
 * Features: Mobile menu, active link highlighting, smooth transitions
 */
```

## 🔒 Security Notes

1. **Never commit credentials**: Use `.env.local` for sensitive data
2. **Admin authentication**: Production version requires secure backend
3. **Payment processing**: Use environment variables for API keys
4. **HTTPS only**: Enforce secure connections in production

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables in Vercel settings
4. Deploy automatically

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Manual Deployment

```bash
npm run build
npm start
```

### VS Code Tasks

This workspace defines convenient tasks under VS Code:

- "dev" — starts the Next.js development server (background)
- "lint" — runs ESLint
- "typecheck" — runs TypeScript checks
- "test" — runs Vitest
- "build" — builds the app
- "deploy" — deploys via Vercel CLI (depends on build)
- "FULL AUTOPILOT: lint → typecheck → test → build → deploy" — runs all in sequence
- "🚀 AUTOPILOT: Merge & Deploy" — automated merge + deploy scripts

Run them via Terminal → Run Task.

## 📊 Performance

- **Build**: Optimized with Next.js Turbopack
- **Static Generation**: All pages pre-rendered
- **Code Splitting**: Automatic chunk optimization
- **Image Optimization**: Next.js Image component

## 🐛 Known Issues & Future Fixes

1. **Font Loading**: Temporarily using system fonts (Google Fonts connection blocked)
2. **Form Submission**: Placeholder logic - needs backend integration
3. **Payment**: Mock checkout - requires Stripe/PayPal setup
4. **Live Streaming**: UI only - needs video service integration

## 💡 Contributing

This is a proprietary project for 3000 Studios. For questions or collaboration:

- Email: [contact@3000studios.com](mailto:contact@3000studios.com)
- Admin: [mr.jwswain@gmail.com](mailto:mr.jwswain@gmail.com)

## 📄 License

© 2025 3000 Studios. All rights reserved.

## 🎯 Next Steps

1. Set up environment variables
2. Configure payment gateways
3. Integrate database (Prisma + Postgres)
4. Implement authentication API (NextAuth)
5. Deploy to production

---

### Built with ❤️ by 3000 Studios

<!-- sanity check commit -->
