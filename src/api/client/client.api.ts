import { apiClient } from "../core";
import type { ItemResponse } from "./client.type";

// 1. 대여지 소유 물품 목록 조회 (GET)
// 엔드포인트 : /api/public/v1/organizations/{organizationId}/items
// Query Parameter :
// { cursor?: number; size?: number }
export const requestItemList = async (
  organizationId: number,
  params?: { cursor?: number; size?: number },
): Promise<ItemResponse> => {
  const response = await apiClient.get<ItemResponse>(
    `/api/public/v1/organizations/${organizationId}/items`,
    {
      params,
    },
  );
  return response.data;
};
