import { useNavigate } from "react-router-dom";

const footerUnderlineClass = "text-inherit underline";

export const GuideFooterSection = () => {
  const navigate = useNavigate();

  return (
    <footer id="footer" className="scroll-mt-20 px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <h2 className="text-20px font-bold">사업자 정보</h2>
        <p className="text-10px font-normal leading-[1.3] text-neutral-gray-3 whitespace-pre">
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
    </footer>
  );
};
