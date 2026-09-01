import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  EMPTY_SUBSCRIPTION_USAGE_GUIDE,
  SUBSCRIPTION_USAGE_GUIDE,
  SUBSCRIPTION_USAGE_GUIDE_TITLE,
} from "../../types/voucherList";
import {
  useAdminMembership,
  useCancelAdminSubscription,
} from "../../hooks/queries/useAdminQueries";
import type { AdminSubscriptionErrorResponse } from "../../api/admin/admin.type";
import {
  formatCouponDay,
  formatFullDotDay,
  formatKoreanDate,
} from "../../utils/couponDisplay";
import MembershipCouponCard from "./MembershipCouponCard";
import MembershipSubscribeCard, {
  MEMBERSHIP_MONTHLY_PLAN,
} from "./MembershipSubscribeCard";
import UsageGuideCard from "./UsageGuideCard";
import SubscriptionCancelModal from "../modals/membership/SubscriptionCancelModal";
import CouponAlertModal from "../modals/membership/CouponAlertModal";

const EMPTY_MEMBERSHIP_MESSAGE = "Retrivr 프로를 이용하고 있지 않아요!";
const MONTHLY_PASS_LABEL = "월간 구독 이용권";
const COUPON_PASS_TYPE = "쿠폰 사용";
const ALREADY_CANCELED_MESSAGE = "이미 구독을 해지하였습니다";

const isCouponPassType = (passType?: string | null): boolean =>
  passType === COUPON_PASS_TYPE;

const getSubscriptionErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | AdminSubscriptionErrorResponse
      | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
};

type CouponPrioritySubscriptionNoticeProps = {
  nextBillingAt: string;
};

const CouponPrioritySubscriptionNotice = ({
  nextBillingAt,
}: CouponPrioritySubscriptionNoticeProps) => (
  <div className="w-full rounded-[7.5px] border border-[#e6eaed] bg-neutral-gray-5 px-[18px] py-3">
    <p className="whitespace-pre-line text-14px font-bold leading-[1.5] text-neutral-gray-3">
      {"현재 쿠폰 이용권이 우선 적용 중입니다.\n"}
      {"모든 쿠폰 소진 후 "}
      <span className="font-bold text-secondary-1">{nextBillingAt}</span>
      {"에\n 구독 이용권이 결제됩니다."}
    </p>
  </div>
);

const SubscriptionVoucherPanel = () => {
  const navigate = useNavigate();
  const { data: membership, isLoading, isError } = useAdminMembership();
  const cancelMutation = useCancelAdminSubscription();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [hasCanceled, setHasCanceled] = useState(false);

  const goToSubscribe = () => {
    navigate("/membership/subscribe?cycle=monthly");
  };

  const subscriptionPlan = membership?.subscriptionPlan ?? null;
  const hasSubscription = Boolean(subscriptionPlan);
  const showCouponPriorityNotice = Boolean(
    membership &&
      subscriptionPlan &&
      isCouponPassType(membership.passType) &&
      membership.nextBillingAt,
  );
  const showEmptyState = !isLoading && (isError || !hasSubscription);
  const nextBillingAt = membership?.nextBillingAt ?? undefined;
  const endAt = membership?.endAt;
  const isCanceledPass =
    hasCanceled || Boolean(hasSubscription && !nextBillingAt);
  const expireAtLabel = nextBillingAt
    ? formatKoreanDate(nextBillingAt)
    : undefined;
  const nextBillingLabel = nextBillingAt
    ? `다음 결제일 ${formatFullDotDay(nextBillingAt)}`
    : isCanceledPass && endAt
      ? `혜택 종료일 ${formatFullDotDay(endAt)}`
      : undefined;
  const formattedNextBillingAt = nextBillingAt
    ? formatFullDotDay(nextBillingAt)
    : "";

  const handleOpenCancel = () => {
    if (isCanceledPass) {
      setResultMessage(ALREADY_CANCELED_MESSAGE);
      return;
    }
    setIsCancelOpen(true);
  };

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
            ctaLabel="구독 시작하기"
            onCtaClick={goToSubscribe}
          />
        </div>
      ) : null}

      {hasSubscription && subscriptionPlan ? (
        <div className="flex flex-col gap-1.5">
          {showCouponPriorityNotice ? (
            <CouponPrioritySubscriptionNotice
              nextBillingAt={formattedNextBillingAt}
            />
          ) : (
            <MembershipCouponCard
              status="active"
              title={MONTHLY_PASS_LABEL}
              detail={MEMBERSHIP_MONTHLY_PLAN.amount}
              detailUnit={MEMBERSHIP_MONTHLY_PLAN.unit}
              footerText={nextBillingLabel}
              footerTone={isCanceledPass ? "muted" : "default"}
            />
          )}

          <button
            type="button"
            onClick={handleOpenCancel}
            disabled={cancelMutation.isPending}
            className="flex h-[42px] w-full items-center justify-center rounded-[7.5px] bg-neutral-white px-[18px] text-12px font-bold leading-[1.5] text-neutral-gray-2 shadow-[0px_0px_2px_rgba(0,0,0,0.14)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            구독 해지
          </button>
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
