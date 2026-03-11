import type {
  AdminItemListResponse,
  AdminRentalItemSummaryResponse,
} from "./admin.type";
import { apiClient } from "../core";

// 관리자 물품 목록 조회 (기존 물품 관리 페이지용)
// GET /api/admin/v1/items
export const requestAdminItemList =
  async (): Promise<AdminItemListResponse> => {
    const response = await apiClient.get<AdminItemListResponse>(
      "/api/admin/v1/items",
    );
    return response.data;
  };

// 반납 화면에서의 물품 리스트 조회 (GET /api/admin/v1/items/rental-summary)
// 필요한 파라미터
export interface AdminRentalItemSummaryListParams {
  cursor?: number;
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
