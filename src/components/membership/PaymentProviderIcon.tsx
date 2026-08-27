import type { PaymentMethodProvider } from "../../types/paymentMethod";

type PaymentProviderIconProps = {
  provider: PaymentMethodProvider;
  size?: "sm" | "lg";
};

const PaymentProviderIcon = ({
  provider,
  size = "lg",
}: PaymentProviderIconProps) => {
  const isKakao = provider === "KAKAOPAY";
  const boxClass = size === "lg" ? "size-9" : "size-3.5";
  const label = isKakao ? "카카오페이" : "카드";

  if (isKakao) {
    return (
      <div className={`relative shrink-0 overflow-clip ${boxClass}`}>
        <img
          src="/icons/membership/payment-kakaopay-bg.svg"
          alt=""
          className="absolute inset-0 h-full w-full"
        />
        <img
          src="/icons/membership/payment-kakaopay-talk.png"
          alt={label}
          className={
            size === "lg"
              ? "absolute left-[3px] top-[3px] size-[30px]"
              : "absolute left-[1px] top-[1px] size-[12px]"
          }
        />
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 overflow-clip ${boxClass}`}>
      <img
        src="/icons/membership/payment-card.svg"
        alt={label}
        className="h-full w-full"
      />
    </div>
  );
};

export default PaymentProviderIcon;
