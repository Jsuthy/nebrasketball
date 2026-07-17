import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Barlow Condensed", "sans-serif"],
        body: ["Barlow", "sans-serif"],
      },
      colors: {
        red: {
          DEFAULT: "#D00000",
          dark: "#9A0000",
        },
        cream: "#F5F1E7",
        black: "#0A0A0A",
        s1: "#111111",
        s2: "#181818",
        s3: "#222222",
      },
    },
  },
  plugins: [],
};

export default config;
