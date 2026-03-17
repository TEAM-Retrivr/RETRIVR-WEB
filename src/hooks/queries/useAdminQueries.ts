import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  requestAdminItemList,
  requestAdminRentalItemSummaryList,
  requestAdminOverdueRentalList,
  requestAdminRentalRequestList,
  createAdminItem,
  approveAdminRental,
  rejectAdminRental,
} from "../../api/admin/admin.api";
import type { AdminCreateItemRequest } from "../../api/admin/admin.type";

// 관리자 물품 목록 조회 (관리자 전용 API 사용)
// - 물품 관리 페이지에서 사용
// - 서버 캐시 키: ["adminItems"]
export const useAdminItemList = () => {
  return useQuery({
    queryKey: ["adminItems"],
    queryFn: requestAdminItemList,
    retry: false,
  });
};

// 반납 화면에서의 물품 리스트 조회
// - 반납 관리 페이지 하단 "물품별 관리" 영역에서 사용
// - size 기본값 50개
// - 서버 캐시 키: ["adminRentalItemSummary"]
export const useAdminRentalItemSummaryList = () => {
  return useQuery({
    queryKey: ["adminRentalItemSummary"],
    queryFn: () => requestAdminRentalItemSummaryList({ size: 50 }),
    retry: false,
  });
};

// 연체된 물품 리스트 조회
// - 반납 관리 페이지 상단 "반납 연체 확인" 영역에서 사용
// - size 기본값 20개
// - 서버 캐시 키: ["adminOverdueRentals"]
export const useAdminOverdueRentalList = () => {
  return useQuery({
    queryKey: ["adminOverdueRentals"],
    queryFn: () => requestAdminOverdueRentalList({ size: 20 }),
    retry: false,
  });
};

// 대여 요청 목록 조회
// - 관리자 대여 요청 확인 페이지에서 사용
// - size 기본값 15개
// - 서버 캐시 키: ["adminRentalRequests"]
export const useAdminRentalRequestList = () => {
  return useQuery({
    queryKey: ["adminRentalRequests"],
    queryFn: () => requestAdminRentalRequestList({ size: 15 }),
    retry: false,
  });
};

// 관리자 물품 등록 (POST)
// - 새 물품과 대여자 요구 정보를 함께 저장
// - 요청 바디 타입: AdminCreateItemRequest
export const useCreateAdminItem = () => {
  return useMutation({
    mutationFn: (body: AdminCreateItemRequest) => createAdminItem(body),
  });
};

// 대여 요청 승인 (POST)
// - RentalRequestPage > ShortRentalApprovalModal 에서 사용
export const useApproveAdminRental = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveAdminRental,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["adminRentalRequests"],
      });
    },
  });
};

// 대여 요청 거절 (POST)
// - RentalRequestPage > ShortRentalApprovalModal 에서 사용
export const useRejectAdminRental = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectAdminRental,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["adminRentalRequests"],
      });
    },
  });
};
