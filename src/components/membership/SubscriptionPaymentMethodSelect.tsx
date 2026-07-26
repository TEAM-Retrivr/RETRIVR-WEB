import type { PaymentMethod } from "../../types/paymentMethod";
import { formatPaymentMethodOptionLabel } from "../../utils/paymentMethodLabel";

type SubscriptionPaymentMethodSelectProps = {
  methods: PaymentMethod[];
  primaryId: string;
  selectedId: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (methodId: string) => void;
  onRegisterNew: () => void;
};

const PaymentMethodLabel = ({
  method,
  isPrimary,
}: {
  method: PaymentMethod;
  isPrimary: boolean;
}) => {
  const label = formatPaymentMethodOptionLabel(method, isPrimary);
  if (!isPrimary) {
    return (
      <span className="text-12px font-bold leading-[1.5] text-neutral-gray-2">
        {label}
      </span>
    );
  }

  const base = label.replace(/\s*\(대표\)$/, "");
  return (
    <span className="text-12px font-bold leading-[1.5] text-neutral-gray-2">
      {base} <span className="font-normal leading-[1.4]">(대표)</span>
    </span>
  );
};

const SubscriptionPaymentMethodSelect = ({
  methods,
  primaryId,
  selectedId,
  isOpen,
  onToggle,
  onSelect,
  onRegisterNew,
}: SubscriptionPaymentMethodSelectProps) => {
  const selectedMethod =
    methods.find((method) => method.id === selectedId) ?? methods[0] ?? null;

  if (!selectedMethod) {
    return (
      <button
        type="button"
        onClick={onRegisterNew}
        className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[7.5px] border border-[#e6eaed] bg-neutral-white px-[18px] py-3 cursor-pointer"
      >
        <img
          src="/icons/membership/payment-plus.svg"
          alt=""
          className="size-6 shrink-0"
          aria-hidden
        />
        <span className="text-12px font-bold leading-[1.5] text-secondary-2">
          결제 수단 신규 등록
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-[7.5px] border border-[#e6eaed] bg-neutral-white">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between px-[18px] py-3 text-left cursor-pointer"
        >
          <PaymentMethodLabel
            method={selectedMethod}
            isPrimary={selectedMethod.id === primaryId}
          />
          <img
            src="/icons/right-arrow2.svg"
            alt=""
            className={`h-[8.4px] w-[4.2px] shrink-0 transition-transform ${
              isOpen ? "-rotate-90" : "rotate-90"
            }`}
            aria-hidden
          />
        </button>

        {isOpen ? (
          <div className="flex flex-col items-center px-[18px] pb-3">
            <div className="mb-3 h-px w-full bg-[#e6eaed]" />
            <ul className="flex w-full flex-col">
              {methods.map((method, index) => {
                const isSelected = method.id === selectedId;

                return (
                  <li key={method.id}>
                    {index > 0 ? (
                      <div className="my-3 h-px w-full bg-[#e6eaed]" />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => onSelect(method.id)}
                      className="flex w-full items-center justify-between text-left cursor-pointer"
                    >
                      <PaymentMethodLabel
                        method={method}
                        isPrimary={method.id === primaryId}
                      />
                      {isSelected ? (
                        <img
                          src="/icons/membership/payment-check.svg"
                          alt=""
                          className="size-3 shrink-0"
                          aria-hidden
                        />
                      ) : (
                        <span className="size-3 shrink-0" aria-hidden />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="my-3 h-px w-[calc(100%+36px)] bg-[#e6eaed]" />

            <button
              type="button"
              onClick={onRegisterNew}
              className="flex w-full items-center gap-2.5 cursor-pointer"
            >
              <img
                src="/icons/membership/payment-plus.svg"
                alt=""
                className="size-6 shrink-0"
                aria-hidden
              />
              <span className="text-12px font-bold leading-[1.5] text-secondary-2">
                결제 수단 신규 등록
              </span>
            </button>
          </div>
        ) : null}
      </div>

      {!isOpen ? (
        <ul className="text-10px font-normal leading-[1.3] text-secondary-5">
          <li>선택한 결제 수단이 대표 결제 수단으로 설정됩니다.</li>
          <li>다음 결제일부터 해당 결제 수단으로 자동 결제됩니다.</li>
        </ul>
      ) : null}
    </div>
  );
};

export default SubscriptionPaymentMethodSelect;
