'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'gold' | 'rose' | 'none';
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = '',
  hover = true,
  glow = 'gold',
  onClick,
}: GlassCardProps) {
  const glowColors = {
    gold: 'hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]',
    rose: 'hover:shadow-[0_0_40px_rgba(183,110,121,0.15)]',
    none: '',
  };

  const borderColors = {
    gold: 'hover:border-gold/40',
    rose: 'hover:border-rose/40',
    none: '',
  };

  return (
    <motion.div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-bg-card/80 to-bg-card/40
        backdrop-blur-xl
        border border-ivory/5
        ${hover ? `transition-all duration-500 ${glowColors[glow]} ${borderColors[glow]}` : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hover ? {
        y: -4,
        transition: { duration: 0.3, ease: 'easeOut' }
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-ivory/[0.02] via-transparent to-transparent pointer-events-none" />

      {/* Animated border gradient */}
      {hover && glow !== 'none' && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className={`absolute inset-[-1px] rounded-2xl bg-gradient-to-r ${
            glow === 'gold'
              ? 'from-gold/20 via-gold/5 to-gold/20'
              : 'from-rose/20 via-rose/5 to-rose/20'
          }`} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// Service card with icon
interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  items?: string[];
  className?: string;
}

export function ServiceCard({
  icon,
  title,
  description,
  items,
  className = '',
}: ServiceCardProps) {
  return (
    <GlassCard className={`p-8 group ${className}`}>
      {/* Icon container with glow */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center group-hover:from-gold/30 group-hover:to-gold/10 transition-all duration-500">
          <div className="text-gold group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gold/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
      </div>

      <h3 className="text-xl font-medium text-ivory mb-3 group-hover:text-gold transition-colors duration-300">
        {title}
      </h3>

      <p className="text-ivory/60 text-sm leading-relaxed mb-4">
        {description}
      </p>

      {items && items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-ivory/50 group-hover:text-ivory/70 transition-colors duration-300"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold transition-colors duration-300" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

// Feature card with number
interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  number,
  title,
  description,
  className = '',
}: FeatureCardProps) {
  return (
    <GlassCard className={`p-8 group ${className}`}>
      <div className="flex items-start gap-4">
        <span className="text-5xl font-serif text-gold/20 group-hover:text-gold/40 transition-colors duration-500">
          {number}
        </span>
        <div>
          <h3 className="text-lg font-medium text-ivory mb-2 group-hover:text-gold transition-colors duration-300">
            {title}
          </h3>
          <p className="text-ivory/60 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

// Stats card with animated counter
interface StatCardProps {
  value: string;
  label: string;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({
  value,
  label,
  icon,
  className = '',
}: StatCardProps) {
  return (
    <GlassCard className={`p-6 text-center group ${className}`} glow="rose">
      {icon && (
        <div className="text-rose/60 group-hover:text-rose transition-colors duration-300 mb-3">
          {icon}
        </div>
      )}
      <div className="text-3xl md:text-4xl font-serif text-gold mb-2">
        {value}
      </div>
      <div className="text-sm text-ivory/60 uppercase tracking-wider">
        {label}
      </div>
    </GlassCard>
  );
}
