import type { AdminPaymentMethodProvider } from "../api/admin/admin.type";

export type PaymentMethodProvider = AdminPaymentMethodProvider;

export type PaymentMethodRegisterOption = "kakao" | "card";

export type PaymentMethod = {
  id: string;
  name: string;
  maskedNumber?: string;
  provider: PaymentMethodProvider;
  isDefault: boolean;
  registeredAt?: string;
};

export const PAYMENT_PROVIDER_LABEL: Record<PaymentMethodProvider, string> = {
  KAKAOPAY: "카카오페이",
  TOSSPAY: "토스페이",
  KGINICIS: "카드",
};

export const REGISTER_OPTION_LABEL: Record<PaymentMethodRegisterOption, string> =
  {
    kakao: "카카오페이",
    card: "카드 등록",
  };

export const REGISTER_OPTION_PROVIDER: Record<
  PaymentMethodRegisterOption,
  PaymentMethodProvider
> = {
  kakao: "KAKAOPAY",
  card: "KGINICIS",
};

export const toPaymentMethodView = (item: {
  paymentMethodId: string;
  provider: PaymentMethodProvider | string;
  isDefault: boolean;
  registeredAt?: string;
}): PaymentMethod => {
  const provider = item.provider as PaymentMethodProvider;
  return {
    id: item.paymentMethodId,
    name: PAYMENT_PROVIDER_LABEL[provider] ?? item.provider,
    provider,
    isDefault: item.isDefault,
    registeredAt: item.registeredAt,
  };
};

export const toActivePaymentMethods = (
  items?: Array<{
    paymentMethodId: string;
    provider: PaymentMethodProvider | string;
    status?: string;
    isDefault: boolean;
    registeredAt?: string;
  }>,
): PaymentMethod[] =>
  (items ?? [])
    .filter((item) => item.status !== "DISABLED")
    .map(toPaymentMethodView);

export const getPrimaryPaymentMethodId = (methods: PaymentMethod[]) =>
  methods.find((method) => method.isDefault)?.id ?? methods[0]?.id ?? "";
