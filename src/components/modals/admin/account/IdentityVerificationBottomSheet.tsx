import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import axios from "axios";
import BottomSheet from "../../../BottomSheet";
import CommonInput from "../../../CommonInput";
import Button from "../../../Button";
import ProfileChangeExitConfirmModal from "./ProfileChangeExitConfirmModal";
import { useVerifyAdminPassword } from "../../../../hooks/queries/useAuthQueries";
import type {
  AdminPasswordVerificationPurpose,
  VerifyAdminPasswordErrorResponse,
} from "../../../../api/auth/auth.type";

export type IdentityVerificationBottomSheetHandle = {
  requestClose: () => void;
};

type IdentityVerificationBottomSheetProps = {
  isOpen: boolean;
  purpose: AdminPasswordVerificationPurpose;
  onClose: () => void;
  onVerified: (verificationToken: string, expiresIn: number) => void;
};

const IdentityVerificationBottomSheet = forwardRef<
  IdentityVerificationBottomSheetHandle,
  IdentityVerificationBottomSheetProps
>(({ isOpen, purpose, onClose, onVerified }, ref) => {
  const [password, setPassword] = useState("");
  const [isMismatch, setIsMismatch] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const verifyRequestIdRef = useRef(0);
  const { mutate: verifyPassword, isPending } = useVerifyAdminPassword();

  const handleRequestClose = () => {
    setIsExitModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    requestClose: handleRequestClose,
  }));

  useEffect(() => {
    if (!isOpen) {
      verifyRequestIdRef.current += 1;
      setPassword("");
      setIsMismatch(false);
      setIsExitModalOpen(false);
    }
  }, [isOpen]);

  const handleConfirmExit = () => {
    verifyRequestIdRef.current += 1;
    setIsExitModalOpen(false);
    onClose();
  };

  const handleVerify = () => {
    const trimmed = password.trim();
    if (!trimmed || isPending) return;

    const requestId = ++verifyRequestIdRef.current;

    verifyPassword(
      { password: trimmed, purpose },
      {
        onSuccess: (data) => {
          if (requestId !== verifyRequestIdRef.current) return;
          if (!data.verificationToken) {
            alert("본인 확인에 실패했습니다. 다시 시도해주세요.");
            return;
          }
          setIsMismatch(false);
          onVerified(data.verificationToken, data.expiresIn);
        },
        onError: (error) => {
          if (requestId !== verifyRequestIdRef.current) return;
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data as
              | VerifyAdminPasswordErrorResponse
              | undefined;
            if (status === 400) {
              setIsMismatch(true);
              return;
            }
            if (status === 401 || status === 403) {
              alert(
                data?.message ??
                  "세션이 만료되었습니다. 다시 로그인한 뒤 시도해주세요.",
              );
              return;
            }
            alert(
              data?.message ??
                "본인 확인에 실패했습니다. 다시 시도해주세요.",
            );
            return;
          }
          alert("본인 확인에 실패했습니다. 다시 시도해주세요.");
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
