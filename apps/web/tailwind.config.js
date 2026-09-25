/** @type {import('tailwindcss').Config} */
import { colors, fontFamily } from './src/theme/tokens.js';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily,
    },
  },
  plugins: [],
};
