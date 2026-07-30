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
import { useUpdateAdminProfile } from "../../../../hooks/queries/useAuthQueries";
import {
  isPasswordValid,
  PASSWORD_RULES,
} from "../../../../utils/passwordValidation";
import type { UpdateAdminProfileErrorResponse } from "../../../../api/auth/auth.type";

export type PasswordChangeBottomSheetHandle = {
  requestClose: () => void;
};

type PasswordChangeBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onChanged: () => void;
};

const PasswordChangeBottomSheet = forwardRef<
  PasswordChangeBottomSheetHandle,
  PasswordChangeBottomSheetProps
>(({ isOpen, onClose, onChanged }, ref) => {
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [bounceKey, setBounceKey] = useState(0);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const updateRequestIdRef = useRef(0);
  const { mutate: updateProfile, isPending } = useUpdateAdminProfile();

  const handleRequestClose = () => {
    setIsExitModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    requestClose: handleRequestClose,
  }));

  useEffect(() => {
    if (!isOpen) {
      updateRequestIdRef.current += 1;
      setPassword("");
      setPasswordCheck("");
      setBounceKey(0);
      setIsExitModalOpen(false);
    }
  }, [isOpen]);

  const passwordMatches = password.length > 0 && password === passwordCheck;
  const rulesOk = isPasswordValid(password);
  const canSubmit = rulesOk && passwordMatches && !isPending;

  const handleConfirmExit = () => {
    updateRequestIdRef.current += 1;
    setIsExitModalOpen(false);
    onClose();
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0 && !isPasswordValid(value)) {
      setBounceKey((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const requestId = ++updateRequestIdRef.current;

    // RTR-323에서 비밀번호 전용 API로 교체 예정 (현재 PATCH /profile은 organizationName만 허용)
    updateProfile(
      {
        newPassword: password,
        confirmPassword: passwordCheck,
      } as unknown as Parameters<typeof updateProfile>[0],
      {
        onSuccess: () => {
          if (requestId !== updateRequestIdRef.current) return;
          onChanged();
          onClose();
        },
        onError: (error) => {
          if (requestId !== updateRequestIdRef.current) return;
          if (axios.isAxiosError(error)) {
            const data = error.response?.data as
              | UpdateAdminProfileErrorResponse
              | undefined;
            if (data?.message) {
              alert(data.message);
              return;
            }
          }
          alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleRequestClose}
        title="비밀번호 변경"
        sheetClassName="h-[612px] max-h-full"
        footer={
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="h-12.5 w-full max-w-none rounded-[23.164px] shadow-primary text-18px"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isPending ? "변경 중..." : "변경하기"}
          </Button>
        }
      >
        <div className="flex w-full flex-col gap-6 font-[Pretendard] text-neutral-gray-1">
          <div className="flex w-full flex-col gap-2.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center">
                <p className="px-0.5 text-14px font-bold">새 비밀번호</p>
                <p className="text-14px font-bold text-primary">*</p>
              </div>
              <p className="px-0.5 text-12px font-normal leading-[1.3] text-neutral-gray-3">
                영문, 숫자, 특수문자를 포함해 8자 이상으로 설정해주세요.
              </p>
            </div>
            <CommonInput
              type="password"
              value={password}
              onChange={(event) => handlePasswordChange(event.target.value)}
              placeholder="비밀번호 입력"
              className="h-12 max-w-none rounded-xl px-3.5 text-neutral-gray-1 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] placeholder:text-neutral-gray-3"
            />
            <ul className="flex flex-col gap-1 px-0.5">
              {PASSWORD_RULES.map((rule) => {
                const ok = rule.test(password);
                const shouldBounce = password.length > 0 && !ok;
                return (
                  <li
                    key={`${rule.id}-${shouldBounce ? bounceKey : "ok"}`}
                    className={`flex items-center gap-1.5 text-12px leading-[1.3] ${
                      ok ? "text-primary" : "text-neutral-gray-3"
                    } ${shouldBounce ? "animate-password-rule-bounce" : ""}`}
                  >
                    <span aria-hidden>{ok ? "✓" : "○"}</span>
                    <span>{rule.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex w-full flex-col gap-2.5">
            <div className="flex items-center">
              <p className="px-0.5 text-14px font-bold">비밀번호 확인</p>
              <p className="text-14px font-bold text-primary">*</p>
            </div>
            <CommonInput
              type="password"
              value={passwordCheck}
              onChange={(event) => setPasswordCheck(event.target.value)}
              placeholder="비밀번호 재입력"
              className="h-12 max-w-none rounded-xl px-3.5 text-neutral-gray-1 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] placeholder:text-neutral-gray-3"
            />
            {passwordCheck.length > 0 && !passwordMatches ? (
              <p className="text-12px font-normal leading-[1.3] text-secondary-2">
                비밀번호가 일치하지 않아요
              </p>
            ) : null}
          </div>
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

PasswordChangeBottomSheet.displayName = "PasswordChangeBottomSheet";

export default PasswordChangeBottomSheet;
