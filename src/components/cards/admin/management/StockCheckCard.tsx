import { ProgressCircle } from "../../../ProgressCircle";

interface CardProps {
  itemName: string;
  availableQuantity: number;
  totalQuantity: number;
  isRentalAvailable: boolean;
}

const StockCheckCard = ({
  itemName,
  availableQuantity,
  totalQuantity,
  isRentalAvailable,
}: CardProps) => {
  const baseBoxStyle =
    "flex justify-between items-center w-84.5 h-22.5 font-[Pretendard] rounded-[16px] shadow-item-card cursor-pointer box-border pl-7 pr-7.5 py-4";
  const availableBoxStyle = "bg-neutral-white ";
  const unavailableBoxStyle = "bg-[#F8F9F9]";

  const baseTextStyle = "text-20px font-[600] leading-[140%]";
  const availableTextStyle = "text-neutral-gray-1 ";
  const unavailableTextStyle = "text-neutral-gray-3";
  return (
    <div
      className={`${baseBoxStyle} ${
        isRentalAvailable ? availableBoxStyle : unavailableBoxStyle
      }`}
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
      ></ProgressCircle>
    </div>
  );
};

export default StockCheckCard;
