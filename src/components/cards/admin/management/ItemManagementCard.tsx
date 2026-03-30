import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemStatusCard from "./ItemStatusCard";
import type {
  AdminBorrowerRequirementResponse,
  AdminItemDetailResponse,
} from "../../../../api/admin/admin.type";
import { useAdminItemDetail } from "../../../../hooks/queries/useAdminQueries";

type ItemStatusCardStatus =
  | "rentalAvailable"
  | "rentedOut"
  | "rentalUnavailable";

/** GET 상세의 유닛 status 문자열 → ItemStatusCard 상태 */
function mapServerUnitStatusToCardStatus(
  status?: string,
): ItemStatusCardStatus {
  if (!status) return "rentalAvailable";
  const s = status.trim().toUpperCase();
  if (s === "AVAILABLE") return "rentalAvailable";
  if (
    s === "RENTED" ||
    s === "BORROWED" ||
    s === "RENTED_OUT" ||
    s === "OUT" ||
    s === "BORROWING"
  ) {
    return "rentedOut";
  }
  if (
    s === "UNAVAILABLE" ||
    s === "DISABLED" ||
    s === "INACTIVE" ||
    s === "UNAVAILABLE_FOR_RENT"
  ) {
    return "rentalUnavailable";
  }
  return "rentalAvailable";
}

type StatusRow = {
  key: string | number;
  itemName: string;
  itemCode?: string;
  status: ItemStatusCardStatus;
};

/** UNIT 물품만 개별 유닛 행 생성. NON_UNIT이면 빈 배열(카드 미렌더). */
function buildItemStatusRows(
  detail: AdminItemDetailResponse | undefined,
): StatusRow[] {
  if (!detail || detail.itemManagementType !== "UNIT") return [];
  const units = detail.itemUnits ?? [];
  if (units.length === 0) return [];
  return units.map((u) => ({
    key: u.itemUnitId,
    itemName: u.label,
    itemCode: String(u.itemUnitId),
    status: mapServerUnitStatusToCardStatus(u.status),
  }));
}

type ItemManagementCardProps = {
  itemId: number;
  name: string;
  totalQuantity: number;
  availableQuantity: number;
  isActive: boolean;
  rentalDuration?: number;
  description?: string;
  useMessageAlarmService?: boolean;
  guaranteedGoods?: string | null;
  borrowerRequirements: AdminBorrowerRequirementResponse[];
};

const ItemManagementCard = ({
  itemId,
  name,
  totalQuantity,
  availableQuantity,
  isActive,
  rentalDuration,
  description,
  useMessageAlarmService,
  guaranteedGoods,
  borrowerRequirements,
}: ItemManagementCardProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isToggledOn, setIsToggledOn] = useState(isActive);

  const {
    data: itemDetail,
    isFetching: isDetailFetching,
    isError: isDetailError,
  } = useAdminItemDetail(itemId, { enabled: isExpanded });

  const effectiveBorrowerRequirements = useMemo(
    () => itemDetail?.borrowerRequirements ?? borrowerRequirements,
    [itemDetail?.borrowerRequirements, borrowerRequirements],
  );

  const statusRows = useMemo(
    () => buildItemStatusRows(itemDetail),
    [itemDetail],
  );

  const isUnitItem = itemDetail?.itemManagementType === "UNIT";

  return (
    <div className="w-87.5 min-h-25 overflow-hidden rounded-[16px] bg-neutral-white font-[Pretendard] shadow-item-card">
      {/* 상단 영역 - 물품명, 토글, 총 개수, 화살표 */}
      <div className="flex h-25 items-center justify-between gap-3 px-7.5">
        <div className="flex flex-col min-w-0 gap-0.5">
          <div className="flex items-center gap-2.5">
            {" "}
            <h3 className="truncate text-24px font-bold text-neutral-gray-1">
              {name}
            </h3>
            <button
              type="button"
              role="switch"
              aria-checked={isToggledOn}
              onClick={(e) => {
                e.stopPropagation();
                setIsToggledOn((prev) => !prev);
              }}
              className="relative flex h-4.25 w-8 shrink-0 items-center rounded-full bg-neutral-gray-4"
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
          <p className="text-12px text-[#000000] opacity-[0.4] font-normal leading-[140%]">
            총 개수: {totalQuantity}개
          </p>
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
          <div className="flex flex-col px-6 pb-6">
            {/* 상세 정보 */}
            <div className="mb-4 flex flex-col w-full gap-4">
              <ul className="min-w-0 text-12px text-secondary-1 font-normal leading-[140%]">
                {description && <li>• 설명: {description}</li>}

                <li>
                  • 독촉 문자 발송 :{" "}
                  <span className="text-primary">
                    {useMessageAlarmService ? "O" : "X"}
                  </span>
                </li>

                <li>
                  • 보증 물품:{" "}
                  <span className="text-primary">
                    {guaranteedGoods ? guaranteedGoods : "없음"}{" "}
                  </span>
                </li>
              </ul>
              <div className="w-76.5 h-13.5 flex justify-between items-center px-4 rounded-[6px] shadow-16-gray">
                <div className="flex w-33 h-7.5 justify-center items-center bg-secondary-4 rounded-[6px] gap-3">
                  <p className="text-12px text-secondary-1 font-[500]  leading-[130%]">
                    대여 가능 기간
                  </p>
                  <div className="flex">
                    <p className="text-14px text-primary font-[600] leading-[120%]">
                      {rentalDuration ?? "-"}{" "}
                    </p>
                    <p className="text-12px text-secondary-1 font-[500] leading-[130%]">
                      일
                    </p>
                  </div>
                </div>
                <div className="flex w-33 h-7.5 justify-center items-center bg-secondary-4 rounded-[6px] gap-3">
                  <p className="text-12px text-secondary-1 font-[500] leading-[130%]">
                    대여 가능 개수
                  </p>
                  <div className="flex">
                    <p className="text-14px text-primary font-[600] leading-[120%]">
                      {availableQuantity}{" "}
                    </p>
                    <p className="text-12px text-secondary-1 font-[500] leading-[130%]">
                      개
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full px-5 py-3 gap-2 rounded-[6px] shadow-16-gray">
                <p className="text-12px text-secondary-1 font-normal leading-[140%]">
                  대여자 입력 요구 정보
                </p>
                <div className="flex flex-wrap gap-2">
                  {isDetailFetching && !itemDetail ? (
                    <span className="text-12px text-neutral-gray-3">
                      불러오는 중...
                    </span>
                  ) : (
                    effectiveBorrowerRequirements.map((req, index) => (
                      <span
                        key={`${req.label}-${index}`}
                        className="inline-flex shrink-0 items-center text-secondary-1 text-12px font-normal rounded-[30px] bg-secondary-4 px-3 py-1 leading-[140%]"
                      >
                        {req.label}
                      </span>
                    ))
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/item-edit/${itemId}`)}
                  className="w-22.5 h-8.5 shrink-0 rounded-[10px] text-center bg-neutral-white text-14px font-[600] leading-[20px] text-primary border border-primary cursor-pointer hover:bg-bg-pale"
                >
                  수정하기
                </button>
              </div>
            </div>

            {/* UNIT 물품만: 구분선 아래 ItemStatusCard — GET /api/admin/v1/items/{itemId} 상세 */}
            {isDetailFetching && !itemDetail ? (
              <div className="flex flex-col gap-1.5 border-t pt-6 border-neutral-gray-4/50 items-center">
                <p className="text-12px text-neutral-gray-3">
                  개별 물품 정보를 불러오는 중...
                </p>
              </div>
            ) : isUnitItem ? (
              <div className="flex flex-col gap-1.5 border-t pt-6 border-neutral-gray-4 items-center">
                {isDetailError ? (
                  <p className="text-12px text-red-500">
                    물품 상세를 불러오지 못했습니다.
                  </p>
                ) : statusRows.length === 0 ? (
                  <p className="text-12px text-neutral-gray-3">
                    표시할 물품 단위가 없습니다.
                  </p>
                ) : (
                  statusRows.map((row) => (
                    <ItemStatusCard
                      key={row.key}
                      status={row.status}
                      itemName={row.itemName}
                      itemCode={row.itemCode}
                      borrowerRequirements={effectiveBorrowerRequirements}
                    />
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemManagementCard;
