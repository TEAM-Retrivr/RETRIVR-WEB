import { Modal } from "../../Modal";
import Button from "../../Button";

type SubscriptionCancelModalProps = {
  isOpen: boolean;
  isPending?: boolean;
  expireAtLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
};

const SubscriptionCancelModal = ({
  isOpen,
  isPending = false,
  expireAtLabel,
  onClose,
  onConfirm,
}: SubscriptionCancelModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    showTitle={false}
    showCloseButton={false}
    modalClassName="!w-[338px] !rounded-[24px] !px-4 !pt-9 !pb-6 shadow-[0_0_16px_-6px_rgba(0,0,0,0.2)]"
  >
    <div className="flex w-full flex-col items-center font-[Pretendard]">
      <p className="text-center text-20px font-semibold leading-[1.4] text-secondary-1">
        구독을 해지하시겠어요?
      </p>
      <p className="mt-3 whitespace-pre-line text-center text-14px font-normal leading-[1.4] text-primary">
        {expireAtLabel
          ? `${expireAtLabel}까지 이용하실 수 있으며,\n이후에는 자동결제되지 않아요.`
          : "해지해도 현재 이용권은 만료일까지 사용할 수 있어요."}
      </p>

      <div className="mt-6 flex h-12 w-full gap-2">
        <Button
          variant="outline"
          size="md"
          className="h-12 max-w-none flex-1 rounded-[12px] text-18px"
          disabled={isPending}
          onClick={onClose}
        >
          구독 유지
        </Button>
        <Button
          variant="primary"
          size="md"
          className="h-12 max-w-none flex-1 rounded-[12px] text-18px shadow-[0_0_4px_rgba(181,244,255,0.5)]"
          disabled={isPending}
          onClick={onConfirm}
        >
          {isPending ? "해지 중..." : "해지하기"}
        </Button>
      </div>
    </div>
  </Modal>
);

export default SubscriptionCancelModal;
