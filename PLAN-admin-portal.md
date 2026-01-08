# Admin Portal - Exact Implementation Plan

## Decisions Locked
- **Auth:** Supabase Auth (cookie-based SSR)
- **Admins:** Single for now, multi-admin ready
- **Storage:** Supabase Storage for images
- **Scope:** Full build - all phases

---

## Phase 1: Authentication Foundation

### 1.1 Install Dependencies
```bash
npm install @supabase/ssr bcryptjs
npm install -D @types/bcryptjs
```

### 1.2 Create Supabase SSR Utilities
**`lib/supabase/server.ts`** - Server-side client with cookies
**`lib/supabase/middleware.ts`** - Middleware client

### 1.3 Create Auth Data Access Layer
**`lib/auth/dal.ts`**
- `verifySession()` - Always uses `getUser()` not `getSession()`
- `requireAdmin()` - Throws if not admin
- `getAdminUser()` - Get current admin details

### 1.4 Create Auth Server Actions
**`lib/auth/actions.ts`**
- `loginAdmin(email, password)` - Sign in with Supabase Auth
- `logoutAdmin()` - Sign out and clear cookies
- `createAdminUser(email, password, name)` - For adding new admins

### 1.5 Update Middleware
**`middleware.ts`**
- Protect all `/admin/*` routes except `/admin/login`
- Refresh session tokens
- Redirect unauthenticated to `/admin/login`

### 1.6 Create Login Page
**`app/admin/login/page.tsx`**
- Email/password form
- Error handling
- Redirect to dashboard on success

### 1.7 Database: Add Supabase Auth Integration
- Create admin user in Supabase Auth
- Link to `admin_users` table via `auth.uid()`
- Update RLS policies

---

## Phase 2: Admin Layout & Dashboard

### 2.1 Admin Layout
**`app/admin/layout.tsx`**
- Verify session (server component)
- Sidebar navigation
- Top header with user menu
- Responsive (mobile hamburger)

### 2.2 Sidebar Component
**`components/admin/Sidebar.tsx`**
- Navigation links:
  - Dashboard
  - Services
  - Products
  - Bookings
  - Orders
  - Settings
- Active state highlighting
- Collapse on mobile

### 2.3 Header Component
**`components/admin/AdminHeader.tsx`**
- Page title
- User dropdown (profile, logout)
- Mobile menu toggle

### 2.4 Dashboard Page
**`app/admin/page.tsx`**
- Stats cards:
  - Today's bookings count
  - Pending orders count
  - This week's revenue
  - Low inventory alerts
- Recent bookings table (5 items)
- Recent orders table (5 items)

### 2.5 Dashboard API
**`app/api/admin/dashboard/route.ts`**
- GET: Fetch all dashboard stats

---

## Phase 3: Services Management

### 3.1 Services List Page
**`app/admin/services/page.tsx`**
- Table: Name, Duration, Price, Status, Actions
- Search by name
- Add new button

### 3.2 Add Service Page
**`app/admin/services/new/page.tsx`**
- Form: name, description, duration, price, image
- Deposit override (optional)
- Save → redirect to list

### 3.3 Edit Service Page
**`app/admin/services/[id]/page.tsx`**
- Same form, pre-filled
- Delete button with confirmation

### 3.4 Services API
**`app/api/admin/services/route.ts`**
- GET: List all services
- POST: Create service

**`app/api/admin/services/[id]/route.ts`**
- GET: Single service
- PUT: Update service
- DELETE: Delete service

---

## Phase 4: Products Management

### 4.1 Products List Page
**`app/admin/products/page.tsx`**
- Table: Image, Title, Type, Variants, Inventory, Actions
- Filter by type
- Search by title

### 4.2 Add Product Page
**`app/admin/products/new/page.tsx`**
- Form: title, handle, description, type, vendor, tags
- Variants section (add/remove):
  - SKU, price, compare price, inventory, options
- Images upload (drag & drop)

### 4.3 Edit Product Page
**`app/admin/products/[id]/page.tsx`**
- Same form, pre-filled
- Manage variants inline
- Delete with confirmation

### 4.4 Image Upload
**`app/api/admin/upload/route.ts`**
- POST: Upload to Supabase Storage
- Return public URL

### 4.5 Products API
**`app/api/admin/products/route.ts`**
- GET: List products with variants
- POST: Create product with variants

**`app/api/admin/products/[id]/route.ts`**
- GET: Single product with variants/images
- PUT: Update product
- DELETE: Delete product (cascade)

---

## Phase 5: Bookings Management

### 5.1 Bookings List Page
**`app/admin/bookings/page.tsx`**
- Tabs: Upcoming | Past | Cancelled
- Table: Date/Time, Customer, Service, Status, Actions
- Filter by date range
- Search by customer name/phone

### 5.2 Booking Details Page
**`app/admin/bookings/[id]/page.tsx`**
- Full booking info
- Customer details
- Service details
- Actions:
  - Mark as Completed
  - Mark as No-Show
  - Cancel (with reason)
  - Add admin notes

### 5.3 Bookings API
**`app/api/admin/bookings/route.ts`**
- GET: List bookings with filters

**`app/api/admin/bookings/[id]/route.ts`**
- GET: Single booking
- PUT: Update status/notes

---

## Phase 6: Orders Management

### 6.1 Orders List Page
**`app/admin/orders/page.tsx`**
- Tabs: All | Pending | Paid | Shipped | Delivered | Needs Attention
- Table: Order #, Customer, Items, Total, Status, Date
- Search by order # or email

### 6.2 Order Details Page
**`app/admin/orders/[id]/page.tsx`**
- Order summary
- Customer info
- Shipping address
- Line items
- Status timeline
- Actions:
  - Update status (paid → processing → shipped → delivered)
  - Add tracking number
  - Mark needs attention
  - Add notes

### 6.3 Orders API
**`app/api/admin/orders/route.ts`**
- GET: List orders with filters

**`app/api/admin/orders/[id]/route.ts`**
- GET: Single order with items
- PUT: Update status

---

## Phase 7: Settings Management

### 7.1 Settings Overview
**`app/admin/settings/page.tsx`**
- Cards linking to each settings section
- Status indicators (configured/not configured)

### 7.2 Shop Settings Page
**`app/admin/settings/shop/page.tsx`**
- Fulfillment options:
  - Shipping enabled (toggle)
  - Flat rate / Free shipping threshold
  - Pickup enabled (toggle)
  - Pickup address, hours, instructions
- Tax settings:
  - Tax mode (none/inclusive/exclusive)
  - Tax rate %
- Stripe status indicator

### 7.3 Booking Settings Page
**`app/admin/settings/booking/page.tsx`**
- Timezone selector
- Min notice (hours)
- Buffer between appointments (minutes)
- Max days out for booking
- Hold duration (minutes)
- Deposits:
  - Enabled toggle
  - Default type (flat/percent)
  - Default value

### 7.4 Availability Page
**`app/admin/settings/availability/page.tsx`**
- Weekly schedule:
  - Each day: enabled toggle, start time, end time
- Blackout dates:
  - Calendar view
  - Add/remove dates
  - Reason field

### 7.5 Settings API
**`app/api/admin/settings/shop/route.ts`**
- GET/PUT shop_settings

**`app/api/admin/settings/booking/route.ts`**
- GET/PUT booking_settings

**`app/api/admin/settings/availability/route.ts`**
- GET/PUT availability_rules
- GET/POST/DELETE blackout_dates

---

## Reusable Components

### UI Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `DataTable` | `components/admin/DataTable.tsx` | Sortable, filterable tables |
| `FormInput` | `components/admin/FormInput.tsx` | Text, number, textarea inputs |
| `FormSelect` | `components/admin/FormSelect.tsx` | Dropdown selects |
| `FormToggle` | `components/admin/FormToggle.tsx` | Boolean toggles |
| `FormImageUpload` | `components/admin/FormImageUpload.tsx` | Drag & drop images |
| `Modal` | `components/admin/Modal.tsx` | Confirmation dialogs |
| `StatusBadge` | `components/admin/StatusBadge.tsx` | Colored status pills |
| `StatsCard` | `components/admin/StatsCard.tsx` | Dashboard metric cards |
| `LoadingSpinner` | `components/admin/LoadingSpinner.tsx` | Loading states |
| `EmptyState` | `components/admin/EmptyState.tsx` | No data messages |

---

## Database Updates

### 1. Update admin_users table
```sql
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS auth_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS role text DEFAULT 'admin';

CREATE INDEX IF NOT EXISTS idx_admin_users_auth_id ON admin_users(auth_id);
```

### 2. Create storage bucket
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT DO NOTHING;

-- Storage policy for admin uploads
CREATE POLICY "Admin can upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'products');
```

### 3. Add tracking to orders
```sql
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS tracking_url text;
```

---

## Execution Order

### Build Order (Optimized for Dependencies)

```
1. Dependencies & Supabase SSR utilities
2. Auth DAL & Server Actions
3. Middleware update
4. Login page
5. Database updates (admin_users, storage bucket)
6. Admin layout + Sidebar + Header
7. Reusable UI components (all)
8. Dashboard page + API
9. Services list + API
10. Service add/edit pages
11. Products list + API
12. Product add/edit pages + image upload
13. Bookings list + API
14. Booking details page
15. Orders list + API
16. Order details page
17. Settings overview
18. Shop settings page + API
19. Booking settings page + API
20. Availability settings page + API
21. Create initial admin user
22. Test all flows
23. Deploy
```

---

## File Count Summary

| Category | Files |
|----------|-------|
| Lib utilities | 5 |
| Components | 12 |
| Pages | 18 |
| API routes | 12 |
| **Total new files** | **47** |

---

## Approval Checklist

- [x] Supabase Auth (cookie-based)
- [x] Single admin, multi-admin ready
- [x] Supabase Storage for images
- [x] Full build scope
- [ ] **Ready to implement?**
