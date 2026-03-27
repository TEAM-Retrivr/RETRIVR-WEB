import type { ReactNode } from "react";
import { Modal } from "../Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  title = "알림",
  message,
  confirmText = "확인",
  onConfirm,
}: ConfirmModalProps) => {
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
      <div className="flex flex-col px-2 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center gap-5.5 pt-3 pb-9 font-[Pretendard]">
          {/* 체크 아이콘 영역 */}
          <div className="flex justify-center">
            <img src="/icons/modal-check.svg" alt="확인 완료" />
          </div>

          {/* 메시지 영역 */}
          <p className="text-20px font-[600] leading-[140%] text-neutral-gray-1 text-center">
            {message}
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

export default ConfirmModal;
