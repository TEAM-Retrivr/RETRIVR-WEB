import type {
  AdminItemListResponse,
  AdminRentalItemSummaryResponse,
  AdminOverdueRentalListResponse,
  AdminRentalRequestListResponse,
  AdminCreateItemRequest,
  AdminCreateItemResponse,
  AdminApproveRentalResponse,
  AdminRejectRentalResponse,
  AdminActiveRentalsByItemResponse,
  AdminConfirmReturnResponse,
  AdminItemDetailResponse,
  AdminUpdateItemRequest,
  AdminUpdateItemResponse,
  AdminSendOverdueReminderResponse,
  AdminUpdateReturnDueDateRequestBody,
  AdminUpdateReturnDueDateResponse,
} from "./admin.type";
import { apiClient } from "../core";

// 관리자 물품 목록 조회 (기존 물품 관리 페이지용)
// - 물품 관리 페이지에서 사용하는 기본 아이템 목록 조회
// - 페이징 cursor, size는 서버 기본값 사용
// GET /api/admin/v1/items
export const requestAdminItemList =
  async (): Promise<AdminItemListResponse> => {
    const response = await apiClient.get<AdminItemListResponse>(
      "/api/admin/v1/items",
    );
    return response.data;
  };

// 반납 화면에서의 물품 리스트 조회
// - 반납 관리 페이지 하단 "물품별 관리" 영역에서 사용
// - cursor: 마지막으로 조회된 itemId (다음 페이지 조회 시 사용)
// - size: 한 번에 가져올 아이템 개수
// GET /api/admin/v1/items/rental-summary
export interface AdminRentalItemSummaryListParams {
  cursor?: number; // 마지막 조회된 itemId, 다음 페이지 조회 시에 사용
  size?: number;
}

export const requestAdminRentalItemSummaryList = async (
  params?: AdminRentalItemSummaryListParams,
): Promise<AdminRentalItemSummaryResponse> => {
  const response = await apiClient.get<AdminRentalItemSummaryResponse>(
    "/api/admin/v1/items/rental-summary",
    { params },
  );
  return response.data;
};

// 연체된 물품 리스트 조회
// - 반납 관리 페이지 상단 "반납 연체 확인" 영역에서 사용
// - cursor: 마지막으로 조회된 rentalId (다음 페이지 조회 시 사용)
// - size: 한 번에 가져올 연체 건수
// GET /api/admin/v1/rentals/overdue
export interface AdminOverdueRentalListParams {
  cursor?: number;
  size?: number;
}

export const requestAdminOverdueRentalList = async (
  params?: AdminOverdueRentalListParams,
): Promise<AdminOverdueRentalListResponse> => {
  const response = await apiClient.get<AdminOverdueRentalListResponse>(
    "/api/admin/v1/rentals/overdue",
    { params },
  );
  return response.data;
};

// 대여 요청 목록 조회
// - 관리자 대여 요청 확인 페이지에서 사용
// - cursor: 마지막으로 조회된 rentalId (다음 페이지 조회 시 사용)
// - size: 한 번에 가져올 대여 요청 수
// GET /api/admin/v1/rentals/requests
export interface AdminRentalRequestListParams {
  cursor?: number;
  size?: number;
}

export const requestAdminRentalRequestList = async (
  params?: AdminRentalRequestListParams,
): Promise<AdminRentalRequestListResponse> => {
  const response = await apiClient.get<AdminRentalRequestListResponse>(
    "/api/admin/v1/rentals/requests",
    { params },
  );
  return response.data;
};

// 대여 중인 물품 상세 조회
// - 물품별 관리(반납 처리) 화면에서 사용
// - itemId: 조회할 물품 ID (path)
// - cursor: 마지막 조회된 unitId (다음 페이지 조회 시 사용)
// - size: 한 번에 가져올 unit 개수 (기본값 서버/화면 정책에 따름)
// GET /api/admin/v1/items/{itemId}/rentals/active
export interface AdminActiveRentalsByItemParams {
  cursor?: number;
  size?: number;
}

export const requestAdminActiveRentalsByItem = async ({
  itemId,
  params,
}: {
  itemId: number;
  params?: AdminActiveRentalsByItemParams;
}): Promise<AdminActiveRentalsByItemResponse> => {
  const response = await apiClient.get<AdminActiveRentalsByItemResponse>(
    `/api/admin/v1/items/${itemId}/rentals/active`,
    { params },
  );
  return response.data;
};

// 반납 확인
// - 물품별 관리(반납 처리) 화면에서 사용
// - rentalId: 반납 처리할 대여 ID (path)
// - adminNameToConfirm: 반납 처리 관리자 이름 (body)
// POST /api/admin/v1/rentals/{rentalId}/return
export const confirmAdminReturn = async ({
  rentalId,
  adminNameToConfirm,
}: {
  rentalId: number;
  adminNameToConfirm: string;
  // itemId는 서버로 보내지 않고, 성공 후 캐시 무효화에만 사용합니다.
  // (mutation variables에 함께 포함시켜 훅에서 queryKey를 정확히 invalidate)
  itemId?: number;
}): Promise<AdminConfirmReturnResponse> => {
  const response = await apiClient.post<AdminConfirmReturnResponse>(
    `/api/admin/v1/rentals/${rentalId}/return`,
    { adminNameToConfirm },
  );
  return response.data;
};

// 반납 예정일 수정
// - 물품별 관리(반납 처리) 화면의 "반납일자 수정" 모달에서 사용
// - rentalId: 반납 예정일을 수정할 대여 ID (path)
// - newReturnDueDate: 새 반납 예정일 (body, YYYY-MM-DD)
// PATCH /api/admin/v1/rentals/{rentalId}/due-date
export const updateAdminRentalReturnDueDate = async ({
  rentalId,
  body,
}: {
  rentalId: number;
  body: AdminUpdateReturnDueDateRequestBody;
}): Promise<AdminUpdateReturnDueDateResponse> => {
  const response = await apiClient.patch<AdminUpdateReturnDueDateResponse>(
    `/api/admin/v1/rentals/${rentalId}/due-date`,
    body,
  );
  return response.data;
};

// 연체 알림 메시지 수동 발송
// - 반납 관리 > 연체 확인 카드, 물품별 관리 > 연체 문자 전송 모달에서 사용
// - rentalId: 연체 알림 메시지를 발송할 대여 ID (path)
// POST /api/admin/v1/rentals/{rentalId}/messages/overdue-reminder
export const sendAdminOverdueReminder = async ({
  rentalId,
}: {
  rentalId: number;
}): Promise<AdminSendOverdueReminderResponse> => {
  const response = await apiClient.post<AdminSendOverdueReminderResponse>(
    `/api/admin/v1/rentals/${rentalId}/messages/overdue-reminder`,
  );
  return response.data;
};

// 대여 요청 승인
// POST /api/admin/v1/rentals/{rentalId}/approve
export interface AdminApproveRentalRequestBody {
  adminNameToApprove: string;
}

export const approveAdminRental = async ({
  rentalId,
  adminNameToApprove,
}: {
  rentalId: number;
  adminNameToApprove: string;
}): Promise<AdminApproveRentalResponse> => {
  const response = await apiClient.post<AdminApproveRentalResponse>(
    `/api/admin/v1/rentals/${rentalId}/approve`,
    {
      adminNameToApprove,
    },
  );
  return response.data;
};

// 대여 요청 거절
// POST /api/admin/v1/rentals/{rentalId}/reject
export interface AdminRejectRentalRequestBody {
  adminNameToReject: string;
}

export const rejectAdminRental = async ({
  rentalId,
  adminNameToReject,
}: {
  rentalId: number;
  adminNameToReject: string;
}): Promise<AdminRejectRentalResponse> => {
  const response = await apiClient.post<AdminRejectRentalResponse>(
    `/api/admin/v1/rentals/${rentalId}/reject`,
    {
      adminNameToReject,
    },
  );
  return response.data;
};

// 관리자 물품 등록 (POST)
// - 물품과 대여자 요구 정보(JSONB)를 함께 저장
// - 요청 바디: AdminCreateItemRequest
// - 응답 바디: AdminCreateItemResponse
// POST /api/admin/v1/items
export const createAdminItem = async (
  body: AdminCreateItemRequest,
): Promise<AdminCreateItemResponse> => {
  const response = await apiClient.post<AdminCreateItemResponse>(
    "/api/admin/v1/items",
    body,
  );
  return response.data;
};

// 관리자 물품 상세 조회
// GET /api/admin/v1/items/{itemId}
export const requestAdminItemDetail = async (
  itemId: number,
): Promise<AdminItemDetailResponse> => {
  const response = await apiClient.get<AdminItemDetailResponse>(
    `/api/admin/v1/items/${itemId}`,
  );
  return response.data;
};

// 관리자 물품 수정
// PATCH /api/admin/v1/items/{itemId}
export const updateAdminItem = async ({
  itemId,
  body,
}: {
  itemId: number;
  body: AdminUpdateItemRequest;
}): Promise<AdminUpdateItemResponse> => {
  const response = await apiClient.patch<AdminUpdateItemResponse>(
    `/api/admin/v1/items/${itemId}`,
    body,
  );
  return response.data;
};
