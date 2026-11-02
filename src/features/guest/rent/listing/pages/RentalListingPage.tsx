import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useItemList } from "../../../../../hooks/queries/useClientQueries";
import { resolveProfileImageDisplayUrl } from "../../../../../utils/profileImageUpload";
import { PageLayout } from "../../../../common/layouts/PageLayout";
import { TitleHeader } from "../../../../common/components/header/TitleHeader";
import { OrganizationInfo } from "../../../../common/components/organization/OrganizationInfo";
import {
  getOrganizationId,
  type RentalItem,
  type RentalListingState,
  type RentalTab,
  type RentalUnit,
} from "../types";
import TabBar from "../components/tabs/TabBar";
import ItemCard from "../components/cards/ItemCard";
import ItemBottomSheet from "../bottom-sheets/ItemBottomSheet";
import NonUnitItemBottomSheet from "../bottom-sheets/non-unit/NonUnitItemBottomSheet";
import UnitItemBottomSheet from "../bottom-sheets/unit/UnitItemBottomSheet";
import { useRentalItemSheet } from "../hooks/useRentalItemSheet";
import {
  Surface,
  StickyHeader,
  OrganizationSection,
  StickyTabs,
  PanelViewport,
  PanelTrack,
  Panel,
  ItemList,
  Message,
  Retry,
} from "./RentalListingPage.styles";

const RentalListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as RentalListingState | null;
  const organizationId = getOrganizationId(state);
  const [tab, setTab] = useState<RentalTab>("items");
  const sheet = useRentalItemSheet(organizationId);
  const list = useItemList({
    organizationId,
    size: 10,
    enabled: organizationId > 0,
  });
  const organization = list.data?.pages[0];
  const organizationName =
    organization?.organizationName ?? state?.organizationName ?? "대여지";
  const profileImageUrl = resolveProfileImageDisplayUrl(
    organization?.profileImageUrl ?? state?.profileImageUrl,
  );
  const items = [
    ...new Map(
      list.data?.pages
        .flatMap((page) => page.items)
        .map((item) => [item.itemId, item]) ?? [],
    ).values(),
  ];
  const selectedItem = sheet.selection?.item;
  const detail = sheet.selection?.detail;
  const loadMore = useRef<HTMLDivElement>(null);
  const {
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = list;

  useEffect(() => {
    if (
      tab !== "items" ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchNextPageError
    )
      return;
    const target = loadMore.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void fetchNextPage();
      },
      { threshold: 0.2 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [
    tab,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  const rent = (item: RentalItem, unit?: RentalUnit) => {
    navigate("/renewal/rental-submit", {
      state: {
        itemId: item.itemId,
        itemUnitId: unit?.itemUnitId,
        organizationId,
        organizationName,
        guaranteedGoods: item.guaranteedGoods ?? "없음",
        borrowerRequirements: detail?.borrowerRequirements ?? [],
        rentalItem: item,
        itemUnitLabel: unit?.label,
      },
    });
  };

  if (!organizationId) return <Navigate to="/renewal/place-search" replace />;

  return (
    <PageLayout>
      <Surface>
        <StickyHeader>
          <TitleHeader
            placeName={organizationName}
            onClick={() => navigate("/renewal/place-search")}
          />
        </StickyHeader>
        <OrganizationSection>
          <OrganizationInfo
            name={organizationName}
            description={state?.description}
            icon={
              <img
                src={profileImageUrl || "/icons/default-profile.svg"}
                alt=""
                onError={(event) => {
                  const img = event.currentTarget;
                  if (!img.src.endsWith("/icons/default-profile.svg"))
                    img.src = "/icons/default-profile.svg";
                }}
              />
            }
          />
        </OrganizationSection>
        <StickyTabs>
          <TabBar
            value={tab}
            onChange={(value) => {
              sheet.close();
              setTab(value);
            }}
          />
        </StickyTabs>
        <PanelViewport>
          <PanelTrack $index={tab === "items" ? 0 : 1}>
            <Panel
              id="rental-panel-items"
              role="tabpanel"
              aria-labelledby="rental-tab-items"
              aria-hidden={tab !== "items"}
              inert={tab !== "items"}
            >
              {list.isPending ? (
                <Message role="status">물품을 불러오고 있습니다.</Message>
              ) : list.isError && !list.data ? (
                <Message role="alert">
                  <p>물품을 불러오지 못했습니다.</p>
                  <Retry type="button" onClick={() => void list.refetch()}>
                    다시 시도
                  </Retry>
                </Message>
              ) : (
                <ItemList>
                  {sheet.error && (
                    <Message role="alert">
                      <p>{sheet.error.message}</p>
                      <Retry
                        type="button"
                        onClick={() => {
                          const item = items.find(
                            (candidate) =>
                              candidate.itemId === sheet.error?.itemId,
                          );
                          if (item) void sheet.open(item);
                        }}
                      >
                        다시 시도
                      </Retry>
                    </Message>
                  )}
                  {items.map((item) => (
                    <ItemCard
                      key={item.itemId}
                      item={item}
                      loading={sheet.pendingItemId === item.itemId}
                      onClick={() => void sheet.open(item)}
                    />
                  ))}
                  {items.length === 0 && (
                    <Message>등록된 대여 물품이 없습니다.</Message>
                  )}
                  {isFetchNextPageError ? (
                    <Message role="alert">
                      <p>물품을 더 불러오지 못했습니다.</p>
                      <Retry
                        type="button"
                        onClick={() => void fetchNextPage()}
                        disabled={isFetchingNextPage}
                      >
                        다시 시도
                      </Retry>
                    </Message>
                  ) : (
                    hasNextPage && (
                      <div ref={loadMore} aria-live="polite">
                        {isFetchingNextPage
                          ? "물품을 더 불러오고 있습니다."
                          : ""}
                      </div>
                    )
                  )}
                </ItemList>
              )}
            </Panel>
            <Panel
              id="rental-panel-lockers"
              role="tabpanel"
              aria-labelledby="rental-tab-lockers"
              aria-hidden={tab !== "lockers"}
              inert={tab !== "lockers"}
            >
              <Message>사물함 대여를 준비 중입니다.</Message>
            </Panel>
          </PanelTrack>
        </PanelViewport>
      </Surface>
      {selectedItem && detail && (
        <ItemBottomSheet
          key={`${organizationId}:${selectedItem.itemId}`}
          label={`${selectedItem.name} 물품 정보`}
          onClose={sheet.close}
        >
          {detail.itemManagementType === "UNIT" ? (
            <UnitItemBottomSheet
              item={selectedItem}
              units={detail.itemUnits ?? []}
              onRent={(unit) => rent(selectedItem, unit)}
            />
          ) : (
            <NonUnitItemBottomSheet
              item={selectedItem}
              onRent={() => rent(selectedItem)}
            />
          )}
        </ItemBottomSheet>
      )}
    </PageLayout>
  );
};
export default RentalListingPage;
