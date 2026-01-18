#!/usr/bin/env node
/**
 * Services Import Script
 * =======================
 * Imports services from services-data.ts into Supabase.
 *
 * Usage:
 *   node scripts/import-services.mjs [options]
 *
 * Options:
 *   --dry-run    Preview changes without writing to database
 *   --clear      Clear existing services before import
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables from .env.local or .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envPath = path.join(__dirname, '..', '.env');
if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
} else if (existsSync(envPath)) {
  config({ path: envPath });
}

// =============================================================================
// SERVICES DATA (copied from services-data.ts since ES modules can't import .ts)
// =============================================================================

const SERVICE_CATEGORIES = [
  {
    id: 'wig-installs',
    name: 'Wig Installs & Services',
    subCategories: [
      {
        name: 'Wig Installs',
        services: [
          { name: 'New Wig Install (with wig purchase)', price: 225, duration: 120 },
          { name: 'New Wig Install', price: 235, priceNote: '+', duration: 120 },
          { name: 'Used Wig Install', price: 190, priceNote: '+', duration: 90 },
          { name: 'New Glueless Wig Install', price: 165, duration: 90 },
          { name: 'Used Glueless Wig Install', price: 90, duration: 60 },
          { name: 'Wig Touch-Up', price: 155, priceNote: '+', duration: 60 },
          { name: 'Glueless Touch-Up', price: 50, priceNote: '+', duration: 45 },
        ],
      },
      {
        name: 'Wig Add-Ons',
        services: [
          { name: 'Braid Down', price: 40, duration: 30 },
          { name: 'Wig Removal', price: 25, duration: 15 },
          { name: 'Wig Wash', price: 45, duration: 30 },
          { name: 'Bleach Knots', price: 35, duration: 30 },
          { name: 'Add Bundle (Bonded)', price: 15, priceNote: 'per row', duration: 15 },
          { name: 'Add Bundle (Sewn-In)', price: 20, priceNote: 'per row', duration: 20 },
        ],
      },
      {
        name: 'Wig Styling',
        services: [
          { name: 'Curl (Short Hair)', price: 40, duration: 30 },
          { name: 'Curl (Long Hair)', price: 55, priceNote: '+', duration: 45 },
          { name: 'Straighten (Short Hair)', price: 40, duration: 30 },
          { name: 'Straighten (Long Hair)', price: 50, priceNote: '+', duration: 45 },
          { name: 'Crimps (Short)', price: 75, duration: 45 },
          { name: 'Crimps (Medium)', price: 85, priceNote: '+', duration: 60 },
          { name: 'Crimps (Long)', price: 100, priceNote: '+', duration: 75 },
          { name: 'Edge Touch-Up', price: 10, priceNote: '+', duration: 15 },
        ],
      },
    ],
  },
  {
    id: 'wig-hair-color',
    name: 'Wig & Hair Color',
    services: [
      { name: 'Root Color (Front Only)', price: 85, priceNote: '+', duration: 60 },
      { name: 'Full Root Color', price: 150, priceNote: '+', duration: 90 },
      { name: 'Highlights', price: 165, priceNote: '+', duration: 120 },
      { name: 'Bundle Coloring', price: 35, priceNote: '+', duration: 45 },
    ],
  },
  {
    id: 'cutting-services',
    name: 'Cutting Services',
    services: [
      { name: 'Haircut', price: 25, priceNote: '+', duration: 30 },
      { name: 'Long Layers', price: 40, priceNote: '+', duration: 30 },
      { name: 'Trim', price: 20, duration: 20 },
      { name: 'Bangs', price: 10, duration: 15 },
    ],
  },
  {
    id: 'sew-ins-quick-weaves',
    name: 'Sew-Ins & Quick Weaves',
    services: [
      { name: 'Full Sew-In (3 Bundles)', price: 250, priceNote: '+', duration: 180 },
      { name: 'Additional Bundles', price: 35, priceNote: 'each', duration: 30 },
      { name: 'Sew-In Maintenance', price: 150, priceNote: '+', duration: 90 },
      { name: 'Frontal Sew-In', price: 300, duration: 210 },
      { name: 'Frontal Ponytail', price: 250, duration: 150 },
      { name: 'Quick Weave', price: 200, priceNote: '+', duration: 120 },
      { name: 'Ponytail', price: 175, duration: 90 },
      { name: 'Half Up Half Down', price: 190, duration: 120 },
    ],
  },
  {
    id: 'natural-hair',
    name: 'Natural Hair Services',
    services: [
      { name: 'Virgin Relaxer', price: 150, duration: 90 },
      { name: 'Relaxer Touch-Up', price: 100, duration: 75 },
      { name: 'Blowout (Short Hair)', price: 45, priceNote: '+', duration: 45 },
      { name: 'Blowout (Long Hair)', price: 85, priceNote: '+', duration: 75 },
    ],
  },
  {
    id: 'shampoo-scalp',
    name: 'Shampoo & Scalp Care',
    services: [
      { name: 'Shampoo & Conditioning', price: 40, duration: 30 },
      { name: 'Shimmer Lights / Shimmery White', price: 50, duration: 45 },
      { name: 'Sea Breeze / Hair Septic', price: 10, duration: 10 },
      { name: 'Treatment', price: 15, priceNote: '+', duration: 20 },
      { name: 'Scalp Treatment', price: 35, duration: 30 },
      { name: 'Detox Scalp Treatment', price: 75, priceNote: '+', duration: 45 },
    ],
  },
  {
    id: 'braid-services',
    name: 'Braid Services',
    subCategories: [
      {
        name: 'Knotless Braids',
        services: [
          { name: 'Knotless Braids - Small / Extra Small', price: 370, duration: 360 },
          { name: 'Knotless Braids - Small Medium', price: 310, duration: 300 },
          { name: 'Knotless Braids - Medium', price: 285, duration: 270 },
          { name: 'Knotless Braids - Large', price: 200, duration: 180 },
          { name: 'Knotless Braids - Jumbo', price: 190, duration: 150 },
          { name: 'Mohawk Knotless', price: 300, priceNote: '+', duration: 240 },
        ],
      },
      {
        name: 'Box Braids',
        services: [
          { name: 'Box Braids - Small / Extra Small', price: 320, priceNote: '+', duration: 330 },
          { name: 'Box Braids - Small Medium', price: 300, duration: 270 },
          { name: 'Box Braids - Medium', price: 250, duration: 240 },
          { name: 'Box Braids - Large', price: 200, duration: 180 },
          { name: 'Box Braids - Jumbo', price: 190, duration: 150 },
        ],
      },
      {
        name: 'Stitch Braids',
        services: [
          { name: 'Stitch Braids - 4 (Without Hair)', price: 110, duration: 60 },
          { name: 'Stitch Braids - 4 (With Hair)', price: 165, duration: 75 },
          { name: 'Stitch Braids - 6 (Without Hair)', price: 150, duration: 75 },
          { name: 'Stitch Braids - 6 (With Hair)', price: 185, duration: 90 },
          { name: 'Stitch Braids - 8 (Without Hair)', price: 185, duration: 90 },
          { name: 'Stitch Braids - 8 (With Hair)', price: 200, duration: 105 },
          { name: 'Stitch Braids - 10 (Without Hair)', price: 225, duration: 105 },
          { name: 'Stitch Braids - 10 (With Hair)', price: 250, duration: 120 },
          { name: 'Stitch Braids - 12 (Without Hair)', price: 250, duration: 120 },
          { name: 'Stitch Braids - 12 (With Hair)', price: 285, duration: 135 },
          { name: 'Stitch Braids - 14 (Without Hair)', price: 265, duration: 135 },
          { name: 'Stitch Braids - 14 (With Hair)', price: 300, duration: 150 },
          { name: 'Stitch Braids - 16 (Without Hair)', price: 285, duration: 150 },
          { name: 'Stitch Braids - 16 (With Hair)', price: 300, duration: 165 },
        ],
      },
      {
        name: 'Lemonade Braids',
        services: [
          { name: 'Lemonade Braids - Medium', price: 250, duration: 210 },
          { name: 'Lemonade Braids - Small', price: 290, priceNote: '+', duration: 270 },
        ],
      },
      {
        name: 'Braid Add-Ons',
        services: [
          { name: 'Boho (Light)', price: 30, duration: 30 },
          { name: 'Boho (Medium)', price: 55, duration: 45 },
          { name: 'Boho (Heavy)', price: 85, priceNote: '+', duration: 60 },
          { name: 'Curly Ends', price: 50, duration: 30 },
          { name: 'Hair Included', price: 50, duration: 0 },
          { name: 'Kids Hair Included', price: 40, duration: 0 },
          { name: 'Custom Designs', price: 10, priceNote: '–$30', duration: 30 },
        ],
      },
    ],
  },
  {
    id: 'kids-services',
    name: 'Kids (Ages 3–10)',
    services: [
      { name: 'Kids - Gel Sleek Ponytail', price: 40, priceNote: '+', duration: 30 },
      { name: 'Kids - Regular Sleek Ponytail', price: 60, priceNote: '+', duration: 45 },
      { name: 'Kids - Half Up Half Down', price: 150, priceNote: '–$195', duration: 90 },
      { name: 'Kids - Stitch Braids', price: 150, priceNote: '–$185', duration: 90 },
      { name: 'Kids - Fulani Sew-In', price: 235, priceNote: '–$275', duration: 150 },
      { name: 'Kids - Fulani Quick Weave', price: 220, priceNote: '–$250', duration: 120 },
      { name: 'Kids - Mohawk Knotless', price: 200, priceNote: '+', duration: 150 },
    ],
  },
  {
    id: 'loc-services',
    name: 'Loc Services',
    services: [
      { name: 'Crochet Locs', price: 150, priceNote: '+', duration: 180 },
      { name: 'Interlocking', price: 135, priceNote: '+', duration: 120 },
      { name: 'Retwist (1–49 locs)', price: 150, duration: 90 },
      { name: 'Retwist (50–100 locs)', price: 175, duration: 120 },
      { name: 'Retwist (102+ locs)', price: 185, priceNote: '+', duration: 150 },
      { name: 'Kids Retwist', price: 125, duration: 75 },
      { name: 'Comb Out', price: 300, priceNote: '+', duration: 240 },
      { name: 'Starter Locs', price: 135, priceNote: '–$220+', duration: 180 },
      { name: 'Instant Locs', price: 300, priceNote: '+', duration: 300 },
    ],
  },
  {
    id: 'makeup',
    name: 'Makeup',
    services: [
      { name: 'Full Face (Lashes Included)', price: 150, duration: 60 },
      { name: 'Full Face + Swarovski Crystals', price: 165, priceNote: '+', duration: 75 },
      { name: 'Brows Only', price: 30, duration: 15 },
      { name: 'Lashes Only', price: 10, duration: 10 },
      { name: 'Mink Lashes (With Service)', price: 15, duration: 0 },
      { name: 'Mink Lashes (No Service)', price: 20, duration: 10 },
      { name: 'Lash Clusters', price: 60, priceNote: '–$85+', duration: 45 },
    ],
  },
  {
    id: 'brows-waxing-facials',
    name: 'Brows, Waxing & Facials',
    subCategories: [
      {
        name: 'Brows',
        services: [
          { name: 'Brow Lamination', price: 60, duration: 45 },
          { name: 'Lamination + Wax + Tint', price: 100, duration: 60 },
          { name: 'Lamination + Wax', price: 85, duration: 50 },
          { name: 'Wax & Tint', price: 50, duration: 30 },
          { name: 'Brow Tint', price: 35, duration: 20 },
          { name: 'Brow Wax', price: 22, duration: 15 },
        ],
      },
      {
        name: 'Waxing',
        services: [
          { name: 'Upper Lip Wax', price: 15, duration: 10 },
          { name: 'Chin Wax', price: 15, duration: 10 },
          { name: 'Underarms Wax', price: 30, priceNote: '+', duration: 15 },
          { name: 'Full Arms Wax', price: 55, duration: 30 },
          { name: 'Full Legs Wax', price: 80, duration: 45 },
          { name: 'Back Wax', price: 65, duration: 35 },
          { name: 'Chest Wax', price: 40, priceNote: '+', duration: 25 },
          { name: 'Stomach Wax', price: 45, duration: 25 },
        ],
      },
      {
        name: 'Facials',
        services: [
          { name: 'Deluxe Facial', price: 150, priceNote: '+', duration: 60 },
          { name: 'Microdermabrasion', price: 185, priceNote: '+', duration: 75 },
        ],
      },
    ],
  },
];

// Helper to get all services flattened
function getAllServices() {
  const allServices = [];
  let position = 0;

  for (const category of SERVICE_CATEGORIES) {
    if (category.services) {
      for (const service of category.services) {
        allServices.push({
          ...service,
          categoryId: category.id,
          categoryName: category.name,
          position: position++,
        });
      }
    }

    if (category.subCategories) {
      for (const subCategory of category.subCategories) {
        for (const service of subCategory.services) {
          allServices.push({
            ...service,
            categoryId: category.id,
            categoryName: category.name,
            subCategoryName: subCategory.name,
            position: position++,
          });
        }
      }
    }
  }

  return allServices;
}

// =============================================================================
// SUPABASE CLIENT
// =============================================================================

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Missing environment variables:');
    if (!url) console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    if (!key) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// =============================================================================
// MAIN IMPORT FUNCTION
// =============================================================================

async function importServices() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const clearFirst = args.includes('--clear');

  console.log('\n========================================');
  console.log('  SERVICES IMPORT SCRIPT');
  console.log('========================================\n');

  if (dryRun) {
    console.log('DRY RUN MODE - No changes will be made\n');
  }

  const supabase = getSupabaseClient();
  const services = getAllServices();

  console.log(`Found ${services.length} services to import\n`);

  // Clear existing services if requested
  if (clearFirst && !dryRun) {
    console.log('Clearing existing services...');
    const { error } = await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      console.error('Failed to clear services:', error.message);
      process.exit(1);
    }
    console.log('Cleared existing services\n');
  }

  // Import services
  let imported = 0;
  let updated = 0;
  let errors = 0;

  for (const service of services) {
    const serviceData = {
      name: service.name,
      description: service.priceNote
        ? `Starting at $${service.price}${service.priceNote === '+' ? '' : ' ' + service.priceNote}`
        : null,
      category: service.categoryName,
      duration_minutes: service.duration || 60,
      price_cents: service.price * 100,
      position: service.position,
      is_active: true,
    };

    if (dryRun) {
      console.log(`  [DRY RUN] ${service.name} - $${service.price} (${service.duration}min)`);
      imported++;
      continue;
    }

    // Check if service exists (by name)
    const { data: existing } = await supabase
      .from('services')
      .select('id')
      .eq('name', service.name)
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', existing.id);

      if (error) {
        console.error(`  Failed to update "${service.name}": ${error.message}`);
        errors++;
      } else {
        console.log(`  Updated: ${service.name}`);
        updated++;
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('services')
        .insert(serviceData);

      if (error) {
        console.error(`  Failed to insert "${service.name}": ${error.message}`);
        errors++;
      } else {
        console.log(`  Imported: ${service.name}`);
        imported++;
      }
    }
  }

  // Summary
  console.log('\n========================================');
  console.log('  IMPORT COMPLETE');
  console.log('========================================');
  console.log(`  New services:     ${imported}`);
  console.log(`  Updated services: ${updated}`);
  console.log(`  Errors:           ${errors}`);
  console.log('========================================\n');
}

// Run the import
importServices().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
