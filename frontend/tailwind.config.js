/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: { 
    extend: {
      colors: {
        base: '#00000',
        secondary: '#1111',
        // Ajoutez d'autres couleurs personnalisées si nécessaire
      },
    },
  },
  plugins: [require("daisyui")],
}