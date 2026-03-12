import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
const RenterSearchPage = () => {
  return (
    <Layout>
      {/* 헤더 영역 */}
      <Header
        pageIconSrc="/icons/retrivr_text_primary.svg"
        pageIconAlt="리트리버"
      ></Header>
      {/* 검색 영역 - 검색 바 + 검색 결과 목록 */}
      <div className="flex flex-col pt-6.5 px-8 gap-3">
        {/* 검색 바 영역 */}
        <div className="  w-84.5 h-11 flex items-center justify-between font-[pretendard] rounded-small border border-primary">
          <input
            className="flex-1  border-none outline-none pl-3 py-3 placeholder:text-neutral-gray-3 placeholder:text-14px "
            type="text"
            placeholder="대여지 이름을 검색하세요."
          ></input>
          <button type="submit" className="pr-3">
            <img src="/icons/search.svg" alt="검색" />
          </button>
        </div>
        {/* 검색 결과 영역 */}
        <div className="w-full h-screen bg-neutral-gray-6 font-[Pretendard] rounded-t-[14px] pt-6.5 px-5.5">
          <p className="text-16px text-secondary-2 opacity-[0.9] font-[600]">
            입력 예시
          </p>
          <div className="flex flex-col px-0.25 pt-4.5 gap-1">
            <p className="text-14px text-neutral-gray-3 font-[600] leading-[20px] ">
              공식 명칭
            </p>
            {/* TODO: 검색 결과 목록 렌더링 영역 */}
            <div className="flex flex-col gap-2.5 "></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RenterSearchPage;
