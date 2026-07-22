import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { lookupCouponPreview } from "../../components/modals/membership/CouponRegistrationModal";
import MembershipCouponCard from "../../components/membership/MembershipCouponCard";
import MembershipProBadge from "../../components/membership/MembershipProBadge";

type BillingCycle = "monthly" | "yearly";

const ACTIVE_PLAN = {
  title: "월간 이용권",
  priceAmount: "4,900₩",
  priceUnit: "/월",
  nextBillingDate: "26. 05. 01",
  usageType: "월간 이용권",
};

const SUBSCRIPTION_PLANS: Record<
  BillingCycle,
  { durationLabel: string; amount: string; unit: string }
> = {
  monthly: { durationLabel: "1개월", amount: "4,900₩", unit: "/월" },
  yearly: { durationLabel: "12개월", amount: "49,000₩", unit: "/년" },
};

const MENU_ITEMS = [
  {
    id: "voucher-manage",
    title: "이용권 관리",
    description: "구독이용권, 쿠폰, 결제내역",
  },
  {
    id: "payment-manage",
    title: "결제 수단 관리",
    description: "이용권 결제수단 관리 및 등록",
  },
] as const;

const COMING_SOON_MESSAGE = "개발 예정입니다.";

const MembershipPage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [couponCode, setCouponCode] = useState("");
  const [confirmModalMessage, setConfirmModalMessage] = useState<string | null>(
    null,
  );

  const selectedPlan = SUBSCRIPTION_PLANS[billingCycle];
  const couponPreview = lookupCouponPreview(couponCode);
  const canRegisterCoupon = couponPreview !== null;

  const handleComingSoon = () => {
    alert(COMING_SOON_MESSAGE);
  };

  const handleMenuClick = (menuId: (typeof MENU_ITEMS)[number]["id"]) => {
    if (menuId === "payment-manage") {
      navigate("/membership/payment-methods");
      return;
    }
    handleComingSoon();
  };

  const handleRegisterCoupon = () => {
    if (!couponPreview) {
      setConfirmModalMessage("유효하지 않은 쿠폰 번호예요");
      return;
    }
    setCouponCode("");
    setConfirmModalMessage("쿠폰이 등록되었어요");
  };

  return (
    <Layout>
      <Header name="계정 관리" pageName="Retrivr 프로" backTo="/account" />

      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar bg-gradient-to-b from-secondary-4 from-[14%] to-neutral-white to-[88%] font-[Pretendard]">
        <section className="flex flex-col gap-3 px-12 pb-6 pt-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-18px font-bold leading-normal text-neutral-gray-1">
                이용 현황
              </h2>
              <MembershipProBadge />
            </div>
            <p className="text-12px font-bold leading-[1.5] text-secondary-2">
              이용 방식: {ACTIVE_PLAN.usageType}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <MembershipCouponCard
              title={ACTIVE_PLAN.title}
              status="active"
              priceAmount={ACTIVE_PLAN.priceAmount}
              priceUnit={ACTIVE_PLAN.priceUnit}
              footerText={`다음 결제 예정일: ${ACTIVE_PLAN.nextBillingDate}`}
            />

            <div className="flex flex-col gap-1.5">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMenuClick(item.id)}
                  className="flex w-full items-center justify-between rounded-[7.5px] border border-[#e6eaed] bg-neutral-white px-[18px] py-3 text-left cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-12px font-bold leading-[1.5] text-neutral-gray-2">
                      {item.title}
                    </span>
                    <span className="text-10px font-normal leading-[1.3] text-neutral-gray-3">
                      {item.description}
                    </span>
                  </div>
                  <img
                    src="/icons/right-arrow2.svg"
                    alt=""
                    className="h-2.5 w-[4.2px] shrink-0"
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 px-8 pb-10">
          <div className="flex w-full flex-col gap-4 rounded-2xl bg-neutral-white px-[26px] py-6 shadow-[0px_0px_16px_-6px_rgba(0,0,0,0.2)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-2">
                <h3 className="text-18px font-bold leading-normal text-secondary-1">
                  pro 이용권 구독
                </h3>
                <div className="flex items-center gap-0.5">
                  <span
                    className="flex size-[17px] shrink-0 items-center justify-center"
                    aria-hidden
                  >
                    <span className="size-0.5 rounded-full bg-neutral-gray-3" />
                  </span>
                  <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
                    카카오톡 알림 메시지 이용
                  </p>
                </div>
              </div>

              <div
                role="tablist"
                aria-label="결제 주기"
                className="relative flex h-7 w-[102px] shrink-0 rounded-lg bg-neutral-gray-5 p-0.5"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={billingCycle === "monthly"}
                  onClick={() => setBillingCycle("monthly")}
                  className={`relative z-10 flex h-full flex-1 items-center justify-center rounded-md text-12px cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-neutral-white font-bold text-neutral-gray-1 shadow-[0px_0px_8px_-4px_rgba(0,0,0,0.3)]"
                      : "font-medium text-neutral-gray-1"
                  }`}
                >
                  월간
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={billingCycle === "yearly"}
                  onClick={() => setBillingCycle("yearly")}
                  className={`relative z-10 flex h-full flex-1 items-center justify-center rounded-md text-12px cursor-pointer ${
                    billingCycle === "yearly"
                      ? "bg-neutral-white font-bold text-neutral-gray-1 shadow-[0px_0px_8px_-4px_rgba(0,0,0,0.3)]"
                      : "font-medium text-neutral-gray-1"
                  }`}
                >
                  연간
                </button>
              </div>
            </div>

            <div className="flex h-[61px] w-full items-center justify-between rounded-[7.5px] border border-primary bg-secondary-4 px-5">
              <span className="text-16px font-semibold leading-normal text-primary">
                {selectedPlan.durationLabel}
              </span>
              <p className="text-14px font-bold leading-5 text-neutral-gray-1">
                <span className="font-semibold">{selectedPlan.amount}</span>
                <span className="font-medium text-neutral-gray-3">
                  {selectedPlan.unit}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleComingSoon}
              className="flex h-12 w-full items-center justify-center rounded-[12px] bg-primary text-18px font-bold text-neutral-white shadow-primary cursor-pointer"
            >
              구독 시작하기
            </button>
          </div>

          <div className="flex w-full flex-col gap-4 rounded-2xl bg-neutral-white px-[26px] py-6 shadow-[0px_0px_16px_-6px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col gap-1">
              <h3 className="text-18px font-bold leading-normal text-secondary-1">
                쿠폰이 있으신가요?
              </h3>
              <p className="text-12px font-normal leading-[1.4] text-neutral-gray-3">
                이벤트나 제휴를 통해 받은 쿠폰번호를 등록하면
                <br />
                이용권이 지급돼요
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(event) =>
                  setCouponCode(event.target.value.toUpperCase())
                }
                placeholder="쿠폰 번호 입력"
                className="h-12 min-w-0 flex-1 rounded-[12px] bg-neutral-gray-5 px-3.5 text-14px font-normal leading-[1.4] text-neutral-gray-2 outline-none placeholder:text-neutral-gray-3 focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={handleRegisterCoupon}
                disabled={!canRegisterCoupon}
                className="flex h-12 w-20 shrink-0 items-center justify-center rounded-[12px] text-16px font-semibold text-neutral-white transition-colors enabled:cursor-pointer enabled:bg-primary enabled:hover:bg-secondary-2 disabled:cursor-not-allowed disabled:bg-neutral-gray-4"
              >
                등록
              </button>
            </div>
          </div>
        </section>
      </div>

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
