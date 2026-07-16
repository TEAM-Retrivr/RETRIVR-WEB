import { Modal } from "../../../Modal";
import Button from "../../../Button";

interface WithdrawPasswordMismatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

/** 탈퇴 2단계 비밀번호 확인 실패 모달 (확인하기 — 추후 API 연동) */
const WithdrawPasswordMismatchModal = ({
  isOpen,
  onClose,
  onConfirm,
}: WithdrawPasswordMismatchModalProps) => {
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
        <div className="flex min-h-[98px] flex-col items-center justify-center px-2">
          <p className="text-center text-20px font-semibold leading-[140%] text-neutral-gray-1">
            비밀번호가 일치하지 않습니다.
            <br />
            다시 확인해주세요.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="mt-6 h-12 max-w-[290px] rounded-[12px] text-18px shadow-[0_0_4px_rgba(181,244,255,0.5)]"
          onClick={handleConfirm}
        >
          확인하기
        </Button>
      </div>
    </Modal>
  );
};

export default WithdrawPasswordMismatchModal;
