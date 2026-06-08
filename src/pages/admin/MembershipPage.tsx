import { useState } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import ConfirmModal from "../../components/modals/ConfirmModal";
import CouponRegistrationModal, {
  type CouponPreview,
} from "../../components/modals/membership/CouponRegistrationModal";
import MembershipCouponCard from "../../components/membership/MembershipCouponCard";
import MembershipProBadge from "../../components/membership/MembershipProBadge";

type MembershipTab = "subscription" | "voucher";

const ACTIVE_VOUCHER = {
  title: "2달 이용권",
  eventName: "Retrivr 출시 이벤트",
  period: "26. 05. 01 ~ 26. 06. 30",
};

const AVAILABLE_VOUCHERS = [
  {
    id: "voucher-1",
    title: "2달 이용권",
    eventName: "Retrivr 출시 이벤트",
    period: "26. 05. 01 ~ 26. 06. 30",
    status: "active" as const,
  },
  {
    id: "voucher-2",
    title: "2달 이용권",
    eventName: "Retrivr 출시 이벤트",
    period: "26. 05. 01 ~ 26. 06. 30",
    status: "pending" as const,
  },
];

const COMPLETED_VOUCHERS = [
  {
    id: "completed-1",
    title: "2달 이용권",
    eventName: "Retrivr 출시 이벤트",
    period: "26. 05. 01 ~ 26. 06. 30",
  },
  {
    id: "completed-2",
    title: "2달 이용권",
    eventName: "Retrivr 출시 이벤트",
    period: "26. 05. 01 ~ 26. 06. 30",
  },
  {
    id: "completed-3",
    title: "2달 이용권",
    eventName: "Retrivr 출시 이벤트",
    period: "26. 05. 01 ~ 26. 06. 30",
  },
];

type VoucherItem = {
  id: string;
  title: string;
  eventName: string;
  period: string;
  status: "active" | "pending";
};

const MembershipPage = () => {
  const [activeTab, setActiveTab] = useState<MembershipTab>("voucher");
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState<string | null>(
    null,
  );
  const [availableVouchers, setAvailableVouchers] =
    useState<VoucherItem[]>(AVAILABLE_VOUCHERS);

  const handleRegisterCoupon = () => {
    setIsCouponModalOpen(true);
  };

  const handleCouponRegister = (_code: string, preview: CouponPreview) => {
    setAvailableVouchers((prev) => {
      const hasPending = prev.some((voucher) => voucher.status === "pending");
      if (hasPending) return prev;

      return [
        ...prev,
        {
          id: `voucher-${Date.now()}`,
          title: preview.title,
          eventName: preview.eventName,
          period: preview.validityPeriod,
          status: "pending",
        },
      ];
    });
    setIsCouponModalOpen(false);
    setConfirmModalMessage("쿠폰이 등록되었어요");
  };

  return (
    <Layout>
      <Header name="계정 관리" pageName="Retrivr 프로" backTo="/account" />

      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar font-[Pretendard]">
        <section className="relative bg-gradient-to-b from-white from-[42.5%] to-secondary-4 to-[87.7%] px-8 pb-6 pt-8">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/icons/retrivr_text_primary.svg"
              alt="Retrivr"
              className="h-[38px] w-auto object-contain"
            />
            <h1 className="text-18px font-bold text-neutral-gray-1">
              <span className="text-primary">리트리버 프로</span> 멤버십
            </h1>
          </div>

          <div className="mx-auto mt-8 flex w-full max-w-[360px] flex-col items-center rounded-[26px] bg-white/40 px-[27px] py-6 shadow-[0px_0px_0px_0px_rgba(45,78,127,0.5),0px_0px_12.9px_0px_rgba(92,174,255,0.2)]">
            <div className="flex w-full max-w-[306px] flex-col items-center gap-[29px]">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-20px font-bold leading-[1.4] text-neutral-gray-1">
                    이용 현황
                  </h2>
                  <MembershipProBadge />
                </div>
                <p className="text-12px font-bold leading-[1.5] text-secondary-2">
                  구독 방식: 이용권 사용
                </p>
              </div>

              <div className="flex w-full flex-col gap-[11px]">
                <MembershipCouponCard
                  title={ACTIVE_VOUCHER.title}
                  eventName={ACTIVE_VOUCHER.eventName}
                  period={ACTIVE_VOUCHER.period}
                  status="active"
                  compact
                />

                <div className="flex items-center justify-between rounded-[7.5px] border border-[#e6eaed] bg-neutral-white px-[18px] py-3">
                  <div className="flex items-center gap-1.5">
                    <img
                      src="/icons/membership/calendar.svg"
                      alt=""
                      className="size-[18px] shrink-0"
                      aria-hidden
                    />
                    <span className="text-[11px] font-bold leading-[1.5] text-neutral-gray-2">
                      다음 갱신일
                    </span>
                  </div>
                  <span className="text-[11px] font-bold leading-[1.5] text-neutral-gray-2">
                    2026. 07. 01
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-1 flex-col rounded-t-[24px] bg-neutral-white px-8 pb-10 shadow-[0px_2px_12px_0px_rgba(116,132,155,0.25)]">
          <div className="flex w-full">
            <button
              type="button"
              onClick={() => setActiveTab("subscription")}
              className="flex h-[57px] flex-1 flex-col items-center justify-end gap-4"
            >
              <span
                className={`text-18px font-bold ${
                  activeTab === "subscription"
                    ? "text-secondary-1"
                    : "text-neutral-gray-4"
                }`}
              >
                요금제 구독
              </span>
              <span
                className={`h-[3px] w-full ${
                  activeTab === "subscription"
                    ? "bg-primary"
                    : "bg-neutral-gray-5"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("voucher")}
              className="flex h-[57px] flex-1 flex-col items-center justify-end gap-4"
            >
              <span
                className={`text-18px font-bold ${
                  activeTab === "voucher"
                    ? "text-secondary-1"
                    : "text-neutral-gray-4"
                }`}
              >
                이용권
              </span>
              <span
                className={`h-[3px] w-full ${
                  activeTab === "voucher" ? "bg-primary" : "bg-neutral-gray-5"
                }`}
              />
            </button>
          </div>

          {activeTab === "voucher" ? (
            <div className="mt-6 flex flex-col gap-8">
              <button
                type="button"
                onClick={handleRegisterCoupon}
                className="flex h-13 w-full items-center justify-center rounded-[12px] bg-neutral-white drop-shadow-[0px_0px_2px_rgba(148,169,201,0.5)] cursor-pointer"
              >
                <img
                  src="/icons/membership/plus.svg"
                  alt=""
                  className="size-12"
                  aria-hidden
                />
                <span className="text-14px font-bold text-secondary-1">
                  쿠폰 등록하기
                </span>
              </button>

              <div className="flex flex-col gap-2.5">
                <h3 className="text-18px font-bold text-secondary-1">이용권</h3>
                <div className="flex flex-col gap-2.5">
                  {availableVouchers.map((voucher) => (
                    <MembershipCouponCard
                      key={voucher.id}
                      title={voucher.title}
                      eventName={voucher.eventName}
                      period={voucher.period}
                      status={voucher.status}
                      periodLabel={
                        voucher.status === "pending" ? "유효 기간" : "사용 기간"
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-14px font-semibold leading-5 text-neutral-gray-3">
                  사용 완료
                </p>
                <div className="flex flex-col gap-2.5">
                  {COMPLETED_VOUCHERS.map((voucher) => (
                    <MembershipCouponCard
                      key={voucher.id}
                      title={voucher.title}
                      eventName={voucher.eventName}
                      period={voucher.period}
                      status="completed"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center py-16 text-center">
              <p className="text-14px font-bold text-secondary-2">
                요금제 구독은 준비 중이에요
              </p>
            </div>
          )}
        </section>
      </div>

      <CouponRegistrationModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onRegister={handleCouponRegister}
      />
      <ConfirmModal
        isOpen={confirmModalMessage !== null}
        onClose={() => setConfirmModalMessage(null)}
        message={confirmModalMessage ?? ""}
        confirmText="확인"
      />
    </Layout>
  );
};

export default MembershipPage;
