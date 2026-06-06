import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#355d7d",
        brand: {
          gray: "#757575",
          "gray-light": "#F5F5F5",
          red: "#E53935",
          "red-dark": "#C62828",
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "system-ui", "sans-serif"],
        persian: ["var(--font-vazirmatn)", "Vazirmatn", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.08)",
        header: "0 2px 8px rgba(0, 0, 0, 0.06)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        pulseStrong: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.05)", color: "#d97706" },
        },
      },
      animation: {
        blink: "blink 1.5s ease-in-out infinite",
        "pulse-strong": "pulseStrong 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
