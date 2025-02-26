/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, 
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#02533C',
          light: '#D3FE94'
        },
        secondary: {
          coral: '#FF7F50',
          brown: '#A67C52'
        },
        accent: '#FFCC29',
        neutral: {
          light: '#F5F5F5',
          dark: '#4F4F4F',
          gray: '#CACCCF'
        }
      }
    }
  },
  plugins: []
}