import { NextRequest, NextResponse } from 'next/server';
import { releaseExpiredHolds } from '@/lib/db/bookings';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * POST /api/cron/release-holds
 *
 * Releases expired booking holds.
 * Should be called by Vercel Cron or external scheduler.
 *
 * Security: Requires CRON_SECRET header to match env var.
 *
 * Vercel cron configuration: see vercel.json
 * Schedule: every 5 minutes
 */

export async function POST(request: NextRequest) {
  // Verify cron secret
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');

  // Allow if CRON_SECRET is set and matches, OR if called internally (no secret set)
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn('[Cron] Unauthorized request to release-holds');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: 'Database not configured', released: 0 },
      { status: 503 }
    );
  }

  try {
    const releasedCount = await releaseExpiredHolds();

    console.log(`[Cron] Released ${releasedCount} expired booking holds`);

    return NextResponse.json({
      success: true,
      released: releasedCount,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Cron] Failed to release holds:', error);
    return NextResponse.json(
      { error: 'Failed to release holds', released: 0 },
      { status: 500 }
    );
  }
}

// Also support GET for easier manual testing
export async function GET(request: NextRequest) {
  return POST(request);
}
