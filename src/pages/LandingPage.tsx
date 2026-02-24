import { Layout } from "../components/Layout";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className=" mt-[50%] mb-auto flex flex-col justify-center items-center gap-4">
        {/* 아이콘, 로고 영역 */}
        <div className=" w-full max-w-[146px] max-h-[164px]">
          <img src="/icons/symbol.svg" alt="리트리버 캐릭터 로고" />
        </div>
        <div className="w-full max-w-[240px]">
          <img
            className="w-full"
            src="/icons/retrivr_text_primary.svg"
            alt="리트리버 텍스트 로고"
          />
        </div>
        <p className="text-neutral-gray-3 text-12px">
          손 쉬운 대여 장부 관리 리트리버
        </p>
      </div>
      {/* 버튼 영역 - 대여하기, 관리자로 로그인 */}
      <div className="flex flex-col justify-center items-center w-full mt-auto mb-[12%] gap-2">
        {/* TODO: 라우팅 경로 짜기 */}
        <Button variant="primary" size="lg" onClick={() => navigate("")}>
          대여하기
        </Button>
        {/* 관리자 로그인 버튼 : /login 으로 이동 */}
        <Button variant="gray" size="lg" onClick={() => navigate("/login")}>
          관리자로 로그인
        </Button>
      </div>
    </Layout>
  );
};

export default LandingPage;
