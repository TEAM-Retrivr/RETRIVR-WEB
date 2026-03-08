// 관리자 물품 목록 조회 응답 (관리자 전용 API 명세에 맞게 수정 예정)
export interface AdminItemListResponse {
  items: {
    itemId: number;
    name: string;
    totalQuantity: number;
    isActive: boolean;
    availableQuantity?: number;
    rentalDuration?: number;
    description?: string;
    guaranteedGoods?: string;
  }[];
  nextCursor?: number;
}
