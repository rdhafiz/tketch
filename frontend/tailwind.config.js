/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        spinner: {
          'from': { transform: 'rotate(0turn)' },
          'to': { transform: 'rotate(1turn)' },
        }
      },
      animation: {
        spinner: 'spinner 1s ease infinite',
      }
    },
  },
  plugins: [],
}

