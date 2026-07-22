export type PaymentMethodKind = "card" | "bank" | "kakao" | "naver";

export type PaymentMethod = {
  id: string;
  name: string;
  maskedNumber?: string;
  kind: PaymentMethodKind;
};

export type PaymentMethodRegisterOption = "kakao" | "naver" | "card";

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "shinhan-card",
    name: "신한카드",
    maskedNumber: "348313*******123",
    kind: "card",
  },
  {
    id: "woori-bank",
    name: "우리은행",
    maskedNumber: "**********26123",
    kind: "bank",
  },
  {
    id: "kb-bank",
    name: "국민은행",
    maskedNumber: "**********26123",
    kind: "bank",
  },
  {
    id: "kakao-pay",
    name: "카카오페이",
    kind: "kakao",
  },
  {
    id: "naver-pay",
    name: "네이버페이",
    kind: "naver",
  },
];

export const INITIAL_PRIMARY_PAYMENT_METHOD_ID = "shinhan-card";

export const REGISTER_OPTION_LABEL: Record<PaymentMethodRegisterOption, string> =
  {
    kakao: "카카오페이",
    naver: "네이버페이",
    card: "카드 등록",
  };

export const createRegisteredPaymentMethod = (
  option: PaymentMethodRegisterOption,
): PaymentMethod => {
  const id = `${option}-${Date.now()}`;

  if (option === "card") {
    return {
      id,
      name: "신한카드",
      maskedNumber: "348313*******123",
      kind: "card",
    };
  }

  if (option === "kakao") {
    return {
      id,
      name: "카카오페이",
      kind: "kakao",
    };
  }

  return {
    id,
    name: "네이버페이",
    kind: "naver",
  };
};
