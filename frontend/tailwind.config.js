/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "rgb(var(--brand))",
          dark: "rgb(var(--brand-dark))",
          soft: "rgb(var(--brand-soft))",
        },
        ink: "rgb(var(--ink))",
        sand: "rgb(var(--sand))",
      },
      fontFamily: {
        sans: ["\"Space Grotesk\"", "sans-serif"],
        display: ["\"Fraunces\"", "serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(23, 23, 23, 0.08)",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        floatIn: "floatIn 0.6s ease-out",
        fadeIn: "fadeIn 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
