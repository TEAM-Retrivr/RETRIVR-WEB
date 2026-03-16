interface ConsentSectionCardProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ConsentSectionCard = ({
  label,
  checked,
  onCheckedChange,
}: ConsentSectionCardProps) => {
  return (
    <div className="rounded-[16px] shadow-consent-card">
      <label className="flex items-center ">
        {/* 체크박스 영역 */}
        <div className="px-5">
          {/* 실제 체크박스는 숨김 */}
          <input
            type="checkbox"
            className="peer sr-only"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
          />
          {/* 커스텀 체크박스 영역 */}
          <div
            className={`w-4.5 h-4.5 rounded-md flex items-center justify-center transition-colors border-1 ${checked ? "bg-primary border-primary" : "bg-white border-neutral-gray-4"}`}
          >
            {/* 체크되었을 때 아이콘 표시 */}
            {checked && <img src="/icons/client/checked.svg" alt="체크됨" />}
          </div>
        </div>
        {/* 2. 텍스트 영역 */}
        <div className="text-14px text-neutral-gray-2 font-[Pretendard] font-[400] leading-[120%] py-4.5 whitespace-pre-line">
          {label}
        </div>
      </label>
    </div>
  );
};
