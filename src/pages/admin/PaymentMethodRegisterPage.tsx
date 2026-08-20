import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import ConfirmModal from "../../components/modals/ConfirmModal";
import {
  REGISTER_OPTION_LABEL,
  type PaymentMethodRegisterOption,
} from "../../types/paymentMethod";
import { resolveMembershipReturnTo } from "../../utils/safeReturnTo";

const REGISTER_OPTIONS: PaymentMethodRegisterOption[] = [
  "kakao",
  "toss",
  "card",
];

const PaymentMethodRegisterPage = () => {
  const [searchParams] = useSearchParams();
  const returnTo = resolveMembershipReturnTo(searchParams.get("returnTo"));
  const [selectedOption, setSelectedOption] =
    useState<PaymentMethodRegisterOption>("card");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = () => {
    setErrorMessage(
      "결제 수단 등록은 PortOne billingKey 발급 연동 후 사용할 수 있습니다.",
    );
  };

  return (
    <Layout>
      <Header
        name="결제 수단 관리"
        pageName="결제 수단 등록"
        backTo={returnTo}
      />

      <div className="relative flex flex-1 flex-col overflow-y-auto no-scrollbar px-8 pb-28 pt-8 font-[Pretendard]">
        <section className="flex flex-col gap-1">
          <h2 className="text-18px font-bold leading-normal text-neutral-gray-1">
            결제 수단 선택
          </h2>
          <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
            등록할 결제수단을 선택해주세요.
          </p>
        </section>

        <div className="mt-6 flex flex-col gap-4">
          {REGISTER_OPTIONS.map((option) => {
            const isSelected = selectedOption === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedOption(option)}
                className={`flex h-[52px] w-full items-center justify-center rounded-[7.5px] border border-[#e6eaed] text-14px font-semibold leading-5 cursor-pointer ${
                  isSelected
                    ? "bg-secondary-4 text-primary"
                    : "bg-neutral-white text-neutral-gray-2"
                }`}
              >
                {REGISTER_OPTION_LABEL[option]}
              </button>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-8 pb-8">
          <button
            type="button"
            onClick={handleRegister}
            className="pointer-events-auto flex h-[50px] w-full items-center justify-center rounded-[12px] bg-primary text-18px font-bold text-neutral-white shadow-primary cursor-pointer"
          >
            등록하기
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={errorMessage !== null}
        onClose={() => setErrorMessage(null)}
        message={errorMessage ?? ""}
        confirmText="확인"
      />
    </Layout>
  );
};

export default PaymentMethodRegisterPage;
