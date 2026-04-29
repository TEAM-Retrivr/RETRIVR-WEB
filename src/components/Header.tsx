import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  name?: string; // 관리자 이름 (선택적)
  pageName?: string; // 페이지 이름 (텍스트)
  pageIconSrc?: string; // 페이지 이름 대신 사용할 아이콘 이미지 경로
  pageIconAlt?: string; // 아이콘 대체 텍스트
  backTo?: string; // 특정 경로로 이동
  onBackClick?: () => void; // 완전 커스텀 핸들러
  rightAction?: ReactNode; // 우측 상단 액션 버튼(선택적)
}

const Header = ({
  name,
  pageName,
  pageIconSrc,
  pageIconAlt,
  backTo,
  onBackClick,
  rightAction,
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    if (backTo) {
      navigate(backTo);
      return;
    }
    navigate(-1); // 기본 동작
  };

  return (
    <header className="relative w-full max-w-[402px] min-h-[110px] bg-neutral-white font-[Pretendard] pt-15 px-8 after:absolute after:content-[''] after:left-8 after:right-8 after:bottom-0 after:border-b-1 after:border-b-primary after:opacity-40">
      {/* 뒤로가기 버튼 */}
      <button
        className="absolute bottom-6 cursor-pointer"
        onClick={handleBack}
        type="button"
      >
        <img
          className="object-fit"
          src="/icons/home/left-arrow.svg"
          alt="뒤로가기 버튼"
        />
      </button>
      {rightAction && (
        <div className="absolute right-8 bottom-4 h-10 w-10 flex items-center justify-center">
          {rightAction}
        </div>
      )}

      {/* 텍스트 영역 - 관리자 이름(선택적), 페이지 이름 */}
      <div className="flex flex-col gap-1">
        {/* 관리자 이름 : 필요없는 페이지가 있을 수 있음 */}
        {name && (
          <p className="text-[#000] opacity-62 text-center text-12px font-normal leading-none">
            {name}
          </p>
        )}
        {/* 페이지 이름 또는 아이콘 */}
        {pageIconSrc ? (
          <img
            src={pageIconSrc}
            alt={pageIconAlt ?? pageName ?? "페이지 아이콘"}
            className="mx-auto h-6 object-contain"
          />
        ) : (
          pageName && (
            <p className="text-secondary-1 text-16px text-center font-bold">
              {pageName}
            </p>
          )
        )}
      </div>
    </header>
  );
};

export default Header;
