import { Modal } from "../../../Modal";
import Button from "../../../Button";

interface WithdrawCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

/** 탈퇴 API 성공 후 완료 안내 모달 */
const WithdrawCompleteModal = ({
  isOpen,
  onClose,
  onConfirm,
}: WithdrawCompleteModalProps) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showTitle={false}
      showCloseButton={false}
      modalClassName="!w-[338px] !rounded-[24px] !px-4 !pt-10 !pb-6 shadow-[0_0_16px_-6px_rgba(0,0,0,0.2)]"
    >
      <div className="flex w-full flex-col items-center font-[Pretendard]">
        <div className="flex min-h-[98px] flex-col items-center justify-center gap-4 px-2">
          <img
            src="/icons/withdraw-complete-check.svg"
            alt=""
            className="h-8.5 w-8.5"
          />
          <p className="text-center text-20px font-semibold leading-[140%] text-neutral-gray-1">
            탈퇴가 완료되었습니다
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="mt-6 h-12 max-w-[290px] rounded-[12px] text-18px shadow-[0_0_4px_rgba(181,244,255,0.5)]"
          onClick={handleConfirm}
        >
          확인
        </Button>
      </div>
    </Modal>
  );
};

export default WithdrawCompleteModal;
