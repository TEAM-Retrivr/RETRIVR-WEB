import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import ConfirmModal from "../../components/modals/ConfirmModal";
import ErrorModal from "../../components/modals/ErrorModal";
import { useQueryClient } from "@tanstack/react-query";
import type { AdminPaymentMethodErrorResponse } from "../../api/admin/admin.type";
import type { AdminProfileResponse } from "../../api/auth/auth.type";
import { useCreateAdminPaymentMethod } from "../../hooks/queries/useAdminQueries";
import {
  REGISTER_OPTION_LABEL,
  type PaymentMethodRegisterOption,
} from "../../types/paymentMethod";
import { getAdminEmail } from "../../utils/adminSession";
import { resolveMembershipReturnTo } from "../../utils/safeReturnTo";
import {
  clearPortoneRegisterOption,
  closePortoneOverlay,
  getPortoneProvider,
  getPortoneRedirectResult,
  isPortoneMobileDevice,
  issuePortoneBillingKey,
  readPortoneRegisterOption,
  type PortoneCheckoutDevice,
} from "../../lib/portoneBilling";

const REGISTER_OPTIONS: PaymentMethodRegisterOption[] = ["kakao", "card"];
const SUCCESS_MESSAGE = "결제 수단 등록이 완료되었습니다.";

const toPortonePhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return "";
};

const getPaymentMethodErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | AdminPaymentMethodErrorResponse
      | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
};

const PaymentMethodRegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = resolveMembershipReturnTo(searchParams.get("returnTo"));
  const shouldSetPrimaryOnRegister = returnTo.startsWith(
    "/membership/subscribe",
  );
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryData<AdminProfileResponse>([
    "adminProfile",
  ]);
  const { mutateAsync: createPaymentMethod, isPending: isCreating } =
    useCreateAdminPaymentMethod();
  const [selectedOption, setSelectedOption] =
    useState<PaymentMethodRegisterOption>("kakao");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isIssuing, setIsIssuing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkoutDevice, setCheckoutDevice] = useState<PortoneCheckoutDevice>(
    () => (isPortoneMobileDevice() ? "mobile" : "desktop"),
  );
  const handledRedirectRef = useRef(false);
  const abortedRef = useRef(false);

  const isBusy = isIssuing || isCreating;

  const abandonRegistration = () => {
    abortedRef.current = true;
    closePortoneOverlay();
    clearPortoneRegisterOption();
  };

  const saveIssuedBillingKey = async ({
    option,
    billingKey,
  }: {
    option: PaymentMethodRegisterOption;
    billingKey: string;
  }) => {
    if (abortedRef.current) return;

    try {
      await createPaymentMethod({
        provider: getPortoneProvider(option),
        billingKey,
        isDefault: shouldSetPrimaryOnRegister,
      });
      if (abortedRef.current) return;
      clearPortoneRegisterOption();
      setSuccessMessage(SUCCESS_MESSAGE);
    } catch (error) {
      if (abortedRef.current) return;
      setErrorMessage(
        getPaymentMethodErrorMessage(
          error,
          "결제 수단 등록에 실패했습니다. 다시 시도해주세요.",
        ),
      );
    }
  };

  useEffect(() => {
    abortedRef.current = false;
    return () => {
      abortedRef.current = true;
      closePortoneOverlay();
    };
  }, []);

  useEffect(() => {
    if (handledRedirectRef.current) return;
    const redirectResult = getPortoneRedirectResult(searchParams);
    if (!redirectResult) return;
    handledRedirectRef.current = true;

    const cleanedParams = new URLSearchParams(searchParams);
    cleanedParams.delete("billingKey");
    cleanedParams.delete("code");
    cleanedParams.delete("message");
    navigate({ search: cleanedParams.toString() }, { replace: true });

    if (abortedRef.current) return;

    const option = readPortoneRegisterOption();
    if ("error" in redirectResult) {
      setErrorMessage(redirectResult.error);
      return;
    }
    if (!option) {
      setErrorMessage("결제수단 등록 정보를 확인하지 못했습니다.");
      return;
    }
    void saveIssuedBillingKey({
      option,
      billingKey: redirectResult.billingKey,
    });
    // 리디렉션 복귀 시에만 한 번 처리한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleRegister = async () => {
    if (isBusy || abortedRef.current) return;

    const cardPhoneNumber =
      selectedOption === "card" ? toPortonePhoneNumber(phoneNumber) : "";
    if (selectedOption === "card" && !cardPhoneNumber) {
      setErrorMessage("카드 등록에는 연락처가 필요합니다.");
      return;
    }

    setIsIssuing(true);
    const organizationId = localStorage.getItem("orgId")?.trim();
    const result = await issuePortoneBillingKey({
      option: selectedOption,
      checkoutDevice,
      customer: {
        customerId: organizationId || undefined,
        fullName: cachedProfile?.organizationName || "Retrivr 관리자",
        email: getAdminEmail() || undefined,
        phoneNumber: cardPhoneNumber || undefined,
      },
    });
    setIsIssuing(false);

    if (abortedRef.current) return;

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    await saveIssuedBillingKey({
      option: selectedOption,
      billingKey: result.billingKey,
    });
  };

  const handleBack = () => {
    abandonRegistration();
    navigate(returnTo);
  };

  return (
    <Layout>
      <Header
        name="결제 수단 관리"
        pageName="결제 수단 등록"
        onBackClick={handleBack}
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
                disabled={isBusy}
                onClick={() => setSelectedOption(option)}
                className={`flex h-[52px] w-full items-center justify-center rounded-[7.5px] border border-[#e6eaed] text-14px font-semibold leading-5 ${
                  isBusy ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                } ${
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

        {selectedOption === "kakao" ? (
          <section className="mt-6 flex flex-col gap-3">
            <h3 className="text-14px font-semibold leading-5 text-neutral-gray-2">
              지금 사용 중인 기기
            </h3>
            <div className="flex gap-2">
              {(
                [
                  ["desktop", "노트북 / PC"],
                  ["mobile", "휴대폰"],
                ] as const
              ).map(([device, label]) => {
                const isSelected = checkoutDevice === device;
                return (
                  <button
                    key={device}
                    type="button"
                    disabled={isBusy}
                    onClick={() => setCheckoutDevice(device)}
                    className={`flex h-[44px] flex-1 items-center justify-center rounded-[7.5px] border border-[#e6eaed] text-13px font-semibold leading-5 ${
                      isBusy ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                    } ${
                      isSelected
                        ? "bg-secondary-4 text-primary"
                        : "bg-neutral-white text-neutral-gray-2"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
              {checkoutDevice === "desktop"
                ? "카카오페이 창에 QR이 표시됩니다. 휴대폰 카카오톡으로 스캔해주세요. 노트북 카카오톡 앱으로는 등록할 수 없습니다."
                : "휴대폰 카카오톡 앱에서 결제수단을 등록합니다."}
            </p>
          </section>
        ) : null}

        {selectedOption === "card" ? (
          <label className="mt-6 flex flex-col gap-2">
            <span className="text-14px font-semibold leading-5 text-neutral-gray-2">
              연락처
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              disabled={isBusy}
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="010-0000-0000"
              className="h-[52px] w-full rounded-[7.5px] border border-[#e6eaed] bg-neutral-white px-4 text-14px font-normal leading-5 text-neutral-gray-1 outline-none placeholder:text-neutral-gray-3 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <span className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
              KG이니시스 카드 등록에 필요한 연락처입니다.
            </span>
          </label>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-8 pb-8">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => {
              void handleRegister();
            }}
            className="pointer-events-auto flex h-[50px] w-full items-center justify-center rounded-[12px] bg-primary text-18px font-bold text-neutral-white shadow-primary disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isBusy ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={successMessage !== null}
        onClose={() => {
          setSuccessMessage(null);
          navigate(returnTo);
        }}
        message={successMessage ?? ""}
        confirmText="확인"
      />
      <ErrorModal
        isOpen={errorMessage !== null}
        onClose={() => setErrorMessage(null)}
        message1={errorMessage ?? ""}
        confirmText="확인"
      />
    </Layout>
  );
};

export default PaymentMethodRegisterPage;
