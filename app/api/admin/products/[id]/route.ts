/**
 * Admin Product API - Single Product
 * ===================================
 * GET, PUT, DELETE for individual product
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/dal';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single product with variants and images
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants (*),
        product_images (*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load product' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createServiceRoleClient();

    const body = await request.json();
    const {
      title,
      handle,
      description,
      product_type,
      vendor,
      tags,
      is_active,
      is_featured,
      // Variant updates (for default variant)
      variant_id,
      price_cents,
      compare_at_price_cents,
      sku,
      inventory_quantity,
      // Image updates
      image_url,
    } = body;

    // Build product update object
    const productUpdates: Record<string, unknown> = {};
    if (title !== undefined) productUpdates.title = title;
    if (handle !== undefined) productUpdates.handle = handle;
    if (description !== undefined) productUpdates.description = description;
    if (product_type !== undefined) productUpdates.product_type = product_type;
    if (vendor !== undefined) productUpdates.vendor = vendor;
    if (tags !== undefined) productUpdates.tags = tags;
    if (is_active !== undefined) productUpdates.is_active = is_active;
    if (is_featured !== undefined) productUpdates.is_featured = is_featured;

    // Update product
    if (Object.keys(productUpdates).length > 0) {
      const { error: productError } = await supabase
        .from('products')
        .update(productUpdates)
        .eq('id', id);

      if (productError) throw productError;
    }

    // Update variant if variant data provided
    if (variant_id && (price_cents !== undefined || sku !== undefined || inventory_quantity !== undefined)) {
      const variantUpdates: Record<string, unknown> = {};
      if (price_cents !== undefined) variantUpdates.price_cents = price_cents;
      if (compare_at_price_cents !== undefined) variantUpdates.compare_at_price_cents = compare_at_price_cents;
      if (sku !== undefined) variantUpdates.sku = sku;
      if (inventory_quantity !== undefined) variantUpdates.inventory_quantity = inventory_quantity;

      await supabase
        .from('product_variants')
        .update(variantUpdates)
        .eq('id', variant_id);
    }

    // Update or create primary image
    if (image_url !== undefined) {
      // Get existing primary image
      const { data: existingImage } = await supabase
        .from('product_images')
        .select('id')
        .eq('product_id', id)
        .eq('position', 0)
        .single();

      if (existingImage) {
        if (image_url) {
          await supabase
            .from('product_images')
            .update({ src: image_url })
            .eq('id', existingImage.id);
        } else {
          await supabase
            .from('product_images')
            .delete()
            .eq('id', existingImage.id);
        }
      } else if (image_url) {
        await supabase
          .from('product_images')
          .insert({
            product_id: id,
            src: image_url,
            alt: title,
            position: 0,
          });
      }
    }

    // Fetch updated product
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants (*),
        product_images (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Product PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createServiceRoleClient();

    // Check if product has any orders
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('id, product_variants!inner(product_id)')
      .eq('product_variants.product_id', id)
      .limit(1);

    if (orderItems && orderItems.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders. Deactivate it instead.' },
        { status: 400 }
      );
    }

    // Delete product (cascades to variants and images)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
