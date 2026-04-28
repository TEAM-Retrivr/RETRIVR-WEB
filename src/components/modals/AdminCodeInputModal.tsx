import { useEffect, useRef, useState } from "react";
import { Modal } from "../Modal";
import Button from "../Button";
import { useVerifyAdminCode } from "../../hooks/queries/useAdminQueries";

interface AdminCodeInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (rowToken: string) => void;
  rentalId: number;
  codeLength?: number;
}

const AdminCodeInputModal = ({
  isOpen,
  onClose,
  onSuccess,
  rentalId,
  codeLength = 6,
}: AdminCodeInputModalProps) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [adminCode, setAdminCode] = useState<string[]>(
    Array(codeLength).fill(""),
  );
  const [adminCodeError, setAdminCodeError] = useState<string | null>(null);
  const [isErrorHighlightActive, setIsErrorHighlightActive] = useState(false);
  const highlightTimerRef = useRef<number | null>(null);
  const { mutate: verifyCode, isPending: isVerifyingCode } =
    useVerifyAdminCode();

  useEffect(() => {
    if (!isOpen) return;
    setAdminCode(Array(codeLength).fill(""));
    setAdminCodeError(null);
    setIsErrorHighlightActive(false);
  }, [isOpen, codeLength]);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        window.clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  const handleAdminCodeChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setAdminCode((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }
    setAdminCode((prev) => {
      const next = [...prev];
      for (let i = 0; i < digits.length && index + i < codeLength; i++) {
        next[index + i] = digits[i];
      }
      return next;
    });
    const nextIndex = Math.min(index + digits.length, codeLength - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !adminCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredCode = adminCode.join("");
    if (enteredCode.length !== codeLength) {
      triggerErrorState(`관리자 코드를 ${codeLength}자리로 입력해주세요.`);
      return;
    }
    if (!Number.isFinite(rentalId) || rentalId <= 0) {
      triggerErrorState("대여 정보가 없어 관리자 코드를 검증할 수 없습니다.");
      return;
    }

    verifyCode(
      {
        adminCode: enteredCode,
        purpose: "IMMEDIATE_APPROVAL",
        rentalId,
      },
      {
        onSuccess: (data) => {
          setAdminCodeError(null);
          onSuccess(data.rowToken);
        },
        onError: () => {
          triggerErrorState(
            "관리자 코드가 올바르지 않아요. 다시 입력해주세요.",
          );
        },
      },
    );
  };

  const triggerErrorState = (message: string) => {
    setAdminCodeError(message);
    setIsErrorHighlightActive(true);

    if (highlightTimerRef.current) {
      window.clearTimeout(highlightTimerRef.current);
    }

    highlightTimerRef.current = window.setTimeout(() => {
      setIsErrorHighlightActive(false);
    }, 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showTitle={false}
      showCloseButton={false}
      modalClassName="w-84.5 h-60"
    >
      <div className="flex flex-col items-center font-[Pretendard]">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-14px text-primary">관리자만 접근 가능해요</p>
            <p className=" text-24px font-bold text-secondary-1">
              관리자 코드 입력
            </p>
          </div>

          <div className="flex gap-1.5">
            {adminCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={codeLength}
                value={digit}
                onChange={(e) => handleAdminCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`h-10 w-9 rounded-[6px] border bg-[#F8F9F9] text-center text-18px text-secondary-1 font-bold ${
                  isErrorHighlightActive
                    ? "border-red-500"
                    : "border-neutral-gray-5"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-1.5 h-4">
          {adminCodeError && (
            <p className="text-12px text-red-500">{adminCodeError}</p>
          )}
        </div>

        <div className="mt-1 flex w-full justify-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isVerifyingCode}
          >
            취소
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit}>
            {isVerifyingCode ? "검증 중..." : "확인"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminCodeInputModal;
