import { Layout } from "../components/Layout";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const footerUnderlineClass = "text-inherit underline";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-1 flex-col">
        <div className="mt-58 flex flex-1 flex-col items-center justify-center gap-4">
          {/* 아이콘, 로고 영역 */}
          <div className="w-full max-w-[146px] max-h-[164px]">
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
        <div className="flex w-full flex-col items-center gap-2 mb-6">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/client-search")}
          >
            대여하기
          </Button>
          <Button variant="gray" size="lg" onClick={() => navigate("/login")}>
            관리자로 로그인
          </Button>
        </div>
        <p className="w-full px-4 pb-12 text-center text-10px font-normal leading-[1.3] text-neutral-gray-3 whitespace-pre">
          Retrivr  |  대표자: 박다솔  |  사업자등록번호: 870-64-00978
          {"\n"}
          <button
            type="button"
            className={`${footerUnderlineClass} inline cursor-pointer bg-transparent p-0 font-[inherit] text-10px leading-[1.3]`}
            onClick={() => navigate("/legal/terms")}
          >
            이용약관
          </button>
          {"  |  "}
          <button
            type="button"
            className={`${footerUnderlineClass} inline cursor-pointer bg-transparent p-0 font-[inherit] text-10px leading-[1.3]`}
            onClick={() => navigate("/legal/privacy")}
          >
            개인정보처리방침
          </button>
          {"  | E-mail: retrivr.service@gmail.com\n"}
          {"Instagram: @retrivr_official  |  사업자 추가 정보\n"}
          {"주소: 경기도 파주시 후곡로 77\n전화: 010-2023-9593"}
        </p>
      </div>
    </Layout>
  );
};

export default LandingPage;
