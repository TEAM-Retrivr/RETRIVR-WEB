interface CardProps {
  status: "rentalAvailable" | "rentedOut" | "rentalUnavailable";
}

const ItemStatusCard = ({ status }: CardProps) => {
  // 기본 컴포넌트 스타일
  const baseBoxStyle =
    "flex justify-between items-center w-80 h-17 font-[Pretendard] rounded-[20px] shadow-item-card cursor-pointer box-border px-5 py-4";

  // 상태에 따른 컴포넌트 스타일
  const boxStyleByStatus: Record<CardProps["status"], string> = {
    rentalAvailable: "bg-neutral-white",
    rentedOut: "bg-neutral-gray-4 opacity-[40%]",
    rentalUnavailable: "bg-neutral-white",
  };

  // 기본 물품 텍스트 스타일
  const baseItemTextStyle = "text-18px font-bold";

  // 상태에 따른 물품 텍스트 스타일
  const itemTextStyleByStatus: Record<CardProps["status"], string> = {
    rentalAvailable: "text-neutral-gray-2",
    rentedOut: "text-neutral-white",
    rentalUnavailable: "text-neutral-gray-2",
  };

  // 기본 물품 상태 전환 버튼 스타일
  const baseItemStatusButtonStyle =
    "w-23 h-10 px-2.5 py-3 items-center rounded-[15px]";
  // 상태에 따른 물품 상태 전환 버튼 스타일
  const itemStatusButtonStyle: Record<CardProps["status"], string> = {
    rentalAvailable: "bg-primary",
    rentedOut: "bg-neutral-white",
    rentalUnavailable: "bg-neutral-gray-4",
  };

  // 기본 물품 상태 스타일
  const baseItemStatus = "text-14px font-[Pretendard] font-bold leading-none";
  // 상태에 따른 물품 상태 스타일
  const itemStatusText: Record<CardProps["status"], string> = {
    rentalAvailable: "text-neutral-white",
    rentedOut: "text-neutral-gray-4",
    rentalUnavailable: "text-neutral-white",
  };
  // 상태에 따른 물품 상태 스타일
  const itemStatus: Record<CardProps["status"], string> = {
    rentalAvailable: "대여 가능",
    rentedOut: "대여 중",
    rentalUnavailable: "대여 불가",
  };

  return (
    <div className={`${baseBoxStyle} ${boxStyleByStatus[status]}`}>
      <div>
        <p className={`${baseItemTextStyle} ${itemTextStyleByStatus[status]}`}>
          c타입 충전기 (1)
        </p>
        <p className="text-10px font-normal">345ss2</p>
      </div>
      <button
        className={`${baseItemStatusButtonStyle} ${itemStatusButtonStyle[status]}`}
      >
        <p
          className={`${baseItemStatus} ${itemStatusText[status]}`}
        >{`${itemStatus[status]}`}</p>
      </button>
    </div>
  );
};

export default ItemStatusCard;
