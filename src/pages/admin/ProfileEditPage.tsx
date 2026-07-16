import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import CommonInput from "../../components/CommonInput";
import Button from "../../components/Button";
import ConfirmModal from "../../components/modals/ConfirmModal";
import EmailChangeBottomSheet, {
  type EmailChangeBottomSheetHandle,
} from "../../components/modals/admin/account/EmailChangeBottomSheet";
import { getPasswordValidationError } from "../../utils/passwordValidation";
import { useAdminProfile } from "../../hooks/queries/useAuthQueries";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { data: profile } = useAdminProfile();
  const emailSheetRef = useRef<EmailChangeBottomSheetHandle>(null);

  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isEmailSheetOpen, setIsEmailSheetOpen] = useState(false);
  /** 이메일 변경 인증 성공 시 발급되는 토큰 (프로필 PATCH용) */
  const [emailVerificationToken, setEmailVerificationToken] = useState("");

  useEffect(() => {
    if (!profile) return;
    setOrganizationName(profile.organizationName ?? "");
    setEmail(profile.email ?? "");
  }, [profile]);

  const handleEditEmail = () => {
    setIsEmailSheetOpen(true);
  };

  const handleHeaderBack = () => {
    if (isEmailSheetOpen) {
      emailSheetRef.current?.requestClose();
      return;
    }
    navigate("/account");
  };

  const handleSubmit = () => {
    if (!organizationName.trim()) return alert("이름(단체명)을 입력해주세요.");
    if (!email.trim()) return alert("이메일을 입력해주세요.");

    const passwordError = getPasswordValidationError(password);
    if (passwordError) return alert(passwordError);

    if (!passwordCheck) return alert("비밀번호 확인을 위해 재입력해주세요.");
    if (password !== passwordCheck) {
      return alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
    }

    if (!adminCode.trim()) return alert("관리자 코드를 입력해주세요.");
    if (!/^\d{6}$/.test(adminCode)) {
      return alert("관리자 코드는 6자리 숫자여야 합니다.");
    }

    if (
      profile?.email &&
      email.trim() !== profile.email &&
      !emailVerificationToken
    ) {
      return alert("이메일 변경 시 인증이 필요해요. 이메일 수정을 완료해주세요.");
    }

    // TODO: 개인정보 수정 API 연동
    setIsCompleteModalOpen(true);
  };

  return (
    <Layout>
      <Header pageName="개인정보 수정" onBackClick={handleHeaderBack} />

      <div className="flex w-full flex-col items-start gap-6 px-8 pt-8.75 font-[Pretendard] text-neutral-gray-1">
        {/* 이름(단체명) */}
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex items-center">
            <p className="px-0.5 text-14px font-bold">이름(단체명)</p>
            <p className="text-14px font-bold text-primary">*</p>
          </div>
          <CommonInput
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="한국대 총학생회"
            className="h-12 rounded-xl px-3.5 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
          />
        </div>

        {/* 이메일 */}
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex items-center">
            <p className="px-0.5 text-14px font-bold">이메일</p>
            <p className="text-14px font-bold text-primary">*</p>
          </div>
          <div className="flex w-full items-center gap-1">
            <div className="min-w-0 flex-1">
              <CommonInput
                type="email"
                value={email}
                readOnly
                tabIndex={-1}
                onFocus={(e) => e.currentTarget.blur()}
                aria-readonly="true"
                placeholder="retrivr@gmail.com"
                className="h-12 max-w-none cursor-default rounded-xl px-3.5 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] placeholder:text-neutral-gray-3 focus:ring-0"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="h-11.5 w-25 shrink-0 rounded-xl text-14px font-semibold"
              onClick={handleEditEmail}
            >
              수정하기
            </Button>
          </div>
          <p className="px-0.5 text-12px font-normal leading-[130%] text-secondary-2">
            이메일 변경 시 새로 인증이 필요해요
          </p>
        </div>

        {/* 비밀번호 */}
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center">
              <p className="px-0.5 text-14px font-bold">비밀번호</p>
              <p className="text-14px font-bold text-primary">*</p>
            </div>
            <p className="px-0.5 text-12px font-normal leading-[130%] text-neutral-gray-3">
              영문자, 숫자, 특수문자를 포함한 8자 이상으로 설정해주세요.
            </p>
          </div>
          <CommonInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="h-12 rounded-xl px-3.5 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
          />
        </div>

        {/* 비밀번호 재입력 */}
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center">
              <p className="px-0.5 text-14px font-bold">비밀번호 재입력</p>
              <p className="text-14px font-bold text-primary">*</p>
            </div>
            <p className="px-0.5 text-12px font-normal leading-[130%] text-neutral-gray-3">
              비밀번호 확인을 위해 재입력해주세요
            </p>
          </div>
          <CommonInput
            type="password"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            placeholder="비밀번호 재입력"
            className="h-12 rounded-xl px-3.5 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
          />
        </div>

        {/* 관리자 코드 */}
        <div className="flex w-full flex-col gap-2.5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center">
              <p className="px-0.5 text-14px font-bold">관리자 코드</p>
              <p className="text-14px font-bold text-primary">*</p>
            </div>
            <p className="px-0.5 text-12px font-normal leading-[130%] text-neutral-gray-3">
              물품 관리 등 중요할 때 쓰이는 코드로, 숫자만 입력가능해요.
            </p>
          </div>
          <CommonInput
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value.replace(/\D/g, ""))}
            placeholder="관리자 코드 입력"
            className="h-12 rounded-xl px-3.5 placeholder:text-14px placeholder:font-normal placeholder:leading-[140%]"
          />
        </div>
      </div>

      <div className="mt-auto mb-10 flex w-full flex-col items-center px-8">
        <Button
          variant="primary"
          size="lg"
          className="h-12.5 w-full max-w-[338px] rounded-[23.164px] shadow-primary"
          onClick={handleSubmit}
        >
          확인
        </Button>
      </div>

      <ConfirmModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        message="개인정보 수정이 완료되었어요"
        confirmText="확인"
        onConfirm={() => navigate("/account")}
      />
      <EmailChangeBottomSheet
        ref={emailSheetRef}
        isOpen={isEmailSheetOpen}
        onClose={() => setIsEmailSheetOpen(false)}
        onVerified={({ email: nextEmail, token }) => {
          setEmail(nextEmail);
          setEmailVerificationToken(token);
        }}
      />
    </Layout>
  );
};

export default ProfileEditPage;
