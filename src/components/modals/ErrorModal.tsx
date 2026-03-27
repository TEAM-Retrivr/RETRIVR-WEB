import type { ReactNode } from "react";
import { Modal } from "../Modal";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message1: ReactNode;
  message2?: ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
}

export const ErrorModal = ({
  isOpen,
  onClose,
  title = "오류",
  message1,
  message2,
  confirmText = "확인",
  onConfirm,
}: ErrorModalProps) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      showTitle={false}
      showCloseButton={false}
    >
      <div className="flex flex-col items-center gap-10.5 pt-8.5 font-[Pretendard] animate-in zoom-in-95 duration-200">
        {/* 메시지 영역 */}
        <div>
          <p className="text-20px font-[600] leading-[140%] text-neutral-gray-1 text-center whitespace-pre-line">
            {message1}
          </p>
          <p className="text-20px font-[600] leading-[140%] text-neutral-gray-1 text-center whitespace-pre-line">
            {message2}
          </p>
        </div>
        {/* 버튼 영역 */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-12 rounded-[18px] bg-primary text-neutral-white text-20px font-bold shadow-primary cursor-pointer hover:bg-secondary-2 transition-colors"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ErrorModal;
