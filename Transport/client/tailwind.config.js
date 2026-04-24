/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        accent: '#F59E0B',
        background: '#F9FAFB',
        sidebar: '#1E293B',
      }
    },
  },
  plugins: [],
}
