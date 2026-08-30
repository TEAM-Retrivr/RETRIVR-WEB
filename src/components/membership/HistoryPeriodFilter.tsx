import {
  HISTORY_PERIOD_LABEL,
  type HistoryPeriodOption,
} from "../../types/voucherList";
import HistoryDateChipGroup from "./HistoryDateChipGroup";
import HistoryDateWheel, { type WheelDate } from "./HistoryDateWheel";

const PERIOD_OPTIONS: HistoryPeriodOption[] = [
  "all",
  "1m",
  "6m",
  "1y",
  "custom",
];

type HistoryPeriodFilterProps = {
  isOpen: boolean;
  period: HistoryPeriodOption;
  editingSide: "start" | "end";
  customStart: WheelDate;
  customEnd: WheelDate;
  onToggleOpen: () => void;
  onSelectPeriod: (period: HistoryPeriodOption) => void;
  onChangeEditingSide: (side: "start" | "end") => void;
  onChangeCustomStart: (value: WheelDate) => void;
  onChangeCustomEnd: (value: WheelDate) => void;
};

const HistoryPeriodFilter = ({
  isOpen,
  period,
  editingSide,
  customStart,
  customEnd,
  onToggleOpen,
  onSelectPeriod,
  onChangeEditingSide,
  onChangeCustomStart,
  onChangeCustomEnd,
}: HistoryPeriodFilterProps) => (
  <div className="flex flex-col gap-2">
    <button
      type="button"
      onClick={onToggleOpen}
      className="flex w-fit items-center gap-2 rounded-md bg-secondary-4 px-2.5 py-1.5 cursor-pointer"
    >
      <span className="text-12px font-semibold leading-[1.4] text-neutral-gray-1">
        {HISTORY_PERIOD_LABEL[period]}
      </span>
      <img
        src="/icons/right-arrow2.svg"
        alt=""
        className={`h-[8.4px] w-[4.2px] transition-transform ${
          isOpen ? "-rotate-90" : "rotate-90"
        }`}
        aria-hidden
      />
    </button>

    {isOpen ? (
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar rounded-[7.5px] bg-secondary-4 px-2.5 py-2.5">
        {PERIOD_OPTIONS.map((option) => {
          const isSelected = period === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelectPeriod(option)}
              className="flex shrink-0 items-center gap-1 px-1.5 py-0.5 cursor-pointer"
            >
              <span
                className={`size-1 shrink-0 rounded-full ${
                  isSelected ? "bg-primary" : "bg-neutral-gray-4"
                }`}
                aria-hidden
              />
              <span
                className={`text-12px leading-[1.4] whitespace-nowrap ${
                  isSelected
                    ? "font-semibold text-neutral-gray-1"
                    : "font-medium text-neutral-gray-3"
                }`}
              >
                {HISTORY_PERIOD_LABEL[option]}
              </span>
            </button>
          );
        })}
      </div>
    ) : null}

    {isOpen && period === "custom" ? (
      <div className="rounded-[7.5px] bg-secondary-4 px-4 py-[18px]">
        <div className="flex items-center justify-center gap-2">
          <HistoryDateChipGroup
            value={customStart}
            isActive={editingSide === "start"}
            onClick={() => onChangeEditingSide("start")}
          />
          <span className="text-12px font-medium text-neutral-gray-3">~</span>
          <HistoryDateChipGroup
            value={customEnd}
            isActive={editingSide === "end"}
            onClick={() => onChangeEditingSide("end")}
          />
        </div>
        <HistoryDateWheel
          value={editingSide === "start" ? customStart : customEnd}
          onChange={
            editingSide === "start" ? onChangeCustomStart : onChangeCustomEnd
          }
        />
      </div>
    ) : null}
  </div>
);

export default HistoryPeriodFilter;
