import { Layout } from "../../components/Layout";
import CommonInput from "../../components/CommonInput";
import Button from "../../components/Button";

// 관리자 회원가입 페이지
const RegisterPage = () => {
  return (
    <Layout>
      {/* 헤더 영역 - 헤더 컴포넌트 제작 후 대체 예정 */}
      <div className="w-full h-28 text-center">헤더 영역</div>
      {/* 회원가입 영역 - 이름, 이메일, 비밀번호, 비밀번호 확인, 관리자 코드 */}
      <div className="flex flex-col items-center w-full gap-8 px-8">
        {/* 이름(단체명) 영역 */}
        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="inline text-[0.875rem] font-bold leading-none">
              이름(단체명)
            </p>
            <p className="inline text-primary">*</p>
          </div>
          <p className="text-neutral-3 text-[0.75rem] font-normal leading-none">
            공식 명칭을 사용해주세요. ex)리턴즈(X), 00학생회(O)
          </p>
          <CommonInput placeholder="한국대 학생회"></CommonInput>
        </div>
        {/* 이메일 영역 */}
        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="inline text-[0.875rem] font-bold leading-none">
              이메일
            </p>
            <p className="inline text-primary leading-none">*</p>
          </div>
          <div className="flex justify-between">
            <CommonInput
              type="email"
              placeholder="retrivr@gmail.com"
            ></CommonInput>
            <Button variant="primary" size="small">
              인증번호 전송
            </Button>
          </div>
          <div className="flex justify-between">
            <CommonInput placeholder="인증번호 입력"></CommonInput>
            <Button variant="primary" size="small">
              인증번호 확인
            </Button>
          </div>
        </div>
        {/* 비밀번호 영역 */}
        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="inline text-[0.875rem] font-bold leading-none">
              비밀번호
            </p>
            <p className="inline text-primary leading-none">*</p>
          </div>
          <CommonInput
            type="password"
            placeholder="비밀번호 입력"
          ></CommonInput>
        </div>
        {/* 비밀번호 확인 영역 */}
        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="inline text-[0.875rem] font-bold leading-none">
              비밀번호 확인
            </p>
            <p className="inline text-primary leading-none">*</p>
          </div>
          <CommonInput
            type="password"
            placeholder="비밀번호 재입력"
          ></CommonInput>
        </div>
        {/* 관리자 코드 영역*/}
        <div className="flex flex-col w-full gap-2">
          <div>
            <p className="inline text-[0.875rem] font-bold leading-none">
              관리자 코드
            </p>
            <p className="inline text-primary leading-none">*</p>
          </div>
          <p className="text-neutral-3 text-[0.75rem] font-normal leading-none">
            물품 관리 등 중요할 때 쓰이는 코드로, 숫자만 입력 가능해요.
          </p>
          <CommonInput
            placeholder="010101"
            inputMode="numeric"
            pattern="[0-9]*"
          ></CommonInput>
        </div>
      </div>
      <div className="w-full flex flex-col items-center mt-auto mb-10">
        <Button variant="primary" size="large">
          Retrivr 시작하기
        </Button>
      </div>
    </Layout>
  );
};

export default RegisterPage;
