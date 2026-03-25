import { useState } from "react";
import Button from "../../../Button";
import ReturnApprovalModal from "../../../modals/admin/return/ReturnApprovalModal";
import { useConfirmAdminReturn } from "../../../../hooks/queries/useAdminQueries";

export interface ReturnCheckCardRentalInfo {
  // 대여 ID (반납 확인 API에서 사용)
  rentalId?: number;
  // 물품 ID (성공 시 캐시 무효화용)
  itemId: number;
  // 연체 여부
  isOverdue: boolean;
  // 물품 이름
  itemName: string;
  // 대여자 정보
  borrowerName: string;
  borrowerMajor: string;
  borrowerStudentNumber?: string;
  // 대여/반납 일자
  rentalDate: string;
  expectedReturnDueDate: string;
}

interface ReturnCheckCardProps {
  rental: ReturnCheckCardRentalInfo;
}

const ReturnCheckCard = ({ rental }: ReturnCheckCardProps) => {
  const [isReturnApprovalOpen, setIsReturnApprovalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutate: confirmReturn, isPending: isConfirming } =
    useConfirmAdminReturn();

  return (
    <>
      <div className="flex flex-col w-87.5 min-h-77 bg-neutral-white font-[Pretendard] items-center pt-7.5 px-5.25 pb-5 rounded-[24px] shadow-16-gray gap-4">
        <div className="flex flex-col w-full gap-3">
          <div className="flex justify-between px-2.25 ">
            {/* 연체 중 표시 및 물품 이름 영역 */}
            <div className="flex flex-col items-start gap-1">
              {/* 연체 중 표시 : isOverdue = true 인 경우에만 아래 div 태그를 보이고, 아니면 아래 div 태그를 보이지 말 것 */}
              {rental.isOverdue && (
                <div className="flex w-13.75 h-4.75 bg-secondary-4 items-center px-1.5 rounded-[10px] gap-1">
                  <div className="bg-[#F00] w-1.25 h-1.25 rounded-[50%]"></div>
                  <p className="text-12px text-primary font-bold leading-[130%]">
                    연체 중
                  </p>
                </div>
              )}
              {/* 물품 이름 영역 : itemName 필요 */}
              <p className="text-24px text-neutral-gray-1 font-[700]">
                {rental.itemName}
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
                <p>이름: {rental.borrowerName}</p>
                <p>학과: {rental.borrowerMajor}</p>
                {rental.borrowerMajor && (
                  <p>학번: {rental.borrowerStudentNumber}</p>
                )}
              </div>
              {/* 대여 일자, 반납 일자 표시 영역 */}
              <div className="w-30.75 text-12px text-secondary-2">
                {/* 대여 일자 영역 : rentalDate 필요  */}
                <div className="flex items-center justify-between">
                  <p className="font-bold leading-[130%]">대여 일자</p>
                  <p className="text-right font-normal leading-[140%]">
                    {rental.rentalDate}
                  </p>
                </div>
                {/* 반납일자 영역 : expectedReturnDueDate 필요 */}
                <div className="flex items-center justify-between">
                  <p className="font-bold leading-[130%]">반납 일자</p>
                  <p className="text-right font-normal leading-[140%]">
                    {rental.expectedReturnDueDate}
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
        onClose={() => {
          setIsReturnApprovalOpen(false);
          setSubmitError(null);
        }}
        isSubmitting={isConfirming}
        submitError={submitError}
        onConfirm={(adminNameToConfirm) => {
          if (!rental.rentalId) {
            setSubmitError(
              "반납 처리에 필요한 rentalId가 없어 요청을 보낼 수 없습니다. (백엔드 응답 명세 확인 필요)",
            );
            return;
          }
          confirmReturn(
            {
              rentalId: rental.rentalId,
              adminNameToConfirm,
              // 훅에서 상세 쿼리 키를 정확히 invalidate 하기 위해 함께 전달
              itemId: rental.itemId,
            },
            {
              onSuccess: () => {
                setIsReturnApprovalOpen(false);
                setSubmitError(null);
              },
              onError: () => {
                setSubmitError("반납 처리에 실패했습니다. 다시 시도해주세요.");
              },
            },
          );
        }}
      />
    </>
  );
};

export default ReturnCheckCard;
