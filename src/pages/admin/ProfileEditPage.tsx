import { useState } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import CommonInput from "../../components/CommonInput";
import Button from "../../components/Button";

const ProfileEditPage = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [adminCode, setAdminCode] = useState("");

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

        {/* 3. 비밀번호/비밀번호 확인 입력 필드 */}
        <div className="flex flex-col w-full gap-1.5">
          <div className="flex gap-0.5">
            <p className="text-14px font-bold">비밀번호</p>
            <p className="text-14px text-primary font-bold">*</p>
          </div>
          <p className="pb-1 text-neutral-gray-3 text-12px font-normal leading-[130%]">
            영문자, 숫자, 특수문자를 포함한 8자 이상으로 설정해주세요.
          </p>
          <CommonInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] "
          />
        </div>

        <div className="flex flex-col w-full gap-2.5">
          <div className="flex gap-0.5">
            <p className="text-14px font-bold">비밀번호 확인</p>
            <p className="text-14px text-primary">*</p>
          </div>
          <CommonInput
            type="password"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            placeholder="비밀번호 재입력"
            className="placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] "
          />
        </div>

        {/* 4. 관리자 코드 입력 필드 */}
        <div className="flex flex-col w-full gap-1.5">
          <div className="flex gap-0.5">
            <p className=" text-14px font-bold">관리자 코드</p>
            <p className=" text-14px text-primary">*</p>
          </div>
          <p className="pb-1 text-neutral-gray-3 text-12px font-normal leading-[140%]">
            물품 관리 등 중요할 때 쓰이는 코드로, 숫자만 입력 가능해요.
          </p>
          <CommonInput
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="관리자 코드 입력"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            className="placeholder:text-14px placeholder:font-normal placeholder:leading-[140%] "
          />
        </div>
      </div>

      {/* 5. 확인 버튼 */}
      <div className="w-full flex flex-col items-center mt-auto mb-10">
        <Button variant="primary" size="lg">
          확인
        </Button>
      </div>
    </Layout>
  );
};

export default ProfileEditPage;
