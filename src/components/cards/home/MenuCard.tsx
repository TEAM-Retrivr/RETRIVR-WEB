import { useNavigate } from "react-router-dom";
import type { HomeMenuData } from "../../../types/menu";

export const MenuCard = ({ menu }: { menu: HomeMenuData }) => {
  const navigate = useNavigate();

  const getIcon = (id: HomeMenuData["id"]) => {
    switch (id) {
      case "return":
        return (
          <img
            src="/icons/home/return-management_icon.svg"
            alt="반납 관리"
            className="w-full h-full"
          />
        );
      case "item":
        return (
          <img
            src="/icons/home/item-management_icon.svg"
            alt="물품 관리"
            className="w-full h-full"
          />
        );
    }
  };

  return (
    <div
      onClick={() => navigate(menu.path)}
      // 1. justify-between을 추가해 아이콘과 텍스트를 위아래로 배치
      // 2. 패딩을 퍼센트 대신 고정값(p-5)으로 수정하여 텍스트 공간 확보
      className="w-full max-w-[161px] h-[127px] hover-lift flex flex-col items-start justify-between bg-neutral-white p-5 cursor-pointer rounded-[24px] border-2 border-menu-border shadow-menu"
    >
      {/* 아이콘 영역 */}
      <div className="w-10 h-10 bg-none rounded-xl flex items-center justify-center">
        <div className="w-10 h-10">{getIcon(menu.id)}</div>
      </div>

      {/* 텍스트 영역: 텍스트가 절대 꺾이지 않도록 whitespace-nowrap 추가 */}
      <div className="flex flex-col gap-1 w-full">
        <h3 className="font-bold text-[1.125rem] text-neutral-dark leading-tight whitespace-nowrap">
          {menu.title}
        </h3>
        <p className="text-[0.75rem] text-neutral-dark opacity-50 leading-tight whitespace-nowrap">
          {menu.description}
        </p>
      </div>
    </div>
  );
};
