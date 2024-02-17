import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundColor: {
        secondary: "#191919",
      },
      boxShadow: {
        appShadow: "0px 8px 16px #000c,0px 0px 1px inset #ffffff3b",
      },
      animation: {
        "dialog-in": "slide-in .4s cubic-bezier(.05, .7, .1, 1)",
        "dialog-out": "slide-out .2s cubic-bezier(.3, 0, .8, .15)",
        "backdrop-in": "fade-in .25s cubic-bezier(.05, .7, .1, 1)",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateY(64px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(64px)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
