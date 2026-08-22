import type { AdminSubscriptionPlan } from "../api/admin/admin.type";

export type VoucherBillingCycle = "monthly" | "yearly";

export type VoucherPaymentPlan = {
  cycle: VoucherBillingCycle;
  pageTitle: string;
  planLabel: string;
  amountLabel: string;
  nextBillingDateLabel: string;
  ctaLabel: string;
};

export const VOUCHER_PAYMENT_PLANS: Record<
  VoucherBillingCycle,
  VoucherPaymentPlan
> = {
  monthly: {
    cycle: "monthly",
    pageTitle: "월간 이용권 구독",
    planLabel: "월간 구독",
    amountLabel: "4,900원",
    nextBillingDateLabel: "2026. 01. 04(금)",
    ctaLabel: "월간 구독 시작하기",
  },
  yearly: {
    cycle: "yearly",
    pageTitle: "연간 이용권 구독",
    planLabel: "연간 구독",
    amountLabel: "49,000원",
    nextBillingDateLabel: "2027. 01. 04(일)",
    ctaLabel: "연간 구독 시작하기",
  },
};

export const parseVoucherBillingCycle = (
  value: string | null,
): VoucherBillingCycle => (value === "yearly" ? "yearly" : "monthly");

export const toAdminSubscriptionPlan = (
  cycle: VoucherBillingCycle,
): AdminSubscriptionPlan => (cycle === "yearly" ? "YEARLY" : "MONTHLY");

export const toVoucherBillingCycle = (
  plan: AdminSubscriptionPlan,
): VoucherBillingCycle => (plan === "YEARLY" ? "yearly" : "monthly");
