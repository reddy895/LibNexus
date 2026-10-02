/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          DEFAULT: '#042F32',
          900: '#042F32',
          800: '#0A3B3E',
          700: '#143F40',
          600: '#1B4F51'
        },
        mint: {
          DEFAULT: '#D6FFCB',
          400: '#E4FFDB',
          500: '#D6FFCB',
          600: '#BAF7AB',
          700: '#9CEE88'
        },
        ivory: {
          DEFAULT: '#F7FAF5',
          50: '#FFFFFF',
          100: '#F7FAF5',
          200: '#EEF4EC',
          300: '#DFE8DC'
        },
        mutedTeal: '#143F40',
        secondaryText: '#B6C8C5'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

