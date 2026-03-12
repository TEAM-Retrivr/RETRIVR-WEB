// 관리자 물품 목록 조회 응답 (기존 물품 관리 페이지용)
// GET /api/admin/v1/items
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
// 반납 관리 페이지 하단 "물품별 관리" 영역에서 사용
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

// 반납 화면 물품 리스트 조회 실패 시 공통 에러 응답
export interface AdminRentalItemSummaryErrorResponse {
  status: string;
  code: number;
  message: string;
  detail?: string;
}

// 연체된 물품 리스트 조회 응답
// GET /api/admin/v1/rentals/overdue
// 반납 관리 페이지 상단 "반납 연체 확인" 영역에서 사용
export interface AdminOverdueRental {
  rentalId: number;
  itemId: number;
  itemName: string;
  itemLimitId: number;
  itemLimitCode: string;
  borrowerName: string;
  borrowerStudentNumber: string;
  borrowerMajor: string;
  rentalDate: string; // ISO date string
  dueDate: string; // ISO date string
  overdueDays: number;
  sendOverdueSmsDates: string[];
}

export interface AdminOverdueRentalListResponse {
  rentals: AdminOverdueRental[];
  canSendOverdueSms: boolean;
  nextCursor?: number;
}

// 대여 요청 목록 조회 응답
// GET /api/admin/v1/rentals/requests
// 관리자 대여 요청 확인 페이지에서 사용
export interface AdminRentalRequestItem {
  rentalId: number;
  itemId: number;
  itemName: string;
  itemUnitId: number;
  itemUnitCode: string;
  totalQuantity: number;
  availableQuantity: number;
  borrowerName: string;
  borrowerMajor: string;
  borrowerStudentNumber: string;
  guaranteedGoods: string;
  requestedAt: string;
}

export interface AdminRentalRequestListResponse {
  requests: AdminRentalRequestItem[];
  nextCursor?: number;
}
