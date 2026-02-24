import { Layout } from "../components/Layout";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className=" mt-[71.394%] flex flex-col justify-center items-center">
        {/* 아이콘 영역 */}
        <div className=" w-full max-w-[192px] max-h-[192px]">
          <img src="/icons/symbol.svg" alt="리트리버 캐릭터 로고" />
        </div>
        {/* 버튼 영역 - 대여하기, 관리자로 로그인 */}
        <div className="flex flex-col justify-center items-center w-full max-w-[305px] pt-[9.564%]">
          {/* TODO: 라우팅 경로 짜기 */}
          <Button variant="primary" size="lg" onClick={() => navigate("")}>
            <p>대여하기</p>
          </Button>
          {/* 관리자 로그인 버튼 : /login 으로 이동 */}
          <button
            onClick={() => navigate("/login")}
            className="w-full max-w-[89px] text-[0.875rem] text-center text-[#000000] opacity-50 mt-[3.74%] cursor-pointer hover:opacity-80"
          >
            관리자로 로그인
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;
