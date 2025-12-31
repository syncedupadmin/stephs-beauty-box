'use client';

/**
 * Global Error Boundary
 *
 * Catches unhandled errors in the app and displays a user-friendly message.
 * Provides a retry button to attempt recovery.
 */

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service in production
    console.error('Uncaught error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-serif text-ivory mb-3">
          Something went wrong
        </h1>

        <p className="text-ivory/60 mb-8">
          We apologize for the inconvenience. Please try again or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gold text-bg font-medium rounded-lg hover:bg-gold-light transition-colors"
          >
            Try Again
          </button>

          <a
            href="/"
            className="px-6 py-3 border border-gold/30 text-gold font-medium rounded-lg hover:bg-gold/10 transition-colors"
          >
            Go Home
          </a>
        </div>

        {/* Error ID for support */}
        {error.digest && (
          <p className="mt-8 text-xs text-ivory/40">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
