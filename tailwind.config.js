/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // v8.0: tokens semánticos → variables CSS con soporte de alfa.
        // Se definen en app/globals.css bajo :root (Día) y .dark (Noche).
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        esperanza: {
          DEFAULT: "rgb(var(--esperanza) / <alpha-value>)",
          foreground: "rgb(var(--esperanza-foreground) / <alpha-value>)",
        },
        calvario: "rgb(var(--calvario) / <alpha-value>)",
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        card: "rgb(var(--card) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        danger: "#B3261E",
        warning: "#C77D0A",
        info: "#2E5E8C",
      },
      borderRadius: { lg: "0.75rem", md: "0.5rem" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
