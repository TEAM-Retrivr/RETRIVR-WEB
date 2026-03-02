// 대여자 홈 화면에 쓰이는 컴포넌트에 들어갈 인터페이스
export interface ItemRequest {
  item: ItemInfo;
  nextCursor: number; // 백엔드에게 물어보기
}

export interface ItemInfo {
  itemId: number; // 물품 번호
  name: string; // 물품 이름
  availableQuantity: number; // 대여 가능한 수량
  totalQuantity: number; // 전체 수량
  isActive: boolean; // 대여 상태 (가능/불가능)
  rentalDuration: number; // 대여 기간
  description: string; // 물품 설명
  guaranteedGoods?: string; // 보증 물품 (있을 수도, 없을 수도)
}
