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
        // LOCKED COLOR SYSTEM - NO DEVIATIONS
        // Primary background - ultra-deep charcoal
        bg: '#111010',
        // Primary accent - rich metallic gold
        gold: '#D4AF37',
        // Secondary accent - soft warm blush
        blush: '#EADBC8',
        // Text colors
        light: '#FFFFFF',
        dark: '#2B2B2B',
      },
      fontFamily: {
        // LOCKED TYPOGRAPHY SYSTEM
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
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
      },
    },
  },
  plugins: [],
};

export default config;
