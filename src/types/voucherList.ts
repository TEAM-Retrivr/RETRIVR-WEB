export type VoucherListTab = "subscription" | "coupon" | "history";

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

export const SUBSCRIPTION_VOUCHER = {
  title: "연간 이용권",
  statusLabel: "일시중지",
  description:
    "등록된 쿠폰 이용권을 모두 사용하면\n26.09.01부터 자동 결제가 다시 진행돼요.",
  durationLabel: "12개월",
  originalPrice: "58,800",
  priceAmount: "46,900₩",
  priceUnit: "/연",
};

export const COUPON_VOUCHERS = [
  {
    id: "coupon-active",
    title: "2개월 이용권 쿠폰",
    eventName: "Retrivr 출시 이벤트",
    status: "active" as const,
    footerText: "사용 기간: 26. 05. 01 ~ 26. 06. 30",
  },
  {
    id: "coupon-pending",
    title: "2개월 이용권 쿠폰",
    eventName: "Retrivr 출시 이벤트",
    status: "pending" as const,
    footerText: "26. 07. 01 활성화 예정",
  },
];

export const SUBSCRIPTION_USAGE_GUIDE = [
  "쿠폰 코드를 등록하면 쿠폰 이용권을 사용할 수 있습니다.",
  "쿠폰 이용권은 등록 즉시 활성화됩니다.",
  "현재 구독 이용권을 사용 중인 경우에는 다음 결제일부터 쿠폰 이용권이 우선 적용됩니다.",
];

export const COUPON_USAGE_GUIDE = [
  "쿠폰 코드를 등록하여 쿠폰 이용권을 사용할 수 있습니다.",
  "쿠폰 이용권은 등록 즉시 활성화됩니다.",
  "현재 사용 중인 구독 이용권이 있는 경우, 다음 결제 주기(익월)부터 쿠폰 이용권이 우선 적용됩니다.",
];

export const USAGE_HISTORY_ITEMS: UsageHistoryItem[] = [
  {
    id: "history-1",
    title: "월간 이용권 결제",
    datetimeLabel: "2026. 07. 04.(금) 14:32",
    occurredAt: "2026-07-04",
    kind: "payment",
    amountLabel: "4,900₩",
  },
  {
    id: "history-2",
    title: "2달 이용권 쿠폰 사용",
    datetimeLabel: "2026. 05. 01.(금) 10:00",
    occurredAt: "2026-05-01",
    kind: "coupon",
  },
  {
    id: "history-3",
    title: "연간 이용권 결제",
    datetimeLabel: "2026. 03. 31.(월) 11:20",
    occurredAt: "2026-03-31",
    kind: "payment",
    amountLabel: "46,900₩",
  },
  {
    id: "history-4",
    title: "1달 이용권 쿠폰 사용",
    datetimeLabel: "2026. 03. 15.(토) 09:20",
    occurredAt: "2026-03-15",
    kind: "coupon",
  },
];
