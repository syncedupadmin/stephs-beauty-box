'use client';

/**
 * Admin Login Page
 * ================
 * Editorial design matching the main site aesthetic
 */

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginAdmin } from '@/lib/auth/actions';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    errorParam === 'not_admin' ? 'Access denied. Not an admin user.' : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginAdmin(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-off-white p-8 md:p-12">
      <h1 className="font-display text-display-sm text-ink mb-8 text-center">
        Sign In
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-clay/10 border border-clay/30 text-clay text-body-sm font-body">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label-editorial">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-editorial"
            placeholder="admin@example.com"
            required
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="label-editorial">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-editorial"
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="cta-primary w-full justify-center disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl text-ink">
              Steph&apos;s Beauty Box
            </span>
          </Link>
          <p className="mt-2 text-overline uppercase tracking-[0.2em] text-ink/40">
            Admin Portal
          </p>
        </div>

        {/* Login Form with Suspense for useSearchParams */}
        <Suspense fallback={
          <div className="bg-off-white p-8 md:p-12 text-center">
            <p className="text-ink/60">Loading...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>

        {/* Back to site */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="editorial-link text-body-sm text-ink/60"
          >
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
