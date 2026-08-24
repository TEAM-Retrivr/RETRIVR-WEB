import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  EMPTY_SUBSCRIPTION_USAGE_GUIDE,
  SUBSCRIPTION_USAGE_GUIDE,
  SUBSCRIPTION_USAGE_GUIDE_TITLE,
} from "../../types/voucherList";
import {
  useAdminCurrentSubscription,
  useCancelAdminSubscription,
} from "../../hooks/queries/useAdminQueries";
import type {
  AdminSubscriptionErrorResponse,
  AdminSubscriptionPlan,
} from "../../api/admin/admin.type";
import {
  formatCouponDay,
  formatFullDotDay,
  formatKoreanDate,
} from "../../utils/couponDisplay";
import type { VoucherBillingCycle } from "../../types/voucherPayment";
import MembershipCouponCard from "./MembershipCouponCard";
import MembershipSubscribeCard from "./MembershipSubscribeCard";
import UsageGuideCard from "./UsageGuideCard";
import SubscriptionCancelModal from "../modals/membership/SubscriptionCancelModal";
import CouponAlertModal from "../modals/membership/CouponAlertModal";

const EMPTY_MEMBERSHIP_MESSAGE = "Retrivr 프로를 이용하고 있지 않아요!";

const SUBSCRIPTION_PLAN_LABEL: Record<AdminSubscriptionPlan, string> = {
  MONTHLY: "월간 구독 이용권",
  YEARLY: "연간 구독 이용권",
};

const SUBSCRIPTION_PLAN_UNIT: Record<AdminSubscriptionPlan, string> = {
  MONTHLY: "/월",
  YEARLY: "/년",
};

const PLAN_CHANGE_LABEL: Record<AdminSubscriptionPlan, string> = {
  MONTHLY: "연간 구독으로 변경",
  YEARLY: "월간 구독으로 변경",
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

const formatPaidAmount = (amount?: number) =>
  typeof amount === "number" ? `${amount.toLocaleString("ko-KR")}₩` : undefined;

const ACTION_BUTTON_CLASS =
  "flex h-[42px] min-w-0 flex-1 items-center justify-center rounded-[7.5px] bg-neutral-white px-2 text-center text-12px font-bold leading-[1.5] text-neutral-gray-2 shadow-[0px_0px_2px_rgba(0,0,0,0.14)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

type VoucherActionButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
};

const VoucherActionButton = ({
  label,
  disabled,
  onClick,
}: VoucherActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={ACTION_BUTTON_CLASS}
  >
    {label}
  </button>
);

const SubscriptionVoucherPanel = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, isSuccess } = useAdminCurrentSubscription();
  const cancelMutation = useCancelAdminSubscription();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [hasCanceled, setHasCanceled] = useState(false);
  const [billingCycle, setBillingCycle] =
    useState<VoucherBillingCycle>("monthly");

  const hasSubscription =
    isSuccess && Boolean(data) && data?.membershipPassStatus !== "EXPIRED";
  const showEmptyState = !isLoading && (isError || !hasSubscription);
  const isPaused = data?.membershipPassStatus === "REGISTERED";
  const isCanceledPass =
    hasCanceled ||
    Boolean(hasSubscription && !isPaused && data && !data.nextBillingAt);
  const planLabel = data?.plan ? SUBSCRIPTION_PLAN_LABEL[data.plan] : undefined;
  const expireAt = data?.endAt || data?.nextBillingAt || undefined;
  const expireAtLabel = expireAt ? formatKoreanDate(expireAt) : undefined;
  const nextBillingLabel =
    !isCanceledPass && !isPaused && data?.nextBillingAt
      ? `다음 결제일 ${formatFullDotDay(data.nextBillingAt)}`
      : isCanceledPass && data?.endAt
        ? `혜택 종료일 ${formatFullDotDay(data.endAt)}`
        : undefined;
  const pausedDescription =
    isPaused && data?.nextBillingAt
      ? `등록된 쿠폰 이용권을 모두 사용하면\n${formatCouponDay(data.nextBillingAt)}부터 자동 결제가 다시 진행돼요.`
      : undefined;

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
        <div className="flex flex-col gap-1.5">
          <div className="flex h-[42px] w-full items-center justify-center rounded-[7.5px] border border-[#e6eaed] bg-neutral-gray-5 px-[18px]">
            <p className="text-12px font-bold leading-[1.5] text-neutral-gray-3">
              {EMPTY_MEMBERSHIP_MESSAGE}
            </p>
          </div>
          <MembershipSubscribeCard
            billingCycle={billingCycle}
            onBillingCycleChange={setBillingCycle}
            ctaLabel="구독 시작하기"
            onCtaClick={() =>
              navigate(`/membership/subscribe?cycle=${billingCycle}`)
            }
          />
        </div>
      ) : null}

      {hasSubscription && data && planLabel ? (
        <div className="flex flex-col gap-1.5">
          <MembershipCouponCard
            title={planLabel}
            status="active"
            priceAmount={formatPaidAmount(data.paidAmount)}
            priceUnit={SUBSCRIPTION_PLAN_UNIT[data.plan]}
            footerText={nextBillingLabel}
          />

          {pausedDescription && !isCanceledPass ? (
            <p className="whitespace-pre-line text-12px font-normal leading-[1.4] text-neutral-gray-3">
              {pausedDescription}
            </p>
          ) : null}

          {isCanceledPass ? (
            <div className="flex gap-1.5">
              <VoucherActionButton label="월간 구독 시작하기" />
              <VoucherActionButton label="연간 구독 시작하기" />
            </div>
          ) : (
            <div className="flex gap-1.5">
              <VoucherActionButton label={PLAN_CHANGE_LABEL[data.plan]} />
              <VoucherActionButton
                label="구독 해지"
                disabled={cancelMutation.isPending}
                onClick={() => setIsCancelOpen(true)}
              />
            </div>
          )}
        </div>
      ) : null}

      <UsageGuideCard
        title={SUBSCRIPTION_USAGE_GUIDE_TITLE}
        items={
          showEmptyState
            ? EMPTY_SUBSCRIPTION_USAGE_GUIDE
            : SUBSCRIPTION_USAGE_GUIDE
        }
      />

      <SubscriptionCancelModal
        isOpen={isCancelOpen}
        isPending={cancelMutation.isPending}
        expireAtLabel={expireAtLabel}
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
