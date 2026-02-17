import { useNavigate } from "react-router-dom";
import type { HomeMenuData } from "../../../types/menu";

export const MenuCard = ({ menu }: { menu: HomeMenuData }) => {
  const navigate = useNavigate();

  // getIcon() : 각 메뉴에 맞는 아이콘 삽입하는 함수
  const getIcon = (id: HomeMenuData["id"]) => {
    switch (id) {
      case "return":
        return (
          <img
            src="/icons/home/return-management_icon.svg"
            alt="반납 관리 아이콘"
          />
        );
      case "item":
        return (
          <img
            src="/icons/home/item-management_icon.svg"
            alt="물품 관리 아이콘"
          />
        );
    }
  };

  return (
    <div
      onClick={() => navigate(menu.path)} // 클릭 시 메뉴에 알맞은 경로로 이동 : path는 types/menu.ts 에서 확인 가능
      className="w-full max-w-[161px] max-h-[127px] flex flex-col align-center gap- bg-neutral-white  px-[7.014%] pt-[7.014%] pb-[8.232%] cursor-pointer rounded-[16px] border-2 border-menu-border shadow-menu"
    >
      <div className="w-full max-w-[26.905px] max-h-[26.428px]">
        {getIcon(menu.id)} {/* 메뉴에 맞는 아이콘 불러오기 */}
      </div>
      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-1">
        <h3 className="font-[600] text-[1.25rem] text-neutral-dark leading-none/">
          {menu.title}
        </h3>
        <p className="text-[0.65rem] text-neutral-dark opacity-50 leading-none">
          {menu.description}
        </p>
      </div>
    </div>
  );
};
