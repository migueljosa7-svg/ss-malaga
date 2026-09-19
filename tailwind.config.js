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
        background: "#faf7f2",
        foreground: "#1c1917",
        primary: { DEFAULT: "#7f1d1d", foreground: "#fef2f2" }, // granate cofrade
        secondary: { DEFAULT: "#fde68a", foreground: "#78350f" }, // oro
        muted: { DEFAULT: "#f5f5f4", foreground: "#57534e" },
        card: "#ffffff",
        border: "#e7e5e4",
        danger: "#dc2626",
        warning: "#f59e0b",
        info: "#2563eb",
      },
      borderRadius: { lg: "0.75rem", md: "0.5rem" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
