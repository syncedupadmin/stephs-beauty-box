#!/usr/bin/env node
/**
 * Product Import Script
 * =====================
 * Imports products from a CSV file (Shopify export format) into Supabase.
 *
 * Usage:
 *   node scripts/import-products-from-csv.mjs <path-to-csv>
 *
 * Features:
 * - Parses Shopify-format CSV exports
 * - Creates products, variants, and images
 * - Normalizes handles and SKUs
 * - Skips service products (logs to import-skip-log.json)
 * - Sets inventory to 0 if not provided (sold out until admin sets)
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =============================================================================
// CONFIGURATION
// =============================================================================

// Service product detection rules (exact matches only)
const SERVICE_INDICATORS = {
  productType: ['service', 'appointment', 'booking', 'consultation'],
  tags: ['service', 'appointment', 'booking', 'install', 'installation'],
  titleKeywords: ['install', 'installation', 'consultation', 'service'],
};

// =============================================================================
// SUPABASE CLIENT
// =============================================================================

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('❌ Missing environment variables:');
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
// HELPERS
// =============================================================================

/**
 * Normalize handle (URL slug)
 */
function normalizeHandle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

/**
 * Normalize SKU
 */
function normalizeSku(sku) {
  if (!sku) return null;
  return sku.toString().trim().toUpperCase().replace(/\s+/g, '-');
}

/**
 * Parse price string to cents
 */
function parsePriceToCents(priceStr) {
  if (!priceStr) return 0;
  const cleaned = priceStr.toString().replace(/[^0-9.]/g, '');
  const price = parseFloat(cleaned);
  return isNaN(price) ? 0 : Math.round(price * 100);
}

/**
 * Parse inventory quantity
 */
function parseInventory(inventoryStr) {
  if (!inventoryStr || inventoryStr === '') return 0; // Default to sold out
  const qty = parseInt(inventoryStr, 10);
  return isNaN(qty) ? 0 : Math.max(0, qty);
}

/**
 * Parse tags string to array
 */
function parseTags(tagsStr) {
  if (!tagsStr) return [];
  return tagsStr
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
}

/**
 * Check if a product is a service (should be skipped)
 */
function isServiceProduct(row) {
  // Check product_type
  const productType = (row['Type'] || row['Product Type'] || '').toLowerCase().trim();
  if (SERVICE_INDICATORS.productType.includes(productType)) {
    return { isService: true, reason: `Product type: ${productType}` };
  }

  // Check tags
  const tags = parseTags(row['Tags'] || '');
  for (const tag of tags) {
    if (SERVICE_INDICATORS.tags.includes(tag.toLowerCase())) {
      return { isService: true, reason: `Tag: ${tag}` };
    }
  }

  // Check title keywords (exact word match)
  const title = (row['Title'] || '').toLowerCase();
  for (const keyword of SERVICE_INDICATORS.titleKeywords) {
    // Match whole word only
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(title)) {
      return { isService: true, reason: `Title keyword: ${keyword}` };
    }
  }

  return { isService: false, reason: null };
}

// =============================================================================
// CSV PARSING
// =============================================================================

/**
 * Parse CSV and group by product handle
 */
function parseCSV(csvPath) {
  console.log(`📄 Reading CSV: ${csvPath}`);

  const content = readFileSync(csvPath, 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`   Found ${records.length} rows`);

  // Group by handle (Shopify exports have multiple rows per product)
  const products = new Map();

  for (const row of records) {
    const handle = row['Handle'] || normalizeHandle(row['Title'] || `product-${Date.now()}`);

    if (!products.has(handle)) {
      products.set(handle, {
        handle,
        title: row['Title'] || 'Untitled Product',
        description: row['Body (HTML)'] || row['Body HTML'] || row['Description'] || null,
        productType: row['Type'] || row['Product Type'] || null,
        vendor: row['Vendor'] || null,
        tags: parseTags(row['Tags']),
        seoTitle: row['SEO Title'] || null,
        seoDescription: row['SEO Description'] || null,
        variants: [],
        images: [],
      });
    }

    const product = products.get(handle);

    // Add variant
    const variantTitle = row['Option1 Value'] || row['Variant Title'] || 'Default';
    const sku = normalizeSku(row['Variant SKU'] || row['SKU']);
    const price = parsePriceToCents(row['Variant Price'] || row['Price']);
    const comparePrice = parsePriceToCents(row['Variant Compare At Price'] || row['Compare At Price']);
    const inventory = parseInventory(row['Variant Inventory Qty'] || row['Inventory']);
    const weight = parseInt(row['Variant Grams'] || row['Weight'] || '0', 10);

    // Check for duplicate SKU in this product
    const existingVariant = product.variants.find(v => v.sku === sku && sku !== null);
    if (!existingVariant) {
      product.variants.push({
        title: variantTitle,
        sku,
        priceCents: price,
        compareAtPriceCents: comparePrice > price ? comparePrice : null,
        inventoryQuantity: inventory,
        weightGrams: weight || null,
        option1Name: row['Option1 Name'] || null,
        option1Value: row['Option1 Value'] || null,
        option2Name: row['Option2 Name'] || null,
        option2Value: row['Option2 Value'] || null,
        option3Name: row['Option3 Name'] || null,
        option3Value: row['Option3 Value'] || null,
      });
    }

    // Add image (if present and not duplicate)
    const imageSrc = row['Image Src'] || row['Image URL'];
    const imageAlt = row['Image Alt Text'] || row['Image Alt'];
    if (imageSrc && !product.images.some(img => img.src === imageSrc)) {
      product.images.push({
        src: imageSrc,
        alt: imageAlt || null,
        position: product.images.length,
      });
    }
  }

  return Array.from(products.values());
}

// =============================================================================
// DATABASE IMPORT
// =============================================================================

async function importProducts(supabase, products) {
  const skipped = [];
  const imported = [];
  const errors = [];

  console.log(`\n📦 Processing ${products.length} products...\n`);

  for (const product of products) {
    // Check if service product
    const serviceCheck = isServiceProduct({
      Title: product.title,
      Type: product.productType,
      Tags: product.tags.join(','),
    });

    if (serviceCheck.isService) {
      skipped.push({
        handle: product.handle,
        title: product.title,
        reason: serviceCheck.reason,
      });
      console.log(`⏭️  Skipped (service): ${product.title}`);
      continue;
    }

    try {
      // Check if product already exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('handle', product.handle)
        .single();

      if (existing) {
        console.log(`⚠️  Already exists: ${product.title}`);
        continue;
      }

      // Insert product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          handle: product.handle,
          title: product.title,
          description: product.description,
          product_type: product.productType,
          vendor: product.vendor,
          tags: product.tags,
          seo_title: product.seoTitle,
          seo_description: product.seoDescription,
          is_active: true,
          is_featured: false,
        })
        .select()
        .single();

      if (productError) {
        throw new Error(`Product insert: ${productError.message}`);
      }

      // Insert variants
      const variants = product.variants.map((v, i) => ({
        product_id: newProduct.id,
        title: v.title,
        sku: v.sku,
        price_cents: v.priceCents || 0,
        compare_at_price_cents: v.compareAtPriceCents,
        inventory_quantity: v.inventoryQuantity,
        weight_grams: v.weightGrams,
        option1_name: v.option1Name,
        option1_value: v.option1Value,
        option2_name: v.option2Name,
        option2_value: v.option2Value,
        option3_name: v.option3Name,
        option3_value: v.option3Value,
        position: i,
        is_active: true,
      }));

      const { error: variantsError } = await supabase
        .from('product_variants')
        .insert(variants);

      if (variantsError) {
        throw new Error(`Variants insert: ${variantsError.message}`);
      }

      // Insert images
      if (product.images.length > 0) {
        const images = product.images.map((img, i) => ({
          product_id: newProduct.id,
          src: img.src,
          alt: img.alt,
          position: i,
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(images);

        if (imagesError) {
          console.warn(`   Warning: Images insert failed: ${imagesError.message}`);
        }
      }

      imported.push({
        handle: product.handle,
        title: product.title,
        variants: product.variants.length,
        images: product.images.length,
      });

      console.log(`✅ Imported: ${product.title} (${product.variants.length} variants)`);

    } catch (error) {
      errors.push({
        handle: product.handle,
        title: product.title,
        error: error.message,
      });
      console.error(`❌ Error: ${product.title} - ${error.message}`);
    }
  }

  return { imported, skipped, errors };
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('🚀 Product Import Script');
  console.log('========================\n');

  // Check arguments
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('❌ Usage: node scripts/import-products-from-csv.mjs <path-to-csv>');
    console.error('\nExample:');
    console.error('  node scripts/import-products-from-csv.mjs ./data/products_export.csv');
    process.exit(1);
  }

  // Initialize Supabase
  const supabase = getSupabaseClient();
  console.log('✅ Supabase client initialized\n');

  // Parse CSV
  let products;
  try {
    products = parseCSV(csvPath);
  } catch (error) {
    console.error(`❌ Failed to parse CSV: ${error.message}`);
    process.exit(1);
  }

  if (products.length === 0) {
    console.log('⚠️  No products found in CSV');
    process.exit(0);
  }

  // Import products
  const { imported, skipped, errors } = await importProducts(supabase, products);

  // Write skip log
  if (skipped.length > 0) {
    const skipLogPath = path.join(__dirname, 'import-skip-log.json');
    writeFileSync(skipLogPath, JSON.stringify(skipped, null, 2));
    console.log(`\n📝 Skipped products logged to: ${skipLogPath}`);
  }

  // Summary
  console.log('\n========== IMPORT SUMMARY ==========');
  console.log(`✅ Imported: ${imported.length} products`);
  console.log(`⏭️  Skipped:  ${skipped.length} products (services)`);
  console.log(`❌ Errors:   ${errors.length} products`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors:');
    errors.forEach(e => console.log(`   - ${e.title}: ${e.error}`));
  }

  console.log('\n✨ Import complete!\n');

  // If there were inventory items set to 0, note it
  const zeroInventory = imported.filter(p =>
    products.find(pr => pr.handle === p.handle)?.variants.some(v => v.inventoryQuantity === 0)
  );
  if (zeroInventory.length > 0) {
    console.log('⚠️  Note: Some products have 0 inventory (Sold Out).');
    console.log('   Update inventory in admin panel to make them available.\n');
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
