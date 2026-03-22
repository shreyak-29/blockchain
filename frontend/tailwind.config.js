/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          900: "#082f49",
        },
        secondary: {
          600: "#a855f7",
          700: "#9333ea",
          900: "#4c0519",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #1e3a8a 0%, #7e22ce 100%)",
        "gradient-primary-dark":
          "linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)",
      },
    },
  },
  plugins: [],
};
