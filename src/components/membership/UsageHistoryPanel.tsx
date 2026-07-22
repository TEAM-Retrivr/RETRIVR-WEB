import { useMemo, useState } from "react";
import {
  USAGE_HISTORY_ITEMS,
  type HistoryPeriodOption,
} from "../../types/voucherList";
import {
  HISTORY_DATE_BOUNDS,
  filterUsageHistory,
} from "../../utils/voucherHistory";
import type { WheelDate } from "./HistoryDateWheel";
import HistoryPeriodFilter from "./HistoryPeriodFilter";
import UsageHistoryItemCard from "./UsageHistoryItemCard";

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

  const filteredHistory = useMemo(
    () =>
      filterUsageHistory(
        USAGE_HISTORY_ITEMS,
        period,
        customStart,
        customEnd,
      ),
    [period, customStart, customEnd],
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
        {filteredHistory.length === 0 ? (
          <p className="py-10 text-center text-12px text-neutral-gray-3">
            선택한 기간의 이용 내역이 없어요
          </p>
        ) : (
          filteredHistory.map((item) => (
            <UsageHistoryItemCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default UsageHistoryPanel;
