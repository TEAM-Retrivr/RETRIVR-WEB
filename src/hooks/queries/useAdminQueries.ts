import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  requestAdminItemList,
  requestAdminRentalItemSummaryList,
  requestAdminOverdueRentalList,
  requestAdminRentalRequestList,
  requestAdminActiveRentalsByItem,
  confirmAdminReturn,
  createAdminItem,
  requestAdminItemDetail,
  updateAdminItem,
  approveAdminRental,
  rejectAdminRental,
  sendAdminOverdueReminder,
  updateAdminRentalReturnDueDate,
  verifyAdminCode,
  requestAdminRentalSearch,
} from "../../api/admin/admin.api";
import type {
  AdminCreateItemRequest,
  AdminItemListResponse,
  AdminUpdateItemRequest,
  AdminUpdateReturnDueDateRequestBody,
  AdminVerifyCodeRequestBody,
} from "../../api/admin/admin.type";

// 관리자 물품 목록 조회 (관리자 전용 API 사용)
// - 물품 관리 페이지에서 사용
// - 서버 캐시 키: ["adminItems"]
export const useAdminItemList = () => {
  return useQuery<AdminItemListResponse>({
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

// 반납 관리 검색 결과 조회
// - GET /api/admin/v1/rentals/search
// - keyword가 비어있으면 요청하지 않음
export const useAdminRentalSearch = (keyword: string) => {
  const trimmedKeyword = keyword.trim();
  return useInfiniteQuery({
    queryKey: ["adminRentalSearch", trimmedKeyword],
    initialPageParam: {
      cursorRentalId: undefined,
      cursorScore: undefined,
    } as { cursorRentalId?: number; cursorScore?: number },
    queryFn: ({ pageParam }) =>
      requestAdminRentalSearch({
        keyword: trimmedKeyword,
        cursorRentalId: pageParam.cursorRentalId,
        cursorScore: pageParam.cursorScore,
        size: 15,
      }),
    getNextPageParam: (lastPage) => {
      const nextRentalIdCursor = lastPage.nextRentalIdCursor;
      const nextScoreCursor = lastPage.nextScoreCursor;

      if (
        typeof nextRentalIdCursor !== "number" ||
        nextRentalIdCursor <= 0 ||
        typeof nextScoreCursor !== "number"
      ) {
        return undefined;
      }

      return {
        cursorRentalId: nextRentalIdCursor,
        cursorScore: nextScoreCursor,
      };
    },
    enabled: trimmedKeyword.length > 0,
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

// 대여 중인 물품 상세 조회
// - 물품별 관리(반납 처리) 페이지에서 사용
// - size 기본값 15개
// - 서버 캐시 키: ["adminActiveRentalsByItem", itemId]
export const useAdminActiveRentalsByItem = (itemId: number) => {
  return useQuery({
    queryKey: ["adminActiveRentalsByItem", itemId],
    queryFn: () =>
      requestAdminActiveRentalsByItem({ itemId, params: { size: 15 } }),
    enabled: Number.isFinite(itemId) && itemId > 0,
    retry: false,
  });
};

// 반납 확인 (POST)
// - 물품별 관리(반납 처리) 화면에서 사용
// - 성공 시 관련 화면 데이터가 즉시 갱신되도록 캐시 무효화 처리
export const useConfirmAdminReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmAdminReturn,
    onSuccess: async (_data, variables) => {
      // 현재 물품의 대여 현황(상세) 갱신
      // - ReturnCheckPage에서 사용: ["adminActiveRentalsByItem", itemId]
      // - itemId는 화면에서 보유하고 있으므로 mutation 호출 시 함께 넘겨주도록 설계
      const itemId = variables.itemId;
      if (itemId) {
        await queryClient.invalidateQueries({
          queryKey: ["adminActiveRentalsByItem", itemId],
        });
      }

      // 반납 관리 목록/연체 목록도 함께 갱신 (상단/하단 영역)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["adminRentalItemSummary"] }),
        queryClient.invalidateQueries({ queryKey: ["adminOverdueRentals"] }),
      ]);
    },
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

// 관리자 물품 상세 조회 (GET)
// - options.enabled: false면 요청하지 않음(예: 목록 카드 접힌 상태)
export const useAdminItemDetail = (
  itemId: number,
  options?: { enabled?: boolean },
) => {
  const idOk = Number.isFinite(itemId) && itemId > 0;
  const enabled =
    options?.enabled !== undefined ? options.enabled && idOk : idOk;
  return useQuery({
    queryKey: ["adminItemDetail", itemId],
    queryFn: () => requestAdminItemDetail(itemId),
    enabled,
    retry: false,
  });
};

// 관리자 물품 수정 (PATCH)
export const useUpdateAdminItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      body,
    }: {
      itemId: number;
      body: AdminUpdateItemRequest;
    }) => updateAdminItem({ itemId, body }),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["adminItems"] }),
        queryClient.invalidateQueries({
          queryKey: ["adminItemDetail", variables.itemId],
        }),
      ]);
    },
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
      // HomePage에서 보여주는 최근 대여 요청 목록도 즉시 갱신
      await queryClient.invalidateQueries({
        queryKey: ["home"],
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
      // HomePage에서 보여주는 최근 대여 요청 목록도 즉시 갱신
      await queryClient.invalidateQueries({
        queryKey: ["home"],
      });
    },
  });
};

// 연체 알림 메시지 수동 발송 (POST)
// - POST /api/admin/v1/rentals/{rentalId}/messages/overdue-reminder
// - OverdueRentalMessageModal 의 "전송" 버튼에서 사용
export const useSendAdminOverdueReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      rentalId,
    }: {
      rentalId: number;
      // itemId는 서버로 보내지 않고, 성공 후 캐시 무효화에만 사용
      itemId?: number;
    }) => sendAdminOverdueReminder({ rentalId }),
    onSuccess: async (_data, variables) => {
      // 연체 카드 영역(상단) 즉시 갱신
      const invalidations: Array<Promise<void>> = [
        queryClient.invalidateQueries({ queryKey: ["adminOverdueRentals"] }),
      ];

      // 물품별 관리(반납 확인)에서 호출된 경우 itemId 기반 상세도 갱신
      if (variables.itemId && Number.isFinite(variables.itemId)) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: ["adminActiveRentalsByItem", variables.itemId],
          }),
        );
      }

      await Promise.all(invalidations);
    },
  });
};

// 반납 예정일 수정 (PATCH)
// - POST 반납 확인 전/후 모두 반영될 수 있어 관련 목록 캐시를 함께 갱신
// - RentalDateChangeModal 의 "수정하기" 버튼에서 사용
export const useUpdateAdminRentalReturnDueDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      rentalId,
      body,
    }: {
      rentalId: number;
      body: AdminUpdateReturnDueDateRequestBody;
      // itemId는 서버 전송용이 아니라 성공 후 쿼리 무효화용
      itemId?: number;
    }) => updateAdminRentalReturnDueDate({ rentalId, body }),
    onSuccess: async (_data, variables) => {
      const invalidations: Array<Promise<void>> = [
        queryClient.invalidateQueries({ queryKey: ["adminRentalItemSummary"] }),
        queryClient.invalidateQueries({ queryKey: ["adminOverdueRentals"] }),
      ];

      if (variables.itemId && Number.isFinite(variables.itemId)) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: ["adminActiveRentalsByItem", variables.itemId],
          }),
        );
      }

      await Promise.all(invalidations);
    },
  });
};

// 관리자 코드 검증 (POST)
// - 대여 완료 페이지에서 현장 승인 진입 전 검증
export const useVerifyAdminCode = () => {
  return useMutation({
    mutationFn: (body: AdminVerifyCodeRequestBody) => verifyAdminCode(body),
  });
};
