export type VoucherListTab = "subscription" | "coupon" | "history";

export const VOUCHER_LIST_TAB_ORDER = [
  "subscription",
  "coupon",
  "history",
] as const satisfies readonly VoucherListTab[];

export const VOUCHER_LIST_TAB_LABELS: Record<VoucherListTab, string> = {
  subscription: "구독 이용권",
  coupon: "쿠폰 이용권",
  history: "이용 내역",
};

export type HistoryPeriodOption = "all" | "1m" | "6m" | "1y" | "custom";

export type UsageHistoryItem = {
  id: string;
  title: string;
  datetimeLabel: string;
  occurredAt: string; // ISO date YYYY-MM-DD
  kind: "payment" | "coupon";
  amountLabel?: string;
};

export const HISTORY_PERIOD_LABEL: Record<HistoryPeriodOption, string> = {
  all: "전체",
  "1m": "1개월",
  "6m": "6개월",
  "1y": "1년",
  custom: "직접입력",
};

export const SUBSCRIPTION_USAGE_GUIDE_TITLE = "구독 및 쿠폰 사용 안내";

export const EMPTY_SUBSCRIPTION_USAGE_GUIDE = [
  "서비스 제공 기간: 결제 후 즉시 제공",
  "(구독 서비스 특성상 환불이 제한될 수 있습니다.)",
  "현재 구독 중이라면 다음 결제일부터 쿠폰 이용권이 먼저 사용돼요.",
  "쿠폰 코드를 등록하면 이용권이 즉시 활성화돼요.",
];

export const SUBSCRIPTION_USAGE_GUIDE = [
  "서비스 제공 기간: 결제 후 즉시 제공",
  "구독 서비스 특성상 환불이 제한될 수 있습니다.",
  "쿠폰 코드를 등록하면 쿠폰 이용권을 사용할 수 있습니다.",
  "쿠폰 이용권은 등록 즉시 활성화됩니다.",
  "현재 구독 이용권을 사용 중인 경우에는 다음 결제일부터 쿠폰 이용권이 우선 적용됩니다.",
];

export const COUPON_USAGE_GUIDE = [
  "쿠폰 코드를 등록하여 쿠폰 이용권을 사용할 수 있습니다.",
  "쿠폰 이용권은 등록 즉시 활성화됩니다.",
  "현재 사용 중인 구독 이용권이 있는 경우, 다음 결제 주기(익월)부터 쿠폰 이용권이 우선 적용됩니다.",
];
