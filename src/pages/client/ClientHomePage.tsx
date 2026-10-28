import { useEffect, useRef } from "react";
import { Layout } from "../../components/Layout";
import RentalAvailableItemCard from "../../components/cards/client/RentalAvailableItemCard";
import type { ItemRequest } from "../../types/item";
import { useItemList } from "../../hooks/queries/useClientQueries";
import UserIcon from "../../components/UserIcon";
import { useNavigate, useSearchParams } from "react-router-dom";

const ClientHome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const organizationIdParam = searchParams.get("organizationId");
  const organizationId = organizationIdParam
    ? Number(organizationIdParam)
    : NaN;

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useItemList({
    organizationId,
    size: 10,
    enabled: Number.isFinite(organizationId) && organizationId > 0,
  });
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const displayOrganizationName = data?.pages[0]?.organizationName ?? "";

  const itemRequests: ItemRequest[] =
    data?.pages.flatMap((page) =>
      page.items.map((item) => ({
        item,
        nextCursor: page.nextCursor ?? 0,
      })),
    ) ?? [];

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || isFetchNextPageError) return;
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void fetchNextPage();
      },
      { threshold: 0.2 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  if (!Number.isFinite(organizationId) || organizationId <= 0) {
    return (
      <Layout>
        <div className="p-6">대여지를 먼저 선택해주세요.</div>
      </Layout>
    );
  }

  // 로딩 중 or 에러 상태 표시
  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">로딩 중...</div>
      </Layout>
    );
  }
  if (isError && !data) {
    return (
      <Layout>
        <div className="p-6">에러가 발생했습니다.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 화면 상단 영역 - 대여지 프로필 사진, 대여지명 */}
      <div
        className="w-100.5 h-45 pt-12.5
      px-7.5 bg-home-gradient rounded-bl-[45px]"
      >
        {/* 상단 뒤로가기 버튼 & 로고 텍스트 */}
        <div className="w-full flex justify-between">
          <button onClick={() => navigate("/client-search")}>
            <img src="/icons/client/left-arrow-white.svg" alt="뒤로가기" />
          </button>
          <img src="/icons/home/retrivr_text_outline.svg" alt="로고 텍스트" />
        </div>
        <div className="flex w-full h-18 mt-13">
          {/* 프로필 사진 */}
          <UserIcon
            usage="home"
            imageURL={data?.pages[0]?.profileImageUrl}
            alt={displayOrganizationName || "대여지"}
          />
          <div />
          {/* 주소 및 단체 이름 */}
          <div className="flex-1 pl-3 pt-3.25 gap-1 font-[Pretendard] leading-none flex flex-col">
            <span className="text-neutral-gray-2 text-start text-12px font-normal">
              대여지
            </span>
            <div className="flex w-full gap-2">
              <span className="text-neutral-white text-start text-16px font-[600]">
                {displayOrganizationName}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* 화면 하단 영역 - 대여 가능 물품 리스트 */}
      <div className="flex flex-col font-[Pretendard] px-6.5 py-10 gap-5">
        <p className="text-18px text-secondary-2 opacity-[0.9] font-[700]">
          대여 가능 물품
        </p>
        <div className="flex flex-col gap-3.5">
          {isLoading && (
            <span className="text-sm text-neutral-gray-3">불러오는 중...</span>
          )}
          {!isLoading &&
            !hasNextPage &&
            !isFetchNextPageError &&
            itemRequests.length === 0 && (
              <span className="text-sm text-neutral-gray-3">
                대여 가능한 물품이 없습니다.
              </span>
            )}
          {itemRequests.map((itemRequest) => (
            <RentalAvailableItemCard
              key={itemRequest.item.itemId}
              itemInfo={itemRequest}
              organizationId={organizationId}
              organizationName={displayOrganizationName}
            />
          ))}
          {isFetchNextPageError && (
            <button
              type="button"
              onClick={() => void fetchNextPage()}
              disabled={isFetchingNextPage}
              className="py-3 text-sm text-secondary-2 disabled:text-neutral-gray-3"
            >
              {isFetchingNextPage
                ? "물품을 불러오는 중..."
                : "물품을 더 불러오지 못했습니다. 다시 시도"}
            </button>
          )}
          {hasNextPage && !isFetchNextPageError && (
            <div
              ref={loadMoreRef}
              className="py-3 text-center text-sm text-neutral-gray-3"
            >
              {isFetchingNextPage ? "물품을 불러오는 중..." : ""}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClientHome;
