/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#56C1C7',
        secondary: '#1E2A47',
        accent: '#FF914D',
      },
    },
  },
  plugins: [],
};