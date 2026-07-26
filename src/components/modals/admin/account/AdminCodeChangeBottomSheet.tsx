import { useEffect, useState } from "react";
import axios from "axios";
import BottomSheet from "../../../BottomSheet";
import CommonInput from "../../../CommonInput";
import Button from "../../../Button";
import ProfileChangeExitConfirmModal from "./ProfileChangeExitConfirmModal";
import { useUpdateAdminProfile } from "../../../../hooks/queries/useAuthQueries";
import type { UpdateAdminProfileErrorResponse } from "../../../../api/auth/auth.type";

type AdminCodeChangeBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onChanged: () => void;
};

const AdminCodeChangeBottomSheet = ({
  isOpen,
  onClose,
  onChanged,
}: AdminCodeChangeBottomSheetProps) => {
  const [adminCode, setAdminCode] = useState("");
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateAdminProfile();

  useEffect(() => {
    if (!isOpen) {
      setAdminCode("");
      setIsExitModalOpen(false);
    }
  }, [isOpen]);

  const isValidCode = /^\d{6}$/.test(adminCode);
  const canSubmit = isValidCode && !isPending;

  const handleRequestClose = () => {
    setIsExitModalOpen(true);
  };

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    updateProfile(
      { newAdminCode: adminCode },
      {
        onSuccess: () => {
          onChanged();
          onClose();
        },
        onError: (error) => {
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
};

export default AdminCodeChangeBottomSheet;
