import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ItemRequest } from "../../../types/item";
import { ProgressCircle } from "../../ProgressCircle";
import Button from "../../Button";
import { requestItemDetail } from "../../../api/client/client.api";
import CustomCheckBox from "../../CustomCheckbox";

const CLIENT_TERMS_REDIRECT_STORAGE_KEY = "clientTermsRedirectPayload";

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
  const canRent = isActive && item.availableQuantity > 0;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [itemManagementType, setItemManagementType] = useState<
    string | undefined
  >();
  const [itemUnits, setItemUnits] = useState<
    { itemUnitId: number; label: string; status?: string }[]
  >([]);
  const [borrowerRequirements, setBorrowerRequirements] = useState<
    { label: string; required: boolean }[]
  >(item.borrowerRequirements ?? []);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const navigate = useNavigate();

  const availableUnits = itemUnits.filter(
    (unit) => unit.status === "AVAILABLE",
  );
  const hasUnitSelection = itemManagementType === "UNIT";

  const handleExpand = async () => {
    if (!canRent) return;
    const nextExpanded = !isExpanded;
    setIsExpanded(nextExpanded);
    if (!nextExpanded) return;
    if (itemManagementType) return;

    setIsDetailLoading(true);
    try {
      const detail = await requestItemDetail(item.itemId);
      setItemManagementType(detail.itemManagementType ?? "NON_UNIT");
      setItemUnits(detail.itemUnits ?? []);
      setBorrowerRequirements(
        detail.borrowerRequirements ?? item.borrowerRequirements ?? [],
      );
    } catch (error) {
      console.error("물품 상세 조회 실패", error);
      setBorrowerRequirements(item.borrowerRequirements ?? []);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const moveToRentalForm = (unitId?: number) => {
    const rentalFormState = {
      itemId: item.itemId,
      itemUnitId: unitId,
      organizationId,
      organizationName,
      name: item.name,
      rentalDuration: item.rentalDuration,
      guaranteedGoods: item.guaranteedGoods,
      description: item.description,
      borrowerRequirements,
    };

    const termsRedirectPayload = {
      userType: "client" as const,
      nextPath: "/client-rental-information-submit",
      nextState: rentalFormState,
    };

    sessionStorage.setItem(
      CLIENT_TERMS_REDIRECT_STORAGE_KEY,
      JSON.stringify(termsRedirectPayload),
    );

    navigate("/terms", { state: termsRedirectPayload });
  };

  return (
    <div
      onClick={handleExpand}
      onKeyDown={
        canRent
          ? (e) => {
              if (e.target !== e.currentTarget) return; // 키보드 이벤트 막기
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleExpand();
              }
            }
          : undefined
      }
      role="button"
      tabIndex={canRent ? 0 : -1}
      aria-expanded={isExpanded}
      aria-disabled={!canRent}
      className={`w-full max-w-[350px] rounded-[16px] shadow-item-card overflow-hidden font-[Pretendard] ${
        canRent
          ? "bg-neutral-white cursor-pointer"
          : "bg-neutral-gray-5 cursor-not-allowed opacity-70"
      }`}
    >
      {/* 상단 영역 - 대여 물품 이름, 수량 표시 */}
      <div className="h-22.5 px-7 flex justify-between items-center">
        <p
          className={`truncate text-20px font-[600] ${
            canRent ? "text-neutral-gray-1" : "text-neutral-gray-3"
          }`}
        >
          {item.name}
        </p>
        <div className="progress-circle">
          {" "}
          <ProgressCircle
            available={item.availableQuantity}
            total={item.totalQuantity}
            isActive={canRent}
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

            {isDetailLoading ? (
              <p className="text-12px text-neutral-gray-3">
                물품 정보를 불러오는 중...
              </p>
            ) : (
              <>
                {hasUnitSelection && (
                  <div className="mb-7 rounded-[12px]">
                    <div className="flex flex-col gap-2">
                      {itemUnits.map((unit) => {
                        const isAvailable = unit.status === "AVAILABLE";
                        const isSelected = selectedUnitId === unit.itemUnitId;

                        return (
                          <button
                            key={unit.itemUnitId}
                            type="button"
                            disabled={!isAvailable}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isAvailable) return;
                              setSelectedUnitId(unit.itemUnitId);
                            }}
                            className={`w-full h-11.25 flex items-center justify-between rounded-[14px] pl-5.5 pr-5 ${
                              isAvailable
                                ? "shadow-16-gray"
                                : "bg-neutral-gray-5"
                            } cursor-pointer`}
                          >
                            <span className="truncate w-50 text-14px text-neutral-gray-2 font-normal leading-[140%] ">
                              {unit.label}
                            </span>
                            {isAvailable ? (
                              <CustomCheckBox checked={isSelected} />
                            ) : (
                              <span className=" text-neutral-gray-3 text-12px font-normal leading-[140%]">
                                대여 불가
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div
                  className="flex gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setIsExpanded(false);
                      setSelectedUnitId(null);
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    disabled={
                      !canRent ||
                      (hasUnitSelection &&
                        (availableUnits.length === 0 ||
                          selectedUnitId === null))
                    }
                    onClick={() => {
                      if (!canRent) return;
                      if (hasUnitSelection) {
                        if (!selectedUnitId) return;
                        moveToRentalForm(selectedUnitId);
                        return;
                      }
                      moveToRentalForm();
                    }}
                  >
                    {canRent ? "대여하기" : "대여 불가"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalAvailableItemCard;
