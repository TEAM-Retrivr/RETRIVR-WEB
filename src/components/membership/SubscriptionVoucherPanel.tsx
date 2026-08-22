import { useState } from "react";
import axios from "axios";
import { SUBSCRIPTION_USAGE_GUIDE } from "../../types/voucherList";
import {
  useAdminCurrentSubscription,
  useCancelAdminSubscription,
} from "../../hooks/queries/useAdminQueries";
import type {
  AdminSubscriptionErrorResponse,
  AdminSubscriptionPlan,
} from "../../api/admin/admin.type";
import { formatCouponDay } from "../../utils/couponDisplay";
import UsageGuideCard from "./UsageGuideCard";
import SubscriptionCancelModal from "../modals/membership/SubscriptionCancelModal";
import CouponAlertModal from "../modals/membership/CouponAlertModal";

const EMPTY_MEMBERSHIP_MESSAGE = "현재 이용 중인 이용권이 없습니다.";

const SUBSCRIPTION_PLAN_LABEL: Record<AdminSubscriptionPlan, string> = {
  MONTHLY: "월간 이용권",
  YEARLY: "연간 이용권",
};

const getSubscriptionErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | AdminSubscriptionErrorResponse
      | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
};

const resolveStatusLabel = (status?: string): string =>
  status === "REGISTERED" ? "일시중지" : "이용중";

const resolveDescription = ({
  isPaused,
  nextBillingAt,
}: {
  isPaused: boolean;
  nextBillingAt?: string | null;
}): string | undefined => {
  if (!nextBillingAt) return undefined;

  const billingDay = formatCouponDay(nextBillingAt);

  if (isPaused) {
    return `등록된 쿠폰 이용권을 모두 사용하면\n${billingDay}부터 자동 결제가 다시 진행돼요.`;
  }

  return `다음 결제 예정일: ${billingDay}`;
};

const SubscriptionVoucherPanel = () => {
  const { data, isLoading, isError, isSuccess } = useAdminCurrentSubscription();
  const cancelMutation = useCancelAdminSubscription();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [hasCanceled, setHasCanceled] = useState(false);

  const hasSubscription =
    isSuccess && Boolean(data) && data?.membershipPassStatus !== "EXPIRED";
  const showEmptyState = !isLoading && (isError || !hasSubscription);
  const isPaused = data?.membershipPassStatus === "REGISTERED";
  const planLabel = data?.plan
    ? SUBSCRIPTION_PLAN_LABEL[data.plan]
    : undefined;
  const statusLabel = resolveStatusLabel(data?.membershipPassStatus);
  const description = resolveDescription({
    isPaused,
    nextBillingAt: data?.nextBillingAt,
  });

  const handleConfirmCancel = async () => {
    if (cancelMutation.isPending) return;
    try {
      const response = await cancelMutation.mutateAsync();
      setHasCanceled(true);
      setIsCancelOpen(false);
      const expireDay = response.currentPassExpireAt
        ? formatCouponDay(response.currentPassExpireAt)
        : undefined;
      setResultMessage(
        expireDay
          ? `구독이 해지되었어요.\n이용권은 ${expireDay}까지 유지됩니다.`
          : "구독이 해지되었어요.",
      );
    } catch (error) {
      setIsCancelOpen(false);
      setResultMessage(
        getSubscriptionErrorMessage(
          error,
          "구독 해지에 실패했습니다. 다시 시도해주세요.",
        ),
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <div className="flex min-h-[180px] items-center justify-center">
          <p className="text-14px font-normal leading-[1.4] text-neutral-gray-3">
            이용권을 불러오는 중이에요
          </p>
        </div>
      ) : null}

      {showEmptyState ? (
        <div className="flex min-h-[180px] items-center justify-center">
          <p className="text-center text-14px font-normal leading-[1.4] text-neutral-gray-3">
            {EMPTY_MEMBERSHIP_MESSAGE}
          </p>
        </div>
      ) : null}

      {hasSubscription && data && planLabel ? (
        <article className="flex flex-col rounded-2xl bg-neutral-white px-[26px] py-6 shadow-[0px_0px_16px_-6px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-[5px]">
            <h2 className="text-16px font-bold leading-normal text-neutral-gray-1">
              {planLabel}
            </h2>
            <span className="inline-flex h-[18px] items-center justify-center rounded-[9px] border-[0.5px] border-secondary-2 bg-neutral-gray-5 px-[7px]">
              <span className="text-10px font-bold leading-[1.3] text-secondary-2">
                {statusLabel}
              </span>
            </span>
          </div>

          {description && !hasCanceled ? (
            <p className="mt-2 whitespace-pre-line text-12px font-normal leading-[1.4] text-neutral-gray-3">
              {description}
            </p>
          ) : null}

          {!hasCanceled && data.nextBillingAt ? (
            <button
              type="button"
              onClick={() => setIsCancelOpen(true)}
              disabled={cancelMutation.isPending}
              className="mt-4 self-end text-12px font-medium leading-[1.5] text-neutral-gray-3 underline cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              구독 해지
            </button>
          ) : null}
        </article>
      ) : null}

      <UsageGuideCard items={SUBSCRIPTION_USAGE_GUIDE} />

      <SubscriptionCancelModal
        isOpen={isCancelOpen}
        isPending={cancelMutation.isPending}
        onClose={() => {
          if (cancelMutation.isPending) return;
          setIsCancelOpen(false);
        }}
        onConfirm={handleConfirmCancel}
      />

      <CouponAlertModal
        isOpen={resultMessage !== null}
        message={resultMessage ?? ""}
        onClose={() => setResultMessage(null)}
      />
    </div>
  );
};

export default SubscriptionVoucherPanel;
