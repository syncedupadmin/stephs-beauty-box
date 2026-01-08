/**
 * Stats Card Component
 * ====================
 * Dashboard metric cards
 */

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, subtitle, trend, icon }: StatsCardProps) {
  return (
    <div className="bg-off-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
            {title}
          </p>
          <p className="font-display text-display-sm text-ink">
            {value}
          </p>
          {subtitle && (
            <p className="text-body-sm font-body text-ink/50 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={`text-body-sm font-body mt-2 ${
              trend.isPositive ? 'text-botanical' : 'text-clay'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 bg-botanical/10 text-botanical flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
