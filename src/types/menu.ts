// 반납 관리 인터페이스
interface ReturnManageMenu {
  id: "return";
  title: "반납 관리";
  description: "연체자 관리, 문자 발송";
  path: "/return-manage";
}

// 물품 관리 인터페이스
interface ItemManageMenu {
  id: "item";
  title: "물품 관리";
  description: "신규 물품 등록, 물품 수정";
  path: "/item-manage";
}

// 두 인터페이스를 유니온 타입으로 결합하여 사용
export type HomeMenuData = ReturnManageMenu | ItemManageMenu;

export const HOME_MENUS: HomeMenuData[] = [
  {
    id: "return",
    title: "반납 관리",
    description: "연체자 관리, 문자 발송",
    path: "/return-manage",
  },
  {
    id: "item",
    title: "물품 관리",
    description: "신규 물품 등록, 물품 수정",
    path: "/item-manage",
  },
];
