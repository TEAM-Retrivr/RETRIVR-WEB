import { useEffect, useMemo, useRef } from "react";
import { HISTORY_YEAR_RANGE } from "../../utils/voucherHistory";

const WHEEL_ITEM_HEIGHT = 29;

type DateWheelColumnProps = {
  values: number[];
  selectedValue: number;
  unit: string;
  onChange: (value: number) => void;
  formatter?: (value: number) => string;
};

const DateWheelColumn = ({
  values,
  selectedValue,
  unit,
  onChange,
  formatter = (value) => String(value).padStart(2, "0"),
}: DateWheelColumnProps) => {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const settleTimerRef = useRef<number | null>(null);

  const clearSettleTimer = () => {
    if (settleTimerRef.current) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  };

  const scrollToValue = (value: number, behavior: ScrollBehavior = "auto") => {
    const container = wheelRef.current;
    if (!container) return;
    const index = values.indexOf(value);
    if (index < 0) return;
    // padding-top 1칸이 있으므로 values[i]는 scrollTop = i * HEIGHT 일 때 중앙에 온다.
    container.scrollTo({
      top: index * WHEEL_ITEM_HEIGHT,
      behavior,
    });
  };

  useEffect(() => {
    clearSettleTimer();
    scrollToValue(selectedValue, "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue, values]);

  useEffect(() => {
    return () => {
      clearSettleTimer();
    };
  }, []);

  const handleScroll = () => {
    const container = wheelRef.current;
    if (!container) return;

    const nearestIndex = Math.round(container.scrollTop / WHEEL_ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(values.length - 1, nearestIndex));
    const nextValue = values[clampedIndex];
    if (nextValue !== selectedValue) {
      onChange(nextValue);
    }

    clearSettleTimer();
    settleTimerRef.current = window.setTimeout(() => {
      scrollToValue(nextValue, "smooth");
    }, 80);
  };

  return (
    <div className="relative min-w-[56px]">
      <div
        ref={wheelRef}
        onScroll={handleScroll}
        className="h-[87px] overflow-y-auto no-scrollbar snap-y snap-mandatory py-[29px]"
      >
        {values.map((value) => (
          <div
            key={value}
            className="flex h-[29px] items-center justify-center snap-start"
          >
            <button
              type="button"
              onClick={() => {
                onChange(value);
                scrollToValue(value, "smooth");
              }}
              className={`z-10 whitespace-nowrap text-12px leading-[1.4] cursor-pointer ${
                value === selectedValue
                  ? "font-semibold text-neutral-gray-1"
                  : "font-normal text-neutral-gray-4"
              }`}
            >
              {formatter(value)}
              {unit}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export type WheelDate = {
  year: number;
  month: number;
  day: number;
};

type HistoryDateWheelProps = {
  value: WheelDate;
  onChange: (next: WheelDate) => void;
};

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

const HistoryDateWheel = ({ value, onChange }: HistoryDateWheelProps) => {
  const years = useMemo(() => {
    const minYear = Math.min(HISTORY_YEAR_RANGE.min, value.year);
    const maxYear = Math.max(HISTORY_YEAR_RANGE.max, value.year);
    return Array.from(
      { length: maxYear - minYear + 1 },
      (_, index) => minYear + index,
    );
  }, [value.year]);

  const months = useMemo(
    () => Array.from({ length: 12 }, (_, index) => index + 1),
    [],
  );
  const days = useMemo(
    () =>
      Array.from(
        { length: getDaysInMonth(value.year, value.month) },
        (_, index) => index + 1,
      ),
    [value.year, value.month],
  );

  const update = (partial: Partial<WheelDate>) => {
    const next = { ...value, ...partial };
    const maxDay = getDaysInMonth(next.year, next.month);
    if (next.day > maxDay) next.day = maxDay;
    onChange(next);
  };

  return (
    <div className="mt-4 flex items-center justify-center gap-5">
      <DateWheelColumn
        values={years}
        selectedValue={value.year}
        unit="년"
        formatter={(year) => String(year)}
        onChange={(year) => update({ year })}
      />
      <DateWheelColumn
        values={months}
        selectedValue={value.month}
        unit="월"
        onChange={(month) => update({ month })}
      />
      <DateWheelColumn
        values={days}
        selectedValue={value.day}
        unit="일"
        onChange={(day) => update({ day })}
      />
    </div>
  );
};

export default HistoryDateWheel;
