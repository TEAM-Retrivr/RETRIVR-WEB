// 관리자 물품 목록 조회 응답 (기존 물품 관리 페이지용)
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

// 반납 화면에서의 물품 리스트 조회 응답
// GET /api/admin/v1/items/rental-summary
export interface AdminRentalItemSummary {
  itemId: number;
  itemName: string;
  totalQuantity: number;
  availableQuantity: number;
  isRentalAvailable: boolean;
}

export interface AdminRentalItemSummaryResponse {
  items: AdminRentalItemSummary[];
  nextCursor?: number;
}

export interface AdminRentalItemSummaryErrorResponse {
  status: string;
  code: number;
  message: string;
  detail?: string;
}
