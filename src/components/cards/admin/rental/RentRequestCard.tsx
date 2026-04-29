import Button from "../../../Button";
import { useState } from "react";
import LongRentalApprovalModal from "../../../modals/admin/rentalApprovalModal/LongRentalApprovalModal";

interface RentRequestCardProps {
  rentalId: number;
  itemName: string; // '대여 요청한 기자재명'
  count: string; // '남은 수량 / 전체 수량'
  applicant: string; // '대여 요청자 | 요청자 전화번호'
  time: string; // '대여 요청이 들어온 시각'
  rentalDuration?: number;
  guaranteedGoods?: string;
  itemUnitLabel?: string;
}

export const RentRequestCard = ({
  rentalId,
  itemName,
  count,
  applicant,
  time,
  rentalDuration,
  guaranteedGoods,
  itemUnitLabel,
}: RentRequestCardProps) => {
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  return (
    <>
      <div className="w-79.5 h-23.5 font-[Pretendard] bg-neutral-white rounded-[24px] px-7 py-4.43 shadow-16-gray flex justify-between items-center">
        <div>
          <div className="flex items-center gap-1 leading-none">
            <h3 className="font-[600] text-16px">{itemName}</h3>
            <span className="text-secondary-2 text-12px">{count}</span>
          </div>
          <p className="text-12px text-neutral-gray-2 mt-1">{applicant}</p>
          <p className="text-10px text-neutral-gray-3 font-normal mt-1">
            {time}
          </p>
        </div>
        <Button size="xs" onClick={() => setIsApprovalModalOpen(true)}>
          확인하기
        </Button>
      </div>

      <LongRentalApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        rentalId={rentalId}
        itemName={itemName}
        count={count}
        applicant={applicant}
        time={time}
        rentalDurationDays={rentalDuration}
        guaranteedGoods={guaranteedGoods}
        itemUnitLabel={itemUnitLabel}
      />
    </>
  );
};
