/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
        editorial: ['Cormorant Garamond', 'serif'],
        script: ['Great Vibes', 'cursive'],
      },
      colors: {
        beige: {
          main: '#F3E6D0',
          cream: '#FAF4E8',
          surface: '#FFFDF8',
          border: '#D8C5A8',
        },
        gold: {
          primary: '#C99A2E',
          dark: '#A87918',
          light: '#E1C46A',
        },
        brown: {
          deep: '#3B2A1A',
          warm: '#6B5842',
        }
      }
    },
  },
  plugins: [],
}
