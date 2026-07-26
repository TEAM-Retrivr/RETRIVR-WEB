import { useEffect, useEffectEvent } from "react";
import { Modal } from "../../../Modal";

const AUTO_CLOSE_MS = 1500;

type ProfileChangeCompleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
};

const ProfileChangeCompleteModal = ({
  isOpen,
  onClose,
  message = "변경이 완료되었어요",
}: ProfileChangeCompleteModalProps) => {
  const handleAutoClose = useEffectEvent(() => {
    onClose();
  });

  useEffect(() => {
    if (!isOpen) return;
    const timerId = window.setTimeout(() => {
      handleAutoClose();
    }, AUTO_CLOSE_MS);
    return () => window.clearTimeout(timerId);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showTitle={false}
      showCloseButton={false}
      modalClassName="!w-[338px] !rounded-[24px] !px-6 !py-9 shadow-[0_0_16px_-6px_rgba(0,0,0,0.2)]"
    >
      <div className="flex w-full flex-col items-center gap-4 font-[Pretendard]">
        <img
          src="/icons/modal-check.svg"
          alt=""
          width={34}
          height={34}
          className="size-[34px]"
          aria-hidden
        />
        <p className="text-center text-20px font-semibold leading-[1.4] text-neutral-gray-1">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ProfileChangeCompleteModal;
