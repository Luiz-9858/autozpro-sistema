/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          dark: "#1e40af",
          light: "#3b82f6",
        },
        secondary: {
          DEFAULT: "#fbbf24",
          dark: "#f59e0b",
          light: "#fcd34d",
        },
        accent: {
          red: "#ef4444",
          gray: "#6b7280",
        },
      },
    },
  },
  plugins: [],
};
