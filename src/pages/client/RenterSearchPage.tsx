import { useState } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import Button from "../../components/Button";
import UserIcon from "../../components/UserIcon";
import { useOrganizationSearch } from "../../hooks/queries/useClientQueries";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 사용자 입력값(query)와 동일한 글자를 더 진한 색으로 칠하기
const HighlightedText = ({ text, query }: { text: string; query: string }) => {
  const q = query.trim();
  if (!q) {
    return (
      <span className="text-neutral-gray-1 group-hover:text-secondary-2">
        {text}
      </span>
    );
  }

  const re = new RegExp(`(${escapeRegExp(q)})`, "g");
  const parts = text.split(re);
  const hasMatch = parts.length > 1;

  if (!hasMatch) {
    return <span className="text-neutral-gray-3">{text}</span>;
  }

  return (
    <>
      {parts.map((part, idx) => {
        const isMatch = idx % 2 === 1;
        return (
          <span
            key={`${idx}-${part}`}
            className={
              isMatch
                ? "text-neutral-gray-1 group-hover:text-secondary-2"
                : "text-neutral-gray-3 group-hover:text-secondary-2"
            }
          >
            {part}
          </span>
        );
      })}
    </>
  );
};

const RenterSearchPage = () => {
  // 입력 중인 검색어
  const [inputValue, setInputValue] = useState("");
  // 실제 검색에 사용하는 키워드(버튼 클릭 또는 엔터 시 확정)
  const [keyword, setKeyword] = useState("");
  // 사용자가 선택한 대여지
  const [selectedOrg, setSelectedOrg] = useState<{
    organizationId: number;
    name: string;
    imageURL?: string;
  } | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useOrganizationSearch(keyword);
  const organizations = data?.organizations ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실시간 검색으로 동작하므로 엔터 제출 시에는 기본 동작만 막음
  };

  return (
    <Layout>
      {/* 헤더 영역 */}
      <Header pageName="대여자 찾기" backTo="/"></Header>

      {/* 검색 영역 - 검색 바 + 검색 결과 목록 */}
      <div className="flex flex-col pt-6.5 px-8 gap-3">
        {/* 검색 바 영역 */}
        <form
          onSubmit={handleSubmit}
          className="w-84.5 h-11 flex items-center justify-between font-[Pretendard] rounded-small border border-primary"
        >
          <input
            className="flex-1 border-none outline-none pl-3 py-3 text-14px text-neutral-gray-1 font-[600] placeholder:text-neutral-gray-3 placeholder:text-14px "
            type="text"
            value={inputValue}
            onChange={(e) => {
              const next = e.target.value;
              setInputValue(next);
              setKeyword(next.trim());
              setSelectedOrg(null);
            }}
            placeholder="대여지 정보로 찾기"
          />
          <button type="submit" className="pr-3">
            <img src="/icons/search.svg" alt="검색" />
          </button>
        </form>
        {/* 검색 결과 영역 */}
        <div className="w-full font-[Pretendard] rounded-[14px]">
          {!keyword && (
            <div className="w-full text-20px text-primary text-center font-[600] leading-[140%] py-20.5">
              <p>안녕하세요, 대여자님!</p>
              <p>대여지를 검색하여 입장하세요</p>
            </div>
          )}

          <div className="flex flex-col px-0.25 gap-3.5 pt-6.5">
            {keyword && (
              <div className="flex flex-col justify-center gap-2.5">
                {isLoading && (
                  <p className="text-20px text-center text-neutral-gray-3">
                    검색 중...
                  </p>
                )}
                {error && (
                  <p className="text-20px text-secondary-1 font-[600]">
                    대여지를 검색하는 중 오류가 발생했습니다.
                  </p>
                )}
                {!isLoading && !error && organizations.length === 0 && (
                  <p className="text-20px text-center text-secondary-2 font-[600]">
                    검색 결과가 없습니다.
                  </p>
                )}
                {!isLoading &&
                  !error &&
                  organizations.map((org) => (
                    <button
                      key={org.organizationId}
                      type="button"
                      className={`group flex items-center h-21.5 px-4 border rounded-[16px] cursor-pointer shadow-search-profile transition-colors ${
                        selectedOrg?.organizationId === org.organizationId
                          ? "bg-secondary-4 border-secondary-4"
                          : "bg-neutral-white border-secondary-4"
                      }`}
                      onClick={() => {
                        setSelectedOrg({
                          organizationId: org.organizationId,
                          name: org.name,
                          imageURL: org.imageURL,
                        });
                      }}
                    >
                      <div className="flex justify-start items-center gap-4.5">
                        <UserIcon
                          usage="search"
                          imageURL={org.imageURL}
                        ></UserIcon>
                        <span className="text-16px font-[600]">
                          <HighlightedText text={org.name} query={keyword} />
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {!(keyword && organizations.length !== 0) && (
        <div>
          <img
            className="absolute bottom-0 object-fit"
            src="/icons/client/search-bg.svg"
            alt="이미지"
          />
        </div>
      )}
      {organizations.length !== 0 && selectedOrg && (
        <div className="flex flex-col justify-center items-center w-full mt-auto mb-12 gap-1.5">
          <p className="text-center text-10px text-primary font-normal leading-[130%]">
            해당 대여지가 맞나요?
          </p>
          <Button
            variant="primary"
            size="lg"
            disabled={!selectedOrg}
            onClick={() => {
              if (!selectedOrg) return;
              queryClient.setQueryData(
                ["selectedOrganization", selectedOrg.organizationId],
                {
                  name: selectedOrg.name,
                  imageURL: selectedOrg.imageURL,
                },
              );
              navigate(
                `/client-home?organizationId=${selectedOrg.organizationId}`,
                {
                  state: {
                    name: selectedOrg.name,
                    imageURL: selectedOrg.imageURL,
                  },
                },
              );
            }}
          >
            확인
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default RenterSearchPage;
