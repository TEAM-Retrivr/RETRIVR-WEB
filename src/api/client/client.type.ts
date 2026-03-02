// 1. 대여지 소유 물품 목록 조회 정보
// 1-1. 전체 응답 바디
export interface ItemResponse {
  items: {
    itemId: number; // 물품 번호
    name: string; // 물품 이름
    availableQuantity: number; // 대여 가능한 수량
    totalQuantity: number; // 전체 수량
    isActive: boolean; // 대여 상태 (가능/불가능)
    rentalDuration: number; // 대여 기간
    description: string; // 물품 설명
    guaranteedGoods?: string; // 보증 물품 (있을 수도, 없을 수도)
  }[];
  nextCursor?: number; // (무한스크롤) 사용자에게 보여줄 페이지 단위. nextCursor가 null이면 다음 페이지가 없음.
}
