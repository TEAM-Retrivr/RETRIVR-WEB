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
  label: string; // 화면에 노출할 필드 이름 (학번 등)
  required: boolean; // 필수 여부
}

export interface AdminCreateItemRequest {
  name: string; // 물품 이름
  description?: string; // 물품 설명 (선택)
  totalQuantity: number; // 총 개수
  rentalDuration: number; // 대여 기간(일)
  itemManagementType: string; // 물품 고유번호 존재 여부
  useMessageAlarmService: boolean; // 연체 알림(카톡) 발송 여부
  guaranteedGoods?: string | null; // 보증 물품 (없으면 null)
  unitLabels?: string[]; // 세부 물품 라벨(옵션)
  borrowerRequirements: AdminBorrowerRequirementRequest[]; // 대여자 입력 요구 정보 목록
}

// 관리자 물품 등록 응답 바디
export interface AdminBorrowerRequirementResponse extends AdminBorrowerRequirementRequest {}

export interface AdminCreateItemResponse {
  itemId: number; // 생성된 물품 ID
  name: string; // 물품 이름
  borrowerRequirements: AdminBorrowerRequirementResponse[]; // 저장된 대여자 요구 정보 목록
}

// 대여 중인 물품 상세 조회 응답
// GET /api/admin/v1/items/{itemId}/rentals/active
// - 물품별 관리(반납 처리) 화면에서 사용
// - itemUnits: 현재 대여 중인 개별 물품(고유번호 단위) 목록
export interface AdminActiveRentalItemUnit {
  rentalId?: number; // 대여 ID (반납 확인 API에서 사용) - 백엔드 명세/응답에 없을 수 있어 optional
  isOverdue: boolean; // 연체 여부
  unitId: number; // 물품 고유번호 ID (서버 명세: unitId)
  borrowedItemName: string; // 대여한 물품 이름
  borrowerName: string; //대여자 이름 (필수 입력 사항)
  borrowerPhone: string; // 대여자 연락처 (필수 입력사항)
  // borrowerFields: 선택적 요구사항
  borrowerFields?: {
    additonalProp1?: string;
    additonalProp2?: string;
    additonalProp3?: string;
  };
  rentalDate: string; // ISO date string (대여 일자)
  expectedReturnDueDate: string; // ISO date string (반납 예정 일자)
}

export interface AdminActiveRentalsByItemResponse {
  itemId: number;
  itemName: string;
  guaranteedGoods?: string;
  availableQuantity: number;
  totalQuantity: number;
  rentalDuration: number;
  borrowedItems: AdminActiveRentalItemUnit[];
  nextCursor?: number;
}

// 반납 확인 요청/응답
// POST /api/admin/v1/rentals/{rentalId}/return
export interface AdminConfirmReturnRequestBody {
  adminNameToConfirm: string;
}

export interface AdminConfirmReturnResponse {
  rentalId: number;
  rentalStatus: string;
  adminNameToConfirm: string;
}
