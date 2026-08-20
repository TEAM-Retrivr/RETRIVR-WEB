import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import ConfirmModal from "../../components/modals/ConfirmModal";
import SubscriptionPaymentMethodSelect from "../../components/membership/SubscriptionPaymentMethodSelect";
import type { AdminPaymentMethodErrorResponse } from "../../api/admin/admin.type";
import {
  useAdminPaymentMethods,
  useUpdateAdminDefaultPaymentMethod,
} from "../../hooks/queries/useAdminQueries";
import {
  getPrimaryPaymentMethodId,
  toActivePaymentMethods,
} from "../../types/paymentMethod";
import {
  parseVoucherBillingCycle,
  VOUCHER_PAYMENT_PLANS,
} from "../../types/voucherPayment";

const SUMMARY_ROWS = [
  { key: "plan", label: "선택 플랜" },
  { key: "amount", label: "예상 금액" },
  { key: "nextBilling", label: "다음 결제 예정일" },
] as const;

const getPaymentMethodErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | AdminPaymentMethodErrorResponse
      | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
};

const VoucherPaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan =
    VOUCHER_PAYMENT_PLANS[parseVoucherBillingCycle(searchParams.get("cycle"))];
  const { data, isLoading, isError } = useAdminPaymentMethods();
  const { mutate: updateDefault, isPending: isUpdatingDefault } =
    useUpdateAdminDefaultPaymentMethod();
  const methods = toActivePaymentMethods(data);
  const primaryId = getPrimaryPaymentMethodId(methods);
  const [selectedId, setSelectedId] = useState("");
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [shouldReturnToMembership, setShouldReturnToMembership] =
    useState(false);

  useEffect(() => {
    setSelectedId((current) => {
      if (current && methods.some((method) => method.id === current)) {
        return current;
      }
      if (primaryId && methods.some((method) => method.id === primaryId)) {
        return primaryId;
      }
      return methods[0]?.id || "";
    });
  }, [methods, primaryId]);

  const summaryValues = {
    plan: plan.planLabel,
    amount: plan.amountLabel,
    nextBilling: plan.nextBillingDateLabel,
  };

  const returnPath = `/membership/subscribe?cycle=${plan.cycle}`;

  const handleSelectMethod = (methodId: string) => {
    if (isUpdatingDefault) return;
    setSelectedId(methodId);
    setIsSelectorOpen(false);
    if (methodId === primaryId) return;
    updateDefault(methodId, {
      onError: (error) => {
        setSelectedId(primaryId);
        setConfirmMessage(
          getPaymentMethodErrorMessage(
            error,
            "대표 결제 수단 변경에 실패했습니다. 다시 시도해주세요.",
          ),
        );
      },
    });
  };

  const handleRegisterNew = () => {
    navigate(
      `/membership/payment-methods/register?returnTo=${encodeURIComponent(returnPath)}`,
    );
  };

  const handleStartSubscription = () => {
    if (!selectedId) {
      setShouldReturnToMembership(false);
      setConfirmMessage("결제 수단을 먼저 등록해주세요.");
      return;
    }
    if (selectedId !== primaryId) {
      updateDefault(selectedId, {
        onSuccess: () => {
          setShouldReturnToMembership(true);
          setConfirmMessage(`${plan.planLabel}이 시작되었어요.`);
        },
        onError: (error) => {
          setShouldReturnToMembership(false);
          setConfirmMessage(
            getPaymentMethodErrorMessage(
              error,
              "대표 결제 수단 변경에 실패했습니다. 다시 시도해주세요.",
            ),
          );
        },
      });
      return;
    }
    setShouldReturnToMembership(true);
    setConfirmMessage(`${plan.planLabel}이 시작되었어요.`);
  };

  return (
    <Layout>
      <Header
        name="Retrivr 프로"
        pageName={plan.pageTitle}
        backTo="/membership"
      />

      <div className="relative flex flex-1 flex-col overflow-y-auto no-scrollbar px-8 pb-28 pt-8 font-[Pretendard]">
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-18px font-bold leading-normal text-neutral-gray-1">
              구독 시작하기
            </h2>
            <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
              저장된 결제 수단을 관리하고,
              <br />
              대표 결제 수단을 바꿀 수 있습니다.
            </p>
          </div>

          <dl className="flex flex-col gap-[5px]">
            {SUMMARY_ROWS.map((row) => (
              <div
                key={row.key}
                className="flex items-center justify-between gap-3"
              >
                <dt className="text-12px font-normal leading-[1.4] text-neutral-gray-2">
                  {row.label}
                </dt>
                <dd className="text-14px font-semibold leading-5 text-secondary-1">
                  {summaryValues[row.key]}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-8 h-px w-full bg-[#e6eaed]" />

        <section className="mt-6 flex flex-col gap-3">
          <h3 className="text-14px font-semibold leading-5 text-neutral-gray-2">
            구독에 사용할 결제 수단
          </h3>
          {isLoading ? (
            <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
              결제 수단을 불러오는 중이에요
            </p>
          ) : isError ? (
            <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
              결제 수단을 불러오지 못했어요
            </p>
          ) : (
            <SubscriptionPaymentMethodSelect
              methods={methods}
              primaryId={primaryId}
              selectedId={selectedId}
              isOpen={isSelectorOpen}
              onToggle={() => setIsSelectorOpen((prev) => !prev)}
              onSelect={handleSelectMethod}
              onRegisterNew={handleRegisterNew}
            />
          )}
        </section>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-8 pb-8">
          <button
            type="button"
            disabled={isLoading || isError || isUpdatingDefault}
            onClick={handleStartSubscription}
            className="pointer-events-auto flex h-[50px] w-full items-center justify-center rounded-[12px] bg-primary text-18px font-bold text-neutral-white shadow-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {plan.ctaLabel}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmMessage !== null}
        onClose={() => {
          setConfirmMessage(null);
          if (shouldReturnToMembership) {
            navigate("/membership");
          }
        }}
        message={confirmMessage ?? ""}
        confirmText="확인"
      />
    </Layout>
  );
};

export default VoucherPaymentPage;
