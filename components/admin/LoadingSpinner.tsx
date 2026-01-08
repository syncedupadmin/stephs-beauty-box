/**
 * Loading Spinner Component
 * =========================
 * Loading states for admin pages
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-ink/10 border-t-botanical animate-spin`}
        style={{ borderRadius: '50%' }}
      />
    </div>
  );
}

// Full page loading state
interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-body-sm font-body text-ink/50">
        {message}
      </p>
    </div>
  );
}

// Skeleton loading for cards
export function CardSkeleton() {
  return (
    <div className="bg-off-white p-6 animate-pulse">
      <div className="h-3 w-24 bg-ink/10 mb-3" />
      <div className="h-8 w-32 bg-ink/10 mb-2" />
      <div className="h-3 w-20 bg-ink/10" />
    </div>
  );
}

// Skeleton loading for table rows
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-ink/5">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-ink/10 animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-off-white overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-ink/10">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="text-left px-6 py-4">
                <div className="h-3 w-20 bg-ink/10 animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
