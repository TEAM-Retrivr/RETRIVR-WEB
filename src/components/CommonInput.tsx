import { type InputHTMLAttributes, forwardRef } from "react";

// 필수 속성들을 포함한 인터페이스 정의
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isRequired?: boolean; // 필수 여부 (true/false)
  inputSize?: "small" | "medium" | "large";
}

const sizeStyles: Record<"small" | "medium" | "large", string> = {
  small: "max-w-[180px] min-h-[36px] px-3 py-2 text-[0.875rem] rounded-[10px]",
  medium:
    "max-w-[260px] min-h-[42px] px-4 py-3 text-[0.9375rem] rounded-[12px]",
  large: "max-w-[338px] min-h-[48px] px-5 py-4 text-[1rem] rounded-[14px]",
};

const wrapperSizeStyles: Record<"small" | "medium" | "large", string> = {
  small: "max-w-[180px] max-h-[72px]",
  medium: "max-w-[260px] max-h-[84px]",
  large: "max-w-[338px] max-h-[97px]",
};

const CommonInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { inputSize = "large", isRequired, className, type = "text", ...props },
    ref,
  ) => {
    return (
      <div
        className={`flex flex-col w-full items-center gap-2 ${wrapperSizeStyles[inputSize]}`}
      >
        {/* 인풋 본체 */}
        <input
          ref={ref}
          type={type} // 입력받은 값의 타입 : text, password, email 등
          required={isRequired} // 해당 입력의 필수 여부 : true, false 중 하나
          className={`
            w-full bg-[#F8F9F9] text-14px text-neutral-gray-1 font-[Pretendard] outline-hidden transition-all
            placeholder:text-gray-400 leading-none
            focus:ring-2 focus:ring-blue-100
            
            ${sizeStyles[inputSize]}
            ${className ?? ""}
          `}
          {...props}
        />
      </div>
    );
  },
);

CommonInput.displayName = "CommonInput";

export default CommonInput;
