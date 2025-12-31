'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode, useState, MouseEvent } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'rose';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  external?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  external = false,
}: ButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.();
  };

  const variants = {
    primary: `
      bg-gradient-to-r from-gold to-gold-soft text-bg font-medium
      hover:from-gold-soft hover:to-gold
      shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30
      active:shadow-gold/10
    `,
    secondary: `
      bg-transparent text-gold font-medium
      border-2 border-gold/50 hover:border-gold
      hover:bg-gold/10
    `,
    ghost: `
      bg-transparent text-ivory/80 font-medium
      hover:text-gold hover:bg-ivory/5
    `,
    rose: `
      bg-gradient-to-r from-rose to-rose-soft text-ivory font-medium
      hover:from-rose-soft hover:to-rose
      shadow-lg shadow-rose/20 hover:shadow-xl hover:shadow-rose/30
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg gap-2',
    md: 'px-6 py-3 text-base rounded-xl gap-2',
    lg: 'px-8 py-4 text-lg rounded-xl gap-3',
  };

  const baseClasses = `
    relative overflow-hidden
    inline-flex items-center justify-center
    transition-all duration-300 ease-out
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  const content = (
    <>
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <motion.span
          className="absolute inset-0 flex items-center justify-center bg-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </motion.span>
      )}

      {/* Button content */}
      <span className={`flex items-center ${sizes[size].split(' ').find(c => c.startsWith('gap'))} ${loading ? 'opacity-0' : ''}`}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <motion.span
            className="flex-shrink-0"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
      </span>
    </>
  );

  if (href) {
    const linkProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

    return (
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        <Link
          href={href}
          className={baseClasses}
          onClick={handleClick}
          {...linkProps}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {content}
    </motion.button>
  );
}

// Icon button for smaller actions
export function IconButton({
  icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
}: {
  icon: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label: string;
  className?: string;
}) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const variants = {
    primary: 'bg-gold text-bg hover:bg-gold-soft',
    secondary: 'border border-gold/50 text-gold hover:bg-gold/10',
    ghost: 'text-ivory/60 hover:text-gold hover:bg-ivory/5',
  };

  return (
    <motion.button
      className={`
        ${sizes[size]}
        ${variants[variant]}
        rounded-full flex items-center justify-center
        transition-colors duration-200
        ${className}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
}
