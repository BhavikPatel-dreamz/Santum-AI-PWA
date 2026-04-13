import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%":       { transform: "scale(1.07)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.8s ease-out both",
        "logo-pulse": "pulse 2s ease-in-out infinite",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;