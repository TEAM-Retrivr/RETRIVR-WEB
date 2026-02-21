import { useState } from "react";

const RentalStatusToggle = () => {
  // 상태 정의: 'available' | 'unavailable' | 'broken'
  const [status, setStatus] = useState("available");

  const options = [
    { label: "대여 가능", value: "available", color: "bg-green-500" },
    { label: "대여 불가", value: "unavailable", color: "bg-red-500" },
    { label: "고장", value: "broken", color: "bg-gray-500" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-lg font-bold">기자재 상태 설정</h3>

      {/* 토글 컨테이너 */}
      <div className="relative flex w-72 items-center justify-between rounded-xl bg-gray-100 p-1 shadow-inner">
        {/* 배경 슬라이더 (애니메이션 효과) */}
        <div
          className={`absolute h-8 w-[92px] rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out`}
          style={{
            transform: `translateX(${
              options.findIndex((opt) => opt.value === status) * 92
            }px)`,
          }}
        />

        {/* 버튼들 */}
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatus(option.value)}
            className={`relative z-10 w-full py-1.5 text-sm font-medium transition-colors duration-200 ${
              status === option.value ? "text-black" : "text-gray-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RentalStatusToggle;
