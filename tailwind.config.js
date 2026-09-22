/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF7F2", // Crema cera
        foreground: "#1A1A1A", // Negro Calvario
        primary: { DEFAULT: "#4A154B", foreground: "#FAF7F2" }, // Púrpura Nazareno
        secondary: { DEFAULT: "#D4AF37", foreground: "#1A1A1A" }, // Dorado Orfebre
        esperanza: { DEFAULT: "#1B4D3E", foreground: "#FAF7F2" }, // Verde Esperanza / Romero
        calvario: "#1A1A1A",
        muted: { DEFAULT: "#F1EBE0", foreground: "#5C5346" },
        card: "#FFFFFF",
        border: "#E4DCCB",
        danger: "#B3261E",
        warning: "#C77D0A",
        info: "#2E5E8C",
      },
      borderRadius: { lg: "0.75rem", md: "0.5rem" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
