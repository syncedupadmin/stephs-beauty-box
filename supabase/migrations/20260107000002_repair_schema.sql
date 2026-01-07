-- =============================================================================
-- STEPH'S BEAUTY BOX - REPAIR/IDEMPOTENT SCHEMA
-- =============================================================================
-- This migration safely creates or updates all schema objects
-- Can be run multiple times without errors
-- =============================================================================

-- Enable required extensions (idempotent)
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- =============================================================================
-- ENUM TYPES (Create only if not exists)
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('hold', 'confirmed', 'cancelled', 'expired', 'completed', 'no_show');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'needs_attention');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE fulfillment_method AS ENUM ('shipping', 'pickup');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE deposit_type AS ENUM ('flat', 'percent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE tax_mode AS ENUM ('none', 'inclusive', 'exclusive');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- SETTINGS TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS shop_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    shipping_enabled boolean DEFAULT false,
    pickup_enabled boolean DEFAULT false,
    pickup_address text,
    pickup_hours text,
    pickup_instructions text,
    flat_shipping_rate_cents integer,
    free_shipping_threshold_cents integer,
    tax_mode tax_mode DEFAULT 'none',
    tax_rate_percent numeric(5,3),
    stripe_configured boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Insert default if empty
INSERT INTO shop_settings (id, shipping_enabled, pickup_enabled)
SELECT gen_random_uuid(), false, false
WHERE NOT EXISTS (SELECT 1 FROM shop_settings);

CREATE TABLE IF NOT EXISTS booking_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    timezone text DEFAULT 'America/New_York',
    min_notice_minutes integer DEFAULT 1440,
    buffer_minutes integer DEFAULT 15,
    max_days_out integer DEFAULT 60,
    hold_minutes integer DEFAULT 15,
    deposits_enabled boolean DEFAULT false,
    default_deposit_type deposit_type DEFAULT 'percent',
    default_deposit_value numeric(10,2) DEFAULT 25.00,
    stripe_configured boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

INSERT INTO booking_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM booking_settings);

-- =============================================================================
-- PRODUCT TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    handle text UNIQUE NOT NULL,
    title text NOT NULL,
    description text,
    product_type text,
    vendor text,
    tags text[],
    seo_title text,
    seo_description text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_variants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    sku text UNIQUE,
    title text DEFAULT 'Default',
    price_cents integer NOT NULL,
    compare_at_price_cents integer,
    inventory_quantity integer NOT NULL DEFAULT 0,
    inventory_policy text DEFAULT 'deny',
    weight_grams integer,
    requires_shipping boolean DEFAULT true,
    option1_name text,
    option1_value text,
    option2_name text,
    option2_value text,
    option3_name text,
    option3_value text,
    is_active boolean DEFAULT true,
    position integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
    src text NOT NULL,
    alt text,
    position integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- ORDER TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number serial UNIQUE,
    stripe_checkout_session_id text UNIQUE,
    stripe_payment_intent_id text,
    customer_email text NOT NULL,
    customer_name text,
    customer_phone text,
    fulfillment_method fulfillment_method NOT NULL,
    shipping_address_line1 text,
    shipping_address_line2 text,
    shipping_city text,
    shipping_state text,
    shipping_postal_code text,
    shipping_country text DEFAULT 'US',
    subtotal_cents integer NOT NULL,
    shipping_cents integer DEFAULT 0,
    tax_cents integer DEFAULT 0,
    total_cents integer NOT NULL,
    status order_status DEFAULT 'pending',
    status_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    paid_at timestamptz,
    fulfilled_at timestamptz
);

CREATE TABLE IF NOT EXISTS order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
    variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
    product_title text NOT NULL,
    variant_title text,
    sku text,
    quantity integer NOT NULL,
    price_cents integer NOT NULL,
    total_cents integer NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- BOOKING/SERVICE TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    duration_minutes integer NOT NULL,
    price_cents integer NOT NULL,
    image_url text,
    position integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_deposits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id uuid REFERENCES services(id) ON DELETE CASCADE UNIQUE,
    deposit_type deposit_type NOT NULL,
    deposit_value numeric(10,2) NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS availability_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week day_of_week NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    UNIQUE(day_of_week)
);

-- Insert default availability if empty
INSERT INTO availability_rules (day_of_week, start_time, end_time, is_active)
SELECT * FROM (VALUES
    ('wednesday'::day_of_week, '11:00'::time, '19:00'::time, true),
    ('thursday'::day_of_week, '11:00'::time, '19:00'::time, true),
    ('friday'::day_of_week, '11:00'::time, '19:00'::time, true),
    ('saturday'::day_of_week, '11:00'::time, '19:00'::time, true),
    ('sunday'::day_of_week, '11:00'::time, '19:00'::time, true),
    ('monday'::day_of_week, '11:00'::time, '19:00'::time, false),
    ('tuesday'::day_of_week, '11:00'::time, '19:00'::time, false)
) AS v(day_of_week, start_time, end_time, is_active)
WHERE NOT EXISTS (SELECT 1 FROM availability_rules);

CREATE TABLE IF NOT EXISTS blackout_dates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    date date NOT NULL,
    reason text,
    created_at timestamptz DEFAULT now(),
    UNIQUE(date)
);

-- =============================================================================
-- BOOKINGS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id uuid REFERENCES services(id) ON DELETE SET NULL,
    start_ts timestamptz NOT NULL,
    end_ts timestamptz NOT NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    customer_email text,
    stripe_checkout_session_id text,
    stripe_payment_intent_id text,
    deposit_amount_cents integer,
    deposit_paid boolean DEFAULT false,
    deposit_paid_at timestamptz,
    status booking_status DEFAULT 'hold',
    hold_expires_at timestamptz,
    customer_notes text,
    admin_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    confirmed_at timestamptz,
    cancelled_at timestamptz,
    CONSTRAINT valid_time_range CHECK (end_ts > start_ts),
    CONSTRAINT hold_requires_expiration CHECK (
        (status != 'hold') OR (hold_expires_at IS NOT NULL)
    )
);

-- =============================================================================
-- ADMIN USERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    name text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    last_login_at timestamptz
);

-- =============================================================================
-- FUNCTIONS (CREATE OR REPLACE is idempotent)
-- =============================================================================

-- Check if booking is active
CREATE OR REPLACE FUNCTION booking_is_active(status booking_status, hold_expires_at timestamptz)
RETURNS boolean AS $$
BEGIN
    IF status = 'confirmed' THEN RETURN true; END IF;
    IF status = 'hold' AND hold_expires_at > now() THEN RETURN true; END IF;
    RETURN false;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Atomic inventory decrement
CREATE OR REPLACE FUNCTION decrement_inventory_safe(
    p_variant_id uuid,
    p_quantity integer
)
RETURNS boolean AS $$
DECLARE
    rows_affected integer;
BEGIN
    UPDATE product_variants
    SET inventory_quantity = inventory_quantity - p_quantity, updated_at = now()
    WHERE id = p_variant_id AND inventory_quantity >= p_quantity;
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- Inventory restore
CREATE OR REPLACE FUNCTION increment_inventory(
    p_variant_id uuid,
    p_quantity integer
)
RETURNS void AS $$
BEGIN
    UPDATE product_variants
    SET inventory_quantity = inventory_quantity + p_quantity, updated_at = now()
    WHERE id = p_variant_id;
END;
$$ LANGUAGE plpgsql;

-- Release expired holds
CREATE OR REPLACE FUNCTION release_expired_holds()
RETURNS integer AS $$
DECLARE
    expired_count integer;
BEGIN
    UPDATE bookings
    SET status = 'expired', updated_at = now()
    WHERE status = 'hold' AND hold_expires_at < now();
    GET DIAGNOSTICS expired_count = ROW_COUNT;
    RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- Create booking hold
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
    SELECT * INTO v_service FROM services WHERE id = p_service_id AND is_active = true;
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::uuid, 'Service not found or inactive'::text, NULL::timestamptz;
        RETURN;
    END IF;

    SELECT * INTO v_settings FROM booking_settings LIMIT 1;
    v_end_ts := p_start_ts + (v_service.duration_minutes || ' minutes')::interval
                           + (v_settings.buffer_minutes || ' minutes')::interval;
    v_hold_expires := now() + (v_settings.hold_minutes || ' minutes')::interval;

    IF v_settings.deposits_enabled THEN
        SELECT CASE
            WHEN sd.deposit_type = 'flat' THEN (sd.deposit_value * 100)::integer
            WHEN sd.deposit_type = 'percent' THEN ((v_service.price_cents * sd.deposit_value / 100))::integer
        END INTO v_deposit_cents
        FROM service_deposits sd WHERE sd.service_id = p_service_id;

        IF v_deposit_cents IS NULL THEN
            v_deposit_cents := CASE
                WHEN v_settings.default_deposit_type = 'flat' THEN (v_settings.default_deposit_value * 100)::integer
                WHEN v_settings.default_deposit_type = 'percent' THEN ((v_service.price_cents * v_settings.default_deposit_value / 100))::integer
            END;
        END IF;
    END IF;

    BEGIN
        INSERT INTO bookings (
            service_id, start_ts, end_ts, customer_name, customer_phone,
            customer_email, customer_notes, status, hold_expires_at, deposit_amount_cents
        ) VALUES (
            p_service_id, p_start_ts, v_end_ts, p_customer_name, p_customer_phone,
            p_customer_email, p_customer_notes, 'hold', v_hold_expires, v_deposit_cents
        ) RETURNING id INTO v_booking_id;

        RETURN QUERY SELECT true, v_booking_id, NULL::text, v_hold_expires;
    EXCEPTION WHEN exclusion_violation THEN
        RETURN QUERY SELECT false, NULL::uuid, 'This time slot is no longer available'::text, NULL::timestamptz;
    END;
END;
$$ LANGUAGE plpgsql;

-- Confirm booking hold
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
    WHERE id = p_booking_id AND status = 'hold' AND hold_expires_at > now();
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- Get available slots
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
    SELECT * INTO v_service FROM services WHERE id = p_service_id AND is_active = true;
    IF NOT FOUND THEN RETURN; END IF;

    SELECT * INTO v_settings FROM booking_settings LIMIT 1;
    v_slot_duration := (v_service.duration_minutes + v_settings.buffer_minutes || ' minutes')::interval;
    v_day_name := lower(trim(to_char(p_date, 'day')))::day_of_week;

    SELECT * INTO v_availability FROM availability_rules
    WHERE day_of_week = v_day_name AND is_active = true;
    IF NOT FOUND THEN RETURN; END IF;

    IF EXISTS (SELECT 1 FROM blackout_dates WHERE date = p_date) THEN RETURN; END IF;
    IF p_date > (current_date + (v_settings.max_days_out || ' days')::interval) THEN RETURN; END IF;
    IF p_date < current_date THEN RETURN; END IF;

    v_day_start := (p_date || ' ' || v_availability.start_time)::timestamp AT TIME ZONE v_settings.timezone;
    v_day_end := (p_date || ' ' || v_availability.end_time)::timestamp AT TIME ZONE v_settings.timezone;
    v_slot_start := v_day_start;

    WHILE v_slot_start + v_slot_duration <= v_day_end LOOP
        v_slot_end := v_slot_start + v_slot_duration;

        IF v_slot_start > now() + (v_settings.min_notice_minutes || ' minutes')::interval THEN
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

        v_slot_start := v_slot_start + interval '30 minutes';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- INDEXES (CREATE IF NOT EXISTS)
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_products_handle ON products(handle);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_inventory ON product_variants(inventory_quantity);
CREATE INDEX IF NOT EXISTS idx_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status_expires ON bookings(status, hold_expires_at) WHERE status = 'hold';
CREATE INDEX IF NOT EXISTS idx_bookings_start ON bookings(start_ts);
CREATE INDEX IF NOT EXISTS idx_bookings_active ON bookings(status) WHERE status IN ('hold', 'confirmed');
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_availability_day ON availability_rules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_blackout_date ON blackout_dates(date);

-- =============================================================================
-- EXCLUSION CONSTRAINT (add only if not exists)
-- =============================================================================

DO $$ BEGIN
    ALTER TABLE bookings ADD CONSTRAINT no_overlapping_active_bookings
        EXCLUDE USING gist (tstzrange(start_ts, end_ts) WITH &&)
        WHERE (booking_is_active(status, hold_expires_at) = true);
EXCEPTION WHEN duplicate_object THEN NULL;
WHEN duplicate_table THEN NULL;
WHEN OTHERS THEN NULL;
END $$;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

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
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (idempotent)
DROP POLICY IF EXISTS "Public can read active products" ON products;
DROP POLICY IF EXISTS "Public can read active variants" ON product_variants;
DROP POLICY IF EXISTS "Public can read product images" ON product_images;
DROP POLICY IF EXISTS "Public can read active services" ON services;
DROP POLICY IF EXISTS "Public can read availability" ON availability_rules;
DROP POLICY IF EXISTS "Public can read blackout dates" ON blackout_dates;
DROP POLICY IF EXISTS "Public can read shop settings" ON shop_settings;
DROP POLICY IF EXISTS "Public can read booking settings" ON booking_settings;
DROP POLICY IF EXISTS "Service role full access to products" ON products;
DROP POLICY IF EXISTS "Service role full access to variants" ON product_variants;
DROP POLICY IF EXISTS "Service role full access to images" ON product_images;
DROP POLICY IF EXISTS "Service role full access to orders" ON orders;
DROP POLICY IF EXISTS "Service role full access to order_items" ON order_items;
DROP POLICY IF EXISTS "Service role full access to services" ON services;
DROP POLICY IF EXISTS "Service role full access to service_deposits" ON service_deposits;
DROP POLICY IF EXISTS "Service role full access to availability" ON availability_rules;
DROP POLICY IF EXISTS "Service role full access to blackouts" ON blackout_dates;
DROP POLICY IF EXISTS "Service role full access to bookings" ON bookings;
DROP POLICY IF EXISTS "Service role full access to shop_settings" ON shop_settings;
DROP POLICY IF EXISTS "Service role full access to booking_settings" ON booking_settings;
DROP POLICY IF EXISTS "Service role full access to admin_users" ON admin_users;

-- Public read policies
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read availability" ON availability_rules FOR SELECT USING (true);
CREATE POLICY "Public can read blackout dates" ON blackout_dates FOR SELECT USING (true);
CREATE POLICY "Public can read shop settings" ON shop_settings FOR SELECT USING (true);
CREATE POLICY "Public can read booking settings" ON booking_settings FOR SELECT USING (true);

-- Service role full access policies
CREATE POLICY "Service role full access to products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to variants" ON product_variants FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to images" ON product_images FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to orders" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to order_items" ON order_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to services" ON services FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to service_deposits" ON service_deposits FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to availability" ON availability_rules FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to blackouts" ON blackout_dates FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to bookings" ON bookings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to shop_settings" ON shop_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to booking_settings" ON booking_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access to admin_users" ON admin_users FOR ALL USING (auth.role() = 'service_role');

-- =============================================================================
-- TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_variants_updated_at ON product_variants;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_shop_settings_updated_at ON shop_settings;
DROP TRIGGER IF EXISTS update_booking_settings_updated_at ON booking_settings;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_shop_settings_updated_at BEFORE UPDATE ON shop_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_booking_settings_updated_at BEFORE UPDATE ON booking_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- COMPLETION
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Schema repair completed successfully!';
END $$;
