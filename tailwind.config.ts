import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#02171c",
        moss: "#176d62",
        aqua: "#35b9ad",
        mint: "#a9f0dd",
        bone: "#eff7f0",
        line: "rgba(239, 247, 240, 0.14)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 80px rgba(53, 185, 173, 0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
