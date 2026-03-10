interface ButtonProps {
  option: "makeQR" | "addItem";
}

const BlueButton = ({ option }: ButtonProps) => {
  const buttonImage: Record<ButtonProps["option"], string> = {
    makeQR: "/icons/home/QR.svg",
    addItem: "/icons/plus-icon.svg",
  };
  const altText: Record<ButtonProps["option"], string> = {
    makeQR: "QR 생성",
    addItem: "물품 추가",
  };

  return (
    <button className="absolute bottom-[5.03%] right-[7.96%] w-[19.4%] max-w-[78px] h-[8.924%] max-h-[78px] cursor-pointer">
      <img
        src={`${buttonImage[option]}`}
        alt={`${altText}`}
        className="w-full max-w-[78px] h-screen max-h-[78px] border-none"
      />
    </button>
  );
};

export default BlueButton;
