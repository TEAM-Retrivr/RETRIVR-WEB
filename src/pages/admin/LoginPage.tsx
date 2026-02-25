import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import CommonInput from "../../components/CommonInput";
import Button from "../../components/Button";
import { useLogin } from "../../hooks/queries/useAuthQueries";

const LoginPage = () => {
  const navigate = useNavigate();

  {
    /* 상태변수 */
  }

  // 이메일: string
  const [email, setEmail] = useState("");

  // 비밀번호: string
  const [password, setPassword] = useState("");

  {
    /* 이벤트 핸들러 */
  }
  const { mutate: requestLogin, isPending: isInLogin } = useLogin();

  const handleRequestLogin = () => {
    if (!email.trim()) return alert("이메일을 입력해주세요.");
    if (!password.trim()) return alert("비밀번호를 입력해주세요.");

    requestLogin(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          navigate("/home");
        },
        onError: () => {
          alert("로그인에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };
  {
    /* */
  }
  return (
    <Layout>
      {/* 뒤로가기 버튼 : 랜딩페이지로 이동 */}
      <button
        className="absolute top-[7%] left-[7%] object-fit"
        onClick={() => navigate(-1)}
      >
        <img src="/icons/home/left-arrow.svg" alt="뒤로가기 버튼" />
      </button>
      {/* 화면 영역 - 로고, 입력창, 버튼 영역 */}
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
        <form className="flex flex-col w-full  mt-[23.888%] gap-3">
          {/* 텍스트 영역 - 관리자 로그인 */}
          <p className="text-neutral-gray-1 text-16px font-bold">
            관리자 로그인
          </p>
          <CommonInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            type="email"
            disabled={isInLogin}
          />
          <CommonInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            type="password"
            disabled={isInLogin}
          />
          {/* TODO : 로그인 페이지 라우팅 및 이벤트 핸들러 설정 */}
          <Button variant="primary" size="lg" onClick={handleRequestLogin}>
            {isInLogin ? "로그인 중 ..." : "로그인"}
          </Button>
          {/* TODO : 찾기 페이지 라우팅 설정 */}
          <button
            className="text-center text-[#9c9c9c] text-[0.875rem] font-normal leading-none cursor-pointer hover:text-neutral-dark"
            onClick={() => navigate("")}
          >
            이메일 / 비밀번호 찾기
          </button>
        </form>

        {/* 회원가입 영역 - 텍스트, 회원가입 버튼 */}
        <div className="flex flex-col w-full items-center gap-3 mt-auto mb-[13.02%]">
          <p className="text-center text-primary text-14px font-normal leading-none">
            회원이 아니신가요?
          </p>
          {/* 회원가입 버튼 : /register 로 이동 */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/register")}
          >
            회원가입
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
