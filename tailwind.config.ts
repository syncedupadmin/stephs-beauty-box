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
      // LOCKED COLOR TOKENS - ROMANTIC HIGH-FASHION EDITORIAL
      // =======================================================================
      colors: {
        // Warm Paper - Primary background
        paper: '#F6F0E6',

        // Soft Charcoal - Deep contrast
        charcoal: '#161514',

        // Botanical Green - Primary accent
        botanical: '#2F4A3B',

        // Clay Accent - Secondary warmth
        clay: '#B88977',

        // Ink - Text color
        ink: '#2B2A28',

        // NO pure black or white - use these instead
        'off-white': '#FDFBF7',
        'near-black': '#0D0C0B',
      },

      // =======================================================================
      // TYPOGRAPHY - EDITORIAL HIERARCHY
      // =======================================================================
      fontFamily: {
        display: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Display - high contrast serif
        'display-hero': ['5.5rem', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display-lg': ['4rem', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display-md': ['2.75rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-sm': ['2rem', { lineHeight: '1', letterSpacing: '-0.01em' }],

        // Overlines - small caps
        'overline': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.2em' }],

        // Body - readable
        'body-lg': ['1.125rem', { lineHeight: '1.8' }],
        'body-md': ['1rem', { lineHeight: '1.8' }],
        'body-sm': ['0.875rem', { lineHeight: '1.7' }],
      },

      // =======================================================================
      // SPACING - VAST NEGATIVE SPACE
      // =======================================================================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '28': '7rem',
        '32': '8rem',
        '36': '9rem',
        '40': '10rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem',
      },

      maxWidth: {
        'editorial': '1400px',
        'content': '1200px',
        'narrow': '680px',
        'prose': '600px',
      },

      // =======================================================================
      // BORDER RADIUS - EDITORIAL ONLY
      // Sharp (0) or Pill (9999px) - nothing in between
      // =======================================================================
      borderRadius: {
        'none': '0px',
        'full': '9999px',
      },

      // =======================================================================
      // TRANSITIONS - LUXURY PACE
      // =======================================================================
      transitionDuration: {
        '600': '600ms',
        '800': '800ms',
      },

      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // =======================================================================
      // ANIMATIONS - GENTLE, RESTRAINED
      // =======================================================================
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },

      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
