import {
  SUBSCRIPTION_USAGE_GUIDE,
} from "../../types/voucherList";
import { useAdminMembership } from "../../hooks/queries/useAdminQueries";
import { formatCouponDay } from "../../utils/couponDisplay";
import UsageGuideCard from "./UsageGuideCard";

const EMPTY_MEMBERSHIP_MESSAGE = "현재 이용 중인 이용권이 없습니다.";

type SubscriptionVoucherPanelProps = {
  onCancelSubscription?: () => void;
};

const isCouponPassType = (passType?: string): boolean =>
  Boolean(passType && /coupon/i.test(passType));

const resolveStatusLabel = (isPausedForCoupon: boolean): string =>
  // 현재 패스가 쿠폰일 때만 구독 일시중지 (대기 쿠폰만 있는 경우는 이용중)
  isPausedForCoupon ? "일시중지" : "이용중";

const resolveDescription = ({
  isPausedForCoupon,
  nextBillingAt,
}: {
  isPausedForCoupon: boolean;
  nextBillingAt?: string;
}): string | undefined => {
  if (!nextBillingAt) return undefined;

  const billingDay = formatCouponDay(nextBillingAt);

  if (isPausedForCoupon) {
    return `등록된 쿠폰 이용권을 모두 사용하면\n${billingDay}부터 자동 결제가 다시 진행돼요.`;
  }

  return `다음 결제 예정일: ${billingDay}`;
};

const SubscriptionVoucherPanel = ({
  onCancelSubscription,
}: SubscriptionVoucherPanelProps) => {
  const { data, isLoading, isError, isSuccess } = useAdminMembership();

  const subscriptionName = data?.subscriptionInfo?.subscriptionName?.trim();
  const hasSubscription = Boolean(subscriptionName);
  const isPausedForCoupon = isCouponPassType(data?.passType);
  const showEmptyState =
    !isLoading && (isError || !isSuccess || (isSuccess && !hasSubscription));

  const statusLabel = resolveStatusLabel(isPausedForCoupon);
  const description = resolveDescription({
    isPausedForCoupon,
    nextBillingAt: data?.nextBillingAt,
  });

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

      {isSuccess && data && hasSubscription && subscriptionName ? (
        <article className="flex flex-col rounded-2xl bg-neutral-white px-[26px] py-6 shadow-[0px_0px_16px_-6px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-[5px]">
            <h2 className="text-16px font-bold leading-normal text-neutral-gray-1">
              {subscriptionName}
            </h2>
            <span className="inline-flex h-[18px] items-center justify-center rounded-[9px] border-[0.5px] border-secondary-2 bg-neutral-gray-5 px-[7px]">
              <span className="text-10px font-bold leading-[1.3] text-secondary-2">
                {statusLabel}
              </span>
            </span>
          </div>

          {description ? (
            <p className="mt-2 whitespace-pre-line text-12px font-normal leading-[1.4] text-neutral-gray-3">
              {description}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onCancelSubscription}
            className="mt-4 self-end text-12px font-medium leading-[1.5] text-neutral-gray-3 underline cursor-pointer"
          >
            구독 해지
          </button>
        </article>
      ) : null}

      <UsageGuideCard items={SUBSCRIPTION_USAGE_GUIDE} />
    </div>
  );
};

export default SubscriptionVoucherPanel;
