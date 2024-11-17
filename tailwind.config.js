/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        input: {
          border: 'var(--input-border)',
          'border-hover': 'var(--input-border-hover)',
          'border-focus': 'var(--input-border-focus)',
          bg: 'var(--input-bg)',
          text: 'var(--input-text)',
          placeholder: 'var(--input-placeholder)',
        },
      },
    },
  },
  plugins: [],
};