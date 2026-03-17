import { useState } from "react";
import { Modal } from "../../../Modal";
import CustomCheckBox from "../../../CustomCheckbox";
import Button from "../../../Button";
import {
  useApproveAdminRental,
  useRejectAdminRental,
} from "../../../../hooks/queries/useAdminQueries";

interface ShortRentalApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentalId: number;
  itemData: {
    name: string;
    borrower: string;
    duration: string;
  };
}

export const ShortRentalApprovalModal = ({
  isOpen,
  onClose,
  rentalId,
  // itemData,
}: ShortRentalApproveModalProps) => {
  const [adminName, setAdminName] = useState("");
  const [isGuaranteedChecked, setIsGuaranteedChecked] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutate: approveRental, isPending: isApproving } =
    useApproveAdminRental();
  const { mutate: rejectRental, isPending: isRejecting } =
    useRejectAdminRental();

  const isMutating = isApproving || isRejecting;
  const canSubmit = isGuaranteedChecked && !!adminName.trim() && !isMutating;

  const handleApprove = () => {
    if (!canSubmit) return;
    approveRental(
      { rentalId, adminNameToApprove: adminName.trim() },
      {
        onSuccess: () => {
          (alert("대여 요청 승인이 완료되었습니다."), onClose);
        },
        onError: () =>
          setSubmitError("대여 요청 승인에 실패했습니다. 다시 시도해주세요."),
      },
    );
  };

  const handleReject = () => {
    if (!canSubmit) return;
    rejectRental(
      { rentalId, adminNameToReject: adminName.trim() },
      {
        onSuccess: () => {
          (alert("대여 요청 거절이 완료되었습니다."), onClose);
        },
        onError: () =>
          setSubmitError("대여 요청 거절에 실패했습니다. 다시 시도해주세요."),
      },
    );
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="요청을 승인하시겠어요?">
      <div className="flex flex-col pt-7 gap-4 font-[Pretendard]">
        {/* 보증 물품을 확인했어요 체크 박스 */}
        <div className="flex w-full h-16 justify-between items-center px-5 py-3.5  border border-neutral-gray-5 rounded-[10px]">
          <div className="">
            <div>
              <span className="text-14px text-neutral-gray-1 font-bold">
                보증 물품을 확인했어요.
              </span>
              <span className="text-14px text-primary font-bold ml-1">*</span>
            </div>
            <p className=""></p>
          </div>
          <CustomCheckBox
            checked={isGuaranteedChecked}
            onCheckedChange={(checked) => setIsGuaranteedChecked(checked)}
          />
        </div>

        {/* 2. 승인 관리자 입력 */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-14px font-bold text-neutral-gray-1">
              승인 관리자 입력{" "}
              <span className="text-14px text-primary font-700 ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="w-full h-12 px-3.5 py-3 bg-[#F8F9F9] align-center rounded-small placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
            />
          </div>
        </div>

        {/* 3. 하단 버튼 영역 */}
        {submitError && <p className="text-12px text-red">{submitError}</p>}
        <div className="flex gap-3 mt-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleReject}
            disabled={!canSubmit}
          >
            거부
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleApprove}
            disabled={!canSubmit}
          >
            {isApproving ? "승인 중..." : "승인"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
