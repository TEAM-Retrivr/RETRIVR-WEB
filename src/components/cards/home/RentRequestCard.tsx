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
    <div className="w-full bg-neutral-white rounded-[20px] p-5 shadow-sm border border-neutral-gray/20 flex justify-between items-center">
      <div>
        <div className="flex items-center gap-1">
          <h3 className="font-bold text-[16px]">{itemName}</h3>
          <span className="text-secondary-light text-[12px]">{count}</span>
        </div>
        <p className="text-[12px] text-neutral-dark mt-1">{applicant}</p>
        <p className="text-[10px] text-[#9c9c9c] font-normal mt-1">{time}</p>
      </div>
      <Button size="small">확인하기</Button>
    </div>
  );
};
