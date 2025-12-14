import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1220",
        surface: "rgba(255,255,255,0.08)",
        primary: "#4F46E5",
        secondary: "#9333EA",
        success: "#22C55E",
        error: "#EF4444"
      },
      boxShadow: {
        glass: "0 20px 60px rgba(0,0,0,0.4)",
        glow: "0 0 20px rgba(79,70,229,0.45)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "Inter", "sans-serif"],
        mono: ["DM Mono", "SFMono-Regular", "Menlo", "monospace"]
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle at 20% 20%, rgba(147,51,234,0.16), transparent 35%), radial-gradient(circle at 80% 0%, rgba(79,70,229,0.18), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
