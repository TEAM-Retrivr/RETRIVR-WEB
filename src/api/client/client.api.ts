import { apiClient } from "../core";
import type {
  BorrowerInformationRequest,
  BorrowerInformationResponse,
  ItemDetailResponse,
  ItemResponse,
  OrganizationSearchResponse,
  RentalDetailResponse,
} from "./client.type";

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

// 2. 물품 상세 조회 (GET)
// 엔드포인트 : /api/public/v1/items/{itemId}
export const requestItemDetail = async (
  itemId: number,
): Promise<ItemDetailResponse> => {
  const response = await apiClient.get<ItemDetailResponse>(
    `/api/public/v1/items/${itemId}`,
  );
  return response.data;
};

// 3. 대여 요청 생성 (POST)
// 엔드포인트 : /api/public/v1/items/{itemId}/rentals
export const sendRentalRequest = async (
  itemId: number,
  data: BorrowerInformationRequest,
): Promise<BorrowerInformationResponse> => {
  const response = await apiClient.post<BorrowerInformationResponse>(
    `/api/public/v1/items/${itemId}/rentals`,
    data,
  );
  return response.data;
};

// 4. 대여지 검색 (GET)
// 엔드포인트 : /api/public/v1/organizations/search
// Query Parameter :
// - keyword: string (required)  검색 키워드
// - cursor?: string              인코딩된 복합 커서 (다음 페이지 조회용)
// - size?: number                페이지 크기 (기본값 15)
export const searchOrganizations = async (params: {
  keyword: string;
  cursor?: string | null;
  size?: number;
}): Promise<OrganizationSearchResponse> => {
  const response = await apiClient.get<OrganizationSearchResponse>(
    "/api/public/v1/organizations/search",
    {
      params,
    },
  );
  return response.data;
};

// 5. 대여 상세 조회 (GET) - 현장 즉시 완료용
// 엔드포인트 : /api/public/v1/rentals/{rentalId}
// Query Parameter :
// - token: string (required)
export const requestRentalDetail = async (
  rentalId: number,
  token: string,
): Promise<RentalDetailResponse> => {
  const response = await apiClient.get<RentalDetailResponse>(
    `/api/public/v1/rentals/${rentalId}`,
    {
      params: { token },
    },
  );
  return response.data;
};
