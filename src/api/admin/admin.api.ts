import type { AdminItemListResponse } from "./admin.type";

// 관리자 물품 목록 조회 (GET)
// TODO: 실제 관리자 API 엔드포인트/명세에 맞게 구현
// import { apiClient } from "../core";
// const response = await apiClient.get<AdminItemListResponse>("/api/admin/v1/items");
// return response.data;
export const requestAdminItemList = async (): Promise<AdminItemListResponse> => {
  return { items: [] };
};
