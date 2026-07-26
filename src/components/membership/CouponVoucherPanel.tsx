import { COUPON_USAGE_GUIDE } from "../../types/voucherList";
import { useAdminMembership } from "../../hooks/queries/useAdminQueries";
import { formatCouponValidityPeriod } from "../../utils/couponDisplay";
import type { MembershipCouponStatus } from "./MembershipStatusBadge";
import MembershipCouponCard from "./MembershipCouponCard";
import UsageGuideCard from "./UsageGuideCard";

const EMPTY_MEMBERSHIP_MESSAGE = "현재 이용 중인 이용권이 없습니다.";

const resolveCouponStatus = ({
  subscribed,
  hasSubscription,
}: {
  subscribed: boolean;
  hasSubscription: boolean;
}): MembershipCouponStatus => {
  // 구독 이용권이 함께 있으면 쿠폰은 대기, 아니면 구독 여부로 사용중/대기 구분
  if (hasSubscription) return "pending";
  return subscribed ? "active" : "pending";
};

const CouponVoucherPanel = () => {
  const { data, isLoading, isError, isSuccess } = useAdminMembership();

  const couponInfo = data?.couponInfo;
  const hasCoupon =
    Boolean(couponInfo?.couponName) || Boolean(couponInfo?.couponDescription);
  const showEmptyState =
    !isLoading && (isError || !isSuccess || (isSuccess && !hasCoupon));

  const usagePeriod =
    data?.startAt && data?.endAt
      ? formatCouponValidityPeriod(data.startAt, data.endAt)
      : null;

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

      {isSuccess && data && hasCoupon && couponInfo ? (
        <div className="flex flex-col gap-2.5">
          <MembershipCouponCard
            title={couponInfo.couponName || "쿠폰 이용권"}
            eventName={couponInfo.couponDescription}
            status={resolveCouponStatus({
              subscribed: data.subscribed,
              hasSubscription: Boolean(
                data.subscriptionInfo?.subscriptionName,
              ),
            })}
            footerText={
              usagePeriod ? `사용 기간: ${usagePeriod}` : undefined
            }
            compact
          />
        </div>
      ) : null}

      <UsageGuideCard items={COUPON_USAGE_GUIDE} />
    </div>
  );
};

export default CouponVoucherPanel;
