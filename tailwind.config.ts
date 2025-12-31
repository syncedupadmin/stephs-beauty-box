import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // =======================================================================
      // GARDEN EDITORIAL COLOR PALETTE
      // =======================================================================
      colors: {
        // Background - warm ivory
        ivory: '#F7F1E8',

        // Primary text - near-black ink
        ink: '#1A1A1A',

        // Accent - muted botanical green
        sage: '#2F4A3B',

        // Secondary - soft blush
        blush: '#E7D3C7',

        // Utility
        white: '#FFFFFF',

        // Hover/active states
        'sage-light': '#3D5C4A',
        'sage-dark': '#243A2E',
        'blush-light': '#F0DED4',
        'blush-dark': '#D4C0B4',
      },

      // =======================================================================
      // TYPOGRAPHY
      // =======================================================================
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Display sizes for headings
        'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],

        // Body sizes
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
      },

      // =======================================================================
      // SPACING & LAYOUT
      // =======================================================================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      maxWidth: {
        'content': '1200px',
        'narrow': '720px',
      },

      // =======================================================================
      // ANIMATIONS
      // =======================================================================
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
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
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      // =======================================================================
      // BOX SHADOW (Soft, minimal)
      // =======================================================================
      boxShadow: {
        'soft': '0 2px 8px rgba(26, 26, 26, 0.06)',
        'soft-lg': '0 4px 16px rgba(26, 26, 26, 0.08)',
        'soft-xl': '0 8px 32px rgba(26, 26, 26, 0.1)',
      },

      // =======================================================================
      // BORDER RADIUS (Editorial - subtle)
      // =======================================================================
      borderRadius: {
        'subtle': '4px',
        'button': '6px',
      },
    },
  },
  plugins: [],
};

export default config;
