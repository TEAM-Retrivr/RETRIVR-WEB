import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ItemRequest } from "../../../types/item";
import { ProgressCircle } from "../../ProgressCircle";
import Button from "../../Button";

interface RentalAvailableItemCardProps {
  itemInfo: ItemRequest;
}

const RentalAvailableItemCard = ({
  itemInfo,
}: RentalAvailableItemCardProps) => {
  const { item } = itemInfo;
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => setIsExpanded((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsExpanded((prev) => !prev);
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      className="w-full max-w-[350px] max-h-[240px] bg-neutral-white rounded-[16px] shadow-item-card overflow-hidden font-[Pretendard] cursor-pointer"
    >
      {/* 상단 영역 - 대여 물품 이름, 수량 표시 */}
      <div className="max-h-[90px] p-7.5 flex justify-between items-center">
        <p className="text-20px text-neutral-gray-1 font-[600]">{item.name}</p>
        <div className="progress-circle">
          {" "}
          <ProgressCircle
            available={item.availableQuantity}
            total={item.totalQuantity}
          ></ProgressCircle>
        </div>
      </div>

      {/* 하단 영역 - 대여 기간, 보증 물품, 물품 설명 + 버튼 */}
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 ">
            <ul className="text-12px text-neutral-gray-3 mb-6">
              <li>
                대여 기간 :{" "}
                <span className="text-primary">{item.rentalDuration}일</span>
              </li>
              <li>
                보증 물품 :{" "}
                <span className="text-primary">
                  {item.guaranteedGoods ?? "-"}
                </span>
              </li>
              <li>물품 설명 : {item.description}</li>
            </ul>

            <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="md">
                취소
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  navigate("/client-rental-information-submit", {
                    state: {
                      itemId: item.itemId,
                      // TODO: 개별 코드형 물품일 때 itemUnitId 전달 필요 시 여기에 추가
                      name: item.name,
                      rentalDuration: item.rentalDuration,
                      guaranteedGoods: item.guaranteedGoods,
                      description: item.description,
                    },
                  });
                }}
              >
                대여하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalAvailableItemCard;
