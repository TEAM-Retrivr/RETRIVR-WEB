import type { PaymentMethod } from "../types/paymentMethod";

const SHORT_NAME_BY_FULL: Record<string, string> = {
  우리은행: "우리",
  국민은행: "국민",
  신한카드: "신한",
};

const shortName = (method: PaymentMethod) =>
  SHORT_NAME_BY_FULL[method.name] ?? method.name;

const maskedTail = (maskedNumber?: string) => {
  if (!maskedNumber) return null;
  const digits = maskedNumber.replace(/\D/g, "");
  const tail = (digits || maskedNumber.replace(/\*/g, "")).slice(-4);
  if (!tail) return null;
  return `*****${tail}`;
};

export const formatPaymentMethodOptionLabel = (
  method: PaymentMethod,
  isPrimary: boolean,
) => {
  const masked = maskedTail(method.maskedNumber);
  const body = masked ? `${shortName(method)} ${masked}` : method.name;
  return isPrimary ? `${body} (대표)` : body;
};
