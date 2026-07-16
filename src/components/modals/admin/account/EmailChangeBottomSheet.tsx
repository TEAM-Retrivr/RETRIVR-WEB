import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import BottomSheet from "../../../BottomSheet";
import CommonInput from "../../../CommonInput";
import Button from "../../../Button";
import EmailChangeExitConfirmModal from "./EmailChangeExitConfirmModal";

export type EmailChangeBottomSheetHandle = {
  /** 종료 확인 모달을 연다 (Header 뒤로가기 등 외부 이탈용) */
  requestClose: () => void;
};

type EmailChangeBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  /** 인증 완료 시 변경된 이메일 */
  onVerified?: (email: string) => void;
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

  const handleRequestClose = () => {
    setIsExitModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    requestClose: handleRequestClose,
  }));

  useEffect(() => {
    if (!isOpen) {
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
    if (!newEmail.trim()) {
      alert("변경할 이메일을 입력해주세요.");
      return;
    }

    // TODO: 이메일 변경용 인증번호 전송 API 연동
    setHasRequestedCode(true);
    setTimeLeft(600);
    setIsTimerActive(true);
    setAuthCode("");
    alert("이메일로 인증 코드가 전송되었습니다.");
  };

  const handleVerifyCode = () => {
    if (!authCode.trim()) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    // TODO: 이메일 변경용 인증번호 확인 API 연동
    onVerified?.(newEmail.trim());
    onClose();
  };

  const canConfirm =
    isTimerActive && timeLeft > 0 && authCode.trim().length > 0;

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
              disabled={!newEmail.trim() || isTimerActive}
            >
              {hasRequestedCode ? "재전송" : "인증번호 전송"}
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
              인증번호 확인
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
