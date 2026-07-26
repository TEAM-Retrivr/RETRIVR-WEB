import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import BottomSheet from "../../../BottomSheet";
import CommonInput from "../../../CommonInput";
import Button from "../../../Button";
import ProfileChangeExitConfirmModal from "./ProfileChangeExitConfirmModal";
import { useLogin } from "../../../../hooks/queries/useAuthQueries";

export type IdentityVerificationBottomSheetHandle = {
  requestClose: () => void;
};

type IdentityVerificationBottomSheetProps = {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onVerified: () => void;
};

const IdentityVerificationBottomSheet = forwardRef<
  IdentityVerificationBottomSheetHandle,
  IdentityVerificationBottomSheetProps
>(({ isOpen, email, onClose, onVerified }, ref) => {
  const [password, setPassword] = useState("");
  const [isMismatch, setIsMismatch] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const handleRequestClose = () => {
    setIsExitModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    requestClose: handleRequestClose,
  }));

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setIsMismatch(false);
      setIsExitModalOpen(false);
    }
  }, [isOpen]);

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    onClose();
  };

  const handleVerify = () => {
    const trimmed = password.trim();
    if (!trimmed || !email || isPending) return;

    login(
      { email, password: trimmed },
      {
        onSuccess: (data) => {
          if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
          }
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
          }
          setIsMismatch(false);
          onVerified();
        },
        onError: () => {
          setIsMismatch(true);
        },
      },
    );
  };

  const canConfirm = password.trim().length > 0 && !isMismatch && !isPending;

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleRequestClose}
        title="본인 확인"
        description={
          <span className="text-neutral-gray-3">
            보안을 위해 현재 비밀번호를 입력해주세요
          </span>
        }
        sheetClassName="h-[612px] max-h-full"
      >
        <div className="flex w-full flex-col gap-2.5 font-[Pretendard] text-neutral-gray-1">
          <p className="px-0.5 text-14px font-bold">현재 비밀번호 확인</p>

          <div className="flex w-full items-center gap-1">
            <div className="min-w-0 flex-1">
              <CommonInput
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (isMismatch) setIsMismatch(false);
                }}
                placeholder="비밀번호 입력"
                className="h-12 max-w-none rounded-xl px-3.5 text-neutral-gray-1 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] placeholder:text-neutral-gray-3"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="h-11.5 w-25 shrink-0 rounded-xl text-14px font-semibold"
              onClick={handleVerify}
              disabled={!canConfirm}
            >
              {isPending ? "확인 중..." : "확인"}
            </Button>
          </div>

          {isMismatch ? (
            <p className="text-12px font-normal leading-[1.3] text-secondary-2">
              비밀번호가 일치하지 않아요
            </p>
          ) : null}
        </div>
      </BottomSheet>

      <ProfileChangeExitConfirmModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirmExit={handleConfirmExit}
      />
    </>
  );
});

IdentityVerificationBottomSheet.displayName = "IdentityVerificationBottomSheet";

export default IdentityVerificationBottomSheet;
