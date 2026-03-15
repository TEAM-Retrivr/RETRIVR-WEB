import { useState } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import { useOrganizationSearch } from "../../hooks/queries/useClientQueries";
import { useNavigate } from "react-router-dom";

const RenterSearchPage = () => {
  // 입력 중인 검색어
  const [inputValue, setInputValue] = useState("");
  // 실제 검색에 사용하는 키워드(버튼 클릭 또는 엔터 시 확정)
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  const { data, isLoading, error } = useOrganizationSearch(keyword);
  const organizations = data?.organizations ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(inputValue.trim());
  };

  return (
    <Layout>
      {/* 헤더 영역 */}
      <Header
        pageIconSrc="/icons/retrivr_text_primary.svg"
        pageIconAlt="리트리버"
        backTo="/"
      ></Header>
      {/* 검색 영역 - 검색 바 + 검색 결과 목록 */}
      <div className="flex flex-col pt-6.5 px-8 gap-3">
        {/* 검색 바 영역 */}
        <form
          onSubmit={handleSubmit}
          className="w-84.5 h-11 flex items-center justify-between font-[Pretendard] rounded-small border border-primary"
        >
          <input
            className="flex-1 border-none outline-none pl-3 py-3  text-14px text-[#444] placeholder:text-neutral-gray-3 placeholder:text-14px "
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="대여지 이름을 검색하세요."
          />
          <button type="submit" className="pr-3">
            <img src="/icons/search.svg" alt="검색" />
          </button>
        </form>
        {/* 검색 결과 영역 */}
        <div className="w-full bg-neutral-gray-6 min-h-40 font-[Pretendard] rounded-[14px] py-6.5 px-5.5">
          <p className="text-16px text-secondary-2 opacity-[0.9] font-[600]">
            {keyword ? "검색 결과" : "입력 예시"}
          </p>
          <div className="flex flex-col px-0.25 pt-4.5">
            {!keyword && (
              <div className="flex flex-col text-14px font-[600] leading-[20px] gap-1">
                <p className="text-neutral-gray-3">공식 명칭 </p>
                <p className="text-[#444]">건국대학교 도서관자치위원회</p>
              </div>
            )}

            {keyword && (
              <div className="flex flex-col gap-2.5">
                {isLoading && (
                  <p className="text-14px text-neutral-gray-3">검색 중...</p>
                )}
                {error && (
                  <p className="text-14px text-secondary-1">
                    대여지를 검색하는 중 오류가 발생했습니다.
                  </p>
                )}
                {!isLoading && !error && organizations.length === 0 && (
                  <p className="text-14px text-neutral-gray-3">
                    검색 결과가 없습니다.
                  </p>
                )}
                {!isLoading &&
                  !error &&
                  organizations.map((org) => (
                    <button
                      key={org.organizationId}
                      type="button"
                      className="flex items-center gap-2.5 bg-none cursor-pointer"
                      onClick={() => {
                        navigate(
                          `/client-home?organizationId=${org.organizationId}`,
                          {
                            state: {
                              name: org.name,
                              imageURL: org.imageURL,
                            },
                          },
                        );
                      }}
                    >
                      <span className="text-14px text-neutral-gray-1 font-[600] hover:text-secondary-2">
                        {org.name}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RenterSearchPage;
