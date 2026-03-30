import type { AdminBorrowerRequirementResponse } from "../../../../api/admin/admin.type";

interface CardProps {
  status: "rentalAvailable" | "rentedOut" | "rentalUnavailable"; // 물품 상태
  itemName: string; // 물품 이름
  itemCode?: string; // 물품 고유 번호 (없을 수도 있음)
  /** GET /api/admin/v1/items/{itemId} 상세의 borrowerRequirements (펼침 시 조회) */
  borrowerRequirements?: AdminBorrowerRequirementResponse[];
}

const ItemStatusCard = ({ status, itemName }: CardProps) => {
  // 기본 컴포넌트 스타일
  const baseBoxStyle =
    "flex justify-between items-center w-75.5 h-13.5 font-[Pretendard] rounded-[20px] shadow-item-card cursor-pointer box-border px-5 py-4";

  // 상태에 따른 컴포넌트 스타일
  const boxStyleByStatus: Record<CardProps["status"], string> = {
    rentalAvailable: "bg-neutral-white",
    rentedOut: "bg-neutral-gray-4 opacity-[40%]",
    rentalUnavailable: "bg-neutral-white",
  };

  // 기본 물품 텍스트 스타일
  const baseItemTextStyle = "text-14px font-normal leading-140%]";

  // 상태에 따른 물품 텍스트 스타일
  const itemTextStyleByStatus: Record<CardProps["status"], string> = {
    rentalAvailable: "text-neutral-gray-2",
    rentedOut: "text-neutral-white",
    rentalUnavailable: "text-neutral-gray-2",
  };

  // 기본 물품 상태 전환 버튼 스타일
  const baseItemStatusButtonStyle =
    "flex w-20 h-8.5 px-2.5 py-3 justify-center items-center rounded-[15px]";
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

  // 상태에 따른 커서 스타일
  const cursorByStatus: Record<CardProps["status"], string> = {
    rentalAvailable: "cursor-pointer",
    rentedOut: "",
    rentalUnavailable: "cursor-pointer",
  };

  return (
    <div className={`${baseBoxStyle} ${boxStyleByStatus[status]}`}>
      <div className="min-w-0 flex-1">
        <p className={`${baseItemTextStyle} ${itemTextStyleByStatus[status]}`}>
          {itemName}
        </p>
      </div>
      <button
        className={`${baseItemStatusButtonStyle} ${itemStatusButtonStyle[status]} ${cursorByStatus[status]}`}
      >
        <p
          className={`${baseItemStatus} ${itemStatusText[status]} `}
        >{`${itemStatus[status]}`}</p>
      </button>
    </div>
  );
};

export default ItemStatusCard;
