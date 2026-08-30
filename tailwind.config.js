/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gym: {
          neon: '#ccff00',
          dark: '#050505',
          card: '#0a0a0a',
          border: '#1a1a1a',
        }
      }
    },
  },
  plugins: [],
}