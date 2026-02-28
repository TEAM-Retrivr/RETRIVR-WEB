import scrollbarHide from "tailwind-scrollbar-hide";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [scrollbarHide],
};

// 화면 비율 조절
const { BREAKPOINTS } = require("./src/constants/breakpoints");

module.exports = {
  theme: {
    extend: {
      screens: {
        // 디자인 기준이 402px이므로, 그보다 조금 큰 모바일 대응용
        xs: `${BREAKPOINTS.DESIGN_MOBILE}px`,
        md: `${BREAKPOINTS.TABLET}px`,
        lg: `${BREAKPOINTS.DESKTOP}px`,
      },
      // 디자인에 사용된 브랜드 컬러가 있다면 상수로 등록
      colors: {
        "brand-blue": "#84ADFF", // 시안의 버튼 색상 예시
      },
    },
  },
};

// 타이포그래피 등록
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neutral Colors
        "neutral-white": "#FFFFFF",
        "neutral-dark": "#444444",
        "neutral-gray": "#CDD6DE",

        // Primary Color
        primary: "#76ADFF",

        // Secondary Colors
        "secondary-dark": "#2D4E7F",
        "secondary-light": "#7998C5",
        "secondary-pale": "#B5F4FF", // drop shadow 등으로 활용

        // Gradient & Background Colors
        "grad-blue": "#7FB5F7",
        "bg-pale": "#D6F4FF", // 연한 바탕색용
      },
      // 로고 그라데이션 등을 위해 그라데이션 설정 추가
      backgroundImage: {
        "logo-gradient": "linear-gradient(to bottom right, #7FB5F7, #CDD6DE)",
      },
    },
  },
  plugins: [],
};
