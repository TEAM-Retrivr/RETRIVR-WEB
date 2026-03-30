import { useEffect, useState } from "react";
import Button from "../../../Button";
import { Modal } from "../../../Modal";

export interface OverdueRentalMessageModalProps {
  isOpen: boolean;
  onClose: () => void;

  itemNameWithCount?: string;
  borrowerName?: string;
  borrowerStudentNumber?: string;

  overdueDays?: number;
  lastSmsSentDateLabel?: string;

  canSendOverdueSms?: boolean;
  onConfirm?: () => Promise<void> | void;
}

const OverdueRentalMessageModal = ({
  isOpen,
  onClose,
  itemNameWithCount,
  borrowerName,
  borrowerStudentNumber,
  overdueDays,
  lastSmsSentDateLabel,
  canSendOverdueSms = true,
  onConfirm,
}: OverdueRentalMessageModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setIsSubmitting(false);
    setSubmitError(null);
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!canSendOverdueSms) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onConfirm?.();
      onClose();
    } catch (e) {
      setSubmitError("연체 문자 전송에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
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
          <textarea
            rows={3}
            className="w-full bg-neutral-gray-5 text-14px text-left text-neutral-gray-2 px-4 py-3 rounded-[12px] font-normal leading-[140%]
            outline-hidden transition-all focus:ring-2 focus:ring-blue-100 resize-none"
            placeholder="여기에 대여자에게 보낼 메시지를 입력하세요."
          />

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
