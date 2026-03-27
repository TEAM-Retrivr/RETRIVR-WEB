import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ItemRequest } from "../../../types/item";
import { ProgressCircle } from "../../ProgressCircle";
import Button from "../../Button";

interface RentalAvailableItemCardProps {
  itemInfo: ItemRequest;
  organizationId: number;
  organizationName?: string;
}

const RentalAvailableItemCard = ({
  itemInfo,
  organizationId,
  organizationName,
}: RentalAvailableItemCardProps) => {
  const { item } = itemInfo;
  const isActive = item.isActive;
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onClick={isActive ? () => setIsExpanded((prev) => !prev) : undefined}
      onKeyDown={
        isActive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsExpanded((prev) => !prev);
              }
            }
          : undefined
      }
      role="button"
      tabIndex={isActive ? 0 : -1}
      aria-expanded={isExpanded}
      aria-disabled={!isActive}
      className={`w-full max-w-[350px] max-h-[240px] rounded-[16px] shadow-item-card overflow-hidden font-[Pretendard] ${
        isActive
          ? "bg-neutral-white cursor-pointer"
          : "bg-neutral-gray-5 cursor-not-allowed opacity-70"
      }`}
    >
      {/* 상단 영역 - 대여 물품 이름, 수량 표시 */}
      <div className="h-22.5 px-7 flex justify-between items-center">
        <p
          className={`text-20px font-[600] ${
            isActive ? "text-neutral-gray-1" : "text-neutral-gray-3"
          }`}
        >
          {item.name}
        </p>
        <div className="progress-circle">
          {" "}
          <ProgressCircle
            available={item.availableQuantity}
            total={item.totalQuantity}
            isActive={isActive}
          ></ProgressCircle>
        </div>
      </div>

      {/* 하단 영역 - 대여 기간, 보증 물품, 물품 설명 + 버튼 */}
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6">
            <ul className="text-12px text-neutral-gray-3 px-1.5 mb-6">
              <li>
                대여 기간 :{" "}
                <span className="text-primary">{item.rentalDuration}일</span>
              </li>
              <li>
                보증 물품 :{" "}
                <span className="text-primary">
                  {item.guaranteedGoods !== "" && item.guaranteedGoods !== null
                    ? item.guaranteedGoods
                    : "-"}
                </span>
              </li>
              <li>
                물품 설명 : {item.description !== "" ? item.description : "-"}
              </li>
            </ul>

            <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="md">
                취소
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!isActive}
                onClick={() => {
                  if (!isActive) return;
                  navigate("/client-rental-information-submit", {
                    state: {
                      itemId: item.itemId,
                      organizationId,
                      organizationName,
                      // TODO: 개별 코드형 물품일 때 itemUnitId 전달 필요 시 여기에 추가
                      name: item.name,
                      rentalDuration: item.rentalDuration,
                      guaranteedGoods: item.guaranteedGoods,
                      description: item.description,
                    },
                  });
                }}
              >
                {isActive ? "대여하기" : "대여 불가"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalAvailableItemCard;
