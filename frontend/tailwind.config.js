/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Azul principal
          dark: "#1e40af",
        },
        secondary: {
          DEFAULT: "#fbbf24", // Amarelo (como no botão "LEARN MORE")
          dark: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
