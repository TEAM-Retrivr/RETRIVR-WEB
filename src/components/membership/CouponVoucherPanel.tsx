import { COUPON_USAGE_GUIDE } from "../../types/voucherList";
import { useAdminCouponMemberships } from "../../hooks/queries/useAdminQueries";
import type { AdminCouponMembershipPassResponse } from "../../api/admin/admin.type";
import { formatCouponDay } from "../../utils/couponDisplay";
import MembershipCouponCard from "./MembershipCouponCard";
import type { MembershipCouponStatus } from "./MembershipStatusBadge";
import UsageGuideCard from "./UsageGuideCard";

const EMPTY_COUPON_MESSAGE = "등록된 쿠폰 이용권이 없습니다.";

const mapCouponPassStatus = (status: string): MembershipCouponStatus => {
  const normalized = status.trim().replace(/\s+/g, "").toLowerCase();

  if (["active", "사용중", "이용중"].includes(normalized)) {
    return "active";
  }
  if (["completed", "expired", "ended", "사용완료"].includes(normalized)) {
    return "completed";
  }
  return "pending";
};

const resolveCouponFooter = (
  coupon: AdminCouponMembershipPassResponse,
  status: MembershipCouponStatus,
): string | undefined => {
  const startAt = coupon.startAt ? formatCouponDay(coupon.startAt) : "";
  const endAt = coupon.endAt ? formatCouponDay(coupon.endAt) : "";

  if (status === "pending" && startAt) {
    return `${startAt} 사용 예정`;
  }
  if (startAt && endAt) {
    return `사용 기간: ${startAt} ~ ${endAt}`;
  }
  return undefined;
};

const CouponVoucherPanel = () => {
  // GET /api/admin/v1/memberships/coupons
  const { data, isLoading, isError, isSuccess } = useAdminCouponMemberships();
  const coupons = data?.coupons ?? [];
  const showEmptyState =
    !isLoading && (isError || !isSuccess || coupons.length === 0);

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
            {EMPTY_COUPON_MESSAGE}
          </p>
        </div>
      ) : null}

      {isSuccess && coupons.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {coupons.map((coupon) => {
            const status = mapCouponPassStatus(coupon.status);
            return (
              <MembershipCouponCard
                key={coupon.membershipPassId}
                status={status}
                title={coupon.couponName}
                detail={coupon.description}
                footerText={resolveCouponFooter(coupon, status)}
              />
            );
          })}
        </div>
      ) : null}

      <UsageGuideCard items={COUPON_USAGE_GUIDE} />
    </div>
  );
};

export default CouponVoucherPanel;
