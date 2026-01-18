-- ============================================================================
-- UPDATE SERVICE CATEGORIES
-- ============================================================================
-- Run this in Supabase SQL Editor to add categories to existing services
-- First, add the category column if it doesn't exist:

ALTER TABLE services ADD COLUMN IF NOT EXISTS category text;

-- ============================================================================
-- Wig Installs & Services
-- ============================================================================
UPDATE services SET category = 'Wig Installs & Services' WHERE name ILIKE '%wig%' AND category IS NULL;
UPDATE services SET category = 'Wig Installs & Services' WHERE name ILIKE '%glueless%' AND category IS NULL;
UPDATE services SET category = 'Wig Installs & Services' WHERE name ILIKE 'braid down%' AND category IS NULL;
UPDATE services SET category = 'Wig Installs & Services' WHERE name ILIKE 'bleach knots%' AND category IS NULL;
UPDATE services SET category = 'Wig Installs & Services' WHERE name ILIKE 'add bundle%' AND category IS NULL;
UPDATE services SET category = 'Wig Installs & Services' WHERE name ILIKE 'curl %' AND category IS NULL;
UPDATE services SET category = 'Wig Installs & Services' WHERE name ILIKE 'straighten %' AND category IS NULL;
UPDATE services SET category = 'Wig Installs & Services' WHERE name ILIKE 'crimps%' AND category IS NULL;
UPDATE services SET category = 'Wig Installs & Services' WHERE name ILIKE 'edge touch%' AND category IS NULL;

-- ============================================================================
-- Wig & Hair Color
-- ============================================================================
UPDATE services SET category = 'Wig & Hair Color' WHERE name ILIKE '%root color%' AND category IS NULL;
UPDATE services SET category = 'Wig & Hair Color' WHERE name ILIKE '%highlights%' AND category IS NULL;
UPDATE services SET category = 'Wig & Hair Color' WHERE name ILIKE '%bundle color%' AND category IS NULL;

-- ============================================================================
-- Cutting Services
-- ============================================================================
UPDATE services SET category = 'Cutting Services' WHERE name ILIKE 'haircut%' AND category IS NULL;
UPDATE services SET category = 'Cutting Services' WHERE name ILIKE '%layers%' AND category IS NULL;
UPDATE services SET category = 'Cutting Services' WHERE name ILIKE 'trim%' AND category IS NULL;
UPDATE services SET category = 'Cutting Services' WHERE name ILIKE 'bangs%' AND category IS NULL;

-- ============================================================================
-- Sew-Ins & Quick Weaves
-- ============================================================================
UPDATE services SET category = 'Sew-Ins & Quick Weaves' WHERE name ILIKE '%sew-in%' AND category IS NULL;
UPDATE services SET category = 'Sew-Ins & Quick Weaves' WHERE name ILIKE '%sew in%' AND category IS NULL;
UPDATE services SET category = 'Sew-Ins & Quick Weaves' WHERE name ILIKE '%quick weave%' AND category IS NULL;
UPDATE services SET category = 'Sew-Ins & Quick Weaves' WHERE name ILIKE '%ponytail%' AND name NOT ILIKE '%kids%' AND category IS NULL;
UPDATE services SET category = 'Sew-Ins & Quick Weaves' WHERE name ILIKE '%half up half down%' AND name NOT ILIKE '%kids%' AND category IS NULL;
UPDATE services SET category = 'Sew-Ins & Quick Weaves' WHERE name ILIKE '%frontal%' AND category IS NULL;
UPDATE services SET category = 'Sew-Ins & Quick Weaves' WHERE name ILIKE '%additional bundle%' AND category IS NULL;

-- ============================================================================
-- Natural Hair Services
-- ============================================================================
UPDATE services SET category = 'Natural Hair Services' WHERE name ILIKE '%relaxer%' AND category IS NULL;
UPDATE services SET category = 'Natural Hair Services' WHERE name ILIKE '%blowout%' AND category IS NULL;

-- ============================================================================
-- Shampoo & Scalp Care
-- ============================================================================
UPDATE services SET category = 'Shampoo & Scalp Care' WHERE name ILIKE '%shampoo%' AND category IS NULL;
UPDATE services SET category = 'Shampoo & Scalp Care' WHERE name ILIKE '%conditioning%' AND category IS NULL;
UPDATE services SET category = 'Shampoo & Scalp Care' WHERE name ILIKE '%shimmer%' AND category IS NULL;
UPDATE services SET category = 'Shampoo & Scalp Care' WHERE name ILIKE '%sea breeze%' AND category IS NULL;
UPDATE services SET category = 'Shampoo & Scalp Care' WHERE name ILIKE '%scalp%' AND category IS NULL;
UPDATE services SET category = 'Shampoo & Scalp Care' WHERE name ILIKE 'treatment%' AND category IS NULL;
UPDATE services SET category = 'Shampoo & Scalp Care' WHERE name ILIKE '%detox%' AND category IS NULL;

-- ============================================================================
-- Braid Services
-- ============================================================================
UPDATE services SET category = 'Braid Services' WHERE name ILIKE '%knotless%' AND category IS NULL;
UPDATE services SET category = 'Braid Services' WHERE name ILIKE '%box braid%' AND category IS NULL;
UPDATE services SET category = 'Braid Services' WHERE name ILIKE '%stitch braid%' AND name NOT ILIKE '%kids%' AND category IS NULL;
UPDATE services SET category = 'Braid Services' WHERE name ILIKE '%lemonade%' AND category IS NULL;
UPDATE services SET category = 'Braid Services' WHERE name ILIKE '%boho%' AND category IS NULL;
UPDATE services SET category = 'Braid Services' WHERE name ILIKE '%curly ends%' AND category IS NULL;
UPDATE services SET category = 'Braid Services' WHERE name ILIKE '%hair included%' AND name NOT ILIKE '%kids%' AND category IS NULL;
UPDATE services SET category = 'Braid Services' WHERE name ILIKE '%custom design%' AND category IS NULL;
UPDATE services SET category = 'Braid Services' WHERE name ILIKE '%mohawk%' AND name NOT ILIKE '%kids%' AND category IS NULL;

-- ============================================================================
-- Kids (Ages 3–10)
-- ============================================================================
UPDATE services SET category = 'Kids (Ages 3–10)' WHERE name ILIKE 'kids%' AND category IS NULL;

-- ============================================================================
-- Loc Services
-- ============================================================================
UPDATE services SET category = 'Loc Services' WHERE name ILIKE '%loc%' AND category IS NULL;
UPDATE services SET category = 'Loc Services' WHERE name ILIKE '%retwist%' AND category IS NULL;
UPDATE services SET category = 'Loc Services' WHERE name ILIKE '%interlock%' AND category IS NULL;
UPDATE services SET category = 'Loc Services' WHERE name ILIKE '%comb out%' AND category IS NULL;

-- ============================================================================
-- Makeup
-- ============================================================================
UPDATE services SET category = 'Makeup' WHERE name ILIKE '%full face%' AND category IS NULL;
UPDATE services SET category = 'Makeup' WHERE name ILIKE '%lash%' AND category IS NULL;
UPDATE services SET category = 'Makeup' WHERE name ILIKE '%mink%' AND category IS NULL;
UPDATE services SET category = 'Makeup' WHERE name ILIKE 'brows only%' AND category IS NULL;

-- ============================================================================
-- Brows, Waxing & Facials
-- ============================================================================
UPDATE services SET category = 'Brows, Waxing & Facials' WHERE name ILIKE '%lamination%' AND category IS NULL;
UPDATE services SET category = 'Brows, Waxing & Facials' WHERE name ILIKE '%wax%' AND category IS NULL;
UPDATE services SET category = 'Brows, Waxing & Facials' WHERE name ILIKE '%tint%' AND category IS NULL;
UPDATE services SET category = 'Brows, Waxing & Facials' WHERE name ILIKE '%facial%' AND category IS NULL;
UPDATE services SET category = 'Brows, Waxing & Facials' WHERE name ILIKE '%microderm%' AND category IS NULL;
UPDATE services SET category = 'Brows, Waxing & Facials' WHERE name ILIKE 'brow %' AND category IS NULL;

-- ============================================================================
-- Catch-all for any remaining uncategorized services
-- ============================================================================
UPDATE services SET category = 'Other Services' WHERE category IS NULL;

-- ============================================================================
-- Verify results
-- ============================================================================
SELECT category, COUNT(*) as count
FROM services
WHERE is_active = true
GROUP BY category
ORDER BY count DESC;
