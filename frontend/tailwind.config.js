/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#151A2B',
          800: '#1E253B',
          700: '#2A334E',
          600: '#384466'
        },
        crimson: {
          600: '#B93434',
          700: '#9B2A2A',
          800: '#7E2121'
        },
        cream: {
          50: '#FAF8F5',
          100: '#F7F5F1',
          200: '#EFECE6',
          300: '#E4DFD5'
        },
        gold: {
          500: '#E3A72F',
          600: '#C79024'
        },
        emeraldCustom: {
          600: '#159A70',
          700: '#107B59'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
