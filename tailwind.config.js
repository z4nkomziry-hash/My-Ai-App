/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        card: '#111827',
        purple: { 400: '#8B5CF6', 500: '#7C3AED', 600: '#6D28D9' },
        cyan: { 400: '#06B6D4', 500: '#0891B2' },
        green: { 400: '#10B981' }
      }
    }
  },
  plugins: []
};
