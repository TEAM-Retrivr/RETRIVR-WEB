import React from "react";

// React.ButtonHTMLAttributes를 상속받으면 onClick, onMouseEnter 등
// 모든 기본 버튼 이벤트를 자동으로 지원하게 됩니다.

/*
    variant는 색상 지정
    // primary: 파란색
    // outline: 흰색
*/
/*
    size는 버튼의 크기에 따라서 다르게 설정
    // small: 주로 확인하기 버튼 크기
    // medium: 승인/거절 버튼 크기
    // large: 로그인하기 버튼 크기
*/
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";

  size?: "small" | "medium" | "large";
}

const Button = ({
  variant = "primary", // 디폴트 색상
  size = "medium", // 디폴트 사이즈
  children, // 텍스트, 이미지가 들어갈 자리 (element)
  onClick, // 버튼별 이벤트 리스너 -> 각 페이지에서 정의한 후 대입
  ...props
}: ButtonProps) => {
  const baseStyles =
    "flex items-center justify-center font-[Pretendard] font-bold cursor-pointer shadow-primary transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-101";

  const variantStyles: Record<"primary" | "outline", string> = {
    primary: "bg-primary text-neutral-white hover:bg-secondary-light ",
    outline:
      "border border-primary text-primary bg-neutral-white hover:bg-bg-pale ",
  };

  const sizeStyles: Record<"small" | "medium" | "large", string> = {
    small: "w-full max-w-[85px] min-h-[38px] rounded-[16px] text-[16px] ",
    medium: "w-full max-w-[145px] min-h-[52px] rounded-medium text-[19px] ",
    large: "w-full max-w-[305px] min-h-[45px] rounded-large text-[18px]",
  };

  return (
    <button
      onClick={onClick} // 전달받은 클릭 핸들러를 연결 -> 각 페이지별로 필요한 이벤트 리스너 이름 넣으면 됨
      {...props} // 나머지 속성(type, disabled 등)을 한꺼번에 전달
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </button>
  );
};

export default Button;
