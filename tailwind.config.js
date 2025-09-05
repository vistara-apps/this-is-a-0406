/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 80%, 50%)',
        accent: 'hsl(160, 100%, 40%)',
        background: 'hsl(220, 20%, 98%)',
        surface: 'hsl(220, 20%, 100%)',
        text: 'hsl(220, 30%, 10%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 30%, 10%, 0.1)',
      },
    },
  },
  plugins: [],
}