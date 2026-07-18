import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Barlow Condensed", "sans-serif"],
        body: ["Barlow", "sans-serif"],
        data: ["Inter", "sans-serif"],
      },
      colors: {
        red: {
          DEFAULT: "#D00000",
          dark: "#9A0000",
        },
        accent: "#E57373",
        cream: "#F5F1E7",
        black: "#121212",
        s1: "#1E1E1E",
        s2: "#232323",
        s3: "#282828",
      },
    },
  },
  plugins: [],
};

export default config;
