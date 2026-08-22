import { useMemo, useState } from "react";
import type {
  HistoryPeriodOption,
  UsageHistoryItem,
} from "../../types/voucherList";
import type { AdminMembershipHistoryItemResponse } from "../../api/admin/admin.type";
import { useAdminMembershipHistory } from "../../hooks/queries/useAdminQueries";
import {
  HISTORY_DATE_BOUNDS,
  formatHistoryAmount,
  formatHistoryOccurredAt,
  resolveHistoryQueryRange,
} from "../../utils/voucherHistory";
import type { WheelDate } from "./HistoryDateWheel";
import HistoryPeriodFilter from "./HistoryPeriodFilter";
import UsageHistoryItemCard from "./UsageHistoryItemCard";

const toUsageHistoryItem = (
  item: AdminMembershipHistoryItemResponse,
): UsageHistoryItem => ({
  id: `${item.membershipPassId}-${item.occurredAt}`,
  title: item.title,
  datetimeLabel: formatHistoryOccurredAt(item.occurredAt),
  occurredAt: item.occurredAt,
  kind: item.type === "COUPON" ? "coupon" : "payment",
  amountLabel:
    item.type === "SUBSCRIPTION" && item.amount > 0
      ? formatHistoryAmount(item.amount)
      : undefined,
});

const UsageHistoryPanel = () => {
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [period, setPeriod] = useState<HistoryPeriodOption>("all");
  const [editingSide, setEditingSide] = useState<"start" | "end">("start");
  const [customStart, setCustomStart] = useState<WheelDate>(
    HISTORY_DATE_BOUNDS.start,
  );
  const [customEnd, setCustomEnd] = useState<WheelDate>(
    HISTORY_DATE_BOUNDS.end,
  );

  const queryRange = useMemo(
    () => resolveHistoryQueryRange(period, customStart, customEnd),
    [period, customStart, customEnd],
  );
  const {
    data,
    isLoading,
    isError,
    isSuccess,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useAdminMembershipHistory(queryRange);

  const historyItems = useMemo(
    () => data?.pages.flatMap((page) => page.items).map(toUsageHistoryItem) ?? [],
    [data],
  );

  const handleSelectPeriod = (next: HistoryPeriodOption) => {
    if (next === "custom") {
      setCustomStart(HISTORY_DATE_BOUNDS.start);
      setCustomEnd(HISTORY_DATE_BOUNDS.end);
      setPeriod(next);
      return;
    }
    setPeriod(next);
    setIsPeriodOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <HistoryPeriodFilter
        isOpen={isPeriodOpen}
        period={period}
        editingSide={editingSide}
        customStart={customStart}
        customEnd={customEnd}
        onToggleOpen={() => setIsPeriodOpen((open) => !open)}
        onSelectPeriod={handleSelectPeriod}
        onChangeEditingSide={setEditingSide}
        onChangeCustomStart={setCustomStart}
        onChangeCustomEnd={setCustomEnd}
      />

      <div className="mt-2 flex flex-col gap-2">
        {isLoading ? (
          <p className="py-10 text-center text-12px text-neutral-gray-3">
            이용 내역을 불러오는 중이에요
          </p>
        ) : null}

        {!isLoading && isError && historyItems.length === 0 ? (
          <p className="py-10 text-center text-12px text-neutral-gray-3">
            이용 내역을 불러오지 못했어요
          </p>
        ) : null}

        {!isLoading && !isError && isSuccess && historyItems.length === 0 ? (
          <p className="py-10 text-center text-12px text-neutral-gray-3">
            선택한 기간의 이용 내역이 없어요
          </p>
        ) : null}

        {historyItems.length > 0
          ? historyItems.map((item) => (
              <UsageHistoryItemCard key={item.id} item={item} />
            ))
          : null}

        {isError && historyItems.length > 0 ? (
          <p className="py-3 text-center text-12px text-neutral-gray-3">
            다음 내역을 불러오지 못했어요
          </p>
        ) : null}

        {hasNextPage ? (
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-2 py-3 text-center text-12px font-medium text-secondary-2 disabled:text-neutral-gray-3"
          >
            {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default UsageHistoryPanel;
