import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import CommonInput from "../../components/CommonInput";
import EmailChangeBottomSheet, {
  type EmailChangeBottomSheetHandle,
} from "../../components/modals/admin/account/EmailChangeBottomSheet";
import IdentityVerificationBottomSheet, {
  type IdentityVerificationBottomSheetHandle,
} from "../../components/modals/admin/account/IdentityVerificationBottomSheet";
import PasswordChangeBottomSheet, {
  type PasswordChangeBottomSheetHandle,
} from "../../components/modals/admin/account/PasswordChangeBottomSheet";
import AdminCodeChangeBottomSheet, {
  type AdminCodeChangeBottomSheetHandle,
} from "../../components/modals/admin/account/AdminCodeChangeBottomSheet";
import ProfileChangeCompleteModal from "../../components/modals/admin/account/ProfileChangeCompleteModal";
import {
  useAdminProfile,
  useUpdateAdminProfile,
} from "../../hooks/queries/useAuthQueries";
import type { UpdateAdminProfileErrorResponse } from "../../api/auth/auth.type";
import { getAdminEmail } from "../../utils/adminSession";

type ChangeTarget = "email" | "password" | "adminCode";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { data: profile } = useAdminProfile();
  const { mutate: updateProfile, isPending: isUpdatingName } =
    useUpdateAdminProfile();

  const emailSheetRef = useRef<EmailChangeBottomSheetHandle>(null);
  const identitySheetRef = useRef<IdentityVerificationBottomSheetHandle>(null);
  const passwordSheetRef = useRef<PasswordChangeBottomSheetHandle>(null);
  const adminCodeSheetRef = useRef<AdminCodeChangeBottomSheetHandle>(null);
  const pendingOpenTargetRef = useRef<ChangeTarget | null>(null);

  const [organizationName, setOrganizationName] = useState("");
  const [savedOrganizationName, setSavedOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [pendingChangeTarget, setPendingChangeTarget] =
    useState<ChangeTarget | null>(null);
  const [isIdentitySheetOpen, setIsIdentitySheetOpen] = useState(false);
  const [isEmailSheetOpen, setIsEmailSheetOpen] = useState(false);
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);
  const [isAdminCodeSheetOpen, setIsAdminCodeSheetOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const hasHydratedProfileRef = useRef(false);

  useEffect(() => {
    // 이메일은 프로필 API에 없으므로 마운트 시 세션에서 바로 채운다
    setEmail(getAdminEmail());
  }, []);

  useEffect(() => {
    if (!profile || hasHydratedProfileRef.current) return;
    const name = profile.organizationName ?? "";
    setOrganizationName(name);
    setSavedOrganizationName(name);
    hasHydratedProfileRef.current = true;
  }, [profile]);

  const handleHeaderBack = () => {
    if (isEmailSheetOpen) {
      emailSheetRef.current?.requestClose();
      return;
    }
    if (isPasswordSheetOpen) {
      passwordSheetRef.current?.requestClose();
      return;
    }
    if (isAdminCodeSheetOpen) {
      adminCodeSheetRef.current?.requestClose();
      return;
    }
    if (isIdentitySheetOpen) {
      identitySheetRef.current?.requestClose();
      return;
    }
    navigate("/account");
  };

  const showCompleteModal = () => {
    setIsCompleteModalOpen(true);
  };

  const openIdentitySheet = (target: ChangeTarget) => {
    setPendingChangeTarget(target);
    setIsIdentitySheetOpen(true);
  };

  const persistOrganizationName = ({
    nextName,
    openTargetAfter,
    showCompleteOnSuccess,
  }: {
    nextName: string;
    openTargetAfter?: ChangeTarget;
    showCompleteOnSuccess: boolean;
  }) => {
    updateProfile(
      { organizationName: nextName },
      {
        onSuccess: () => {
          // 204라 응답 본문이 없으므로 일단 요청값을 반영하고,
          // invalidate 후 프로필을 다시 hydrate해 서버 정규화 값과 맞춘다
          hasHydratedProfileRef.current = false;
          setOrganizationName(nextName);
          setSavedOrganizationName(nextName);

          const queuedTarget = openTargetAfter ?? pendingOpenTargetRef.current;
          pendingOpenTargetRef.current = null;
          if (queuedTarget) {
            openIdentitySheet(queuedTarget);
            return;
          }

          if (showCompleteOnSuccess) {
            showCompleteModal();
          }
        },
        onError: (error) => {
          pendingOpenTargetRef.current = null;
          if (axios.isAxiosError(error)) {
            const data = error.response?.data as
              | UpdateAdminProfileErrorResponse
              | undefined;
            if (data?.message) {
              alert(data.message);
              return;
            }
          }
          alert("이름(단체명) 저장에 실패했습니다. 다시 시도해주세요.");
          setOrganizationName(savedOrganizationName);
        },
      },
    );
  };

  const openIdentityFor = (target: ChangeTarget) => {
    const nextName = organizationName.trim();
    if (!nextName) {
      setOrganizationName(savedOrganizationName);
      openIdentitySheet(target);
      return;
    }

    if (nextName === savedOrganizationName) {
      openIdentitySheet(target);
      return;
    }

    if (isUpdatingName) {
      pendingOpenTargetRef.current = target;
      return;
    }

    persistOrganizationName({
      nextName,
      openTargetAfter: target,
      showCompleteOnSuccess: false,
    });
  };

  const handleIdentityVerified = () => {
    setIsIdentitySheetOpen(false);
    if (pendingChangeTarget === "email") {
      setIsEmailSheetOpen(true);
    } else if (pendingChangeTarget === "password") {
      setIsPasswordSheetOpen(true);
    } else if (pendingChangeTarget === "adminCode") {
      setIsAdminCodeSheetOpen(true);
    }
    setPendingChangeTarget(null);
  };

  const handleSaveOrganizationName = () => {
    const nextName = organizationName.trim();
    if (!nextName) {
      setOrganizationName(savedOrganizationName);
      return;
    }
    if (nextName === savedOrganizationName || isUpdatingName) {
      return;
    }

    persistOrganizationName({
      nextName,
      showCompleteOnSuccess: pendingOpenTargetRef.current === null,
    });
  };

  return (
    <Layout>
      <Header
        name="계정관리"
        pageName="개인정보 수정"
        onBackClick={handleHeaderBack}
      />

      <div className="flex w-full flex-col items-start gap-6 px-8 pt-8.75 font-[Pretendard] text-neutral-gray-1">
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex items-center">
            <p className="px-0.5 text-14px font-bold">이름(단체명)</p>
            <p className="text-14px font-bold text-primary">*</p>
          </div>
          <CommonInput
            type="text"
            value={organizationName}
            onChange={(event) => setOrganizationName(event.target.value)}
            onBlur={handleSaveOrganizationName}
            placeholder="한국대 총학생회"
            className="h-12 rounded-xl px-3.5 text-neutral-gray-1 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
          />
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <div className="flex items-center">
            <p className="px-0.5 text-14px font-bold">이메일</p>
            <p className="text-14px font-bold text-primary">*</p>
          </div>
          <div className="relative w-full">
            <CommonInput
              type="email"
              value={email}
              readOnly
              tabIndex={-1}
              onFocus={(event) => event.currentTarget.blur()}
              aria-readonly="true"
              placeholder="retrivr@gmail.com"
              className="h-12 max-w-none cursor-default rounded-xl px-3.5 pr-24 text-neutral-gray-3 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] placeholder:text-neutral-gray-3 focus:ring-0"
            />
            <button
              type="button"
              onClick={() => openIdentityFor("email")}
              className="absolute right-2.5 top-1/2 flex h-[27px] -translate-y-1/2 items-center justify-center rounded-[6px] border border-neutral-gray-4 bg-neutral-white px-3 text-12px font-normal leading-[1.4] text-neutral-gray-3 cursor-pointer"
            >
              변경하기
            </button>
          </div>
          <p className="px-0.5 text-12px font-normal leading-[130%] text-secondary-2">
            이메일 변경 시 새로 인증이 필요해요
          </p>
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center">
              <p className="px-0.5 text-14px font-bold">비밀번호</p>
              <p className="text-14px font-bold text-primary">*</p>
            </div>
            <p className="px-0.5 text-12px font-normal leading-[130%] text-neutral-gray-3">
              영문, 숫자, 특수문자를 포함해 8자 이상으로 설정해주세요.
            </p>
          </div>
          <div className="relative w-full">
            <CommonInput
              type="text"
              value="*******"
              readOnly
              tabIndex={-1}
              onFocus={(event) => event.currentTarget.blur()}
              aria-readonly="true"
              className="h-12 max-w-none cursor-default rounded-xl px-3.5 pr-24 text-neutral-gray-3 focus:ring-0"
            />
            <button
              type="button"
              onClick={() => openIdentityFor("password")}
              className="absolute right-2.5 top-1/2 flex h-[27px] -translate-y-1/2 items-center justify-center rounded-[6px] border border-neutral-gray-4 bg-neutral-white px-3 text-12px font-normal leading-[1.4] text-neutral-gray-3 cursor-pointer"
            >
              변경하기
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center">
              <p className="px-0.5 text-14px font-bold">관리자 코드</p>
              <p className="text-14px font-bold text-primary">*</p>
            </div>
            <p className="px-0.5 text-12px font-normal leading-[130%] text-neutral-gray-3">
              물품 관리 등 관리자 권한이 필요한 작업에 사용하는 코드예요.
              <br />
              숫자만 입력할 수 있어요.
            </p>
          </div>
          <div className="relative flex w-full items-center">
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex size-[34px] items-center justify-center rounded-[6px] bg-neutral-gray-5 text-14px text-neutral-gray-3"
                >
                  *
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => openIdentityFor("adminCode")}
              className="absolute right-0 flex h-[27px] items-center justify-center rounded-[6px] border border-neutral-gray-4 bg-neutral-white px-3 text-12px font-normal leading-[1.4] text-neutral-gray-3 cursor-pointer"
            >
              변경하기
            </button>
          </div>
        </div>
      </div>

      <IdentityVerificationBottomSheet
        ref={identitySheetRef}
        isOpen={isIdentitySheetOpen}
        email={email || getAdminEmail()}
        onClose={() => {
          setIsIdentitySheetOpen(false);
          setPendingChangeTarget(null);
        }}
        onVerified={handleIdentityVerified}
      />

      <EmailChangeBottomSheet
        ref={emailSheetRef}
        isOpen={isEmailSheetOpen}
        onClose={() => setIsEmailSheetOpen(false)}
        onChanged={(nextEmail) => {
          setEmail(nextEmail);
          localStorage.setItem("email", nextEmail);
          showCompleteModal();
        }}
      />

      <PasswordChangeBottomSheet
        ref={passwordSheetRef}
        isOpen={isPasswordSheetOpen}
        onClose={() => setIsPasswordSheetOpen(false)}
        onChanged={showCompleteModal}
      />

      <AdminCodeChangeBottomSheet
        ref={adminCodeSheetRef}
        isOpen={isAdminCodeSheetOpen}
        onClose={() => setIsAdminCodeSheetOpen(false)}
        onChanged={showCompleteModal}
      />

      <ProfileChangeCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
      />
    </Layout>
  );
};

export default ProfileEditPage;
