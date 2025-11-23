import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Colors are defined in globals.css via CSS variables and @theme inline
      // Accessible via: bg-button-green, text-text-dark, etc.
      borderRadius: {
        'design': '10px', // Main card/button radius - matches rounded-[10px]
        'card': '10px',   // Alias for consistency
      },
      spacing: {
        // Design system spacing scale: 16 → 24 → 32 → 48
        'design-16': '16px',
        'design-24': '24px',
        'design-32': '32px',
        'design-48': '48px',
      },
      fontFamily: {
        'fraunces': ['Fraunces', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'cta': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'cta-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
export default config

