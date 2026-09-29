/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marine: {
          50: '#F4F7F9',
          100: '#E6ECF2',
          200: '#D2DCE6',
          300: '#B2C4D4',
          400: '#7E9BB8',
          500: '#4F769F',
          600: '#385C83',
          700: '#2C496A',
          800: '#1C324B',
          900: '#0F1E31',
          950: '#08101C',
        },
        sonar: {
          dark: '#0a101d',
          darker: '#060a12',
          card: '#0f172a',
          border: '#1e293b',
          amber: '#f59e0b',
          amberDark: '#b45309',
          copper: '#c2410c',
          cyan: '#0284c7',
          teal: '#0d9488',
          green: '#16a34a',
          red: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'Consolas', 'Menlo', 'monospace'],
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        DEFAULT: '4px',
        'md': '6px',
        'lg': '8px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'panel': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        'elevated': '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)',
      }
    },
  },
  plugins: [],
}
