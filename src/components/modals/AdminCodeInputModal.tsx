import { useEffect, useRef, useState } from "react";
import { Modal } from "../Modal";
import Button from "../Button";
import {
  useVerifyAdminCode,
  useVerifyAdminCodeByAdmin,
} from "../../hooks/queries/useAdminQueries";
import type { AdminVerifyCodeRequestBody } from "../../api/admin/admin.type";

interface AdminCodeInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (rawToken: string) => void;
  rentalId?: number;
  purpose?: AdminVerifyCodeRequestBody["purpose"];
  verificationApiMode?: "public" | "admin";
  codeLength?: number;
}

const AdminCodeInputModal = ({
  isOpen,
  onClose,
  onSuccess,
  rentalId,
  purpose = "IMMEDIATE_APPROVAL",
  verificationApiMode = "public",
  codeLength = 6,
}: AdminCodeInputModalProps) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [adminCode, setAdminCode] = useState<string[]>(
    Array(codeLength).fill(""),
  );
  const [adminCodeError, setAdminCodeError] = useState<string | null>(null);
  const [isErrorHighlightActive, setIsErrorHighlightActive] = useState(false);
  const highlightTimerRef = useRef<number | null>(null);
  const { mutate: verifyCodePublic, isPending: isPublicVerifyingCode } =
    useVerifyAdminCode();
  const { mutate: verifyCodeAdmin, isPending: isAdminVerifyingCode } =
    useVerifyAdminCodeByAdmin();
  const isVerifyingCode = isPublicVerifyingCode || isAdminVerifyingCode;

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

  const handlePaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    const pastedDigits = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedDigits) return;
    e.preventDefault();

    setAdminCode((prev) => {
      const next = [...prev];
      for (
        let i = 0;
        i < pastedDigits.length && index + i < codeLength;
        i += 1
      ) {
        next[index + i] = pastedDigits[i];
      }
      return next;
    });

    const focusIndex = Math.min(index + pastedDigits.length, codeLength - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !adminCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      return;
    }

    // 이미 값이 있는 칸에서 숫자를 입력하면 현재 칸 값을 교체하고 다음 칸으로 이동
    if (/^\d$/.test(e.key) && adminCode[index]) {
      e.preventDefault();
      setAdminCode((prev) => {
        const next = [...prev];
        next[index] = e.key;
        return next;
      });
      const nextIndex = Math.min(index + 1, codeLength - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredCode = adminCode.join("");

    if (enteredCode.length !== codeLength) {
      triggerErrorState(`관리자 코드를 ${codeLength}자리로 입력해주세요.`);
      return;
    }

    const shouldRequireRentalId = purpose === "IMMEDIATE_APPROVAL";
    if (
      shouldRequireRentalId &&
      (!Number.isFinite(rentalId) || (rentalId ?? 0) <= 0)
    ) {
      triggerErrorState("대여 정보가 없어 관리자 코드를 검증할 수 없습니다.");
      return;
    }

    const payload: AdminVerifyCodeRequestBody = shouldRequireRentalId
      ? {
          adminCode: enteredCode,
          purpose,
          rentalId: rentalId as number,
        }
      : {
          adminCode: enteredCode,
          purpose,
        };

    const verifyCode =
      verificationApiMode === "admin" ? verifyCodeAdmin : verifyCodePublic;

    verifyCode(payload, {
      onSuccess: (data) => {
        const verificationToken = data.rawToken;
        if (!verificationToken) {
          triggerErrorState("검증 토큰이 없어 다시 시도해주세요.");
          return;
        }
        setAdminCodeError(null);
        onSuccess(verificationToken);
      },
      onError: () => {
        triggerErrorState("관리자 코드가 올바르지 않아요. 다시 입력해주세요.");
      },
    });
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
              <div key={index} className="relative h-10 w-9">
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleAdminCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => e.currentTarget.select()}
                  onPaste={(e) => handlePaste(index, e)}
                  className={`h-10 w-9 rounded-[6px] border bg-[#F8F9F9] text-center text-18px text-transparent font-bold caret-secondary-1 focus:border-secondary-1 focus:outline-none focus:ring-0 ${
                    isErrorHighlightActive
                      ? "border-red-500"
                      : "border-neutral-gray-5"
                  }`}
                />
                {digit && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-18px font-bold text-secondary-1">
                    *
                  </span>
                )}
              </div>
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
