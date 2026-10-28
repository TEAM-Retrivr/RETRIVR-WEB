export const fontFamily = {
  primary: "'Pretendard', sans-serif",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const typography = {
  heading1: {
    fontSize: "24px",
    fontWeight: fontWeight.bold,
    lineHeight: "32px",
  },
  heading2: {
    fontSize: "20px",
    fontWeight: fontWeight.bold,
    lineHeight: "28px",
  },
  heading3: {
    fontSize: "18px",
    fontWeight: fontWeight.bold,
    lineHeight: "26px",
  },

  body1: {
    fontSize: "16px",
    fontWeight: fontWeight.regular,
    lineHeight: "24px",
  },
  body2: {
    fontSize: "14px",
    fontWeight: fontWeight.regular,
    lineHeight: "20px",
  },
  body3: {
    fontSize: "13px",
    fontWeight: fontWeight.regular,
    lineHeight: "18px",
  },

  label1: {
    fontSize: "16px",
    fontWeight: fontWeight.semibold,
    lineHeight: "24px",
  },
  label2: {
    fontSize: "14px",
    fontWeight: fontWeight.medium,
    lineHeight: "20px",
  },
  label3: {
    fontSize: "13px",
    fontWeight: fontWeight.medium,
    lineHeight: "18px",
  },

  button: {
    large: {
      fontSize: "18px",
      fontWeight: fontWeight.medium,
      lineHeight: "24px",
    },
    medium: {
      fontSize: "16px",
      fontWeight: fontWeight.medium,
      lineHeight: "20px",
    },
    small: {
      fontSize: "14px",
      fontWeight: fontWeight.medium,
      lineHeight: "16px",
    },
  },
} as const;
