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
import {
  useSendAdminEmailCode,
  useVerifyAdminEmailCode,
} from "../../../../hooks/queries/useAuthQueries";
import type {
  AdminEmailVerificationErrorResponse,
} from "../../../../api/auth/auth.type";
import { ADMIN_EMAIL_VERIFICATION_ERROR_CODE } from "../../../../api/auth/auth.type";

export type EmailChangeBottomSheetHandle = {
  requestClose: () => void;
};

type EmailChangeBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  /** 이메일 변경(검증) 성공 후 호출. 호출측에서 로그아웃 처리한다. */
  onChanged: (email: string) => void;
  /** EMAIL_CHANGE 목적 비밀번호 인증 토큰 (RTR-321에서 발급) */
  passwordVerificationToken: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
>(({ isOpen, onClose, onChanged, passwordVerificationToken }, ref) => {
  const [newEmail, setNewEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [hasRequestedCode, setHasRequestedCode] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [codeMismatchError, setCodeMismatchError] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
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
      setEmailFormatError(false);
      setCodeMismatchError(false);
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
    sendRequestIdRef.current += 1;
    verifyRequestIdRef.current += 1;
    setIsExitModalOpen(false);
    onClose();
  };

  const trimmedEmail = newEmail.trim();
  const isEmailFormatValid = EMAIL_PATTERN.test(trimmedEmail);
  const canSendCode =
    trimmedEmail.length > 0 &&
    isEmailFormatValid &&
    Boolean(passwordVerificationToken) &&
    !isTimerActive &&
    !isSendingCode;
  const canVerifyCode =
    isTimerActive &&
    timeLeft > 0 &&
    authCode.trim().length > 0 &&
    Boolean(passwordVerificationToken) &&
    !codeMismatchError &&
    !isVerifyingCode;

  const handleSendCode = () => {
    if (!trimmedEmail) return;
    if (!isEmailFormatValid) {
      setEmailFormatError(true);
      return;
    }
    if (!passwordVerificationToken) {
      alert("본인 확인이 필요합니다. 다시 시도해주세요.");
      return;
    }

    const requestId = ++sendRequestIdRef.current;
    verifyRequestIdRef.current += 1;
    setCodeMismatchError(false);

    sendCode(
      {
        email: trimmedEmail,
        passwordVerificationToken,
      },
      {
        onSuccess: (data) => {
          if (requestId !== sendRequestIdRef.current) return;
          setHasRequestedCode(true);
          setTimeLeft(data.expiresInSeconds);
          setIsTimerActive(true);
          setAuthCode("");
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
    const code = authCode.trim();
    if (!code || !trimmedEmail || !passwordVerificationToken) return;

    const requestId = ++verifyRequestIdRef.current;

    // 검증 성공 시 이메일이 변경되고 세션이 만료되므로 호출측에서 로그아웃한다
    verifyCode(
      {
        email: trimmedEmail,
        code,
        passwordVerificationToken,
      },
      {
        onSuccess: () => {
          // 세션을 만료시키는 성공은 시트 닫힘/취소와 무관하게 반드시 로그아웃한다
          setIsTimerActive(false);
          setCodeMismatchError(false);
          onChanged(trimmedEmail);
          onClose();
        },
        onError: (error) => {
          if (requestId !== verifyRequestIdRef.current) return;
          if (axios.isAxiosError(error)) {
            const data = error.response?.data as
              | AdminEmailVerificationErrorResponse
              | undefined;
            const code = data?.code;
            const isKnownNonMismatch =
              code ===
                ADMIN_EMAIL_VERIFICATION_ERROR_CODE.REQUEST_NOT_FOUND ||
              code ===
                ADMIN_EMAIL_VERIFICATION_ERROR_CODE.TOO_MANY_REQUESTS;

            if (isKnownNonMismatch || error.response?.status !== 400) {
              alert(
                data?.message ??
                  "이메일 변경에 실패했습니다. 다시 시도해주세요.",
              );
              return;
            }

            // 400 중 인증번호 불일치로 취급
            setCodeMismatchError(true);
            return;
          }
          alert("이메일 변경에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleRequestClose}
        title="이메일 변경"
        description="변경 시 이메일 인증이 필요해요. 변경 후 다시 로그인해야 합니다."
        sheetClassName="h-[612px] max-h-full"
        footer={
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="h-12.5 w-full max-w-none rounded-[23.164px] shadow-primary text-18px"
            disabled={!canVerifyCode}
            onClick={handleVerifyCode}
          >
            {isVerifyingCode ? "변경 중..." : "변경하기"}
          </Button>
        }
      >
        <div className="flex w-full flex-col gap-2.5 font-[Pretendard] text-neutral-gray-1">
          <p className="px-0.5 text-14px font-bold">이메일</p>

          <div className="flex w-full items-center gap-1">
            <div className="min-w-0 flex-1">
              <CommonInput
                type="email"
                value={newEmail}
                onChange={(event) => {
                  setNewEmail(event.target.value);
                  setEmailFormatError(false);
                }}
                onBlur={() => {
                  if (trimmedEmail && !isEmailFormatValid) {
                    setEmailFormatError(true);
                  }
                }}
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
              disabled={!canSendCode}
            >
              {isSendingCode
                ? "전송 중..."
                : hasRequestedCode
                  ? "재전송"
                  : "인증번호 전송"}
            </Button>
          </div>

          {emailFormatError ? (
            <p className="text-12px font-normal leading-[1.3] text-secondary-2">
              이메일 형식이 올바르지 않아요. 다시 입력해주세요.
            </p>
          ) : null}

          <div className="relative flex w-full items-center gap-1">
            <div className="relative min-w-0 flex-1">
              <CommonInput
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={authCode}
                onChange={(event) => {
                  setAuthCode(event.target.value.replace(/\D/g, ""));
                  setCodeMismatchError(false);
                }}
                placeholder="인증번호 입력"
                disabled={!isTimerActive}
                className="h-12 max-w-none rounded-xl px-3.5 pr-14 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] placeholder:text-neutral-gray-3"
              />
              {isTimerActive && timeLeft > 0 ? (
                <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-14px text-secondary-2">
                  {formatTime(timeLeft)}
                </span>
              ) : null}
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="h-11.5 w-25 shrink-0 rounded-xl text-14px font-semibold"
              onClick={handleVerifyCode}
              disabled={!canVerifyCode}
            >
              {isVerifyingCode ? "확인 중..." : "인증번호 확인"}
            </Button>
          </div>

          {codeMismatchError ? (
            <p className="text-12px font-normal leading-[1.3] text-secondary-2">
              인증번호가 일치하지 않아요
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

EmailChangeBottomSheet.displayName = "EmailChangeBottomSheet";

export default EmailChangeBottomSheet;
