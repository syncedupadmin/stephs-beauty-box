/**
 * Admin Products API
 * ==================
 * CRUD operations for products with variants and images
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/dal';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET - List all products with variants and images
export async function GET() {
  try {
    await requireAdmin();
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants (*),
        product_images (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ products: data });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    );
  }
}

// POST - Create new product with default variant
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
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
      // Default variant data
      price_cents,
      compare_at_price_cents,
      sku,
      inventory_quantity,
      // Image
      image_url,
    } = body;

    // Validate required fields
    if (!title || price_cents === undefined) {
      return NextResponse.json(
        { error: 'Title and price are required' },
        { status: 400 }
      );
    }

    // Generate handle if not provided
    const productHandle = handle || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check handle uniqueness
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('handle', productHandle)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A product with this URL handle already exists' },
        { status: 400 }
      );
    }

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        title,
        handle: productHandle,
        description,
        product_type,
        vendor,
        tags: tags || [],
        is_active: is_active ?? true,
        is_featured: is_featured ?? false,
      })
      .select()
      .single();

    if (productError) throw productError;

    // Create default variant
    const { error: variantError } = await supabase
      .from('product_variants')
      .insert({
        product_id: product.id,
        title: 'Default',
        sku,
        price_cents,
        compare_at_price_cents,
        inventory_quantity: inventory_quantity ?? 0,
        is_active: true,
        position: 0,
      });

    if (variantError) throw variantError;

    // Create image if provided
    if (image_url) {
      await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          src: image_url,
          alt: title,
          position: 0,
        });
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
