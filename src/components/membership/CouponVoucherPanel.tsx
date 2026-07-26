import { COUPON_USAGE_GUIDE } from "../../types/voucherList";
import { useAdminMembership } from "../../hooks/queries/useAdminQueries";
import {
  formatCouponDay,
  formatCouponValidityPeriod,
} from "../../utils/couponDisplay";
import type { MembershipCouponStatus } from "./MembershipStatusBadge";
import MembershipCouponCard from "./MembershipCouponCard";
import UsageGuideCard from "./UsageGuideCard";

const EMPTY_MEMBERSHIP_MESSAGE = "현재 이용 중인 이용권이 없습니다.";

const resolveCouponStatus = (
  hasSubscription: boolean,
): MembershipCouponStatus =>
  // 구독 이용권이 있으면 쿠폰은 대기, 쿠폰만 있으면 등록 즉시 사용중
  hasSubscription ? "pending" : "active";

const resolveCouponFooterText = ({
  status,
  startAt,
  endAt,
  nextBillingAt,
}: {
  status: MembershipCouponStatus;
  startAt?: string;
  endAt?: string;
  nextBillingAt?: string;
}): string | undefined => {
  if (status === "pending") {
    if (nextBillingAt) {
      return `${formatCouponDay(nextBillingAt)} 활성화 예정`;
    }
    return undefined;
  }

  if (startAt && endAt) {
    return `사용 기간: ${formatCouponValidityPeriod(startAt, endAt)}`;
  }
  return undefined;
};

const CouponVoucherPanel = () => {
  const { data, isLoading, isError, isSuccess } = useAdminMembership();

  const couponInfo = data?.couponInfo;
  const hasCoupon =
    Boolean(couponInfo?.couponName) || Boolean(couponInfo?.couponDescription);
  const hasSubscription = Boolean(data?.subscriptionInfo?.subscriptionName);
  const showEmptyState =
    !isLoading && (isError || !isSuccess || (isSuccess && !hasCoupon));

  const status = resolveCouponStatus(hasSubscription);
  const footerText = resolveCouponFooterText({
    status,
    startAt: data?.startAt,
    endAt: data?.endAt,
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

      {isSuccess && data && hasCoupon && couponInfo ? (
        <div className="flex flex-col gap-2.5">
          <MembershipCouponCard
            title={couponInfo.couponName || "쿠폰 이용권"}
            eventName={couponInfo.couponDescription}
            status={status}
            footerText={footerText}
            compact
          />
        </div>
      ) : null}

      <UsageGuideCard items={COUPON_USAGE_GUIDE} />
    </div>
  );
};

export default CouponVoucherPanel;
