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

export const formatPaymentMethodRegisteredAt = (registeredAt?: string) => {
  if (!registeredAt) return null;
  const match = registeredAt.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
  );
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  return `등록일자: ${year}년 ${month}월 ${day}일 ${hour}:${minute}:${second}`;
};

export const formatPaymentMethodOptionLabel = (
  method: PaymentMethod,
  isPrimary: boolean,
) => {
  const masked = maskedTail(method.maskedNumber);
  const body = masked ? `${shortName(method)} ${masked}` : method.name;
  return isPrimary ? `${body} (대표)` : body;
};
