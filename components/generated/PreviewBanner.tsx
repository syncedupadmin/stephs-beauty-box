'use client';

import { useEffect, useState } from 'react';

interface PreviewBannerProps {
  projectId: string;
}

interface StatusResponse {
  success: boolean;
  data?: {
    projectId: string;
    purchaseStatus: 'preview' | 'purchased';
    invoiceEnabled: boolean;
    invoiceUrl: string | null;
  };
}

/**
 * PreviewBanner Component
 *
 * This component is injected into generated websites when invoice mode is enabled.
 * It fetches the project status from the SyncedUp API and displays a banner if the site is in preview mode.
 *
 * - Shows banner when: purchaseStatus === 'preview' && invoiceEnabled === true
 * - Hides when: purchaseStatus === 'purchased' OR invoiceEnabled === false
 */
export function PreviewBanner({ projectId }: PreviewBannerProps) {
  const [status, setStatus] = useState<'loading' | 'preview' | 'hidden'>('loading');
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setStatus('hidden');
      return;
    }

    async function checkStatus() {
      try {
        // Fetch status from SyncedUp API (main platform)
        // Using Vercel auto-domain until custom domain is properly configured
        const apiUrl = process.env.NEXT_PUBLIC_SYNCEDUP_API_URL || 'https://syncedupwebsites.vercel.app';
        const response = await fetch(`${apiUrl}/api/project/${projectId}/status`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          setStatus('hidden');
          return;
        }

        const data: StatusResponse = await response.json();

        if (!data.success || !data.data) {
          setStatus('hidden');
          return;
        }

        // Check if banner should be shown
        if (data.data.purchaseStatus === 'preview' && data.data.invoiceEnabled) {
          setStatus('preview');
          setInvoiceUrl(data.data.invoiceUrl);
        } else {
          setStatus('hidden');
        }
      } catch (error) {
        console.error('[PreviewBanner] Error fetching status:', error);
        setStatus('hidden');
      }
    }

    checkStatus();

    // Re-check every 30 seconds in case payment is made
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [projectId]);

  // Don't render anything if not in preview mode
  if (status === 'loading' || status === 'hidden') {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-slate-900 text-white shadow-2xl"
      role="banner"
      aria-label="Preview mode notification"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Status message */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <svg
                className="w-5 h-5 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="font-medium">PREVIEW MODE</span>
            </span>
            <span className="hidden sm:inline text-slate-300">
              This website is ready for purchase
            </span>
          </div>

          {/* Right: CTA button */}
          {invoiceUrl && (
            <a
              href={invoiceUrl}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base whitespace-nowrap"
            >
              Buy Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Mobile: additional info */}
      <div className="sm:hidden bg-slate-800 px-4 py-2 text-center text-xs text-slate-400">
        Complete your purchase to remove this banner
      </div>
    </div>
  );
}

export default PreviewBanner;
