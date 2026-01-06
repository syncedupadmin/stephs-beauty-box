// @ts-nocheck
/**
 * Product Database Operations
 * ===========================
 * Server-side operations for products, variants, and inventory
 *
 * Note: Type checking disabled until database types are properly generated
 */

import { getSupabase } from '@/lib/supabase';
import type { Product, ProductVariant, ProductImage, ProductWithDetails } from '@/types/database';

/**
 * Get all active products with variants and images
 */
export async function getProducts(): Promise<ProductWithDetails[]> {
  const supabase = getSupabase();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!products?.length) return [];

  // Fetch variants and images
  const productIds = products.map(p => p.id);

  const [variantsRes, imagesRes] = await Promise.all([
    supabase
      .from('product_variants')
      .select('*')
      .in('product_id', productIds)
      .eq('is_active', true)
      .order('position'),
    supabase
      .from('product_images')
      .select('*')
      .in('product_id', productIds)
      .order('position'),
  ]);

  if (variantsRes.error) throw variantsRes.error;
  if (imagesRes.error) throw imagesRes.error;

  // Combine into ProductWithDetails
  return products.map(product => ({
    ...product,
    variants: variantsRes.data?.filter(v => v.product_id === product.id) || [],
    images: imagesRes.data?.filter(i => i.product_id === product.id) || [],
  }));
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(): Promise<ProductWithDetails[]> {
  const supabase = getSupabase();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(6);

  if (error) throw error;
  if (!products?.length) return [];

  const productIds = products.map(p => p.id);

  const [variantsRes, imagesRes] = await Promise.all([
    supabase
      .from('product_variants')
      .select('*')
      .in('product_id', productIds)
      .eq('is_active', true)
      .order('position'),
    supabase
      .from('product_images')
      .select('*')
      .in('product_id', productIds)
      .order('position'),
  ]);

  if (variantsRes.error) throw variantsRes.error;
  if (imagesRes.error) throw imagesRes.error;

  return products.map(product => ({
    ...product,
    variants: variantsRes.data?.filter(v => v.product_id === product.id) || [],
    images: imagesRes.data?.filter(i => i.product_id === product.id) || [],
  }));
}

/**
 * Get a single product by handle
 */
export async function getProductByHandle(handle: string): Promise<ProductWithDetails | null> {
  const supabase = getSupabase();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('handle', handle)
    .eq('is_active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  const [variantsRes, imagesRes] = await Promise.all([
    supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', product.id)
      .eq('is_active', true)
      .order('position'),
    supabase
      .from('product_images')
      .select('*')
      .eq('product_id', product.id)
      .order('position'),
  ]);

  if (variantsRes.error) throw variantsRes.error;
  if (imagesRes.error) throw imagesRes.error;

  return {
    ...product,
    variants: variantsRes.data || [],
    images: imagesRes.data || [],
  };
}

/**
 * Get variant by ID
 */
export async function getVariant(variantId: string): Promise<ProductVariant | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('id', variantId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

/**
 * Get multiple variants by IDs (for cart validation)
 */
export async function getVariants(variantIds: string[]): Promise<ProductVariant[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .in('id', variantIds);

  if (error) throw error;
  return data || [];
}

/**
 * Validate cart items against current inventory
 * Returns items that need adjustment or removal
 */
export async function validateCartInventory(
  items: { variantId: string; quantity: number }[]
): Promise<{
  valid: boolean;
  adjustments: { variantId: string; requestedQty: number; availableQty: number }[];
}> {
  const variantIds = items.map(i => i.variantId);
  const variants = await getVariants(variantIds);

  const adjustments: { variantId: string; requestedQty: number; availableQty: number }[] = [];

  for (const item of items) {
    const variant = variants.find(v => v.id === item.variantId);
    if (!variant) {
      // Variant no longer exists
      adjustments.push({
        variantId: item.variantId,
        requestedQty: item.quantity,
        availableQty: 0,
      });
    } else if (variant.inventory_quantity < item.quantity) {
      // Not enough inventory
      adjustments.push({
        variantId: item.variantId,
        requestedQty: item.quantity,
        availableQty: variant.inventory_quantity,
      });
    }
  }

  return {
    valid: adjustments.length === 0,
    adjustments,
  };
}

/**
 * Atomically decrement inventory (used by webhook after payment)
 */
export async function decrementInventory(
  variantId: string,
  quantity: number
): Promise<boolean> {
  const supabase = getSupabase(true); // Use service role

  const { data, error } = await supabase.rpc('decrement_inventory_safe', {
    p_variant_id: variantId,
    p_quantity: quantity,
  });

  if (error) throw error;
  return data;
}

/**
 * Restore inventory (for cancellations)
 */
export async function restoreInventory(
  variantId: string,
  quantity: number
): Promise<void> {
  const supabase = getSupabase(true);

  const { error } = await supabase.rpc('increment_inventory', {
    p_variant_id: variantId,
    p_quantity: quantity,
  });

  if (error) throw error;
}

/**
 * Get products by type
 */
export async function getProductsByType(productType: string): Promise<ProductWithDetails[]> {
  const supabase = getSupabase();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('product_type', productType)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!products?.length) return [];

  const productIds = products.map(p => p.id);

  const [variantsRes, imagesRes] = await Promise.all([
    supabase
      .from('product_variants')
      .select('*')
      .in('product_id', productIds)
      .eq('is_active', true)
      .order('position'),
    supabase
      .from('product_images')
      .select('*')
      .in('product_id', productIds)
      .order('position'),
  ]);

  if (variantsRes.error) throw variantsRes.error;
  if (imagesRes.error) throw imagesRes.error;

  return products.map(product => ({
    ...product,
    variants: variantsRes.data?.filter(v => v.product_id === product.id) || [],
    images: imagesRes.data?.filter(i => i.product_id === product.id) || [],
  }));
}

/**
 * Check if any products exist in database
 */
export async function hasProducts(): Promise<boolean> {
  const supabase = getSupabase();

  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (error) throw error;
  return (count ?? 0) > 0;
}
