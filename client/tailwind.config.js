/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3d8bff',
          50: '#e6f2ff',
          100: '#cce5ff',
          200: '#99cbff',
          300: '#66b1ff',
          400: '#3d8bff',
          500: '#0a6bff',
          600: '#0056cc',
          700: '#004099',
          800: '#002b66',
          900: '#001533',
        },
        secondary: {
          DEFAULT: '#ffff00',
          50: '#ffffcc',
          100: '#ffff99',
          200: '#ffff66',
          300: '#ffff33',
          400: '#ffff00',
          500: '#cccc00',
          600: '#999900',
          700: '#666600',
          800: '#333300',
          900: '#1a1a00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
