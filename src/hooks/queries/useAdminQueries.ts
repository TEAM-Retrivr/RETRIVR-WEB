import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
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
  verifyAdminCodeByAdmin,
  requestAdminRentalSearch,
  approvePublicRental,
  rejectPublicRental,
  requestAdminCoupon,
  registerAdminCoupon,
  requestAdminCouponMemberships,
  requestAdminCurrentSubscription,
  requestAdminMembership,
  requestAdminMembershipHistory,
  startAdminSubscription,
  changeAdminSubscriptionPlan,
  cancelAdminSubscription,
  requestAdminPaymentMethods,
  createAdminPaymentMethod,
  updateAdminDefaultPaymentMethod,
  requestAdminPaymentMethod,
  deleteAdminPaymentMethod,
} from "../../api/admin/admin.api";
import type {
  AdminCreateItemRequest,
  AdminItemListResponse,
  AdminCouponMembershipPassListResponse,
  AdminCurrentSubscriptionResponse,
  AdminMembershipHistoryResponse,
  AdminMembershipResponse,
  AdminSubscriptionStartRequest,
  AdminSubscriptionPlanChangeRequest,
  AdminPaymentMethodCreateRequest,
  AdminPaymentMethodListResponse,
  AdminPaymentMethodResponse,
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

// 대여 요청 현장 승인 (public API)
// - RentalConfirmationPage > LongRentalApprovalModal 에서 사용
export const useApprovePublicRental = () => {
  return useMutation({
    mutationFn: ({
      rentalId,
      adminNameToApprove,
      adminCodeVerificationToken,
    }: {
      rentalId: number;
      adminNameToApprove: string;
      adminCodeVerificationToken: string;
    }) =>
      approvePublicRental({
        rentalId,
        body: { adminNameToApprove, adminCodeVerificationToken },
      }),
  });
};

// 대여 요청 현장 거절 (public API)
// - RentalConfirmationPage > LongRentalApprovalModal 에서 사용
export const useRejectPublicRental = () => {
  return useMutation({
    mutationFn: ({
      rentalId,
      adminNameToReject,
      adminCodeVerificationToken,
    }: {
      rentalId: number;
      adminNameToReject: string;
      adminCodeVerificationToken: string;
    }) =>
      rejectPublicRental({
        rentalId,
        body: { adminNameToReject, adminCodeVerificationToken },
      }),
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

// 관리자 코드 검증 (admin API)
// - 관리자 화면(물품 수정 진입 등)에서 사용
export const useVerifyAdminCodeByAdmin = () => {
  return useMutation({
    mutationFn: (body: AdminVerifyCodeRequestBody) => verifyAdminCodeByAdmin(body),
  });
};

// 쿠폰 조회
// - 멤버십 페이지에서 쿠폰 코드로 미리보기/등록 모달 진입 전 검증
// GET /api/admin/v1/coupons/{couponCode}
export const useRequestAdminCoupon = () => {
  return useMutation({
    mutationFn: (couponCode: string) => requestAdminCoupon(couponCode),
  });
};

// 쿠폰 등록
// - 쿠폰 등록 모달에서 조회된 couponId로 이용권 등록
// POST /api/admin/v1/coupons/{couponId}/registrations
export const useRegisterAdminCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (couponId: string) => registerAdminCoupon({ couponId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["adminMembership"] });
      await queryClient.invalidateQueries({
        queryKey: ["adminCouponMemberships"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["adminCurrentSubscription"],
      });
    },
  });
};

// 쿠폰 이용권 목록 조회
// - 이용권 목록 > 쿠폰 이용권 탭
// GET /api/admin/v1/memberships/coupons
export const useAdminCouponMemberships = () => {
  return useQuery<AdminCouponMembershipPassListResponse>({
    queryKey: ["adminCouponMemberships"],
    queryFn: requestAdminCouponMemberships,
    retry: false,
  });
};

// 현재 이용 중인 구독 이용권 조회
// GET /api/admin/v1/memberships/current/subscription
export const useAdminCurrentSubscription = () => {
  return useQuery<AdminCurrentSubscriptionResponse | null>({
    queryKey: ["adminCurrentSubscription"],
    queryFn: async () => {
      try {
        return await requestAdminCurrentSubscription();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });
};

// 이용권 및 결제 내역 조회
// - 이용권 목록 > 이용 내역 탭
// GET /api/admin/v1/memberships/history
export const useAdminMembershipHistory = (params?: {
  start?: string;
  end?: string;
}) => {
  return useInfiniteQuery<AdminMembershipHistoryResponse>({
    queryKey: ["adminMembershipHistory", params?.start, params?.end],
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) =>
      requestAdminMembershipHistory({
        cursor: pageParam as number | undefined,
        size: 15,
        start: params?.start,
        end: params?.end,
      }),
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.nextCursor;
      if (typeof nextCursor !== "number" || nextCursor <= 0) {
        return undefined;
      }
      return nextCursor;
    },
    retry: false,
  });
};

// 구독 시작
// POST /api/admin/v1/subscriptions
export const useStartAdminSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminSubscriptionStartRequest) =>
      startAdminSubscription(body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["adminMembership"] }),
        queryClient.invalidateQueries({
          queryKey: ["adminCurrentSubscription"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["adminMembershipHistory"],
        }),
      ]);
    },
  });
};

// 구독 플랜 변경
// PATCH /api/admin/v1/subscriptions/plans
export const useChangeAdminSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminSubscriptionPlanChangeRequest) =>
      changeAdminSubscriptionPlan(body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["adminMembership"] }),
        queryClient.invalidateQueries({
          queryKey: ["adminCurrentSubscription"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["adminMembershipHistory"],
        }),
      ]);
    },
  });
};

// 구독 해지
// PATCH /api/admin/v1/subscriptions/me/cancel
export const useCancelAdminSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelAdminSubscription(),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["adminMembership"] }),
        queryClient.invalidateQueries({
          queryKey: ["adminCurrentSubscription"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["adminMembershipHistory"],
        }),
      ]);
    },
  });
};

// 현재 멤버십 상태 조회
// - 멤버십 이용 현황, 이용권 목록 > 구독 이용권 탭 등에서 사용
// GET /api/admin/v1/memberships/current
export const useAdminMembership = () => {
  return useQuery<AdminMembershipResponse>({
    queryKey: ["adminMembership"],
    queryFn: requestAdminMembership,
    retry: false,
  });
};

// 결제수단 목록 조회
// GET /api/admin/v1/payment-methods
export const useAdminPaymentMethods = () => {
  return useQuery<AdminPaymentMethodListResponse>({
    queryKey: ["adminPaymentMethods"],
    queryFn: requestAdminPaymentMethods,
    retry: false,
  });
};

// 결제수단 단건 조회
// GET /api/admin/v1/payment-methods/{paymentMethodId}
export const useAdminPaymentMethod = (
  paymentMethodId: string,
  options?: { enabled?: boolean },
) => {
  const idOk = paymentMethodId.length > 0;
  const enabled =
    options?.enabled !== undefined ? options.enabled && idOk : idOk;

  return useQuery<AdminPaymentMethodResponse>({
    queryKey: ["adminPaymentMethod", paymentMethodId],
    queryFn: () => requestAdminPaymentMethod(paymentMethodId),
    enabled,
    retry: false,
  });
};

// 결제수단 추가
// POST /api/admin/v1/payment-methods
export const useCreateAdminPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminPaymentMethodCreateRequest) =>
      createAdminPaymentMethod(body),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["adminPaymentMethods"] }),
        queryClient.invalidateQueries({
          queryKey: ["adminPaymentMethod", data.paymentMethodId],
        }),
      ]);
    },
  });
};

// 기본 결제수단 변경
// PATCH /api/admin/v1/payment-methods/{paymentMethodId}/default
export const useUpdateAdminDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentMethodId: string) =>
      updateAdminDefaultPaymentMethod({ paymentMethodId }),
    onSuccess: async (_data, paymentMethodId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["adminPaymentMethods"] }),
        queryClient.invalidateQueries({
          queryKey: ["adminPaymentMethod", paymentMethodId],
        }),
      ]);
    },
  });
};

// 결제수단 삭제
// DELETE /api/admin/v1/payment-methods/{paymentMethodId}
export const useDeleteAdminPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentMethodId: string) =>
      deleteAdminPaymentMethod({ paymentMethodId }),
    onSuccess: async (_data, paymentMethodId) => {
      queryClient.removeQueries({
        queryKey: ["adminPaymentMethod", paymentMethodId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["adminPaymentMethods"],
      });
    },
  });
};
