# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Steph's Beauty Box is a beauty salon website built with Next.js 14.2, React 18, TypeScript, and Tailwind CSS 3.4. The site uses a "romantic high-fashion editorial" design aesthetic inspired by Vogue Italia and Gucci Garden campaigns.

This is a generated website from the SyncedUp platform with **full production e-commerce and booking capabilities**:
- **Shop**: Real product catalog with Supabase, Stripe checkout, inventory management
- **Booking**: Appointment scheduling with deposits, calendar availability, hold system
- **Admin**: Full admin panel at `/admin` with Supabase Auth (email/password)
- **Emails**: Transactional emails via Resend (order/booking confirmations)

## Development Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check without emitting
npm run import:products path/to/products.csv  # Import products from CSV
```

## Coming Soon Mode

The site has a "coming soon" lockdown mode controlled in `middleware.ts`:

```typescript
const COMING_SOON_MODE = true;  // Set to false when ready to launch
```

When enabled:
- All public routes redirect to `/coming-soon`
- `/admin/*` and `/api/*` routes remain accessible
- Users with `site_preview=authorized` cookie can bypass (set via password on coming soon page)

## Architecture

### Directory Structure

```
app/                    # Next.js App Router pages
  layout.tsx           # Root layout with fonts, metadata, Header/Footer, CartDrawer
  page.tsx             # Homepage with mobile scroll-snap + desktop editorial
  services/page.tsx    # Services listing
  gallery/page.tsx     # Image gallery
  about/page.tsx       # About page
  contact/page.tsx     # Contact form
  shop/                # E-commerce
    page.tsx           # Product listing (real Supabase data)
    [handle]/          # Product detail pages
  book/                # Booking system
    page.tsx           # Booking wizard start
    success/           # Booking confirmation
  checkout/            # Shop checkout
    page.tsx           # Fulfillment selection (shipping/pickup)
    success/           # Order confirmation
  api/
    admin/             # Admin API routes (CRUD for services, products, orders, settings)
    booking/           # Booking endpoints
    checkout/          # Shop checkout
    orders/            # Order lookup
    webhooks/stripe/   # Stripe webhook handler
    cron/              # Scheduled tasks (hold expiration)

components/
  layout/              # Header, Footer (Header includes CartButton)
  ui/                  # Reusable UI components
  shop/                # Cart drawer, product components
  admin/               # Admin panel components (sidebar, stats, modals)
  generated/           # PreviewBanner (SyncedUp integration)

lib/
  auth/                # Authentication (DAL pattern)
    dal.ts             # verifySession(), requireAdmin(), getAdminUser()
    actions.ts         # Server actions: loginAdmin(), logoutAdmin()
  config/              # Brand configuration (single source of truth)
  db/                  # Supabase database operations
    products.ts        # Product CRUD, inventory
    orders.ts          # Order management
    bookings.ts        # Booking/services/availability
    settings.ts        # Shop/booking settings
  store/               # Client-side state (Zustand)
    cart.ts            # Shopping cart
  stripe/              # Stripe integration
  email/               # Resend email templates
  supabase/            # Supabase clients
    server.ts          # Server-side clients (createServerSupabaseClient, createServiceRoleClient)
    middleware.ts      # Session update for middleware

supabase/
  migrations/          # Database schema (run via Supabase Dashboard)

types/
  database.ts          # TypeScript types for Supabase tables
```

### Path Alias

`@/*` maps to `./*` (project root)

### Scripts Directory

The `scripts/` folder contains Node.js utility scripts (like `import-products-from-csv.mjs`) and is excluded from TypeScript compilation. These scripts use `.mjs` extension and ES modules.

### Key Configuration Files

**`lib/config/brand.ts`** - Single source of truth for all brand data:
- Business contact info (verified vs "[CLIENT TO CONFIRM]")
- Services categories (5 categories: hair, makeup, skin, brows-lashes, wigs)
- Business hours, social media, navigation
- SEO metadata, theme colors
- Uses `null` for unknown optional fields

**`lib/config/images.ts`** - Central image manifest:
- All gallery images in `GALLERY_IMAGES` array
- Helper functions: `getImage(index)`, `getImages(count)`, `getShuffledImages(seed)`
- Service images mapped to specific gallery indices (prioritizing darker models: 7, 8, 12, 15, 17)

### Design System

**Colors** (defined in `tailwind.config.ts`):
- `paper` (#F6F0E6) - Warm ivory background
- `ink` (#2B2A28) - Text color
- `botanical` (#2F4A3B) - Primary accent (green)
- `charcoal` (#161514) - Deep contrast
- `off-white` / `near-black` - No pure black/white

**Typography**:
- Display font: Playfair Display (headings, editorial)
- Body font: Inter (body text)
- Display sizes: `text-display-hero`, `text-display-lg`, `text-display-md`, `text-display-sm`
- Overline: uppercase, tracked 0.2em

**Editorial CSS Classes** (in `globals.css`):
- `.container-editorial` - Max 1400px, asymmetric padding
- `.editorial-link` - Underline expands on hover
- `.cta-primary` / `.cta-secondary` - Pill-shaped buttons
- `.section-editorial` - Vast negative space (py-32 to py-48)
- `.divider-hairline` - 0.5px subtle dividers
- `.overline` - Small caps label text

**Border Radius Rule**: Only `none` (0) or `full` (pill) - no rounded corners

### Mobile vs Desktop

The homepage uses a responsive split approach:
- **Mobile** (`<md`): Full-screen scroll-snap story sections (Instagram story-like)
- **Desktop** (`>=md`): Magazine cover hero + alternating editorial sections

### PreviewBanner Integration

`components/generated/PreviewBanner.tsx` handles SyncedUp invoice mode:
- Polls `/api/project/[projectId]/status` every 30 seconds
- Shows "PREVIEW MODE" banner when `purchaseStatus === 'preview'`
- Hidden after purchase or if invoice mode disabled
- Project ID hardcoded in `app/layout.tsx`

## Styling Patterns

- Use Tailwind utilities; avoid custom CSS unless adding new component patterns
- Transitions: 600ms with `cubic-bezier(0.4, 0, 0.2, 1)` for "luxury pace"
- Never use pure black/white - use `off-white`, `near-black`, `paper`, `ink`
- Images: Use `getImage(n)` from images.ts; prioritize inclusive representation
- Body text: ragged-right, 1.8 line-height
- Headings: tight leading (0.9), negative letter-spacing

## Production Systems

### Admin Authentication

Admin panel uses Supabase Auth with the Data Access Layer (DAL) pattern:
- **Middleware** (`middleware.ts`): Protects `/admin/*` routes, redirects unauthenticated users
- **DAL** (`lib/auth/dal.ts`): `requireAdmin()` for Server Components, `verifySession()` for session checks
- **Admin users**: Stored in `admin_users` table linked to Supabase Auth via `auth_id`

```typescript
// In Server Components or API routes:
import { requireAdmin } from '@/lib/auth/dal';
const admin = await requireAdmin(); // Redirects if not authenticated
```

### Database (Supabase)

Schema migrations in `supabase/migrations/`. Key tables:

**Shop**:
- `products`, `product_variants`, `product_images` - Product catalog
- `orders`, `order_items` - Order management
- `shop_settings` - Shipping/pickup/tax configuration

**Booking**:
- `services`, `service_deposits` - Service catalog
- `bookings` - Appointments with hold system
- `availability_rules`, `blackout_dates` - Calendar configuration
- `booking_settings` - Deposit/timezone configuration

**Admin**:
- `admin_users` - Admin accounts linked to Supabase Auth via `auth_id`

**Critical Functions**:
- `decrement_inventory_safe(variant_id, qty)` - Atomic inventory decrement (prevents oversell)
- `create_booking_hold(...)` - Creates booking with exclusion constraint collision prevention
- `release_expired_holds()` - Cleanup function called by cron

### Settings-First Architecture

Features are disabled until properly configured:
- Shop shows "coming soon" if `shop_settings` not configured
- Booking shows configuration issues if missing services/availability
- Checkout validates fulfillment options against `shop_settings`

### Booking Hold System

1. Customer selects slot → `create_booking_hold` creates `status='hold'` with `hold_expires_at`
2. Customer pays deposit → Stripe webhook sets `status='confirmed'`
3. If customer abandons → Cron releases hold after expiration (default 15 min)

Collision prevention: PostgreSQL exclusion constraint ensures no overlapping bookings.

### Inventory Management

1. Customer adds to cart → No inventory deduction
2. Customer pays → `decrement_inventory_safe` atomically decrements
3. If decrement fails → Order marked `needs_attention`, admin notified

### Email Templates (Resend)

- Order confirmation with items list
- Booking confirmation with date/time
- Admin alerts for inventory issues

### Environment Variables

See `.env.example` for all required variables:
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Stripe: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- Resend: `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`
- Site: `NEXT_PUBLIC_SITE_URL` (for Stripe redirects)
- Cron: `CRON_SECRET`

### Vercel Cron

`vercel.json` configures automatic hold expiration every 5 minutes:
```json
{
  "crons": [{
    "path": "/api/cron/release-holds",
    "schedule": "*/5 * * * *"
  }]
}
```
