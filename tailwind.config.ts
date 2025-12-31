import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary backgrounds - deep dark glam
        bg: {
          DEFAULT: '#0A0A0A',
          soft: '#141414',
          card: '#1A1A1A',
        },
        // Gold accent (primary)
        gold: {
          DEFAULT: '#D4AF37',
          soft: '#E5C158',
          dark: '#B8972E',
          muted: 'rgba(212, 175, 55, 0.1)',
        },
        // Rose gold (secondary accent)
        rose: {
          DEFAULT: '#B76E79',
          soft: '#C9858F',
          dark: '#9B5A64',
          muted: 'rgba(183, 110, 121, 0.1)',
        },
        // Ivory text
        ivory: {
          DEFAULT: '#F5F1E8',
          soft: '#E8E4DB',
          muted: '#A9A6A0',
        },
        // Faith accent (soft lavender)
        accent: {
          DEFAULT: '#9B7EBD',
          soft: '#B199CC',
          muted: 'rgba(155, 126, 189, 0.1)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glam': 'linear-gradient(135deg, #0A0A0A 0%, #141414 50%, #1A1A1A 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #E5C158 100%)',
        'gradient-rose': 'linear-gradient(135deg, #B76E79 0%, #C9858F 100%)',
        'gradient-card': 'linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%)',
        'gradient-hero': 'linear-gradient(to bottom, rgba(10,10,10,0.3), rgba(10,10,10,0.8))',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.15)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.2)',
        'gold-glow': '0 0 60px rgba(212, 175, 55, 0.25)',
        'rose': '0 0 20px rgba(183, 110, 121, 0.15)',
        'rose-lg': '0 0 40px rgba(183, 110, 121, 0.2)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
