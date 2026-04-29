import { ProgressCircle } from "../../../ProgressCircle";

interface CardProps {
  itemName: string;
  availableQuantity: number;
  totalQuantity: number;
  isRentalAvailable: boolean;
  onClick?: () => void;
}

const StockCheckCard = ({
  itemName,
  availableQuantity,
  totalQuantity,
  isRentalAvailable,
  onClick,
}: CardProps) => {
  const baseBoxStyle =
    "flex justify-between items-center w-full h-22.5 font-[Pretendard] rounded-[16px] shadow-item-card cursor-pointer box-border px-7 py-4";
  const availableBoxStyle = "bg-neutral-white ";
  const unavailableBoxStyle = "bg-[#F8F9F9]";

  const baseTextStyle = "min-w-0 truncate text-20px font-[600] leading-[140%]";
  const availableTextStyle = "text-neutral-gray-1 ";
  const unavailableTextStyle = "text-neutral-gray-3";
  return (
    <div
      className={`${baseBoxStyle} ${
        isRentalAvailable ? availableBoxStyle : unavailableBoxStyle
      }`}
      onClick={onClick}
    >
      <p
        className={`${baseTextStyle} ${
          isRentalAvailable ? availableTextStyle : unavailableTextStyle
        }`}
      >
        {itemName}
      </p>
      <ProgressCircle
        available={availableQuantity}
        total={totalQuantity}
        isActive={isRentalAvailable}
      ></ProgressCircle>
    </div>
  );
};

export default StockCheckCard;
