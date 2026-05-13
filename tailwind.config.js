/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
    "./store/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F0E9DE",
        card: "#E8DDD0",
        primary: "#7A8C6E",
        secondary: "#A3B18A",
        cta: "#C8A97E",
        ctaHover: "#B8966D",
        textPrimary: "#1A1714",
        textSecondary: "#5C5650",
        borderSoft: "#D4C5B0",
        highlight: "#B7C4A5",
        accentBrown: "#9C7C5B",
        white: "#FFFFFF",
        dark: "#1E1A15",
      },
      boxShadow: {
        soft: "0 20px 50px rgba(26, 23, 20, 0.13)",
        subtle: "0 8px 20px rgba(26, 23, 20, 0.07)",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
