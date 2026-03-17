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

// 대여 요청 승인 응답
// POST /api/admin/v1/rentals/{rentalId}/approve
export interface AdminApproveRentalResponse {
  rentalId: number;
  rentalDecisionStatus: "APPROVE" | "REJECT" | string;
  adminNameToDecide: string;
  decisionDate: string;
}

// 대여 요청 거절 응답
// POST /api/admin/v1/rentals/{rentalId}/reject
export interface AdminRejectRentalResponse {
  rentalId: number;
  rentalDecisionStatus: "APPROVE" | "REJECT" | string;
  adminNameToDecide: string;
  decisionDate: string;
}

// 관리자 물품 등록 요청 바디
// POST /api/admin/v1/items
export interface AdminBorrowerRequirementRequest {
  fieldKey: string; //
  label: string; // 화면에 노출할 필드 이름 (학번 등)
  fieldType: string; // 예: "TEXT"
  required: boolean; // 필수 여부
}

export interface AdminCreateItemRequest {
  name: string; // 물품 이름
  description?: string; // 물품 설명 (선택)
  rentalDuration: number; // 대여 기간(일)
  isActive: boolean; // 대여 가능 여부
  itemManagementType: string; // 물품 고유번호 존재 여부
  borrowerRequirements: AdminBorrowerRequirementRequest[]; // 대여자 입력 요구 정보 목록
}

// 관리자 물품 등록 응답 바디
export interface AdminBorrowerRequirementResponse extends AdminBorrowerRequirementRequest {}

export interface AdminCreateItemResponse {
  itemId: number; // 생성된 물품 ID
  name: string; // 물품 이름
  borrowerRequirements: AdminBorrowerRequirementResponse[]; // 저장된 대여자 요구 정보 목록
}
