/** @type {import('tailwindcss').Config} */
import { colors, fontFamily } from './src/theme/tokens.js';

export default {
  content: ['./index.html', './src/**/*.js'],
  theme: {
    extend: {
      colors,
      fontFamily,
    },
  },
  plugins: [],
};
