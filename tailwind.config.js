
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Tajawal", "sans-serif"]
      },
      colors: {
        alora: {
          dark: "#172554",
          primary: "#6366F1",
          accent: "#F59E0B",
          light: "#F8FAFC"
        }
      }
    }
  },
  plugins: []
};
