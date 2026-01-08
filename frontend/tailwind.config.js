/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cores da B77 Auto Parts
        primary: {
          DEFAULT: "#DC2626", // Vermelho do logo
          dark: "#B91C1C", // Vermelho escuro
          light: "#EF4444", // Vermelho claro
        },
        secondary: {
          DEFAULT: "#1E293B", // Azul escuro do logo
          dark: "#0F172A", // Azul muito escuro
          light: "#334155", // Azul médio
        },
        accent: {
          DEFAULT: "#F8FAFC", // Branco/cinza claro
          gray: "#E2E8F0", // Cinza
        },
      },
    },
  },
  plugins: [],
};
