import { Modal } from "../../../Modal";
import Button from "../../../Button";

type EmailChangeExitConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
};

const EmailChangeExitConfirmModal = ({
  isOpen,
  onClose,
  onConfirmExit,
}: EmailChangeExitConfirmModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showTitle={false}
      showCloseButton={false}
      modalClassName="!w-[338px] !rounded-[24px] !px-4 !pt-10 !pb-6 shadow-[0_0_16px_-6px_rgba(0,0,0,0.2)]"
    >
      <div className="flex w-full flex-col items-center font-[Pretendard]">
        <div className="flex min-h-[98px] flex-col items-center justify-center gap-3 px-2">
          <p className="text-center text-20px font-semibold leading-[140%] text-secondary-1">
            이메일 변경을 종료하시겠어요?
          </p>
          <p className="text-center text-14px font-normal leading-[140%] text-primary">
            지금 나가시면
            <br />
            작성한 내용이 저장되지 않아요!
          </p>
        </div>

        <div className="mt-6 flex h-12 w-full gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="h-12 max-w-none flex-1 rounded-[12px] text-18px"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="h-12 max-w-none flex-1 rounded-[12px] text-18px shadow-[0_0_4px_rgba(181,244,255,0.5)]"
            onClick={onConfirmExit}
          >
            나가기
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EmailChangeExitConfirmModal;
