import { Layout } from "../../components/Layout";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col w-full h-screen max-h-[874px] items-center px-[7.962%]">
        {/* 로고 영역 - 리트리버 로고 */}
        <div className="w-full max-w-[278.242px] mt-[59.765%]">
          <img
            className="object-fit"
            src="/icons/login-logo.svg"
            alt="로그인 로고"
          />
        </div>
        {/* 로그인 영역 - 입력창, 로그인 버튼 */}
        <div className="flex flex-col w-full items-center gap-3">
          <Button variant="primary" size="large" onClick={() => navigate("")}>
            로그인
          </Button>
          {/* TODO : 찾기 페이지 라우팅 설정 */}
          <button
            className="text-center text-[#9c9c9c] text-[0.875rem] leading-none"
            onClick={() => navigate("")}
          >
            이메일 / 비밀번호 찾기
          </button>
        </div>
        {/* 회원가입 영역 - 텍스트, 회원가입 버튼 */}
        <div className="flex flex-col w-full items-center gap-3 mb-[5%]">
          <p className="text-center text-[#9c9c9c] text-[0.875rem] leading-none">
            회원이 아니신가요?
          </p>
          {/* TODO : 회원가입 페이지 라우팅 설정 */}
          <Button variant="outline" size="large" onClick={() => navigate("")}>
            회원가입
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
