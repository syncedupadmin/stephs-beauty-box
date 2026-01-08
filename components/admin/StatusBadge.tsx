/**
 * Status Badge Component
 * ======================
 * Colored status pills for various states
 */

type StatusType =
  | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  | 'confirmed' | 'hold' | 'cancelled' | 'expired' | 'completed' | 'no_show'
  | 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'refunded' | 'needs_attention';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusConfig: Record<StatusType, { bg: string; text: string; label: string }> = {
  // Generic
  success: { bg: 'bg-botanical/10', text: 'text-botanical', label: 'Success' },
  warning: { bg: 'bg-clay/10', text: 'text-clay', label: 'Warning' },
  error: { bg: 'bg-red-100', text: 'text-red-700', label: 'Error' },
  info: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Info' },
  neutral: { bg: 'bg-ink/10', text: 'text-ink/60', label: 'Neutral' },

  // Booking statuses
  confirmed: { bg: 'bg-botanical/10', text: 'text-botanical', label: 'Confirmed' },
  hold: { bg: 'bg-clay/10', text: 'text-clay', label: 'Hold' },
  cancelled: { bg: 'bg-ink/10', text: 'text-ink/60', label: 'Cancelled' },
  expired: { bg: 'bg-ink/10', text: 'text-ink/40', label: 'Expired' },
  completed: { bg: 'bg-botanical/10', text: 'text-botanical', label: 'Completed' },
  no_show: { bg: 'bg-red-100', text: 'text-red-700', label: 'No Show' },

  // Order statuses
  pending: { bg: 'bg-clay/10', text: 'text-clay', label: 'Pending' },
  paid: { bg: 'bg-botanical/10', text: 'text-botanical', label: 'Paid' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Shipped' },
  delivered: { bg: 'bg-botanical/10', text: 'text-botanical', label: 'Delivered' },
  refunded: { bg: 'bg-ink/10', text: 'text-ink/60', label: 'Refunded' },
  needs_attention: { bg: 'bg-red-100', text: 'text-red-700', label: 'Needs Attention' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.neutral;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-body uppercase tracking-wider ${config.bg} ${config.text}`}>
      {label || config.label}
    </span>
  );
}
