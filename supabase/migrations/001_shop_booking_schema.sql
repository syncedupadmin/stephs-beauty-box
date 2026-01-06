-- =============================================================================
-- STEPH'S BEAUTY BOX - SHOP & BOOKING SCHEMA
-- =============================================================================
-- Version: 1.0.0
-- This migration creates tables for:
--   - Shop: products, variants, images, cart, orders
--   - Booking: services, availability, bookings with hold system
--   - Settings: shop_settings, booking_settings
--   - Atomic inventory management
--   - Hold expiration automation
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- Required for exclusion constraints

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

-- Booking status enum with hold support
CREATE TYPE booking_status AS ENUM ('hold', 'confirmed', 'cancelled', 'expired', 'completed', 'no_show');

-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'needs_attention');

-- Fulfillment method enum
CREATE TYPE fulfillment_method AS ENUM ('shipping', 'pickup');

-- Deposit type enum
CREATE TYPE deposit_type AS ENUM ('flat', 'percent');

-- Tax mode enum
CREATE TYPE tax_mode AS ENUM ('none', 'inclusive', 'exclusive');

-- Day of week enum for availability rules
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- =============================================================================
-- SETTINGS TABLES (SETTINGS-FIRST APPROACH)
-- =============================================================================

-- Shop settings - controls shipping, pickup, tax
CREATE TABLE shop_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Fulfillment options
    shipping_enabled boolean DEFAULT false,
    pickup_enabled boolean DEFAULT false,

    -- Pickup details (required if pickup_enabled)
    pickup_address text,
    pickup_hours text, -- e.g., "Wed-Sun 11am-7pm"
    pickup_instructions text,

    -- Shipping rates (required if shipping_enabled)
    flat_shipping_rate_cents integer, -- e.g., 599 = $5.99
    free_shipping_threshold_cents integer, -- e.g., 5000 = $50.00

    -- Tax configuration
    tax_mode tax_mode DEFAULT 'none',
    tax_rate_percent numeric(5,3), -- e.g., 7.000 for 7%

    -- Stripe configuration status
    stripe_configured boolean DEFAULT false,

    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Insert default shop settings (disabled until configured)
INSERT INTO shop_settings (id, shipping_enabled, pickup_enabled)
VALUES (uuid_generate_v4(), false, false);

-- Booking settings - controls timezone, buffer, hold duration
CREATE TABLE booking_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Timezone for display (stored as IANA timezone name)
    timezone text DEFAULT 'America/New_York',

    -- Scheduling constraints
    min_notice_minutes integer DEFAULT 1440, -- 24 hours default
    buffer_minutes integer DEFAULT 15, -- Time between appointments
    max_days_out integer DEFAULT 60, -- How far in advance to book

    -- Hold system configuration
    hold_minutes integer DEFAULT 15, -- How long a hold lasts before expiring

    -- Deposit requirements
    deposits_enabled boolean DEFAULT false,
    default_deposit_type deposit_type DEFAULT 'percent',
    default_deposit_value numeric(10,2) DEFAULT 25.00, -- 25% or $25

    -- Stripe configuration status
    stripe_configured boolean DEFAULT false,

    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Insert default booking settings
INSERT INTO booking_settings (id) VALUES (uuid_generate_v4());

-- =============================================================================
-- PRODUCT TABLES
-- =============================================================================

-- Products table
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic info
    handle text UNIQUE NOT NULL, -- URL slug
    title text NOT NULL,
    description text,

    -- Categorization
    product_type text, -- e.g., "Skincare", "Hair Care", "Makeup"
    vendor text,
    tags text[], -- Array of tags

    -- SEO
    seo_title text,
    seo_description text,

    -- Status
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,

    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Product variants (each product has at least one variant)
CREATE TABLE product_variants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,

    -- Variant info
    sku text UNIQUE,
    title text DEFAULT 'Default', -- e.g., "Small", "Large", "Red"

    -- Pricing (in cents)
    price_cents integer NOT NULL,
    compare_at_price_cents integer, -- Original price if on sale

    -- Inventory (CRITICAL for atomic management)
    inventory_quantity integer NOT NULL DEFAULT 0,
    inventory_policy text DEFAULT 'deny', -- 'deny' or 'continue' (backorders)

    -- Physical attributes
    weight_grams integer,
    requires_shipping boolean DEFAULT true,

    -- Options
    option1_name text,
    option1_value text,
    option2_name text,
    option2_value text,
    option3_name text,
    option3_value text,

    -- Status
    is_active boolean DEFAULT true,
    position integer DEFAULT 0,

    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Product images
CREATE TABLE product_images (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,

    src text NOT NULL, -- Image URL
    alt text,
    position integer DEFAULT 0,

    created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- ORDER TABLES
-- =============================================================================

-- Orders table
CREATE TABLE orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number serial UNIQUE,

    -- Stripe
    stripe_checkout_session_id text UNIQUE,
    stripe_payment_intent_id text,

    -- Customer info (PII - protected by RLS)
    customer_email text NOT NULL,
    customer_name text,
    customer_phone text,

    -- Fulfillment
    fulfillment_method fulfillment_method NOT NULL,

    -- Shipping address (if shipping)
    shipping_address_line1 text,
    shipping_address_line2 text,
    shipping_city text,
    shipping_state text,
    shipping_postal_code text,
    shipping_country text DEFAULT 'US',

    -- Totals (in cents)
    subtotal_cents integer NOT NULL,
    shipping_cents integer DEFAULT 0,
    tax_cents integer DEFAULT 0,
    total_cents integer NOT NULL,

    -- Status
    status order_status DEFAULT 'pending',
    status_notes text, -- For needs_attention cases

    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    paid_at timestamptz,
    fulfilled_at timestamptz
);

-- Order line items
CREATE TABLE order_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,

    -- Snapshot of product at time of purchase
    product_title text NOT NULL,
    variant_title text,
    sku text,

    -- Pricing
    quantity integer NOT NULL,
    price_cents integer NOT NULL, -- Per unit
    total_cents integer NOT NULL, -- quantity * price_cents

    created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- BOOKING/SERVICE TABLES
-- =============================================================================

-- Services offered
CREATE TABLE services (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic info
    name text NOT NULL,
    description text,

    -- Duration
    duration_minutes integer NOT NULL,

    -- Pricing (in cents)
    price_cents integer NOT NULL,

    -- Display
    image_url text,
    position integer DEFAULT 0,

    -- Status
    is_active boolean DEFAULT true,

    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Service-specific deposit overrides
CREATE TABLE service_deposits (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id uuid REFERENCES services(id) ON DELETE CASCADE UNIQUE,

    deposit_type deposit_type NOT NULL,
    deposit_value numeric(10,2) NOT NULL, -- Amount in dollars or percentage

    created_at timestamptz DEFAULT now()
);

-- Weekly availability rules
CREATE TABLE availability_rules (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    day_of_week day_of_week NOT NULL,
    start_time time NOT NULL, -- e.g., '11:00'
    end_time time NOT NULL, -- e.g., '19:00'

    is_active boolean DEFAULT true,

    created_at timestamptz DEFAULT now(),

    UNIQUE(day_of_week) -- One rule per day
);

-- Insert default availability (Wed-Sun 11am-7pm per brand.ts)
INSERT INTO availability_rules (day_of_week, start_time, end_time, is_active) VALUES
    ('wednesday', '11:00', '19:00', true),
    ('thursday', '11:00', '19:00', true),
    ('friday', '11:00', '19:00', true),
    ('saturday', '11:00', '19:00', true),
    ('sunday', '11:00', '19:00', true),
    ('monday', '11:00', '19:00', false),
    ('tuesday', '11:00', '19:00', false);

-- Blackout dates (holidays, vacations, etc.)
CREATE TABLE blackout_dates (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    date date NOT NULL,
    reason text,

    created_at timestamptz DEFAULT now(),

    UNIQUE(date)
);

-- =============================================================================
-- BOOKINGS TABLE (CRITICAL - WITH HOLD SYSTEM)
-- =============================================================================

CREATE TABLE bookings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Service reference
    service_id uuid REFERENCES services(id) ON DELETE SET NULL,

    -- Timing (ALL IN UTC)
    start_ts timestamptz NOT NULL,
    end_ts timestamptz NOT NULL, -- start_ts + duration + buffer

    -- Customer info (PII - protected by RLS)
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    customer_email text,

    -- Stripe
    stripe_checkout_session_id text,
    stripe_payment_intent_id text,

    -- Deposit info
    deposit_amount_cents integer,
    deposit_paid boolean DEFAULT false,

    -- Status with hold support
    status booking_status DEFAULT 'hold',

    -- Hold expiration (CRITICAL for ghost booking prevention)
    hold_expires_at timestamptz, -- Required when status = 'hold'

    -- Notes
    customer_notes text,
    admin_notes text,

    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    confirmed_at timestamptz,
    cancelled_at timestamptz,

    -- Constraints
    CONSTRAINT valid_time_range CHECK (end_ts > start_ts),
    CONSTRAINT hold_requires_expiration CHECK (
        (status != 'hold') OR (hold_expires_at IS NOT NULL)
    )
);

-- =============================================================================
-- EXCLUSION CONSTRAINT FOR BOOKING COLLISION PREVENTION
-- =============================================================================
-- This prevents double-booking at the DATABASE level, not in application code.
-- It uses a GiST index on the time range and only applies to active bookings.

-- First, create a function to check if a booking is active
CREATE OR REPLACE FUNCTION booking_is_active(status booking_status, hold_expires_at timestamptz)
RETURNS boolean AS $$
BEGIN
    -- Confirmed bookings are always active
    IF status = 'confirmed' THEN
        RETURN true;
    END IF;

    -- Holds are active only if not expired
    IF status = 'hold' AND hold_expires_at > now() THEN
        RETURN true;
    END IF;

    RETURN false;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create the exclusion constraint
-- This ensures no two active bookings can have overlapping time ranges
ALTER TABLE bookings ADD CONSTRAINT no_overlapping_active_bookings
    EXCLUDE USING gist (
        tstzrange(start_ts, end_ts) WITH &&
    )
    WHERE (booking_is_active(status, hold_expires_at) = true);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Products
CREATE INDEX idx_products_handle ON products(handle);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_type ON products(product_type);

-- Variants
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_inventory ON product_variants(inventory_quantity);

-- Images
CREATE INDEX idx_images_product ON product_images(product_id);

-- Orders
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_checkout_session_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Bookings (CRITICAL for hold expiration)
CREATE INDEX idx_bookings_status_expires ON bookings(status, hold_expires_at)
    WHERE status = 'hold';
CREATE INDEX idx_bookings_start ON bookings(start_ts);
CREATE INDEX idx_bookings_active ON bookings(status)
    WHERE status IN ('hold', 'confirmed');
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);

-- Availability
CREATE INDEX idx_availability_day ON availability_rules(day_of_week);
CREATE INDEX idx_blackout_date ON blackout_dates(date);

-- =============================================================================
-- FUNCTIONS: ATOMIC INVENTORY MANAGEMENT
-- =============================================================================

-- Atomically decrement inventory, returns true if successful
CREATE OR REPLACE FUNCTION decrement_inventory_safe(
    p_variant_id uuid,
    p_quantity integer
)
RETURNS boolean AS $$
DECLARE
    rows_affected integer;
BEGIN
    -- Atomic decrement with WHERE guard - prevents negative inventory
    UPDATE product_variants
    SET
        inventory_quantity = inventory_quantity - p_quantity,
        updated_at = now()
    WHERE
        id = p_variant_id
        AND inventory_quantity >= p_quantity;

    GET DIAGNOSTICS rows_affected = ROW_COUNT;

    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- Restore inventory (for cancellations/refunds)
CREATE OR REPLACE FUNCTION increment_inventory(
    p_variant_id uuid,
    p_quantity integer
)
RETURNS void AS $$
BEGIN
    UPDATE product_variants
    SET
        inventory_quantity = inventory_quantity + p_quantity,
        updated_at = now()
    WHERE id = p_variant_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- FUNCTIONS: HOLD EXPIRATION AUTOMATION
-- =============================================================================

-- Release expired holds (called by cron or endpoint)
CREATE OR REPLACE FUNCTION release_expired_holds()
RETURNS integer AS $$
DECLARE
    expired_count integer;
BEGIN
    UPDATE bookings
    SET
        status = 'expired',
        updated_at = now()
    WHERE
        status = 'hold'
        AND hold_expires_at < now();

    GET DIAGNOSTICS expired_count = ROW_COUNT;

    RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- FUNCTIONS: BOOKING HOLD CREATION
-- =============================================================================

-- Create a booking hold with collision prevention
CREATE OR REPLACE FUNCTION create_booking_hold(
    p_service_id uuid,
    p_start_ts timestamptz,
    p_customer_name text,
    p_customer_phone text,
    p_customer_email text DEFAULT NULL,
    p_customer_notes text DEFAULT NULL
)
RETURNS TABLE (
    success boolean,
    booking_id uuid,
    error_message text,
    hold_expires_at timestamptz
) AS $$
DECLARE
    v_service RECORD;
    v_settings RECORD;
    v_end_ts timestamptz;
    v_hold_expires timestamptz;
    v_booking_id uuid;
    v_deposit_cents integer;
BEGIN
    -- Get service details
    SELECT * INTO v_service FROM services WHERE id = p_service_id AND is_active = true;
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::uuid, 'Service not found or inactive'::text, NULL::timestamptz;
        RETURN;
    END IF;

    -- Get booking settings
    SELECT * INTO v_settings FROM booking_settings LIMIT 1;

    -- Calculate end time (duration + buffer)
    v_end_ts := p_start_ts + (v_service.duration_minutes || ' minutes')::interval
                           + (v_settings.buffer_minutes || ' minutes')::interval;

    -- Calculate hold expiration
    v_hold_expires := now() + (v_settings.hold_minutes || ' minutes')::interval;

    -- Calculate deposit if enabled
    IF v_settings.deposits_enabled THEN
        -- Check for service-specific deposit
        SELECT
            CASE
                WHEN sd.deposit_type = 'flat' THEN (sd.deposit_value * 100)::integer
                WHEN sd.deposit_type = 'percent' THEN ((v_service.price_cents * sd.deposit_value / 100))::integer
            END INTO v_deposit_cents
        FROM service_deposits sd
        WHERE sd.service_id = p_service_id;

        -- Fall back to default deposit
        IF v_deposit_cents IS NULL THEN
            v_deposit_cents := CASE
                WHEN v_settings.default_deposit_type = 'flat' THEN (v_settings.default_deposit_value * 100)::integer
                WHEN v_settings.default_deposit_type = 'percent' THEN ((v_service.price_cents * v_settings.default_deposit_value / 100))::integer
            END;
        END IF;
    END IF;

    -- Attempt to insert (exclusion constraint will prevent collisions)
    BEGIN
        INSERT INTO bookings (
            service_id,
            start_ts,
            end_ts,
            customer_name,
            customer_phone,
            customer_email,
            customer_notes,
            status,
            hold_expires_at,
            deposit_amount_cents
        ) VALUES (
            p_service_id,
            p_start_ts,
            v_end_ts,
            p_customer_name,
            p_customer_phone,
            p_customer_email,
            p_customer_notes,
            'hold',
            v_hold_expires,
            v_deposit_cents
        )
        RETURNING id INTO v_booking_id;

        RETURN QUERY SELECT true, v_booking_id, NULL::text, v_hold_expires;

    EXCEPTION WHEN exclusion_violation THEN
        RETURN QUERY SELECT false, NULL::uuid, 'This time slot is no longer available'::text, NULL::timestamptz;
    END;
END;
$$ LANGUAGE plpgsql;

-- Confirm a booking hold (after payment)
CREATE OR REPLACE FUNCTION confirm_booking_hold(
    p_booking_id uuid,
    p_stripe_session_id text,
    p_stripe_payment_intent_id text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
    rows_affected integer;
BEGIN
    UPDATE bookings
    SET
        status = 'confirmed',
        stripe_checkout_session_id = p_stripe_session_id,
        stripe_payment_intent_id = p_stripe_payment_intent_id,
        deposit_paid = true,
        confirmed_at = now(),
        updated_at = now()
    WHERE
        id = p_booking_id
        AND status = 'hold'
        AND hold_expires_at > now(); -- Only confirm if hold hasn't expired

    GET DIAGNOSTICS rows_affected = ROW_COUNT;

    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- FUNCTIONS: AVAILABILITY CALCULATION
-- =============================================================================

-- Get available slots for a service on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
    p_service_id uuid,
    p_date date
)
RETURNS TABLE (
    slot_start timestamptz,
    slot_end timestamptz
) AS $$
DECLARE
    v_service RECORD;
    v_settings RECORD;
    v_availability RECORD;
    v_day_name day_of_week;
    v_slot_start timestamptz;
    v_slot_end timestamptz;
    v_slot_duration interval;
    v_day_start timestamptz;
    v_day_end timestamptz;
BEGIN
    -- Get service
    SELECT * INTO v_service FROM services WHERE id = p_service_id AND is_active = true;
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Get settings
    SELECT * INTO v_settings FROM booking_settings LIMIT 1;

    -- Calculate slot duration (service + buffer)
    v_slot_duration := (v_service.duration_minutes + v_settings.buffer_minutes || ' minutes')::interval;

    -- Get day of week
    v_day_name := lower(to_char(p_date, 'day'))::day_of_week;

    -- Check if day is available
    SELECT * INTO v_availability
    FROM availability_rules
    WHERE day_of_week = v_day_name AND is_active = true;

    IF NOT FOUND THEN
        RETURN; -- Day not available
    END IF;

    -- Check for blackout
    IF EXISTS (SELECT 1 FROM blackout_dates WHERE date = p_date) THEN
        RETURN; -- Date is blacked out
    END IF;

    -- Check max days out
    IF p_date > (current_date + (v_settings.max_days_out || ' days')::interval) THEN
        RETURN; -- Too far in the future
    END IF;

    -- Check min notice
    IF p_date < current_date THEN
        RETURN; -- In the past
    END IF;

    -- Build day boundaries in configured timezone, then convert to UTC
    v_day_start := (p_date || ' ' || v_availability.start_time)::timestamp
                   AT TIME ZONE v_settings.timezone;
    v_day_end := (p_date || ' ' || v_availability.end_time)::timestamp
                 AT TIME ZONE v_settings.timezone;

    -- Generate slots
    v_slot_start := v_day_start;

    WHILE v_slot_start + v_slot_duration <= v_day_end LOOP
        v_slot_end := v_slot_start + v_slot_duration;

        -- Check min notice
        IF v_slot_start > now() + (v_settings.min_notice_minutes || ' minutes')::interval THEN
            -- Check for conflicts with active bookings
            IF NOT EXISTS (
                SELECT 1 FROM bookings b
                WHERE booking_is_active(b.status, b.hold_expires_at)
                AND tstzrange(b.start_ts, b.end_ts) && tstzrange(v_slot_start, v_slot_end)
            ) THEN
                slot_start := v_slot_start;
                slot_end := v_slot_end;
                RETURN NEXT;
            END IF;
        END IF;

        -- Move to next slot (30 minute intervals)
        v_slot_start := v_slot_start + interval '30 minutes';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE blackout_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon users can read these)
CREATE POLICY "Public can read active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active variants" ON product_variants
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read product images" ON product_images
    FOR SELECT USING (true);

CREATE POLICY "Public can read active services" ON services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read availability" ON availability_rules
    FOR SELECT USING (true);

CREATE POLICY "Public can read blackout dates" ON blackout_dates
    FOR SELECT USING (true);

-- Settings are readable by public (needed for checkout flow)
CREATE POLICY "Public can read shop settings" ON shop_settings
    FOR SELECT USING (true);

CREATE POLICY "Public can read booking settings" ON booking_settings
    FOR SELECT USING (true);

-- Service role (server-side) can do everything
CREATE POLICY "Service role full access to products" ON products
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to variants" ON product_variants
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to images" ON product_images
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to orders" ON orders
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to order_items" ON order_items
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to services" ON services
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to service_deposits" ON service_deposits
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to availability" ON availability_rules
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to blackouts" ON blackout_dates
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to bookings" ON bookings
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to shop_settings" ON shop_settings
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to booking_settings" ON booking_settings
    FOR ALL USING (auth.role() = 'service_role');

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_shop_settings_updated_at BEFORE UPDATE ON shop_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_booking_settings_updated_at BEFORE UPDATE ON booking_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ADMIN USERS TABLE (if not exists)
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    name text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    last_login_at timestamptz
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to admin_users" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Shop & Booking schema created successfully!';
    RAISE NOTICE 'Tables created: shop_settings, booking_settings, products, product_variants, product_images, orders, order_items, services, service_deposits, availability_rules, blackout_dates, bookings, admin_users';
    RAISE NOTICE 'Functions created: decrement_inventory_safe, increment_inventory, release_expired_holds, create_booking_hold, confirm_booking_hold, get_available_slots';
    RAISE NOTICE 'RLS policies enabled on all tables';
END $$;
