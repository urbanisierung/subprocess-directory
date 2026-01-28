/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "orangemunda": "#FC5D0D",
        "spacecraft": "#F7F7F7",
        "look-up": "#1F2A44",
        "concrete-grey": "#E6E7E8",
        "misty-grey": "#666666",
        "greenmunda": "#26D07C",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "Inter", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
