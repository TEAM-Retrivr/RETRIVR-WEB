import { Modal } from "../../Modal";
import Button from "../../Button";
import type { PaymentMethod } from "../../../types/paymentMethod";

type PaymentMethodDeleteModalProps = {
  isOpen: boolean;
  paymentMethod: PaymentMethod | null;
  onClose: () => void;
  onConfirm: () => void;
};

const PaymentMethodDeleteModal = ({
  isOpen,
  paymentMethod,
  onClose,
  onConfirm,
}: PaymentMethodDeleteModalProps) => {
  if (!paymentMethod) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showTitle={false}
      showCloseButton={false}
      modalClassName="!w-[338px] !rounded-[24px] !px-4 !pt-10 !pb-6 shadow-[0_0_16px_-6px_rgba(0,0,0,0.2)]"
    >
      <div className="flex w-full flex-col items-center font-[Pretendard]">
        <p className="text-center text-20px font-semibold leading-[1.4] text-secondary-1">
          결제수단을 삭제하시겠어요?
        </p>

        <div className="mt-4 flex w-full max-w-[274px] flex-col rounded-[7.5px] border border-[#e6eaed] bg-neutral-white px-[18px] py-3">
          <p className="text-12px font-bold leading-[1.5] text-neutral-gray-1">
            {paymentMethod.name}
          </p>
          {paymentMethod.maskedNumber ? (
            <p className="text-12px font-normal leading-[1.4] text-neutral-gray-1">
              {paymentMethod.maskedNumber}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex h-12 w-full gap-2">
          <Button
            variant="outline"
            size="md"
            className="h-12 max-w-none flex-1 rounded-[12px] text-18px"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="md"
            className="h-12 max-w-none flex-1 rounded-[12px] text-18px shadow-[0_0_4px_rgba(181,244,255,0.5)]"
            onClick={onConfirm}
          >
            삭제하기
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentMethodDeleteModal;
