import { type InputHTMLAttributes, forwardRef } from "react";

// 필수 속성들을 포함한 인터페이스 정의
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isRequired?: boolean; // 필수 여부 (true/false)
}

const CommonInput = forwardRef<HTMLInputElement, InputProps>(
  ({ isRequired, className, type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col w-full max-w-[338px] items-center max-h-[97px] gap-2">
        {/* 인풋 본체 */}
        <input
          ref={ref}
          type={type} // 입력받은 값의 타입 : text, password, email 등
          required={isRequired} // 해당 입력의 필수 여부 : true, false 중 하나
          className={`
            w-full max-w-[305px] max-h-[48px] px-5 py-4 bg-[#F8F9F9] rounded-[14px] 
            text-[#333] text-[1rem] font-[Pretendard] outline-none transition-all
            placeholder:text-gray-400 placeholder:text-[1rem] leading-none
            focus:ring-2 focus:ring-blue-100
            ${className}
          `}
          {...props}
        />
      </div>
    );
  },
);

CommonInput.displayName = "CommonInput";

export default CommonInput;
