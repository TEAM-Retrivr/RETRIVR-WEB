import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import ConfirmModal from "../../components/modals/ConfirmModal";
import PaymentMethodDeleteModal from "../../components/modals/membership/PaymentMethodDeleteModal";
import {
  removePaymentMethod,
  setPrimaryPaymentMethod,
  usePaymentMethodsStore,
} from "../../store/paymentMethodsStore";
import type { PaymentMethod } from "../../types/paymentMethod";

const PaymentMethodsPage = () => {
  const navigate = useNavigate();
  const { methods, primaryId } = usePaymentMethodsStore();
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethod | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

  const primaryMethod =
    methods.find((method) => method.id === primaryId) ?? methods[0] ?? null;
  const otherMethods = methods.filter(
    (method) => method.id !== primaryMethod?.id,
  );

  const handleChangePrimary = (methodId: string) => {
    if (methodId === primaryId) return;
    setPrimaryPaymentMethod(methodId);
    setConfirmMessage("대표 결제 수단 변경이 완료되었어요.");
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    removePaymentMethod(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <Layout>
      <Header
        name="Retrivr 프로"
        pageName="결제 수단 관리"
        backTo="/membership"
      />

      <div className="relative flex flex-1 flex-col overflow-y-auto no-scrollbar px-8 pb-28 pt-8 font-[Pretendard]">
        <section className="flex flex-col gap-2">
          <h2 className="text-18px font-bold leading-normal text-neutral-gray-1">
            대표 결제 수단
          </h2>

          {primaryMethod ? (
            <div className="flex flex-col gap-0.5 text-secondary-1">
              <p className="text-12px font-bold leading-[1.5]">
                {primaryMethod.name}
              </p>
              {primaryMethod.maskedNumber ? (
                <p className="text-16px font-semibold leading-normal">
                  {primaryMethod.maskedNumber}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
              등록된 대표 결제 수단이 없어요
            </p>
          )}

          <ul className="mt-2 pl-1.5 text-12px font-normal leading-[1.4] text-neutral-gray-3">
            <li>∙ 다음 결제일에 대표 결제 수단으로 자동 결제됩니다.</li>
          </ul>
        </section>

        <section className="mt-6 flex flex-col">
          <div className="border-t border-[#e6eaed]" />
          {otherMethods.length === 0 ? (
            <p className="py-8 text-center text-12px font-normal text-neutral-gray-3">
              추가 등록된 결제 수단이 없어요
            </p>
          ) : (
            otherMethods.map((method) => (
              <div key={method.id} className="border-b border-[#e6eaed]">
                <div className="flex items-center justify-between py-6">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(method)}
                    className="flex min-w-0 items-center gap-2 text-left cursor-pointer"
                    aria-label={`${method.name} 삭제`}
                  >
                    <img
                      src="/icons/membership/payment-method-placeholder.svg"
                      alt=""
                      className="size-3.5 shrink-0"
                      aria-hidden
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-12px font-bold leading-[1.5] text-neutral-gray-1">
                        {method.name}
                      </span>
                      {method.maskedNumber ? (
                        <span className="text-12px font-normal leading-[1.4] text-neutral-gray-1">
                          {method.maskedNumber}
                        </span>
                      ) : null}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChangePrimary(method.id)}
                    className="flex h-[27px] w-[113px] shrink-0 items-center justify-center rounded-[10px] border border-neutral-gray-2 bg-neutral-white text-12px font-normal leading-[1.4] text-neutral-gray-2 cursor-pointer"
                  >
                    대표 수단으로 변경
                  </button>
                </div>
              </div>
            ))
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
        paymentMethod={deleteTarget}
        onClose={() => setDeleteTarget(null)}
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
