import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import ConfirmModal from "../../components/modals/ConfirmModal";
import PaymentMethodDeleteModal from "../../components/modals/membership/PaymentMethodDeleteModal";
import PaymentProviderIcon from "../../components/membership/PaymentProviderIcon";
import {
  useAdminPaymentMethod,
  useAdminPaymentMethods,
  useDeleteAdminPaymentMethod,
  useUpdateAdminDefaultPaymentMethod,
} from "../../hooks/queries/useAdminQueries";
import type { AdminPaymentMethodErrorResponse } from "../../api/admin/admin.type";
import {
  getPrimaryPaymentMethodId,
  toActivePaymentMethods,
  toPaymentMethodView,
  type PaymentMethod,
} from "../../types/paymentMethod";
import { formatPaymentMethodRegisteredAt } from "../../utils/paymentMethodLabel";

const getPaymentMethodErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | AdminPaymentMethodErrorResponse
      | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
};

const PaymentMethodsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useAdminPaymentMethods();
  const { mutate: updateDefault, isPending: isUpdatingDefault } =
    useUpdateAdminDefaultPaymentMethod();
  const { mutate: deleteMethod, isPending: isDeleting } =
    useDeleteAdminPaymentMethod();
  const methods = toActivePaymentMethods(data);
  const primaryId = getPrimaryPaymentMethodId(methods);
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const { data: deleteDetail } = useAdminPaymentMethod(deleteTarget?.id ?? "", {
    enabled: Boolean(deleteTarget?.id),
  });

  const primaryMethod =
    methods.find((method) => method.id === primaryId) ?? null;
  const otherMethods = methods.filter(
    (method) => method.id !== primaryMethod?.id,
  );
  const deleteMethodView =
    deleteDetail && deleteDetail.status !== "DISABLED"
      ? toPaymentMethodView(deleteDetail)
      : deleteTarget;

  const handleChangePrimary = (methodId: string) => {
    if (methodId === primaryId || isUpdatingDefault) return;
    updateDefault(methodId, {
      onSuccess: () => {
        setConfirmMessage("대표 결제 수단 변경이 완료되었어요.");
      },
      onError: (error) => {
        setConfirmMessage(
          getPaymentMethodErrorMessage(
            error,
            "대표 결제 수단 변경에 실패했습니다. 다시 시도해주세요.",
          ),
        );
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget || isDeleting) return;
    deleteMethod(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
      },
      onError: (error) => {
        setConfirmMessage(
          getPaymentMethodErrorMessage(
            error,
            "결제 수단 삭제에 실패했습니다. 다시 시도해주세요.",
          ),
        );
      },
    });
  };

  const isPrimaryKakao = primaryMethod?.provider === "KAKAOPAY";
  const primaryRegisteredAtLabel = isPrimaryKakao
    ? null
    : formatPaymentMethodRegisteredAt(primaryMethod?.registeredAt);

  return (
    <Layout>
      <Header
        name="Retrivr 프로"
        pageName="결제 수단 관리"
        backTo="/membership"
      />

      <div className="relative flex flex-1 flex-col overflow-y-auto no-scrollbar pb-28 font-[Pretendard]">
        <section className="flex flex-col gap-5 bg-secondary-4 px-8 pt-8 pb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-18px font-bold leading-normal text-neutral-gray-1">
              대표 결제 수단
            </h2>
            <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
              다음 결제일에 대표 결제 수단으로 자동 결제됩니다.
            </p>
          </div>

          {isLoading ? (
            <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
              결제 수단을 불러오는 중이에요
            </p>
          ) : isError ? (
            <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
              결제 수단을 불러오지 못했어요
            </p>
          ) : primaryMethod ? (
            <div className="flex items-center gap-3">
              <PaymentProviderIcon
                provider={primaryMethod.provider}
                size="lg"
              />
              <div className="flex min-w-0 flex-col text-secondary-1">
                {isPrimaryKakao ? (
                  <p className="text-16px font-semibold leading-normal">
                    {primaryMethod.name}
                  </p>
                ) : (
                  <>
                    <p className="text-12px font-bold leading-[1.5]">
                      {primaryMethod.name}
                    </p>
                    {primaryRegisteredAtLabel ? (
                      <p className="text-12px font-normal leading-[1.4]">
                        {primaryRegisteredAtLabel}
                      </p>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
              등록된 대표 결제 수단이 없어요
            </p>
          )}
        </section>

        <section className="flex flex-col px-8">
          <div className="border-t border-[#e6eaed]" />
          {isLoading || isError ? null : otherMethods.length === 0 ? (
            <p className="py-8 text-center text-12px font-normal text-neutral-gray-3">
              추가 등록된 결제 수단이 없어요
            </p>
          ) : (
            otherMethods.map((method) => {
              const registeredAtLabel = formatPaymentMethodRegisteredAt(
                method.registeredAt,
              );

              return (
                <div key={method.id} className="border-b border-[#e6eaed]">
                  <div className="flex items-center justify-between gap-3 py-6">
                    <div className="flex min-w-0 items-center gap-2">
                      <PaymentProviderIcon
                        provider={method.provider}
                        size="sm"
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="text-12px font-bold leading-[1.5] text-neutral-gray-1">
                          {method.name}
                        </span>
                        {registeredAtLabel ? (
                          <span className="text-12px font-normal leading-[1.4] text-neutral-gray-1">
                            {registeredAtLabel}
                          </span>
                        ) : null}
                      </span>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <button
                        type="button"
                        disabled={isUpdatingDefault}
                        onClick={() => handleChangePrimary(method.id)}
                        className="flex h-[27px] shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] border border-neutral-gray-4 bg-neutral-white px-3 text-12px font-normal leading-[1.4] text-neutral-gray-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        대표 수단으로 변경
                      </button>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => setDeleteTarget(method)}
                        className="text-12px font-normal leading-[1.4] text-neutral-gray-3 underline-offset-2 cursor-pointer hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        삭제하기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-8 pb-8">
          <button
            type="button"
            onClick={() => navigate("/membership/payment-methods/register")}
            className="pointer-events-auto flex h-[50px] w-full items-center justify-center rounded-[12px] border border-primary bg-neutral-white text-18px font-bold text-primary shadow-[0px_0px_16px_0px_rgba(181,244,255,0.5)] cursor-pointer"
          >
            결제수단 등록
          </button>
        </div>
      </div>

      <PaymentMethodDeleteModal
        isOpen={deleteTarget !== null}
        paymentMethod={deleteMethodView}
        isPending={isDeleting}
        onClose={() => {
          if (isDeleting) return;
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
      <ConfirmModal
        isOpen={confirmMessage !== null}
        onClose={() => setConfirmMessage(null)}
        message={confirmMessage ?? ""}
        confirmText="확인"
      />
    </Layout>
  );
};

export default PaymentMethodsPage;
