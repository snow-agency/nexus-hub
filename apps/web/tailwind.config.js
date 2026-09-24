/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005C46',
          hover: '#004736',
        },
        accent: {
          DEFAULT: '#FFB800',
          hover: '#E0A200',
        },
        'bg-light': '#F7F5F0',
        dark: '#18181B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
