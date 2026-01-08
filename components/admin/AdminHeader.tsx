'use client';

/**
 * Admin Header
 * ============
 * Top header with user menu
 */

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logoutAdmin } from '@/lib/auth/actions';
import type { AdminUser } from '@/lib/auth/dal';

interface AdminHeaderProps {
  admin: AdminUser;
}

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/services': 'Services',
  '/admin/services/new': 'Add Service',
  '/admin/products': 'Products',
  '/admin/products/new': 'Add Product',
  '/admin/bookings': 'Bookings',
  '/admin/orders': 'Orders',
  '/admin/settings': 'Settings',
  '/admin/settings/shop': 'Shop Settings',
  '/admin/settings/booking': 'Booking Settings',
  '/admin/settings/availability': 'Availability',
};

export function AdminHeader({ admin }: AdminHeaderProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get page title
  const getPageTitle = () => {
    // Check for exact match first
    if (pageTitles[pathname]) return pageTitles[pathname];

    // Check for dynamic routes (e.g., /admin/services/[id])
    if (pathname.startsWith('/admin/services/') && pathname !== '/admin/services/new') {
      return 'Edit Service';
    }
    if (pathname.startsWith('/admin/products/') && pathname !== '/admin/products/new') {
      return 'Edit Product';
    }
    if (pathname.startsWith('/admin/bookings/')) return 'Booking Details';
    if (pathname.startsWith('/admin/orders/')) return 'Order Details';

    return 'Admin';
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await logoutAdmin();
  };

  return (
    <header className="sticky top-0 z-30 bg-paper border-b border-ink/10">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Page title */}
        <div className="pl-12 lg:pl-0">
          <h1 className="font-display text-xl text-ink">
            {getPageTitle()}
          </h1>
        </div>

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 text-body-sm font-body text-ink/60 hover:text-ink transition-colors duration-600"
          >
            <span className="hidden sm:block">
              {admin.name || admin.email}
            </span>
            <div className="w-8 h-8 bg-botanical text-paper flex items-center justify-center text-sm font-medium">
              {(admin.name || admin.email).charAt(0).toUpperCase()}
            </div>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-off-white shadow-lg border border-ink/10 py-1">
              <div className="px-4 py-2 border-b border-ink/10">
                <p className="text-body-sm font-body text-ink truncate">
                  {admin.email}
                </p>
                <p className="text-overline text-ink/40 uppercase mt-1">
                  {admin.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-body-sm font-body text-ink/60 hover:text-ink hover:bg-ink/5 transition-colors duration-600"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
