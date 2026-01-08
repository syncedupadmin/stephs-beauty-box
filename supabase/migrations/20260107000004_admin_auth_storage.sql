-- =============================================================================
-- ADMIN AUTH & STORAGE SETUP
-- =============================================================================

-- Update admin_users table to link with Supabase Auth
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS role text DEFAULT 'admin';

CREATE INDEX IF NOT EXISTS idx_admin_users_auth_id ON admin_users(auth_id);

-- Drop the password_hash requirement since we use Supabase Auth
ALTER TABLE admin_users ALTER COLUMN password_hash DROP NOT NULL;

-- =============================================================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- =============================================================================

-- Create products bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create services bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'services',
  'services',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- STORAGE POLICIES
-- =============================================================================

-- Products bucket: Public read, authenticated upload
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Authenticated can upload product images" ON storage.objects;
CREATE POLICY "Authenticated can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated can update product images" ON storage.objects;
CREATE POLICY "Authenticated can update product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated can delete product images" ON storage.objects;
CREATE POLICY "Authenticated can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);

-- Services bucket: Same policies
DROP POLICY IF EXISTS "Public can view service images" ON storage.objects;
CREATE POLICY "Public can view service images" ON storage.objects
FOR SELECT USING (bucket_id = 'services');

DROP POLICY IF EXISTS "Authenticated can upload service images" ON storage.objects;
CREATE POLICY "Authenticated can upload service images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'services'
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated can update service images" ON storage.objects;
CREATE POLICY "Authenticated can update service images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'services'
  AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated can delete service images" ON storage.objects;
CREATE POLICY "Authenticated can delete service images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'services'
  AND auth.role() = 'authenticated'
);

-- =============================================================================
-- ADD TRACKING TO ORDERS
-- =============================================================================

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS tracking_url text;

-- =============================================================================
-- COMPLETION
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Admin auth and storage setup complete!';
END $$;
