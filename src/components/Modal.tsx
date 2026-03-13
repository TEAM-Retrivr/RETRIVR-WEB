import { createPortal } from "react-dom";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // 모달 상단 제목
  children: ReactNode; // 각 모달 내용
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 박스 */}
      <div className="relative z-[1000] w-84.5 bg-white rounded-[28px] pt-8 pb-6 px-4 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* 헤더: 제목과 닫기 버튼 */}
        <div className="items-center font-[Pretendard]">
          <p className="text-24px font-bold text-secondary-1 text-center">
            {title}
          </p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-6 right-5 text-neutral-gray transition-colors cursor-pointer"
        >
          <img src="/icons/X.svg" alt="닫기" />
        </button>
        {/* 모달 내용 */}
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")!,
  );
};
