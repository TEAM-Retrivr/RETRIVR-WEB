type CustomCheckBoxProps = {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
};

const CustomCheckBox = ({
  checked,
  onCheckedChange,
  disabled,
}: CustomCheckBoxProps) => {
  const handleToggle = () => {
    if (disabled) return;
    onCheckedChange?.(!checked);
  };

  return (
    <div
      className="px-1 inline-flex items-center"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={handleToggle}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        readOnly
      />
      <div
        className={`w-4.75 h-4.75 flex items-center justify-center transition-colors rounded-[4px] border-1 ${
          checked
            ? "bg-primary border-primary"
            : "bg-white border-neutral-gray-4"
        } ${disabled ? "opacity-60" : ""}`}
      >
        {checked && <img src="/icons/client/checked.svg" alt="체크됨" />}
      </div>
    </div>
  );
};

export default CustomCheckBox;
