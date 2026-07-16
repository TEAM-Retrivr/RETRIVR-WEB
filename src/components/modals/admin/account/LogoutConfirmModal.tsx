import { Modal } from "../../../Modal";
import Button from "../../../Button";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const LogoutConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutConfirmModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      // 로그아웃 요청 중에는 배경 클릭으로 모달이 닫히지 않도록 막는다
      // (닫혀도 진행 중인 로그아웃은 계속되어 세션이 정리되기 때문)
      onClose={isLoading ? () => {} : onClose}
      showTitle={false}
      showCloseButton={false}
      modalClassName="!w-[338px] !rounded-[24px] !px-4 !pt-10 !pb-6 shadow-[0_0_16px_-6px_rgba(0,0,0,0.2)]"
    >
      <div className="flex w-full flex-col items-center font-[Pretendard]">
        <div className="flex min-h-[98px] flex-col items-center justify-center gap-3 px-2">
          <p className="text-center text-20px font-semibold leading-[140%] text-secondary-1">
            로그아웃 하시겠어요?
          </p>
          <p className="text-center text-14px font-normal leading-[140%] text-primary">
            서비스를 이용하려면
            <br />
            다시 로그인이 필요해요
          </p>
        </div>

        <div className="mt-6 flex h-12 w-full gap-2">
          <Button
            variant="outline"
            size="md"
            className="h-12 max-w-none flex-1 rounded-[12px] text-18px"
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="md"
            className="h-12 max-w-none flex-1 rounded-[12px] text-18px shadow-[0_0_4px_rgba(181,244,255,0.5)]"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "로그아웃 중..." : "로그아웃"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmModal;
