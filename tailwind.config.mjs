/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'kaldon-bg': '#0a0e17',
        'kaldon-surface': '#111827',
        'kaldon-surface-2': '#1a2236',
        'kaldon-surface-3': '#232d42',
        'kaldon-border': 'rgba(255,255,255,0.08)',
        'kaldon-border-hover': 'rgba(255,255,255,0.15)',
        'kaldon-text': '#e2e8f0',
        'kaldon-muted': '#94a3b8',
        'kaldon-dim': '#64748b',
        'kaldon-cyan': '#22d3ee',
        'kaldon-cyan-glow': 'rgba(34,211,238,0.15)',
        'kaldon-cyan-light': '#67e8f9',
        'kaldon-blue': '#3b82f6',
        'kaldon-green': '#34d399',
        'kaldon-red': '#f87171',
        'kaldon-orange': '#fb923c',
        'kaldon-yellow': '#fbbf24',
        'kaldon-purple': '#a78bfa',
        'kaldon-pink': '#f472b6',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      fontSize: {
        'h1': ['42px', { lineHeight: '1.15', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '1.25', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '1.35', fontWeight: '700' }],
        'h4': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        'eyebrow': ['11px', { lineHeight: '1', letterSpacing: '0.25em', fontWeight: '500' }],
        'badge': ['10px', { lineHeight: '1', letterSpacing: '0.1em', fontWeight: '500' }],
      },
      borderRadius: {
        'card': '16px',
        'btn': '8px',
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(34,211,238,0.15)',
        'cyan-glow-strong': '0 0 30px rgba(34,211,238,0.3)',
        'card-hover': '0 0 40px rgba(34,211,238,0.05)',
        'screenshot': '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34,211,238,0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34,211,238,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(34,211,238,0.35)' },
        },
      },
    },
  },
  plugins: [],
};
