import { Modal } from "../../Modal";
import Button from "../../Button";
import type { VoucherBillingCycle } from "../../../types/voucherPayment";

type PlanChangeConfirmModalProps = {
  isOpen: boolean;
  isPending?: boolean;
  targetCycle: VoucherBillingCycle;
  amountLabel: string;
  onClose: () => void;
  onConfirm: () => void;
};

const CYCLE_LABEL: Record<VoucherBillingCycle, string> = {
  monthly: "월간",
  yearly: "연간",
};

const PlanChangeConfirmModal = ({
  isOpen,
  isPending = false,
  targetCycle,
  amountLabel,
  onClose,
  onConfirm,
}: PlanChangeConfirmModalProps) => {
  const targetLabel = CYCLE_LABEL[targetCycle];
  const currentLabel = targetCycle === "yearly" ? "월간" : "연간";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showTitle={false}
      showCloseButton={false}
      modalClassName="!w-[338px] !rounded-[24px] !px-4 !pt-9 !pb-6 shadow-[0_0_16px_-6px_rgba(0,0,0,0.2)]"
    >
      <div className="flex w-full flex-col items-center font-[Pretendard]">
        <p className="text-center text-20px font-semibold leading-[1.4] text-secondary-1">
          {targetLabel} 구독으로 변경할까요?
        </p>
        <p className="mt-3 text-center text-14px font-normal leading-[1.4] text-primary">
          현재 {currentLabel} 구독은 남은 기간까지 이용할 수 있어요.
        </p>
        <p className="mt-1.5 text-center text-14px font-normal leading-[1.4] text-primary">
          다음 결제일에{" "}
          <span className="font-bold">
            {targetLabel} 구독료 {amountLabel}
          </span>
          이 결제되며, {targetLabel} 구독으로 자동 변경됩니다.
        </p>

        <div className="mt-6 flex h-12 w-full gap-2">
          <Button
            variant="outline"
            size="md"
            className="h-12 max-w-none flex-1 rounded-[12px] text-18px"
            disabled={isPending}
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="md"
            className="h-12 max-w-none flex-1 rounded-[12px] text-18px shadow-[0_0_4px_rgba(181,244,255,0.5)]"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "예약 중..." : "변경 예약하기"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PlanChangeConfirmModal;
