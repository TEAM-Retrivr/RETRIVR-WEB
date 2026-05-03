import { useState } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import CommonInput from "../../components/CommonInput";
import Button from "../../components/Button";
import { getPasswordValidationError } from "../../utils/passwordValidation";
import AdminAccountCommonFields from "../../components/admin/AdminAccountCommonFields";

const ProfileEditPage = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [adminCode, setAdminCode] = useState("");

  const handleSubmit = () => {
    if (!organizationName.trim()) return alert("이름(단체명)을 입력해주세요.");
    if (!email.trim()) return alert("이메일을 입력해주세요.");

    const passwordError = getPasswordValidationError(password);
    if (passwordError) return alert(passwordError);

    if (!passwordCheck) return alert("비밀번호 확인 입력을 진행해주세요.");
    if (password !== passwordCheck) {
      return alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
    }

    if (!adminCode.trim()) return alert("관리자 코드를 입력해주세요.");
    if (!/^\d{6}$/.test(adminCode)) {
      return alert("관리자 코드는 6자리 숫자여야 합니다.");
    }

    alert("입력값 검증이 완료되었습니다.");
  };

  return (
    <Layout>
      <Header pageName="개인정보 수정" backTo="/account" />
      <div className="flex flex-col items-center w-full gap-6 pt-8 px-8 ">
        {/* 1. 이름(단체명) 입력필드 */}
        <div className="flex flex-col w-full gap-2">
          <div className="flex gap-0.5">
            <p className=" text-14px font-bold">이름(단체명)</p>
            <p className="text-14px text-primary">*</p>
          </div>
          <CommonInput
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="한국대 도서관자치위원회"
            className="placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] "
          />
        </div>

        {/* 2. 이메일 인증 관련 입력 필드 */}
        <div className="flex flex-col w-full gap-2.5">
          <div className="flex gap-0.5">
            <p className=" text-14px font-bold ">이메일</p>
            <p className="text-14px text-primary">*</p>
          </div>
          <div className="flex justify-between items-center gap-1">
            <CommonInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="retrivr@gmail.com"
              className="placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] "
            />
            <Button variant="primary" size="sm" className="w-25 h-11.5">
              인증번호 전송
            </Button>
          </div>
          <div className="relative flex justify-between items-center gap-1">
            <CommonInput
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              placeholder="인증번호 입력"
              className="placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] "
            />

            <Button variant="gray" size="sm" className="w-25 h-11.5">
              인증번호 확인
            </Button>
          </div>
        </div>

        <AdminAccountCommonFields
          variant="profileEdit"
          includeOrganizationName={false}
          organizationName={organizationName}
          onOrganizationNameChange={setOrganizationName}
          password={password}
          onPasswordChange={setPassword}
          passwordCheck={passwordCheck}
          onPasswordCheckChange={setPasswordCheck}
          adminCode={adminCode}
          onAdminCodeChange={setAdminCode}
        />
      </div>

      {/* 5. 확인 버튼 */}
      <div className="w-full flex flex-col items-center mt-auto mb-10">
        <Button variant="primary" size="lg" onClick={handleSubmit}>
          확인
        </Button>
      </div>
    </Layout>
  );
};

export default ProfileEditPage;
