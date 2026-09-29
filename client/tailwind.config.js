/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Forest Emerald Palette
        emerald: {
          950: '#032017',
          900: '#063B2A', // Deep Emerald
          800: '#075E45', // Primary Forest Emerald
          700: '#0B7658', // Vibrant Emerald
          600: '#0E946E',
          500: '#16B386',
          400: '#38D4A5',
          100: '#D5F5EA',
          50: '#EBFBF5',
          dark: '#0B0F0D', // Dark mode root bg
        },
        // Champagne Soft Gold Accents
        champagne: {
          DEFAULT: '#C9A86A', // Core Accent
          light: '#D8BD82',
          pale: '#E5D09A',
          cream: '#F4E7C5',
          dark: '#9A7D43',
        },
        // Warm Ivory & Stone Bases
        ivory: {
          DEFAULT: '#F7F5EF', // Warm Ivory light mode bg
          light: '#FAF9F6',
          card: '#FFFFFF',
          dark: '#111713',    // Dark mode surface
          elevated: '#151C18', // Dark mode card
        },
        stone: {
          warm: '#E7E2D8',     // Warm Stone borders
          muted: '#D5CFC3',
          dark: '#222924',
        },
        charcoal: {
          DEFAULT: '#171A18', // Deep Charcoal primary text
          soft: '#2D322F',
          muted: '#5A625D',
          subtle: '#8C948F',
        },
        // Official Payoneer brand accent
        payoneer: {
          orange: '#FF4800',
          dark: '#171A18',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(23, 26, 24, 0.04)',
        'elevated': '0 12px 32px -8px rgba(6, 59, 42, 0.08), 0 4px 12px -2px rgba(23, 26, 24, 0.03)',
        'emerald': '0 10px 30px -10px rgba(7, 94, 69, 0.35)',
        'champagne': '0 8px 24px -6px rgba(201, 168, 106, 0.25)',
      },
    },
  },
  plugins: [],
}
