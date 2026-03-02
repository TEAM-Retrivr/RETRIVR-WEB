import { useState } from "react"; // 체크 아이콘 라이브러리 (없으면 SVG로 대체 가능)

interface ConsentSectionCardProps {
  label: string;
}

export const ConsentSectionCard = ({ label }: ConsentSectionCardProps) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="rounded-[16px] shadow-consent-card">
      <label className="flex items-center ">
        {/* 체크박스 영역 */}
        <div className="px-5">
          {/* 실제 체크박스는 숨김 */}
          <input
            type="checkbox"
            className="sr-only"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          {/* 커스텀 체크박스 영역 */}
          <div
            className={`w-4.5 h-4.5 rounded-md flex items-center justify-center transition-colors border-1
            ${isChecked ? "bg-primary border-primary" : "bg-white border-neutral-gray-4"}`}
          >
            {/* 체크되었을 때 아이콘 표시 */}
            {isChecked && <img src="/icons/client/checked.svg" alt="체크됨" />}
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
