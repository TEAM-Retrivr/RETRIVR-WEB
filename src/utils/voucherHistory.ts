import type { WheelDate } from "../components/membership/HistoryDateWheel";
import type {
  HistoryPeriodOption,
  UsageHistoryItem,
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

export const toIsoDate = (value: Date | WheelDate): string => {
  const date = value instanceof Date ? value : fromWheelDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const shiftMonths = (base: Date, months: number) => {
  const next = new Date(base);
  next.setMonth(next.getMonth() - months);
  return startOfDay(next);
};

export const HISTORY_DATE_BOUNDS = (() => {
  const today = new Date();
  return {
    start: toWheelDate(shiftMonths(today, 60)),
    end: toWheelDate(today),
  };
})();

const currentYear = new Date().getFullYear();

export const HISTORY_YEAR_RANGE = {
  min: Math.min(HISTORY_DATE_BOUNDS.start.year, currentYear - 5),
  max: Math.max(HISTORY_DATE_BOUNDS.end.year, currentYear + 5),
};

export const resolveHistoryQueryRange = (
  period: HistoryPeriodOption,
  customStart: WheelDate,
  customEnd: WheelDate,
): { start?: string; end?: string } => {
  if (period === "all") return {};

  if (period === "custom") {
    const start = fromWheelDate(customStart);
    const end = fromWheelDate(customEnd);
    const from = start <= end ? start : end;
    const to = start <= end ? end : start;
    return { start: toIsoDate(from), end: toIsoDate(to) };
  }

  const months = period === "1m" ? 1 : period === "6m" ? 6 : 12;
  const today = new Date();
  return {
    start: toIsoDate(shiftMonths(today, months)),
    end: toIsoDate(today),
  };
};

export const formatHistoryAmount = (amount: number): string =>
  `${amount.toLocaleString("ko-KR")}₩`;

const WEEKDAY_LABEL = ["일", "월", "화", "수", "목", "금", "토"] as const;

export const formatHistoryOccurredAt = (value: string): string => {
  const dottedWithWeekday = value.match(
    /^(\d{4})\.(\d{2})\.(\d{2})\((.+)\)\s*(\d{2}:\d{2})/,
  );
  if (dottedWithWeekday) {
    return `${dottedWithWeekday[1]}. ${dottedWithWeekday[2]}. ${dottedWithWeekday[3]}.(${dottedWithWeekday[4]}) ${dottedWithWeekday[5]}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  return `${year}. ${month}. ${day}.(${WEEKDAY_LABEL[parsed.getDay()]}) ${hours}:${minutes}`;
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
