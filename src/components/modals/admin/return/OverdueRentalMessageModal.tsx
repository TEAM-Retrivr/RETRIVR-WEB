import { useEffect, useState } from "react";
import Button from "../../../Button";
import { Modal } from "../../../Modal";
import { useSendAdminOverdueReminder } from "../../../../hooks/queries/useAdminQueries";

export interface OverdueRentalMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalId?: number;
  itemId?: number;

  organizationName?: string;

  itemNameWithCount?: string;
  borrowerName?: string;
  borrowerStudentNumber?: string;

  overdueDays?: number;
  lastSmsSentDateLabel?: string;

  canSendOverdueSms?: boolean;
}

const OverdueRentalMessageModal = ({
  isOpen,
  onClose,
  rentalId,
  itemId,
  organizationName,
  borrowerName,
  itemNameWithCount,
  overdueDays,
  canSendOverdueSms = true,
}: OverdueRentalMessageModalProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateAsync: sendOverdueReminder, isPending: isSubmitting } =
    useSendAdminOverdueReminder();

  useEffect(() => {
    if (!isOpen) return;
    setSubmitError(null);
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!canSendOverdueSms) return;
    if (!rentalId) {
      setSubmitError("문자 전송에 필요한 rentalId가 없어 요청할 수 없습니다.");
      return;
    }

    try {
      setSubmitError(null);
      // 서버로는 rentalId만 전송하고, itemId는 성공 후 캐시 무효화에만 사용
      await sendOverdueReminder({ rentalId, itemId });
      onClose();
    } catch (e) {
      setSubmitError("연체 문자 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="font-[Pretendard]">
        {/* 모달 제목 영역 */}
        <div className="text-20px text-start text-secondary-1 font-[600] px-3.5">
          <p>{borrowerName}님에게 연체 문자를 </p>
          <p>다음과 같이 보내시겠어요?</p>
        </div>

        {/* 연체 메시지 입력 영역 */}
        <div className="flex flex-col w-full mt-6.5 gap-5">
          <div className="w-full bg-neutral-gray-5 text-14px text-left text-neutral-gray-3 px-4 py-3 rounded-[12px] font-normal leading-[140%]">
            {organizationName ? <p>'{organizationName}'입니다.</p> : null}
            <p>
              대여해 가신 '{itemNameWithCount ?? ""}'가{" "}
              {overdueDays !== undefined ? `${overdueDays}일` : ""}{" "}
              연체되었습니다.
            </p>
            <p>빠른 시일 내에 반납 부탁드립니다.</p>
          </div>

          {submitError && <p className="text-12px text-red">{submitError}</p>}

          {/* 버튼 영역 - 취소, 전송 */}
          <div className="flex w-full justify-between mt-3">
            <Button
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              disabled={!canSendOverdueSms || isSubmitting}
            >
              {isSubmitting ? "전송 중..." : "전송"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OverdueRentalMessageModal;
