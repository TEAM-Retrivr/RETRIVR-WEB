import type { ReactNode } from "react";
import { Modal } from "../../Modal";

type CouponAlertModalProps = {
  isOpen: boolean;
  message: ReactNode;
  confirmText?: string;
  onClose: () => void;
};

const CouponAlertModal = ({
  isOpen,
  message,
  confirmText = "확인",
  onClose,
}: CouponAlertModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    showTitle={false}
    showCloseButton={false}
    modalClassName="!w-[338px] !rounded-[24px] !px-6 !pt-16 !pb-6 shadow-[0_0_16px_-6px_rgba(0,0,0,0.2)]"
  >
    <div className="flex w-full flex-col items-center font-[Pretendard]">
      <p className="min-h-[56px] text-center text-20px font-semibold leading-[1.4] text-neutral-gray-1 whitespace-pre-line">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-10 flex h-12 w-full max-w-[290px] items-center justify-center rounded-[12px] bg-primary text-18px font-bold text-neutral-white shadow-[0_0_4px_rgba(181,244,255,0.5)] cursor-pointer hover:bg-secondary-2 transition-colors"
      >
        {confirmText}
      </button>
    </div>
  </Modal>
);

export default CouponAlertModal;
