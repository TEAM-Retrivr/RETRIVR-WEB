import React from "react";

// React.ButtonHTMLAttributes를 상속받으면 onClick, onMouseEnter 등
// 모든 기본 버튼 이벤트를 자동으로 지원

/*
    variant는 색상 지정
    // primary: 파란색
    // outline: 흰색
*/
/*
    size는 버튼의 크기에 따라서 다르게 설정
    // xs : 가장 작은 버튼 크기 -> RentalRequestCard에서 사용
    // sm: 작은 버튼 크기 -> RegisterPage에서 사용
    // md: 중간 길이 버튼 크기 -> 관리자 대여 신청 확인에서 사용
    // lg: 가장 긴 버튼 크기 -> LandingPage 등에서 사용
*/
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gray" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
}

const Button = ({
  variant = "primary", // 디폴트 색상
  size = "md", // 디폴트 사이즈
  children, // 텍스트, 이미지가 들어갈 자리 (element)
  onClick, // 버튼별 이벤트 리스너 -> 각 페이지에서 정의한 후 대입
  className,
  type,
  ...props
}: ButtonProps) => {
  const { disabled } = props;

  const baseStyles =
    "flex items-center justify-center font-[Pretendard] font-bold";

  const variantStyles: Record<"primary" | "gray" | "outline", string> = {
    primary: "bg-primary text-neutral-white hover:bg-secondary-2",
    gray: "bg-neutral-gray-4 text-neutral-white hover:bg-neutral-gray-3",
    outline:
      "border border-primary text-primary bg-neutral-white hover:bg-bg-pale ",
  };

  const sizeStyles: Record<"xs" | "sm" | "md" | "lg", string> = {
    xs: "w-full max-w-[86px] min-h-[38px] rounded-medium text-14px",
    sm: "w-full max-w-[100px] min-h-[46px] rounded-[16px] text-14px",
    md: "w-full max-w-[145px] min-h-[52px] rounded-medium text-18px",
    lg: "w-full max-w-[335px] min-h-[45px] rounded-large text-18px",
  };

  const disabledStyles =
    "bg-neutral-gray-4 text-neutral-white cursor-not-allowed";
  const enabledCursor = "cursor-pointer";

  return (
    <button
      // disabled 상태일 때는 클릭 이벤트를 막기 위해 onClick 제거
      onClick={disabled ? undefined : onClick}
      type={type ?? "button"} // 버튼의 타입
      {...props} // 나머지 속성(type, disabled 등)을 한꺼번에 전달
      className={`${baseStyles} ${
        disabled ? disabledStyles : `${variantStyles[variant]} ${enabledCursor}`
      } ${sizeStyles[size]} ${className ?? ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
