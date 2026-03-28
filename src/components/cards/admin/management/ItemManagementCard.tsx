import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemStatusCard from "./ItemStatusCard";

type ItemManagementCardProps = {
  itemId: number;
  name: string;
  totalQuantity: number;
  isActive: boolean;
  rentalDuration?: number;
  description?: string;
  guaranteedGoods?: string;
};

// TODO: ItemStatusCard 목록은 향후 개별 물품 단위 데이터로 교체 예정
const MOCK_ITEM_NAME = "c타입 충전기 (1)";
const MOCK_ITEM_CODE = "345ss2";
const MOCK_ITEM_STATUSES: Array<
  "rentalAvailable" | "rentedOut" | "rentalUnavailable"
> = ["rentedOut", "rentalAvailable", "rentalUnavailable"];

const ItemManagementCard = ({
  itemId,
  name,
  totalQuantity,
  isActive,
  rentalDuration,
  description,
  guaranteedGoods,
}: ItemManagementCardProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isToggledOn, setIsToggledOn] = useState(isActive);

  return (
    <div className="w-87.5 min-h-25 overflow-hidden rounded-[16px] bg-neutral-white font-[Pretendard] shadow-item-card">
      {/* 상단 영역 - 물품명, 토글, 총 개수, 화살표 */}
      <div className="flex h-25 items-center justify-between gap-3 px-7.5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div>
            {" "}
            <h3 className="truncate text-24px font-bold text-neutral-gray-1">
              {name}
            </h3>
            <p className="text-12px text-[#000000] opacity-[0.4] font-normal leading-[140%]">
              총 개수: {totalQuantity}개
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isToggledOn}
            onClick={(e) => {
              e.stopPropagation();
              setIsToggledOn((prev) => !prev);
            }}
            className="relative flex h-4 w-8 shrink-0 items-center rounded-full bg-neutral-gray-4"
          >
            {/* 배경을 직접 교체하지 않고, 그라데이션 레이어를 opacity로만 전환해서 깜빡임 방지 */}
            <span
              aria-hidden="true"
              className={`absolute inset-0 rounded-full bg-logo-gradient transition-opacity duration-200 ${
                isToggledOn ? "opacity-100" : "opacity-0"
              }`}
            />
            <span
              className={`absolute left-0.5 top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                isToggledOn ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
            aria-expanded={isExpanded}
          >
            <img
              className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              src="/icons/down_arrow.svg"
              alt={isExpanded ? "접기" : "펼치기"}
            />
          </button>
        </div>
      </div>

      {/* 하단 영역 - 상세 정보 + ItemStatusCard 목록 (슬라이드 다운) */}
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-6 pb-6 ">
            {/* 상세 정보 */}
            <div className="mb-4 flex w-full items-end justify-between gap-4">
              <ul className="min-w-0 flex-1 list-disc ml-5 text-12px text-neutral-gray-1 font-normal leading-[140%]">
                <li>대상 : 건국대학교 재학생 혹은 휴학생</li>
                {rentalDuration !== undefined && (
                  <li>대여 기간 : {rentalDuration}일</li>
                )}
                {description && <li>설명 : {description}</li>}
                {guaranteedGoods && <li>보증 물품 : {guaranteedGoods}</li>}
              </ul>
              <button
                type="button"
                onClick={() => navigate(`/item-edit/${itemId}`)}
                className="w-22.5 h-8.5 shrink-0 rounded-[10px] text-center bg-neutral-white text-14px font-[600] leading-[20px] text-primary border border-primary cursor-pointer hover:bg-bg-pale"
              >
                수정하기
              </button>
            </div>

            {/* 구분선 아래 ItemStatusCard 목록 */}
            <div className="flex flex-col gap-1.5 border-t pt-6 border-neutral-gray-4/50 items-center">
              {MOCK_ITEM_STATUSES.map((status, index) => (
                <ItemStatusCard
                  key={index}
                  status={status}
                  itemName={MOCK_ITEM_NAME}
                  itemCode={MOCK_ITEM_CODE}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemManagementCard;
