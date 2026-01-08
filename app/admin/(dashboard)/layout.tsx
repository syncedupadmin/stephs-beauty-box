import { requireAdmin } from '@/lib/auth/dal';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

/**
 * Admin Layout
 * ============
 * Protected layout with sidebar navigation
 * Matches the editorial aesthetic of the main site
 */

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify admin access (redirects if not authenticated)
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-paper">
      {/* Sidebar - fixed on desktop */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <AdminHeader admin={admin} />

        {/* Page content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
