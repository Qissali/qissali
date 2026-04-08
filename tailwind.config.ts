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
        qissali: {
          rose: "#E8A0C0",
          "rose-light": "#F5D0E4",
          mauve: "#C49AD8",
          "mauve-mid": "#9B6FB8",
          cream: "#FEF6FF",
          section: "#FDF0F7",
          title: "#4A2E5A",
          body: "#7A5A8A",
          soft: "#B8A0C8",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
