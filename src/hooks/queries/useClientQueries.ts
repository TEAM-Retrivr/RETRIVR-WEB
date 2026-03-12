import { useMutation, useQuery } from "@tanstack/react-query";
import {
  requestItemList,
  sendRentalRequest,
  searchOrganizations,
} from "../../api/client/client.api";
import type {
  BorrowerInformationRequest,
  ItemResponse,
  OrganizationSearchResponse,
} from "../../api/client/client.type";

interface UseItemListParams {
  organizationId: number;
  cursor?: number;
  size?: number;
}

export const useItemList = ({
  organizationId,
  cursor,
  size,
}: UseItemListParams) => {
  return useQuery<ItemResponse>({
    // queryKey: 쿼리를 고유 식별하는 Cache Key로 사용
    // clientItems: 네임스페이스 역할 -> 쿼리의 종류를 나타냄
    // oragnizationId, cursor, size: 파라미터 값이 달라질 때 다른 캐시로 구분되도록 하기 위해 사용
    queryKey: ["clientItems", organizationId, cursor, size],
    queryFn: () => requestItemList(organizationId, { cursor, size }),
    retry: false,
    // 재고 수량이 자주 변할 수 있으므로 너무 오래 캐싱하지 않아야 한다.
    // StaleTime: 3초 이내에는 동일 파라미터로 재요청해도 캐시 사용!
    staleTime: 1000 * 3,
    // refetchOnWindowFocus: 탭 전환 후 다시 돌아왔을 때 최신 데이터로 동기화
    refetchOnWindowFocus: true,
  });
};

// 2. 대여 요청 생성 API (POST)
// - 클라이언트(대여자) 단에서 대여 정보 입력 후 호출
// - Path Parameter: itemId (대여하려는 물품 ID)
// - Request Body: BorrowerInformationRequest
export const useSendRentalRequest = () => {
  return useMutation({
    mutationFn: ({
      itemId,
      ...data
    }: { itemId: number } & BorrowerInformationRequest) =>
      // itemId는 URL Path로, 나머지 필드는 Body로 전달
      sendRentalRequest(itemId, data),
    onSuccess: () => {
      console.log("인증 성공");
    },
    onError: (error: any) => {
      console.log("인증 실패", error);
    },
  });
};

// 3. 대여지 검색 API (GET)
// - 클라이언트(대여자) 홈 진입 전에 대여지를 선택하는 검색 페이지에서 사용
// - keyword가 비어 있으면 요청을 보내지 않는다(enabled 조건)
// - cursor 파라미터는 이후 무한 스크롤/페이지네이션 구현 시 확장 가능
export const useOrganizationSearch = (keyword: string) => {
  const trimmed = keyword.trim();

  return useQuery<OrganizationSearchResponse>({
    queryKey: ["clientOrganizationsSearch", trimmed],
    queryFn: () =>
      searchOrganizations({
        keyword: trimmed,
        size: 15,
      }),
    enabled: trimmed.length > 0, // 검색어가 있을 때만 호출
    retry: false,
  });
};
