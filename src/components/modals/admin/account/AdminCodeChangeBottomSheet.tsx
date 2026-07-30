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
import type { UpdateAdminProfileErrorResponse } from "../../../../api/auth/auth.type";

export type AdminCodeChangeBottomSheetHandle = {
  requestClose: () => void;
};

type AdminCodeChangeBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onChanged: () => void;
};

const AdminCodeChangeBottomSheet = forwardRef<
  AdminCodeChangeBottomSheetHandle,
  AdminCodeChangeBottomSheetProps
>(({ isOpen, onClose, onChanged }, ref) => {
  const [adminCode, setAdminCode] = useState("");
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
      setAdminCode("");
      setIsExitModalOpen(false);
    }
  }, [isOpen]);

  const isValidCode = /^\d{6}$/.test(adminCode);
  const canSubmit = isValidCode && !isPending;

  const handleConfirmExit = () => {
    updateRequestIdRef.current += 1;
    setIsExitModalOpen(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    const requestId = ++updateRequestIdRef.current;

    // RTR-325에서 관리자코드 전용 API로 교체 예정 (현재 PATCH /profile은 organizationName만 허용)
    updateProfile(
      { newAdminCode: adminCode } as unknown as Parameters<
        typeof updateProfile
      >[0],
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
          alert("관리자 코드 변경에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleRequestClose}
        title="관리자코드 변경"
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
        <div className="flex w-full flex-col gap-2.5 font-[Pretendard] text-neutral-gray-1">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center">
              <p className="px-0.5 text-14px font-bold">새 관리자 코드</p>
              <p className="text-14px font-bold text-primary">*</p>
            </div>
            <p className="px-0.5 text-12px font-normal leading-[1.3] text-neutral-gray-3">
              숫자 6자리로 입력해주세요.
            </p>
          </div>
          <CommonInput
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={adminCode}
            onChange={(event) =>
              setAdminCode(event.target.value.replace(/\D/g, ""))
            }
            placeholder="관리자 코드 입력"
            className="h-12 max-w-none rounded-xl px-3.5 text-neutral-gray-1 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] placeholder:text-neutral-gray-3"
          />
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

AdminCodeChangeBottomSheet.displayName = "AdminCodeChangeBottomSheet";

export default AdminCodeChangeBottomSheet;
