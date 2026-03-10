import Button from "../../../Button";
import type { RentalRequest } from "../../../../types/rental";
// 대여 확인 카드에 들어갈 값

interface RentalConfirmCardProps {
  rental: RentalRequest;
}

const RentalConfirmCard = ({ rental }: RentalConfirmCardProps) => {
  const { requestedAt, itemName, itemId, itemCount, applicantInfo } = rental;

  return (
    <div className="flex flex-col items-center w-full max-w-[350px] h-screen max-h-[225px] font-[Pretendard] bg-neutral-white shadow-card rounded-[24px]">
      {/* 정보 영역 */}
      <div className="flex w-full mt-7.5 mb-auto items-start justify-between pl-8 pr-10">
        {/* 대여 물품 정보 영역 */}
        <div className="flex-[2]">
          <p className="text-primary text-12px font-[300]">
            요청시각 {requestedAt}
          </p>
          <div className="flex w-full items-end gap-1">
            <p className="text-neutral-gray-1 text-24px font-bold whitespace-nowrap">
              {itemName}
            </p>
            <p className="text-[#000] opacity-[0.39] text-12px font-normal mt-auto mb-1 whitespace-nowrap">
              {itemCount}
            </p>
          </div>
          {itemId && (
            <p className="text-neutral-gray-1 opacity-[0.9] text-16px font-[500] leading-none">
              {itemId}
            </p>
          )}
        </div>
        {/* 대여자 정보 영역 */}
        <div className="flex flex-col text-neutral-gray-3 text-12px font-normal mt-12">
          <p>이름: {applicantInfo.name}</p>
          <p>학과: {applicantInfo.major}</p>
          <p>학번: {applicantInfo.id}</p>
        </div>
      </div>
      {/* 버튼 영역 */}
      <div className="flex w-full max-w-[306px] justify-between mt-auto mb-6">
        <Button variant="outline" size="md">
          거부
        </Button>
        <Button variant="primary" size="md">
          승인
        </Button>
      </div>
    </div>
  );
};

export default RentalConfirmCard;
