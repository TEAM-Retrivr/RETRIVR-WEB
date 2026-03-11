// 반납 연체 확인 영역에서 사용하는 카드 컴포넌트 Props
// - 연체 일수, 마지막 문자 발송일, 대여 물품/대여자 정보, 문자 발송 가능 여부를 전달받음
interface ReturnConfirmCardProps {
  overdueDays: number;
  lastSmsSentDateLabel: string;
  itemNameWithCount: string;
  borrowerName: string;
  borrowerStudentNumber: string;
  canSendOverdueSms: boolean;
}

const ReturnConfirmCard = ({
  overdueDays,
  lastSmsSentDateLabel,
  itemNameWithCount,
  borrowerName,
  borrowerStudentNumber,
  canSendOverdueSms,
}: ReturnConfirmCardProps) => {
  return (
    <div className="flex flex-col w-46.5 h-39.5 box-border px-3 py-3.5 rounded-[24px] shadow-consent-card">
      {/* */}
      <div className="flex flex-col mt-2.5 px-1">
        {/* 반납 연체일 + 연체 문자 발송된 시각 */}
        <div className="flex w-full items-center gap-3">
          <p className="text-12px text-primary font-bold leading-[130%]">
            {`D+${overdueDays}`}
          </p>
          <p className="text-10px text-primary opacity-[0.5] font-normal leading-[130%]">
            {lastSmsSentDateLabel}
          </p>
        </div>
        {/* 대여 물품 명 */}
        <p className="text-18px text-neutral-gray-1 mt-1.5 font-bold">
          {itemNameWithCount}
        </p>
        {/* 대여자 이름 | 학번 */}
        <p className="text-12px text-neutral-gray-3 font-normal leading-[130%]">
          {borrowerName} | {borrowerStudentNumber}
        </p>
      </div>
      {/* */}
      <button
        disabled={!canSendOverdueSms}
        className={`w-40.5 h-10 mt-auto text-neutral-white text-center text-16px font-[Pretendard] font-[600] rounded-small cursor-pointer ${
          canSendOverdueSms
            ? "bg-primary hover:bg-secondary-2"
            : "bg-neutral-gray-3 cursor-not-allowed"
        }`}
      >
        연체 문자 전송
      </button>
    </div>
  );
};

export default ReturnConfirmCard;
