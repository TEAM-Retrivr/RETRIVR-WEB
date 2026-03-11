import { useQuery } from "@tanstack/react-query";
import {
  requestAdminItemList,
  requestAdminRentalItemSummaryList,
} from "../../api/admin/admin.api";

// 관리자 물품 목록 조회 (관리자 전용 API 사용)
export const useAdminItemList = () => {
  return useQuery({
    queryKey: ["adminItems"],
    queryFn: requestAdminItemList,
    retry: false,
  });
};

// 반납 화면에서의 물품 리스트 조회
export const useAdminRentalItemSummaryList = () => {
  return useQuery({
    queryKey: ["adminRentalItemSummary"],
    queryFn: () => requestAdminRentalItemSummaryList({ size: 50 }),
    retry: false,
  });
};
