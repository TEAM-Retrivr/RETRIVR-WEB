import type React from "react";

interface ButtonProps {
  option: "makeQR" | "addItem";
  // 각 페이지에서 동작을 주입할 수 있는 클릭 핸들러
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const BlueButton = ({ option, onClick }: ButtonProps) => {
  const buttonImage: Record<ButtonProps["option"], string> = {
    makeQR: "/icons/home/QR.svg",
    addItem: "/icons/plus-icon.svg",
  };
  const altText: Record<ButtonProps["option"], string> = {
    makeQR: "QR 생성",
    addItem: "물품 추가",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="sticky bottom-11 self-end mr-8 w-19.5 h-19.5 cursor-pointer z-50"
    >
      <img
        src={buttonImage[option]}
        alt={altText[option]}
        className="w-full h-full max-w-[78px] max-h-[78px] border-none"
      />
    </button>
  );
};

export default BlueButton;
