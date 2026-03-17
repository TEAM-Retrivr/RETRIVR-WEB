import { useState } from "react";
import Button from "../../../Button";
import ReturnApprovalModal from "../../../modals/admin/return/ReturnApprovalModal";

const ReturnCheckCard = () => {
  const [isReturnApprovalOpen, setIsReturnApprovalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col w-87.5 min-h-77 bg-neutral-white font-[Pretendard] items-center pt-7.5 px-5.25 pb-5 rounded-[24px] shadow-16-gray gap-4">
        <div className="flex flex-col w-full gap-3">
          <div className="flex justify-between px-2.25 ">
            {/* 연체 중 표시 및 물품 이름 영역 */}
            <div className="flex flex-col items-start gap-1">
              {/* 연체 중 표시 */}
              <div className="flex w-13.75 h-4.75 bg-secondary-4 items-center px-1.5 rounded-[10px] gap-1">
                <div className="bg-[#F00] w-1.25 h-1.25 rounded-[50%]"></div>
                <p className="text-12px text-primary font-bold leading-[130%]">
                  연체 중
                </p>
              </div>
              {/* 물품 이름 영역 */}
              <p className="text-24px text-neutral-gray-1 font-[700]">
                c타입 충전기 (1)
              </p>
            </div>
            {/* 수정하기 버튼 */}
            <button className="w-17 h-6.75 border border-primary text-12px text-primary font-normal bg-neutral-white mt-auto mb-0 hover:bg-bg-pale rounded-[10px] leading-[140%]">
              수정하기
            </button>
          </div>
          {/* 대여자 정보 및 대여 일자, 반납 일자 영역 */}
          <div className="w-full h-32.5 bg-secondary-4 pt-4.5 px-5.5 rounded-[10px]">
            <div className="flex flex-col gap-2.5">
              {/* 대여자 정보 영역 - 이름, 학과, 학번  */}
              <div className="text-12px text-neutral-gray-1 font-normal leading-[140%]">
                <p>이름: 조윤아</p>
                <p>학과: 동물자원과학과</p>
                <p>학번: 202312690</p>
              </div>
              {/* 대여 일자, 반납 일자 표시 영역 */}
              <div className="w-30.75 text-12px text-secondary-2">
                <div className="flex align-center justify-between">
                  <p className="font-bold leading-[130%]">대여 일자</p>
                  <p className="text-right font-normal leading-[140%]">
                    2026-01-31
                  </p>
                </div>
                <div className="flex align-center justify-between">
                  <p className="font-bold leading-[130%]">반납 일자</p>
                  <p className="text-right font-normal leading-[140%]">
                    2026-02-21
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 버튼 영역 - 연체 문자 전송, 반납 확인 */}
        <div className="flex w-full gap-2">
          <Button variant="outline" className="w-37.25">
            연체 문자 전송
          </Button>
          <Button
            variant="primary"
            className="w-37.25"
            onClick={() => setIsReturnApprovalOpen(true)}
          >
            반납 확인
          </Button>
        </div>
      </div>

      <ReturnApprovalModal
        isOpen={isReturnApprovalOpen}
        onClose={() => setIsReturnApprovalOpen(false)}
      />
    </>
  );
};

export default ReturnCheckCard;
