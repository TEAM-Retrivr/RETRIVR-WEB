import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { useItemList } from "../../../../hooks/queries/useClientQueries";
import RentalAvailableItemCard from "../../../../components/cards/client/RentalAvailableItemCard";
import { LockerLayout } from "../../locker-rental/components/LockerLayout";
import { LockerHeader } from "../../locker-rental/components/LockerHeader";
import { RentalTypeTabs } from "../../locker-rental/components/RentalTypeTabs";
import {
  BoardViewport,
  EmptyMessage,
} from "../../locker-rental/components/LockerHome.styles";
import { theme } from "../../../common/styles/theme";
import { useRentalPlace } from "../model/rental-place.context";
import { rentalHomePath } from "../routes";

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  h1 {
    margin: 12px 0;
    ${theme.typography.heading3};
  }
`;

// 운영 페이지를 변경하지 않고 기존 물품 API/카드를 이름 기반 renewal 경로에서 재사용한다.
export const ItemRentalHomeRoute = () => {
  const { place, navigationState } = useRentalPlace();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const items = useItemList({
    organizationId: place.id,
    size: 10,
    enabled: true,
  });
  const loadMore = useRef<HTMLDivElement>(null);
  const {
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = items;
  useEffect(() => {
    if (
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchNextPageError ||
      !loadMore.current
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void fetchNextPage();
      },
      { threshold: 0.2 },
    );
    observer.observe(loadMore.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);
  const allItems = items.data?.pages.flatMap((page) => page.items) ?? [];
  return (
    <LockerLayout>
      <LockerHeader
        placeName={place.name}
        onBack={() => navigate("/renewal/place-search")}
      />
      <RentalTypeTabs
        type="item"
        onLockers={() =>
          navigate(rentalHomePath(params, "locker"), { state: navigationState })
        }
      />
      <BoardViewport aria-label="대여 물품 목록">
        <Items>
          <h1>대여 가능 물품</h1>
          {items.isPending ? (
            <EmptyMessage role="status">물품을 불러오고 있습니다.</EmptyMessage>
          ) : items.isError && !items.data ? (
            <EmptyMessage role="alert">
              물품을 불러오지 못했습니다.
              <br />
              <button type="button" onClick={() => void items.refetch()}>
                다시 시도
              </button>
            </EmptyMessage>
          ) : allItems.length === 0 ? (
            <EmptyMessage role="status">
              대여 가능한 물품이 없습니다.
            </EmptyMessage>
          ) : (
            allItems.map((item) => (
              <RentalAvailableItemCard
                key={item.itemId}
                itemInfo={{ item, nextCursor: 0 }}
                organizationId={place.id}
                organizationName={place.name}
              />
            ))
          )}
          {isFetchNextPageError && (
            <button
              type="button"
              onClick={() => void fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              물품을 더 불러오지 못했습니다. 다시 시도
            </button>
          )}
          {hasNextPage && !isFetchNextPageError && (
            <div ref={loadMore} role="status">
              {isFetchingNextPage ? "물품을 불러오는 중..." : ""}
            </div>
          )}
        </Items>
      </BoardViewport>
    </LockerLayout>
  );
};
