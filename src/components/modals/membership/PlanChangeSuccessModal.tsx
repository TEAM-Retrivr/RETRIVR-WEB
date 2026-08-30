import { Modal } from "../../Modal";
import type { VoucherBillingCycle } from "../../../types/voucherPayment";

type PlanChangeSuccessModalProps = {
  isOpen: boolean;
  targetCycle: VoucherBillingCycle;
  startDateLabel?: string;
  onClose: () => void;
};

const CYCLE_LABEL: Record<VoucherBillingCycle, string> = {
  monthly: "월간",
  yearly: "연간",
};

const PlanChangeSuccessModal = ({
  isOpen,
  targetCycle,
  startDateLabel,
  onClose,
}: PlanChangeSuccessModalProps) => {
  const targetLabel = CYCLE_LABEL[targetCycle];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showTitle={false}
      showCloseButton={false}
      modalClassName="!w-[338px] !rounded-[24px] !px-6 !pt-9 !pb-6 shadow-[0_0_16px_-6px_rgba(0,0,0,0.2)]"
    >
      <div className="flex w-full flex-col items-center font-[Pretendard]">
        <img
          src="/icons/modal-check.svg"
          alt=""
          width={34}
          height={34}
          className="size-[34px]"
          aria-hidden
        />

        <p className="mt-4 text-center text-20px font-semibold leading-[1.4] text-secondary-1">
          {targetLabel} 구독 변경이 예약되었어요
        </p>
        <p className="mt-1 text-center text-14px font-normal leading-[1.4] text-primary">
          {startDateLabel
            ? `${targetLabel} 구독은 다음 결제일인`
            : `${targetLabel} 구독은 다음 결제일부터 시작됩니다.`}
        </p>
        {startDateLabel ? (
          <p className="text-center text-14px font-normal leading-[1.4] text-primary">
            {startDateLabel}부터 시작됩니다.
          </p>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="mt-10 flex h-12 w-full max-w-[290px] items-center justify-center rounded-[12px] bg-primary text-18px font-bold text-neutral-white shadow-[0_0_4px_rgba(181,244,255,0.5)] cursor-pointer hover:bg-secondary-2 transition-colors"
        >
          확인
        </button>
      </div>
    </Modal>
  );
};

export default PlanChangeSuccessModal;
