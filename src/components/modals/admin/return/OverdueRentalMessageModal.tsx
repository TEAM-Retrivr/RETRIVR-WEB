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
  itemUnitName?: string;
  borrowerName?: string;
  borrowerStudentNumber?: string;

  rentalDurationDays?: number;
  rentalDateLabel?: string;
  returnDueDateLabel?: string;

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
  itemUnitName,
  rentalDurationDays,
  rentalDateLabel,
  returnDueDateLabel,
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
            <p>[Retrivr]</p>
            <br />
            <p>대여 물품</p>
            <p>{itemNameWithCount ?? "-"}</p>
            <br />
            {itemUnitName?.trim() ? <p>물품 상세 {itemUnitName}</p> : null}
            <p>
              대여 기간{" "}
              {Number.isFinite(rentalDurationDays) &&
              (rentalDurationDays ?? 0) > 0
                ? `${rentalDurationDays}일`
                : "-"}
            </p>
            <p>대여 일시 {rentalDateLabel ?? "-"}</p>
            <p>반납 기한 {returnDueDateLabel ?? "-"}</p>
            <br />
            <p>[연체 안내]</p>
            <p>
              {organizationName ?? "해당 단체"}에서 빌려가신 물품의 반납 기한이
              지났어요.
            </p>
            <p>빠른 반납 부탁드릴게요.</p>
            <br />
            <p>※ 미반납 시 추가 안내가 진행될 수 있어요.</p>
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
