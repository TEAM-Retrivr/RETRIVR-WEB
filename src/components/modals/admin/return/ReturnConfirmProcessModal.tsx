import { useEffect, useState } from "react";
import { Modal } from "../../../Modal";
import CustomCheckBox from "../../../CustomCheckbox";
import Button from "../../../Button";

interface ReturnConfirmProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adminNameToConfirm: string) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

/** 반납 처리 최종 확인 모달 (보증/물품 상태 체크 + 승인 관리자 입력) */
const ReturnConfirmProcessModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  submitError = null,
}: ReturnConfirmProcessModalProps) => {
  const [isGuaranteedReturned, setIsGuaranteedReturned] = useState(false);
  const [isItemConditionChecked, setIsItemConditionChecked] = useState(false);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setIsGuaranteedReturned(false);
    setIsItemConditionChecked(false);
    setAdminName("");
  }, [isOpen]);

  const canSubmit =
    isGuaranteedReturned &&
    isItemConditionChecked &&
    !!adminName.trim() &&
    !isSubmitting;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="반납 처리를 하시겠어요?">
      <div className="flex w-full flex-col gap-6 mt-6.5">
        {/* 체크 영역 - 보증 물품 반환, 물품 상태 확인 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex h-13 w-full items-center justify-between rounded-[10px] border border-neutral-gray-5 px-5 py-3.5">
            <div>
              <span className="text-14px font-bold text-neutral-gray-1">
                보증 물품을 반환했어요.
              </span>
              <span className="ml-1 text-14px font-bold text-primary">*</span>
            </div>
            <CustomCheckBox
              checked={isGuaranteedReturned}
              onCheckedChange={(checked) => setIsGuaranteedReturned(checked)}
            />
          </div>
          <div className="flex h-13 w-full items-center justify-between rounded-[10px] border border-neutral-gray-5 px-5 py-3.5">
            <div>
              <span className="text-14px font-bold text-neutral-gray-1">
                물품 상태를 확인했어요.
              </span>
              <span className="ml-1 text-14px font-bold text-primary">*</span>
            </div>
            <CustomCheckBox
              checked={isItemConditionChecked}
              onCheckedChange={(checked) => setIsItemConditionChecked(checked)}
            />
          </div>
        </div>

        {/* 승인 관리자 입력 */}
        <div className="flex flex-col gap-2">
          <label className="text-14px font-bold text-neutral-gray-1">
            승인 관리자 입력{" "}
            <span className="ml-0.5 text-14px font-bold text-primary">*</span>
          </label>
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            placeholder="이름을 입력해주세요"
            className="h-12 w-full rounded-small bg-[#F8F9F9] px-3.5 py-3 text-14px text-neutral-gray-1 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] focus:ring-2 focus:ring-secondary-2"
          />
        </div>

        {submitError && <p className="text-12px text-red">{submitError}</p>}

        <div className="flex w-full justify-between">
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
            disabled={!canSubmit}
            onClick={() => {
              if (!canSubmit) return;
              onConfirm(adminName.trim());
            }}
          >
            {isSubmitting ? "반납 중..." : "반납"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReturnConfirmProcessModal;
