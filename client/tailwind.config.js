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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36abf7',
          500: '#0284c7', // vibrant fintech cyan/sky
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
          950: '#041826',
        },
        payoneer: {
          orange: '#FF4800',
          dark: '#0F172A',
          muted: '#64748B',
        },
        surface: {
          light: '#F8FAFC',
          dark: '#0B0F19',
          cardLight: '#FFFFFF',
          cardDark: '#111827',
          cardDarkElevated: '#1E293B',
          borderLight: '#E2E8F0',
          borderDark: '#1E293B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 25px -5px rgba(2, 132, 199, 0.25)',
        'glow-payoneer': '0 0 25px -5px rgba(255, 72, 0, 0.3)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
