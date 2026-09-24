/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Primary: Deep Teal — the AI interview brand color
        brand: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',  // primary teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Secondary: Electric Blue — CTAs, highlights
        accent: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Surface tokens — deep navy dark mode
        surface: {
          DEFAULT:    'rgb(var(--color-surface-rgb) / <alpha-value>)',
          card:       'rgb(var(--color-surface-card-rgb) / <alpha-value>)',
          cardMuted:  'rgb(var(--color-surface-card-muted-rgb) / <alpha-value>)',
          border:     'rgb(var(--color-surface-border-rgb) / <alpha-value>)',
          borderLight:'rgb(var(--color-surface-border-light-rgb) / <alpha-value>)',
          hover:      'rgb(var(--color-surface-hover-rgb) / <alpha-value>)',
          active:     'rgb(var(--color-surface-active-rgb) / <alpha-value>)',
        },
        // Semantic UI colors
        ui: {
          teal:    '#14b8a6',
          blue:    '#3b82f6',
          emerald: '#10b981',
          amber:   '#f59e0b',
          rose:    '#f43f5e',
          violet:  '#8b5cf6',
          cyan:    '#06b6d4',
        }
      },
      backgroundImage: {
        'gradient-brand':      'linear-gradient(135deg, #0d9488 0%, #14b8a6 40%, #2563eb 100%)',
        'gradient-brand-soft': 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
        'gradient-dark':       'linear-gradient(180deg, #060d1a 0%, #040810 100%)',
        'gradient-card':       'linear-gradient(135deg, rgba(13,148,136,0.07) 0%, rgba(37,99,235,0.04) 100%)',
        'gradient-card-hover': 'linear-gradient(135deg, rgba(13,148,136,0.13) 0%, rgba(37,99,235,0.08) 100%)',
        'gradient-hero':       'radial-gradient(ellipse at 20% 0%, rgba(13,148,136,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(37,99,235,0.12) 0%, transparent 55%)',
      },
      boxShadow: {
        'brand':        '0 0 30px rgba(13,148,136,0.3)',
        'brand-lg':     '0 0 50px rgba(13,148,136,0.2)',
        'card':         '0 8px 32px -4px rgba(0,0,0,0.5), 0 0 1px 1px rgba(255,255,255,0.04)',
        'card-hover':   '0 16px 48px -8px rgba(0,0,0,0.6), 0 0 1px 1px rgba(20,184,166,0.15)',
        'glow':         '0 0 24px rgba(13,148,136,0.5)',
        'glow-blue':    '0 0 24px rgba(59,130,246,0.45)',
        'glow-emerald': '0 0 24px rgba(16,185,129,0.4)',
        'inner-teal':   'inset 0 1px 0 rgba(20,184,166,0.12)',
        'cockpit':      '0 20px 60px -15px rgba(0,0,0,0.8), 0 0 1px 1px rgba(20,184,166,0.1)',
      },
      animation: {
        'fade-in':    'fadeIn 0.35s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 12s linear infinite',
        'float':      'float 6s ease-in-out infinite',
        'orb-glow':   'orbGlow 4s ease-in-out infinite alternate',
        'scan-line':  'scanLine 3s linear infinite',
        'marquee':    'marquee 35s linear infinite',
        'marquee-reverse': 'marqueeReverse 35s linear infinite',
      },
      keyframes: {
        fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:  { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float:    { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        orbGlow:  { '0%': { transform: 'scale(1)', opacity: '0.6' }, '100%': { transform: 'scale(1.15)', opacity: '0.9' } },
        scanLine: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100vh)' } },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
};
