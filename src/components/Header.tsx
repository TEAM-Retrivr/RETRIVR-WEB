import { useNavigate } from "react-router-dom";
interface headerProps {
  name?: string; // 관리자 이름 (선택적)
  pageName: string; // 페이지 이름
}

const Header = ({ name, pageName }: headerProps) => {
  const navigate = useNavigate();
  return (
    <header className="relative w-full max-w-[402px] min-h-[110px] bg-neutral-white font-[Pretendard] pt-15 px-8 after:absolute after:content-[''] after:left-8 after:right-8 after:bottom-0 after:border-b-1 after:border-b-primary after:opacity-40">
      {/* 뒤로가기 버튼 */}
      <button
        className="absolute bottom-6 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <img
          className="object-fit"
          src="/icons/home/left-arrow.svg"
          alt="뒤로가기 버튼"
        />
      </button>

      {/* 텍스트 영역 - 관리자 이름(선택적), 페이지 이름 */}
      <div className="flex flex-col gap-1">
        {/* 관리자 이름 : 필요없는 페이지가 있을 수 있음 */}
        {name && (
          <p className="text-[#000] opacity-62 text-center text-12px font-normal leading-none">
            {name}
          </p>
        )}
        {/* 페이지 이름 */}
        <p className="text-secondary-1 text-16px text-center font-bold">
          {pageName}
        </p>
      </div>
    </header>
  );
};

export default Header;
