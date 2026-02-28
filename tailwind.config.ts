import scrollbarHide from "tailwind-scrollbar-hide";
import { BREAKPOINTS } from "./src/constants/breakpoints";
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: `${BREAKPOINTS.DESIGN_MOBILE}px`,
        md: `${BREAKPOINTS.TABLET}px`,
        lg: `${BREAKPOINTS.DESKTOP}px`,
      },
      colors: {
        "brand-blue": "#84ADFF",
        "neutral-white": "#FFFFFF",
        "neutral-dark": "#444444",
        "neutral-gray": "#CDD6DE",
        primary: "#76ADFF",
        "secondary-dark": "#2D4E7F",
        "secondary-light": "#7998C5",
        "secondary-pale": "#B5F4FF",
        "grad-blue": "#7FB5F7",
        "bg-pale": "#D6F4FF",
      },
      backgroundImage: {
        "logo-gradient":
          "linear-gradient(to bottom right, `#7FB5F7`, `#CDD6DE`)",
      },
    },
  },
  plugins: [scrollbarHide],
};

export default config;
