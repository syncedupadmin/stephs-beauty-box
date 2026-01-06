# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Steph's Beauty Box is a beauty salon website built with Next.js 14.2, React 18, TypeScript, and Tailwind CSS 3.4. The site uses a "romantic high-fashion editorial" design aesthetic inspired by Vogue Italia and Gucci Garden campaigns.

This is a generated website from the SyncedUp platform with **full production e-commerce and booking capabilities**:
- **Shop**: Real product catalog with Supabase, Stripe checkout, inventory management
- **Booking**: Appointment scheduling with deposits, calendar availability, hold system
- **Emails**: Transactional emails via Resend (order/booking confirmations)

## Development Commands

```bash
npm install     # Install dependencies
npm run dev     # Start dev server (http://localhost:3000)
npm run build   # Production build
npm run lint    # Run ESLint

# Import products from CSV (one-time setup)
node scripts/import-products-from-csv.mjs path/to/products.csv
```

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
    booking/           # Booking endpoints
    checkout/          # Shop checkout
    orders/            # Order lookup
    webhooks/stripe/   # Stripe webhook handler
    cron/              # Scheduled tasks (hold expiration)

components/
  layout/              # Header, Footer (Header includes CartButton)
  ui/                  # Reusable UI components
  shop/                # Cart drawer, product components
  generated/           # PreviewBanner (SyncedUp integration)

lib/
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
  supabase.ts          # Supabase client

supabase/
  migrations/          # Database schema (run via Supabase Dashboard)

scripts/
  import-products-from-csv.mjs  # Product import script

types/
  database.ts          # TypeScript types for Supabase tables
```

### Path Alias

`@/*` maps to `./*` (project root)

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

### Database (Supabase)

The schema is in `supabase/migrations/001_shop_booking_schema.sql`. Key tables:

**Shop**:
- `products`, `product_variants`, `product_images` - Product catalog
- `orders`, `order_items` - Order management
- `shop_settings` - Shipping/pickup/tax configuration

**Booking**:
- `services`, `service_deposits` - Service catalog
- `bookings` - Appointments with hold system
- `availability_rules`, `blackout_dates` - Calendar configuration
- `booking_settings` - Deposit/timezone configuration

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
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Resend: `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`
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
