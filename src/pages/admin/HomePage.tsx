import { Layout } from "../../components/Layout";
import { UserIcon } from "../../components/UserIcon";

const Home = () => {
  return (
    <Layout>
      {/* 화면 상단 영역 - 프로필 사진, 주소 및 단체명 */}
      <div
        className="w-full max-w-[402px] h-[20%] max-h-[180px] pt-[12.66%] 
      px-[7.464%] bg-home-gradient rounded-bl-[45px]"
      >
        {/* 상단 로고 텍스트 및 사람 아이콘 */}
        <div className="w-full flex justify-between">
          <img
            src="../../../public/icons/home/retrivr_text_outline.svg"
            alt="로고 텍스트"
          />
          <img
            src="../../../public/icons/home/man_icon.svg"
            alt="사람 아이콘"
          />
        </div>
        <div className="flex w-full max-h-[72px] mt-[50.64px]">
          {/* 프로필 사진 */}
          <div className="w-full h-screen max-w-[72px] max-h-[72px] bg-neutral-gray rounded-full shadow-profile overflow-hidden bg-white flex items-center justify-center">
            {/* 사용자 프로필 사진 들어가는 자리 */}
          </div>
          {/* 주소 및 단체 이름 */}
          <div className="pl-[12px] pt-[12.68px] gap-[4px] font-[Pretendard] leading-none flex flex-col">
            <span className="text-neutral-dark text-start text-[12px] font-[400]">
              능동로 120 상허기념도서관
            </span>
            <span className="text-neutral-white text-start text-[16px] font-[600]">
              건국대학교 도서관자치위원회
            </span>
          </div>
        </div>
      </div>
      {/* 대여 요청 섹션 */}
      <div className="mt-[30px] mx-[26px] bg-rental-gradient w-[87.06%] max-w-[350px] h-[320px] rounded-[33px]"></div>
      {/* 관리 섹션 - 반납 관리, 물품 관리 */}
      <div className="flex mt-[26px] mx-[26px] w-[87.06%] max-w-[350px] h-[127px] justify-between">
        {/* 반납 관리 탭 */}
        <div className="bg-neutral-gray rounded-[16px] w-[161px] h-[127px]"></div>
        {/* 물품 관리 탭 */}
        <div className="bg-neutral-gray rounded-[16px] w-[161px] h-[127px]"></div>
      </div>
      {/* QR 코드 생성 버튼 */}
      <button className="absolute bottom-[5.03%] right-[7.96%] w-[19.4%] max-w-[78px] h-[8.924%] max-h-[78px] cursor-pointer">
        <img
          src="../../../public/icons/home/QR.svg"
          alt="QR 생성 버튼"
          className="w-full max-w-[78px] h-screen max-h-[78px] border-none"
        />
      </button>
    </Layout>
  );
};

export default Home;
