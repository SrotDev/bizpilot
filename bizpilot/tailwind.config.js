/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefaff",
          100: "#d7f2ff",
          200: "#afe4ff",
          300: "#7ad0ff",
          400: "#47b6ff",
          500: "#6366f1", // Updated brand-500 color
          600: "#4f46e5",
          700: "#085ab0",
          800: "#0a4b8f",
          900: "#0d3f75",
        },
      },
    },
  },
  plugins: [],
};
