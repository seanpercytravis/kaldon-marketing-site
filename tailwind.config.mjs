/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // V3 spec — Dark Intelligence palette
        void: '#0A0A0F',
        'deep-space': '#12121A',
        graphite: '#1E1E2A',
        'surface-3': '#272733',
        signal: '#00D4FF',
        'signal-glow': 'rgba(0,212,255,0.15)',
        gold: '#FFB800',
        'gold-hover': '#FFC633',
        ghost: '#8B8BA3',
        chalk: '#F5F5F7',
        'text-secondary': '#C8CAD3',
        'text-quaternary': 'rgba(139,139,163,0.55)',
        hairline: 'rgba(255,255,255,0.06)',
        'hairline-active': 'rgba(255,255,255,0.14)',
        lattice: 'rgba(255,255,255,0.04)',

        // Legacy kaldon-* aliases — mapped to V3 equivalents so existing pages still build
        // These will be removed once all pages are rebuilt.
        'kaldon-bg': '#0A0A0F',
        'kaldon-surface': '#12121A',
        'kaldon-surface-2': '#1E1E2A',
        'kaldon-surface-3': '#272733',
        'kaldon-border': 'rgba(255,255,255,0.06)',
        'kaldon-border-hover': 'rgba(255,255,255,0.14)',
        'kaldon-text': '#F5F5F7',
        'kaldon-muted': '#8B8BA3',
        'kaldon-dim': 'rgba(139,139,163,0.55)',
        'kaldon-cyan': '#00D4FF',
        'kaldon-cyan-glow': 'rgba(0,212,255,0.15)',
        'kaldon-cyan-light': '#66E5FF',
        'kaldon-gold': '#FFB800',
        'kaldon-chalk': '#F5F5F7',
        'kaldon-ghost': '#8B8BA3',
        // Decorative legacy colors (transitional — will be removed in Phase 3)
        'kaldon-blue': '#8B8BA3',
        'kaldon-green': '#8B8BA3',
        'kaldon-red': '#8B8BA3',
        'kaldon-orange': '#8B8BA3',
        'kaldon-yellow': '#FFB800',
        'kaldon-purple': '#8B8BA3',
        'kaldon-pink': '#8B8BA3',
      },
      fontFamily: {
        display: ['Satoshi', 'Inter Variable', 'SF Pro Display', 'system-ui', 'sans-serif'],
        sans: ['Inter Variable', 'Inter', 'SF Pro Text', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'JetBrains Mono', 'ui-monospace', 'SF Mono', 'monospace'],
      },
      fontSize: {
        // Display — Linear-school, not Stripe-school
        'display': ['clamp(48px, 6vw, 64px)', { lineHeight: '1.05', letterSpacing: '-0.022em', fontWeight: '500' }],
        'h1': ['clamp(40px, 5vw, 56px)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h2': ['clamp(28px, 3.5vw, 40px)', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.5', letterSpacing: '-0.005em' }],
        'body': ['16px', { lineHeight: '1.55', letterSpacing: '-0.005em' }],
        'body-sm': ['15px', { lineHeight: '1.5', letterSpacing: '-0.005em' }],
        'small': ['14px', { lineHeight: '1.5' }],
        'kicker': ['12px', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '500' }],
      },
      letterSpacing: {
        display: '-0.022em',
        h1: '-0.02em',
        h2: '-0.015em',
        body: '-0.005em',
        kicker: '0.08em',
      },
      borderRadius: {
        btn: '6px',
        card: '12px',
        xl: '16px',
      },
      boxShadow: {
        // Hairline "inset glow" instead of drop shadows (Attio pattern)
        'hairline-inset': 'inset 0 0 0 1px rgba(255,255,255,0.02)',
        'card-hover': 'inset 0 0 0 1px rgba(255,255,255,0.04)',
      },
      backgroundImage: {
        'dot-lattice': 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'gradient-border': 'linear-gradient(to bottom right, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
        'hero-fade-bottom': 'linear-gradient(to bottom, transparent 60%, #0A0A0F 95%)',
      },
      backgroundSize: {
        'lattice-24': '24px 24px',
      },
      transitionTimingFunction: {
        'out-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      },
      transitionDuration: {
        quick: '100ms',
        micro: '160ms',
        regular: '250ms',
      },
      spacing: {
        'section': 'clamp(80px, 10vw, 128px)',
        'section-lg': 'clamp(120px, 14vw, 180px)',
      },
      maxWidth: {
        'container': '1200px',
        'hero-copy': '620px',
        'subhead': '420px',
        'prose': '640px',
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.75s cubic-bezier(0.66, 0, 0, 1) infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 212, 255, 0.6)' },
          '50%': { boxShadow: '0 0 0 12px rgba(0, 212, 255, 0)' },
        },
      },
    },
  },
  plugins: [],
};
