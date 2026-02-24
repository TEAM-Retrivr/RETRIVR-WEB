import Button from "../../Button";

interface RentRequestCardProps {
  itemName: string; // '대여 요청한 기자재명'
  count: string; // '남은 수량 / 전체 수량'
  applicant: string; // '대여 요청자 | 소속'
  time: string; // '대여 요청이 들어온 시각'
}

export const RentRequestCard = ({
  itemName,
  count,
  applicant,
  time,
}: RentRequestCardProps) => {
  return (
    <div className="w-full max-w-[318px] max-h-[94px] bg-neutral-white rounded-[20px] p-5 shadow-sm border border-neutral-gray/20 flex justify-between items-center">
      <div>
        <div className="flex items-center gap-1 leading-none">
          <h3 className="font-[600] text-[1rem]">{itemName}</h3>
          <span className="text-secondary-light text-[12px]">{count}</span>
        </div>
        <p className="text-[0.75rem] text-neutral-dark mt-1">{applicant}</p>
        <p className="text-[0.625rem] text-[#9c9c9c] font-normal mt-1">
          {time}
        </p>
      </div>
      {/* TODO : 확인하기 버튼 클릭 시 세부사항 페이지로 라우팅 */}
      <Button size="xs">확인하기</Button>
    </div>
  );
};
