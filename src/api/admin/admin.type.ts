// 관리자 물품 목록 조회 응답 (기존 물품 관리 페이지용)
// GET /api/admin/v1/items
// - borrowerRequirements: 물품 상세·등록 API와 동일한 { label, required }[] (아래 AdminBorrowerRequirementResponse)
export interface AdminItemListResponse {
  items: {
    itemId: number;
    name: string;
    totalQuantity: number;
    availableQuantity: number;
    isActive: boolean;
    rentalDuration?: number;
    description?: string;
    guaranteedGoods?: string;
    itemManagementType?: string;
    useMessageAlarmService?: boolean;
    borrowerRequirements: AdminBorrowerRequirementResponse[];
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

// 대여중인 물품 검색 응답
// GET /api/admin/v1/rentals/search
export interface AdminRentalSearchItem {
  rentalId: number;
  borrowerName: string;
  contact: string;
  itemName: string;
}

export interface AdminRentalSearchResponse {
  rentals: AdminRentalSearchItem[];
  nextScoreCursor?: number;
  nextRentalIdCursor?: number;
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

// 대여 요청 현장 승인 요청/응답
// POST /api/public/v1/rentals/{rentalId}/approve
export interface PublicApproveRentalRequestBody {
  adminNameToApprove: string;
  adminCodeVerificationToken: string;
}

export interface PublicApproveRentalResponse {
  organizationId: number;
}

// 대여 요청 현장 거절 요청/응답
// POST /api/public/v1/rentals/{rentalId}/reject
export interface PublicRejectRentalRequestBody {
  adminNameToReject: string;
  adminCodeVerificationToken: string;
}

export interface PublicRejectRentalResponse {
  organizationId: number;
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

/** NON_UNIT: 세부 유닛 이름 없음 / UNIT: 세부 유닛(unitChanges·itemUnits 등) 사용 */
export type AdminItemManagementType = "UNIT" | "NON_UNIT";

export interface AdminItemBaseRequest {
  name: string; // 물품 이름
  description?: string; // 물품 설명 (선택)
  totalQuantity: number; // 총 개수
  rentalDuration: number; // 대여 기간(일)
  itemManagementType: AdminItemManagementType | string; // 호환용 string 유지
  useMessageAlarmService: boolean; // 연체 알림(카톡) 발송 여부
  guaranteedGoods?: string | null; // 보증 물품 (없으면 null)
  borrowerRequirements: AdminBorrowerRequirementRequest[]; // 대여자 입력 요구 정보 목록
}

export interface AdminCreateItemRequest extends AdminItemBaseRequest {
  /** UNIT일 때만: 생성 시 각 유닛 표시명 (NON_UNIT 요청에는 넣지 않음) */
  unitLabels?: string[];
}

// 관리자 물품 등록 응답 바디
export interface AdminBorrowerRequirementResponse extends AdminBorrowerRequirementRequest {}

export interface AdminCreateItemResponse {
  itemId: number; // 생성된 물품 ID
  name: string; // 물품 이름
  borrowerRequirements: AdminBorrowerRequirementResponse[]; // 저장된 대여자 요구 정보 목록
}

// 관리자 물품 상세 조회 응답
// GET /api/admin/v1/items/{itemId}
export interface AdminItemDetailResponse {
  itemId: number;
  name: string;
  description?: string;
  totalQuantity: number;
  rentalDuration: number;
  itemManagementType: AdminItemManagementType | string;
  useMessageAlarmService: boolean;
  guaranteedGoods?: string | null;
  unitLabels?: string[];
  /** NON_UNIT이면 빈 배열, UNIT이면 유닛별 id·label·상태(서버 명세에 따라 optional) */
  itemUnits?: {
    itemUnitId: number;
    label: string;
    status?: string;
  }[];
  isActive?: boolean;
  borrowerRequirements: AdminBorrowerRequirementResponse[];
}

/* PATCH unitChanges 한 건: 이름 변경·유닛 삭제·유닛 추가 */
/* 타입을 판별 유니언으로 제한하여 차단 하는 방법 논의해보기 */
// export type AdminItemUnitChangeEntry =
// | { currentLabel: string; label: string } // 이름 변경
// | { currentLabel: string; label: null }   // 유닛 삭제
// | { currentLabel: null; label: string };  // 유닛 추가

export interface AdminItemUnitChangeEntry {
  currentLabel: string | null;
  label: string | null;
}

// 관리자 물품 수정 요청 바디
// PATCH /api/admin/v1/items/{itemId}
// - NON_UNIT: unitChanges 없음
// - UNIT: unitChanges (이름 변경 / { currentLabel, label: null } 삭제 / { currentLabel: null, label } 추가)
export interface AdminUpdateItemRequest extends Partial<AdminItemBaseRequest> {
  unitChanges?: AdminItemUnitChangeEntry[];
  isActive?: boolean;
  adminCodeVerificationToken: string;
}

// 관리자 물품 수정 응답 바디
export interface AdminUpdateItemResponse {
  itemId: number;
  name: string;
  description?: string;
  rentalDuration?: number;
  totalQuantity?: number;
  itemManagementType?: AdminItemManagementType;
  useMessageAlarmService?: boolean;
  guaranteedGoods?: string | null;
  itemUnits?: {
    itemUnitId: number;
    label: string;
    status?: string;
  }[];
  borrowerRequirements: AdminBorrowerRequirementResponse[];
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
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
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

// 반납 예정일 수정 요청/응답
// PATCH /api/admin/v1/rentals/{rentalId}/due-date
export interface AdminUpdateReturnDueDateRequestBody {
  newReturnDueDate: string; // YYYY-MM-DD
}

export interface AdminUpdateReturnDueDateResponse {
  rentalId: number;
  updatedDate: string; // YYYY-MM-DD
}

// 연체 알림 메시지 수동 발송 응답
// POST /api/admin/v1/rentals/{rentalId}/messages/overdue-reminder
export interface AdminSendOverdueReminderResponse {
  rentalId: number; // 대여 번호
  success: boolean; // 전송 성공 여부
}

// 관리자 코드 검증 요청/응답
// POST /api/public/v1/admin-code/verification
export interface AdminVerifyCodeRequestBody {
  adminCode: string;
  purpose: "ORGANIZATION_UPDATE" | "ITEM_UPDATE" | "IMMEDIATE_APPROVAL";
  rentalId?: number;
}

export interface AdminVerifyCodeResponse {
  rawToken?: string;
  rowToken?: string;
  rentalId?: number;
}
