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
import EmailChangeExitConfirmModal from "./EmailChangeExitConfirmModal";
import {
  useSendAdminEmailCode,
  useVerifyAdminEmailCode,
} from "../../../../hooks/queries/useAuthQueries";
import type { AdminEmailVerificationErrorResponse } from "../../../../api/auth/auth.type";

export type EmailChangeBottomSheetHandle = {
  /** 종료 확인 모달을 연다 (Header 뒤로가기 등 외부 이탈용) */
  requestClose: () => void;
};

export type EmailChangeVerifiedPayload = {
  email: string;
  token: string;
};

type EmailChangeBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  /** 인증 완료 시 변경된 이메일 + 검증 토큰 */
  onVerified?: (payload: EmailChangeVerifiedPayload) => void;
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const EmailChangeBottomSheet = forwardRef<
  EmailChangeBottomSheetHandle,
  EmailChangeBottomSheetProps
>(({ isOpen, onClose, onVerified }, ref) => {
  const [newEmail, setNewEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [hasRequestedCode, setHasRequestedCode] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  /** 시트 닫힘/재요청 시 in-flight 콜백을 무효화 */
  const sendRequestIdRef = useRef(0);
  const verifyRequestIdRef = useRef(0);

  const { mutate: sendCode, isPending: isSendingCode } = useSendAdminEmailCode();
  const { mutate: verifyCode, isPending: isVerifyingCode } =
    useVerifyAdminEmailCode();

  const handleRequestClose = () => {
    setIsExitModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    requestClose: handleRequestClose,
  }));

  useEffect(() => {
    if (!isOpen) {
      sendRequestIdRef.current += 1;
      verifyRequestIdRef.current += 1;
      setNewEmail("");
      setAuthCode("");
      setTimeLeft(0);
      setIsTimerActive(false);
      setHasRequestedCode(false);
      setIsExitModalOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) {
      if (timeLeft <= 0) setIsTimerActive(false);
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isTimerActive, timeLeft]);

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    onClose();
  };

  const handleSendCode = () => {
    const email = newEmail.trim();
    if (!email) {
      alert("변경할 이메일을 입력해주세요.");
      return;
    }

    const requestId = ++sendRequestIdRef.current;
    // 재전송 시 진행 중인 검증 콜백도 무효화
    verifyRequestIdRef.current += 1;

    sendCode(
      { email, purpose: "EMAIL_CHANGE" },
      {
        onSuccess: (data) => {
          // 시트 닫힘/재전송으로 무효화된 응답은 무시
          if (requestId !== sendRequestIdRef.current) return;
          setHasRequestedCode(true);
          setTimeLeft(data.expiresInSeconds);
          setIsTimerActive(true);
          setAuthCode("");
          alert("이메일로 인증 코드가 전송되었습니다.");
        },
        onError: (error) => {
          if (requestId !== sendRequestIdRef.current) return;
          if (axios.isAxiosError(error)) {
            const data = error.response?.data as
              | AdminEmailVerificationErrorResponse
              | undefined;
            if (data?.message) {
              alert(data.message);
              return;
            }
          }
          alert("인증 코드 전송에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

  const handleVerifyCode = () => {
    const email = newEmail.trim();
    const code = authCode.trim();
    if (!code) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    if (!email) {
      alert("변경할 이메일을 입력해주세요.");
      return;
    }

    const requestId = ++verifyRequestIdRef.current;

    verifyCode(
      { email, purpose: "EMAIL_CHANGE", code },
      {
        onSuccess: (data) => {
          if (requestId !== verifyRequestIdRef.current) return;
          if (!data.token) {
            alert("인증 토큰 발급에 실패했습니다. 다시 시도해주세요.");
            return;
          }
          alert("이메일 인증이 완료되었습니다.");
          setIsTimerActive(false);
          onVerified?.({ email, token: data.token });
          onClose();
        },
        onError: (error) => {
          if (requestId !== verifyRequestIdRef.current) return;
          if (axios.isAxiosError(error)) {
            const data = error.response?.data as
              | AdminEmailVerificationErrorResponse
              | undefined;
            if (data?.message) {
              alert(data.message);
              return;
            }
          }
          alert("인증 코드 확인에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

  const canConfirm =
    isTimerActive &&
    timeLeft > 0 &&
    authCode.trim().length > 0 &&
    !isVerifyingCode;

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleRequestClose}
        title="이메일 변경"
        description="변경 시 이메일 인증이 필요해요"
        sheetClassName="h-[612px] max-h-full"
      >
        <div className="flex w-full flex-col gap-2.5 font-[Pretendard] text-neutral-gray-1">
          <p className="px-0.5 text-14px font-bold">이메일</p>

          <div className="flex w-full items-center gap-1">
            <div className="min-w-0 flex-1">
              <CommonInput
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="변경할 이메일을 입력해주세요"
                className="h-12 max-w-none rounded-xl px-3.5 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] placeholder:text-neutral-gray-3"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="h-11.5 w-25 shrink-0 rounded-xl text-14px font-semibold"
              onClick={handleSendCode}
              disabled={!newEmail.trim() || isTimerActive || isSendingCode}
            >
              {isSendingCode
                ? "전송 중..."
                : hasRequestedCode
                  ? "재전송"
                  : "인증번호 전송"}
            </Button>
          </div>

          <div className="relative flex w-full items-center gap-1">
            <div className="relative min-w-0 flex-1">
              <CommonInput
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ""))}
                placeholder="인증번호 입력"
                disabled={!isTimerActive}
                className="h-12 max-w-none rounded-xl px-3.5 pr-14 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] placeholder:text-neutral-gray-3"
              />
              {isTimerActive && timeLeft > 0 && (
                <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-14px text-secondary-2">
                  {formatTime(timeLeft)}
                </span>
              )}
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="h-11.5 w-25 shrink-0 rounded-xl text-14px font-semibold"
              onClick={handleVerifyCode}
              disabled={!canConfirm}
            >
              {isVerifyingCode ? "확인 중..." : "인증번호 확인"}
            </Button>
          </div>
        </div>
      </BottomSheet>

      <EmailChangeExitConfirmModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirmExit={handleConfirmExit}
      />
    </>
  );
});

EmailChangeBottomSheet.displayName = "EmailChangeBottomSheet";

export default EmailChangeBottomSheet;
