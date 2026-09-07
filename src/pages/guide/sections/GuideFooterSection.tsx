import { useNavigate } from "react-router-dom";

export const GuideFooterSection = () => {
  const navigate = useNavigate();

  return (
    <footer id="footer" className="bg-secondary-1 px-4 py-10 text-secondary-5 md:px-6 md:py-12">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div className="w-full text-12px leading-relaxed md:text-14px">
          <img
            src="/icons/home/retrivr_text_outline.svg"
            alt="Retrivr"
            className="mb-4 h-7 w-auto"
          />
          <p className="mb-1">대표자 : 박다솔 | 사업자등록번호 : 870-64-00978</p>
          <p className="mb-1">주소 : 경기도 파주시 후곡로 77</p>
          <p>고객센터 : 010-2023-9593 | E-mail : retrivr.service@gmail.com</p>
        </div>
        <div className="w-full border-t border-white/20 pt-6 md:w-auto md:border-0 md:pt-0">
          <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-12px md:mb-0 md:text-14px">
            <li>
              <button
                type="button"
                className="cursor-pointer bg-transparent p-0 hover:text-neutral-white"
                onClick={() => navigate("/legal/terms")}
              >
                이용약관
              </button>
            </li>
            <li>
              <button
                type="button"
                className="cursor-pointer bg-transparent p-0 font-bold text-secondary-3 hover:text-neutral-white"
                onClick={() => navigate("/legal/privacy")}
              >
                개인정보처리방침
              </button>
            </li>
            <li>
              <a
                href="https://www.instagram.com/retrivr_official"
                className="hover:text-neutral-white"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
          <p className="mt-4 text-12px text-secondary-2 md:text-right">
            © Retrivr. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
