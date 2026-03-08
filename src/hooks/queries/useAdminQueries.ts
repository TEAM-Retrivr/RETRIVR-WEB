import { useQuery } from "@tanstack/react-query";
import { requestAdminItemList } from "../../api/admin/admin.api";

// 관리자 물품 목록 조회 (관리자 전용 API 사용)
export const useAdminItemList = () => {
  return useQuery({
    queryKey: ["adminItems"],
    queryFn: requestAdminItemList,
    retry: false,
  });
};
