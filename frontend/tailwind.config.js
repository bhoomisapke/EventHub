/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0B1020',
        electric: '#2563EB',
        violet: '#7C3AED',
        cyan: '#06B6D4',
        offwhite: '#F8FAFC',
        slate: '#94A3B8',
      },
    },
  },
  plugins: [],
}