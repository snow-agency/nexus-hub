/** @type {import('tailwindcss').Config} */
import { colors, fontFamily } from '../../src/theme/tokens.js';

export default {
  content: ['./index.html', './main.jsx', '../../src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors,
      fontFamily,
    },
  },
  plugins: [],
};
