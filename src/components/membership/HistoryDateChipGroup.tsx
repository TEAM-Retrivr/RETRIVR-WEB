import type { WheelDate } from "./HistoryDateWheel";

type HistoryDateChipGroupProps = {
  value: WheelDate;
  isActive: boolean;
  onClick: () => void;
};

const HistoryDateChipGroup = ({
  value,
  isActive,
  onClick,
}: HistoryDateChipGroupProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1 rounded-md p-0.5 cursor-pointer ${
      isActive ? "ring-1 ring-primary/40" : ""
    }`}
  >
    {[
      String(value.year),
      String(value.month).padStart(2, "0"),
      String(value.day).padStart(2, "0"),
    ].map((part, index) => (
      <span
        key={`${part}-${index}`}
        className="inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-[4px] bg-neutral-white px-1 text-10px font-semibold leading-[1.3] text-neutral-gray-1"
      >
        {part}
      </span>
    ))}
  </button>
);

export default HistoryDateChipGroup;
