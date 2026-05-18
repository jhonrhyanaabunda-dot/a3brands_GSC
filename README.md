# A3 Brands GSC Intelligence Platform

AI-powered Google Search Console and dealership SEO analytics platform built for General Managers, Marketing Directors, Principal Dealers, and Automotive Dealer Groups.

## Stack

- **Framework:** Next.js 15 (App Router, React Server Components, Server Actions)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + ShadCN UI primitives + Framer Motion
- **Charts:** Recharts
- **Auth:** Auth.js v5 (NextAuth) with Prisma adapter
- **Database:** PostgreSQL via Prisma ORM
- **State:** Zustand (client) + Server Actions (mutations)
- **Icons:** Lucide React
- **Notifications:** Sonner

## Project Layout

```
/app                  → App Router routes, layouts, server actions
  /(marketing)        → Public landing, pricing, about
  /(auth)             → Login, register, forgot password
  /(dashboard)        → Authenticated executive dashboard
  /api                → Route handlers
/components
  /ui                 → ShadCN primitives
  /marketing          → Landing-page sections
  /dashboard          → Dashboard widgets, charts, KPI cards
  /forms              → Reusable form blocks
  /animations         → Framer Motion wrappers
/lib                  → auth, prisma client, utils, seo, mock data
/hooks                → Reusable client hooks
/actions              → Server actions
/types                → Shared TypeScript types
/prisma               → schema.prisma + seed
/public               → Static assets
/styles               → Additional CSS (if needed)
/utils                → Pure helpers
```

## Google Search Console Verification

The verification meta tag is injected globally in [app/layout.tsx](app/layout.tsx), so every route serves it from the moment the app boots:

```html
<meta name="google-site-verification" content="VwtQf-f6xZOXpRtmaI3OjUtvxnj4exVXhJgv4iIA5qo" />
```

After deploying to your production domain, return to Search Console and click **Verify**.

## Getting Started

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env.local
# fill in DATABASE_URL and AUTH_SECRET (openssl rand -base64 32)

# 3. Database
npm run db:push           # sync schema (dev)
npm run db:seed           # load realistic dealership seed data

# 4. Dev server
npm run dev               # http://localhost:3000
```

## Scripts

| Command                | Purpose                              |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start dev server                     |
| `npm run build`        | Production build (runs prisma generate) |
| `npm run start`        | Start production server              |
| `npm run lint`         | ESLint                               |
| `npm run typecheck`    | TypeScript no-emit check             |
| `npm run db:push`      | Push Prisma schema to database       |
| `npm run db:migrate`   | Create + apply migration             |
| `npm run db:seed`      | Seed realistic dealership data       |
| `npm run db:studio`    | Open Prisma Studio                   |

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the project in Vercel → it auto-detects Next.js 15.
3. Add environment variables in **Project Settings → Environment Variables**:
   - `DATABASE_URL`, `DIRECT_URL`
   - `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, `NEXTAUTH_URL=https://your-domain.com`
   - `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
   - Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
4. Deploy. The Postgres should be Neon, Supabase, or Vercel Postgres.
5. Hit **Verify** in Google Search Console once the production domain resolves.

## Roles

| Role                | Capabilities                                                          |
| ------------------- | --------------------------------------------------------------------- |
| `ADMIN`             | Full platform access, user/dealership management, system settings     |
| `DEALER_GROUP`      | Multi-dealership view, group-level rollups, executive reporting       |
| `MARKETING_DIRECTOR`| Campaign + keyword + AI insights, recommendations, report exports     |
| `GENERAL_MANAGER`   | Single-store KPIs, lead opportunity, weekly executive summary         |

## Build Status

This codebase is being delivered iteratively. Foundation in place:

- [x] Project config, Tailwind design system, ShadCN setup
- [x] Root layout with GSC verification meta tag
- [x] Prisma schema + seed
- [x] Auth.js v5 scaffold, middleware, role-based access
- [x] Landing page (hero, metrics, features, AI recs, testimonials, FAQ, CTA, footer)
- [ ] Login / Register / Forgot password pages
- [ ] Executive dashboard (KPIs, charts, AI insights, local SEO, competitors)
- [ ] GSC analyzer tool
- [ ] AI recommendation engine UI
- [ ] Local SEO module (map pack, reviews, proximity)
- [ ] Reporting system (PDF, monthly snapshots)
- [ ] Admin panel
