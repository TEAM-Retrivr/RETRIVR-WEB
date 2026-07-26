import type { AdminCouponLookupResponse } from "../api/admin/admin.type";

/** YYYY-MM-DD → YY. MM. DD */
export const formatCouponDay = (day: string): string => {
  const [year, month, date] = day.split("-");
  if (!year || !month || !date) return day;
  return `${year.slice(-2)}. ${month}. ${date}`;
};

export const formatCouponValidityPeriod = (
  activeStartDay: string,
  expiresDay: string,
): string =>
  `${formatCouponDay(activeStartDay)} ~ ${formatCouponDay(expiresDay)}`;

export const formatCouponBenefitPeriod = (durationDays: number): string =>
  `등록일로부터 ${durationDays}일 간`;

export type CouponModalViewModel = {
  title: string;
  eventName: string;
  validityPeriod: string;
  benefitPeriod: string;
};

export const toCouponModalViewModel = (
  coupon: AdminCouponLookupResponse,
): CouponModalViewModel => ({
  title: coupon.name,
  eventName: coupon.description,
  validityPeriod: formatCouponValidityPeriod(
    coupon.activeStartDay,
    coupon.expiresDay,
  ),
  benefitPeriod: formatCouponBenefitPeriod(coupon.durationDays),
});
