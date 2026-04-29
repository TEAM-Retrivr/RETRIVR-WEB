import { useState } from "react";
import type { RentalRequest } from "../../../../types/rental";
import { ShortRentalApprovalModal } from "../../../modals/admin/rentalApprovalModal/ShortRentalApprovalModal";
// 대여 확인 카드에 들어갈 값

interface RentalConfirmCardProps {
  rental: RentalRequest;
}

const RentalConfirmCard = ({ rental }: RentalConfirmCardProps) => {
  const {
    rentalId,
    requestedAt,
    itemName,
    itemId,
    itemCount,
    rentalDuration,
    guaranteedGoods,
    applicantInfo,
  } = rental;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex w-87.5 h-85 justify-center font-[Pretendard]">
        <div className="w-full rounded-[24px] border-secondary-3 p-1">
          {/* 실제 카드 영역 */}
          <div className="flex h-85 w-full flex-col rounded-[20px] bg-neutral-white px-5 pt-6 pb-5 shadow-card">
            {/* 상단 정보 영역 */}
            <div className="flex flex-col px-2.5 gap-1">
              <p className="text-12px font-[300] text-primary">
                요청 시각 {requestedAt}
              </p>
              <div className="flex items-baseline gap-1">
                <p className="whitespace-nowrap text-24px font-bold text-neutral-gray-1">
                  {itemName}
                </p>
                <p className="text-12px font-normal text-neutral-gray-3">
                  {itemCount}
                </p>
              </div>
              {itemId && (
                <p className="text-16px font-[500] leading-none text-neutral-gray-1 opacity-[0.9]">
                  {itemName}
                </p>
              )}
            </div>

            {/* 대여 기간 / 보증 물품 (하드코딩) */}
            <div className="mt-2.5 pl-2.5">
              <ul className="list-disc pl-5 text-14px font-normal leading-[140%] text-neutral-gray-1">
                <li>대여 기간 : {rentalDuration ?? "-"}일</li>
                <li>보증 물품 : {guaranteedGoods?.trim() || "없음"}</li>
              </ul>
            </div>

            {/* 대여자 정보 영역 */}
            <div className="mt-5 border-t border-neutral-gray-4/50 pt-4.5 pl-2.5 text-14px font-normal leading-[140%] text-secondary-1">
              <p>이름: {applicantInfo.name}</p>
              {/*<p>연락처: {applicantInfo.phone}</p>*/}
            </div>

            {/* 버튼 영역 */}
            <button
              className="mt-auto mb-0 h-12 w-full rounded-small bg-primary text-center text-18px font-bold text-neutral-white hover:bg-secondary-2"
              onClick={handleOpenModal}
            >
              확인하기
            </button>
          </div>
        </div>
      </div>

      <ShortRentalApprovalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        rentalId={rentalId}
        itemData={{
          name: itemName,
          borrower: applicantInfo.name,
          duration: `${rentalDuration ?? "-"}일`,
          guaranteedGoods: guaranteedGoods?.trim() || "없음",
        }}
      />
    </>
  );
};

export default RentalConfirmCard;
