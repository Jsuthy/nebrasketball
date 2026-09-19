import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Libre Franklin", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        body: ["Libre Franklin", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        data: ["Libre Franklin", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        red: {
          DEFAULT: "#c8102e",
          dark: "#9a0c23",
        },
        accent: "#c8102e",
        cream: "#1b1914",
        black: "#f7f4ee",
        s1: "#ffffff",
        s2: "#fffdf8",
        s3: "#f3efe6",
      },
    },
  },
  plugins: [],
};

export default config;
