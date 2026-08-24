import type { AdminCouponLookupResponse } from "../api/admin/admin.type";

/** 영대문자·숫자 4자리 3묶음. 예: YKQ3-SVC3-2JVB */
export const COUPON_CODE_PATTERN = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export const isValidCouponCode = (couponCode: string): boolean =>
  COUPON_CODE_PATTERN.test(couponCode);

/** YYYY-MM-DD → YY. MM. DD */
export const formatCouponDay = (day: string): string => {
  const datePart = day.includes("T") ? day.slice(0, 10) : day;

  const isoMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1].slice(-2)}. ${isoMatch[2]}. ${isoMatch[3]}`;
  }

  const dottedMatch = datePart.match(/^(\d{2})\.\s*(\d{2})\.\s*(\d{2})/);
  if (dottedMatch) {
    return `${dottedMatch[1]}. ${dottedMatch[2]}. ${dottedMatch[3]}`;
  }

  return day;
};

/** YYYY-MM-DD → YYYY. MM. DD */
export const formatFullDotDay = (day: string): string => {
  const datePart = day.includes("T") ? day.slice(0, 10) : day;
  const isoMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}. ${isoMatch[2]}. ${isoMatch[3]}`;
  }
  return formatCouponDay(day);
};

/** YYYY-MM-DD → YYYY년 M월 D일 */
export const formatKoreanDate = (day: string): string => {
  const datePart = day.includes("T") ? day.slice(0, 10) : day;
  const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return formatCouponDay(day);
  return `${match[1]}년 ${Number(match[2])}월 ${Number(match[3])}일`;
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
