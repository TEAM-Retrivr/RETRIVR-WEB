const ReturnConfirmCard = () => {
  return (
    <div className="flex flex-col w-46.5 h-39.5 box-border px-3 py-3.5 rounded-[24px] shadow-consent-card">
      {/* */}
      <div className="flex flex-col mt-2.5 px-1">
        {/* 반납 연체일 + 연체 문자 발송된 시각 */}
        <div className="flex w-full items-center gap-3">
          <p className="text-12px text-primary font-bold leading-[130%]">D+3</p>
          <p className="text-10px text-primary opacity-[0.5] font-normal leading-[130%]">
            26-02-01 문자 발송됨
          </p>
        </div>
        {/* 대여 물품 명 */}
        <p className="text-18px text-neutral-gray-1 mt-1.5 font-bold">
          c타입 충전기 (1)
        </p>
        {/* 대여자 이름 | 학번 */}
        <p className="text-12px text-neutral-gray-3 font-normal leading-[130%]">
          조윤아 | 202312690
        </p>
      </div>
      {/* */}
      <button className="w-40.5 h-10 mt-auto bg-primary text-neutral-white text-center text-16px font-[Pretendard] font-[600] rounded-small cursor-pointer hover:bg-secondary-2">
        연체 문자 전송
      </button>
    </div>
  );
};

export default ReturnConfirmCard;
