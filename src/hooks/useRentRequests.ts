// 대여 요청 목록을 가져오는 커스텀 훅 (TanStack Query 사용)
// TODO: TanStack Query Provider가 App.tsx에 설정되어 있는지 확인하세요

import { useQuery } from "@tanstack/react-query";
import { fetchRentRequests } from "../api/rentRequests";
import type { RentRequestsResponse } from "../api/rentRequests";

/**
 * 대여 요청 목록을 가져오는 훅
 * @returns { data, isLoading, error, refetch }
 */
export const useRentRequests = () => {
  return useQuery<RentRequestsResponse>({
    queryKey: ["rentRequests"],
    queryFn: fetchRentRequests,
    // 필요시 옵션 추가:
    // staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    // refetchOnWindowFocus: false, // 창 포커스 시 자동 재요청 비활성화
  });
};
