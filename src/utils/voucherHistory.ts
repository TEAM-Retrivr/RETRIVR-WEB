import type { WheelDate } from "../components/membership/HistoryDateWheel";
import {
  USAGE_HISTORY_ITEMS,
  type HistoryPeriodOption,
  type UsageHistoryItem,
} from "../types/voucherList";

export const parseLocalDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const endOfDay = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );

export const toWheelDate = (date: Date): WheelDate => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
});

export const fromWheelDate = (value: WheelDate) =>
  new Date(value.year, value.month - 1, value.day);

export const shiftMonths = (base: Date, months: number) => {
  const next = new Date(base);
  next.setMonth(next.getMonth() - months);
  return startOfDay(next);
};

export const HISTORY_DATE_BOUNDS = (() => {
  if (USAGE_HISTORY_ITEMS.length === 0) {
    const today = toWheelDate(new Date());
    return { start: today, end: today };
  }

  const timestamps = USAGE_HISTORY_ITEMS.map((item) =>
    parseLocalDate(item.occurredAt).getTime(),
  );
  return {
    start: toWheelDate(new Date(Math.min(...timestamps))),
    end: toWheelDate(new Date(Math.max(...timestamps))),
  };
})();

const currentYear = new Date().getFullYear();

export const HISTORY_YEAR_RANGE = {
  min: Math.min(HISTORY_DATE_BOUNDS.start.year, currentYear - 5),
  max: Math.max(HISTORY_DATE_BOUNDS.end.year, currentYear + 5),
};

export const filterUsageHistory = (
  items: UsageHistoryItem[],
  period: HistoryPeriodOption,
  customStart: WheelDate,
  customEnd: WheelDate,
) => {
  if (period === "all") return items;

  if (period === "custom") {
    const start = fromWheelDate(customStart);
    const end = fromWheelDate(customEnd);
    const from = startOfDay(start <= end ? start : end);
    const to = endOfDay(start <= end ? end : start);
    return items.filter((item) => {
      const date = parseLocalDate(item.occurredAt);
      return date >= from && date <= to;
    });
  }

  const months = period === "1m" ? 1 : period === "6m" ? 6 : 12;
  const from = shiftMonths(new Date(), months);
  return items.filter((item) => parseLocalDate(item.occurredAt) >= from);
};
