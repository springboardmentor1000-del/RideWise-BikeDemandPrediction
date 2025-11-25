/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f534f",
        accent1: "#f97316", // orange-500
        accent2: "#ea580c", // orange-600
        dark: "#0a3a38",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins:  [require("@tailwindcss/typography")],
}
