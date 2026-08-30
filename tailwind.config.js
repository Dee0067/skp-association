/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        skp: {
          navy: '#1B1F4A',
          'navy-deep': '#0B0F28',
          'navy-dark': '#060919',
          'navy-card': '#111738',
          'navy-border': '#232B5E',
          'navy-light': '#2A3370',
          red: '#B01A38',
          'red-dark': '#8B112A',
          'red-hover': '#C72445',
          'red-subtle': '#3A0B16',
          cyan: '#38BDF8',
          'cyan-glow': '#0284C7',
          'cyan-subtle': '#0C2A4A',
          gold: '#F59E0B',
          slate: '#334155',
          muted: '#64748B',
          surface: '#F8FAFC',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Prompt', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'blueprint-grid': 'linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)',
        'blueprint-grid-dense': 'linear-gradient(to right, rgba(56, 189, 248, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.12) 1px, transparent 1px)',
        'dots-pattern': 'radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))' },
          '100%': { opacity: '0.9', filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.8))' },
        },
      },
    },
  },
  plugins: [],
};
