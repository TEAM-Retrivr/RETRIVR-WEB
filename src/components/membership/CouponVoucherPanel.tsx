import {
  COUPON_USAGE_GUIDE,
  COUPON_VOUCHERS,
} from "../../types/voucherList";
import MembershipCouponCard from "./MembershipCouponCard";
import UsageGuideCard from "./UsageGuideCard";

const CouponVoucherPanel = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2.5">
      {COUPON_VOUCHERS.map((voucher) => (
        <MembershipCouponCard
          key={voucher.id}
          title={voucher.title}
          eventName={voucher.eventName}
          status={voucher.status}
          footerText={voucher.footerText}
          compact
        />
      ))}
    </div>
    <UsageGuideCard items={COUPON_USAGE_GUIDE} />
  </div>
);

export default CouponVoucherPanel;
