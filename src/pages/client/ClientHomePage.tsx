import { Layout } from "../../components/Layout";
import RentalAvailableItemCard from "../../components/cards/client/RentalAvailableItemCard";
import type { ItemRequest } from "../../types/item";
import { useItemList } from "../../hooks/queries/useClientQueries";
import UserIcon from "../../components/UserIcon";
import { useLocation, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const ClientHome = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  const organizationIdParam = searchParams.get("organizationId");
  const organizationId = organizationIdParam
    ? Number(organizationIdParam)
    : NaN;

  const state = location.state as
    | {
        name?: string;
        imageURL?: string;
      }
    | undefined;
  const cachedOrganization = queryClient.getQueryData<{
    name?: string;
    imageURL?: string;
  }>(["selectedOrganization", organizationId]);
  const organizationName = state?.name ?? cachedOrganization?.name ?? "";
  const imageURL = state?.imageURL ?? cachedOrganization?.imageURL ?? "";

  const { data, isLoading, error } = useItemList({
    organizationId,
    size: 10,
    enabled: Number.isFinite(organizationId) && organizationId > 0,
  });

  const itemRequests: ItemRequest[] =
    data?.items?.map((item) => ({
      item,
      nextCursor: data.nextCursor ?? 0,
    })) ?? [];

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
  if (error) {
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
        className="w-full max-w-[402px] h-[20%] max-h-[180px] pt-[12.66%]
      px-[7.464%] bg-home-gradient rounded-bl-[45px]"
      >
        {/* 상단 로고 텍스트 및 사람 아이콘 */}
        <div className="w-full flex justify-between">
          <img src="/icons/home/retrivr_text_outline.svg" alt="로고 텍스트" />
          <img src="/icons/home/man_icon.svg" alt="사람 아이콘" />
        </div>
        <div className="flex w-full max-h-[72px] mt-[50.64px]">
          {/* 프로필 사진 */}
          <UserIcon imageURL={imageURL} alt={organizationName || "대여지"} />
          <div />
          {/* 주소 및 단체 이름 */}
          <div className="pl-[12px] pt-[12.68px] gap-[4px] font-[Pretendard] leading-none flex flex-col">
            <span className="text-neutral-dark text-start text-[12px] font-[400]">
              {/* 주소 영역 - 아직 구현 X */}
            </span>
            <span className="text-neutral-white text-start text-[16px] font-[600]">
              {organizationName}
            </span>
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
          {error && (
            <span className="text-sm text-red-500">
              대여 가능 물품을 불러오는 중 오류가 발생했습니다.
            </span>
          )}
          {!isLoading && !error && itemRequests.length === 0 && (
            <span className="text-sm text-neutral-gray-3">
              대여 가능한 물품이 없습니다.
            </span>
          )}
          {!isLoading &&
            !error &&
            itemRequests.map((itemRequest) => (
              <RentalAvailableItemCard
                key={itemRequest.item.itemId}
                itemInfo={itemRequest}
                organizationId={organizationId}
                organizationName={organizationName}
              />
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default ClientHome;
