import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import CouponAlertModal from "../../components/modals/membership/CouponAlertModal";
import CouponRegistrationModal from "../../components/modals/membership/CouponRegistrationModal";
import CouponSuccessModal from "../../components/modals/membership/CouponSuccessModal";
import MembershipCouponCard from "../../components/membership/MembershipCouponCard";
import MembershipProBadge from "../../components/membership/MembershipProBadge";
import {
  useRegisterAdminCoupon,
  useRequestAdminCoupon,
} from "../../hooks/queries/useAdminQueries";
import type { AdminCouponLookupResponse } from "../../api/admin/admin.type";

type BillingCycle = "monthly" | "yearly";
type CouponAlertType =
  | "notFound"
  | "alreadyUsed"
  | "lookupFailed"
  | "registerFailed";

const ACTIVE_PLAN = {
  title: "월간 이용권",
  priceAmount: "4,900₩",
  priceUnit: "/월",
  nextBillingDate: "26. 05. 01",
  usageType: "월간 이용권",
};

const COUPON_ALERT_MESSAGES: Record<CouponAlertType, string> = {
  notFound: "쿠폰 번호를\n다시 확인해주세요.",
  alreadyUsed: "이미 사용된 쿠폰이예요.",
  lookupFailed: "쿠폰 조회에 실패했습니다.\n다시 시도해주세요.",
  registerFailed: "쿠폰 등록에 실패했습니다.\n다시 시도해주세요.",
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
  const [lookedUpCouponCode, setLookedUpCouponCode] = useState("");
  const [lookedUpCoupon, setLookedUpCoupon] =
    useState<AdminCouponLookupResponse | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponAlertType, setCouponAlertType] =
    useState<CouponAlertType | null>(null);
  const [isCouponSuccessModalOpen, setIsCouponSuccessModalOpen] =
    useState(false);

  const lookupCouponMutation = useRequestAdminCoupon();
  const registerCouponMutation = useRegisterAdminCoupon();

  const selectedPlan = SUBSCRIPTION_PLANS[billingCycle];
  const trimmedCouponCode = couponCode.trim();
  const canLookupCoupon =
    trimmedCouponCode.length > 0 && !lookupCouponMutation.isPending;

  const handleComingSoon = () => {
    alert(COMING_SOON_MESSAGE);
  };

  const handleStartSubscription = () => {
    navigate(`/membership/subscribe?cycle=${billingCycle}`);
  };

  const handleMenuClick = (menuId: (typeof MENU_ITEMS)[number]["id"]) => {
    if (menuId === "payment-manage") {
      navigate("/membership/payment-methods");
      return;
    }
    if (menuId === "voucher-manage") {
      navigate("/membership/vouchers");
      return;
    }
    handleComingSoon();
  };

  const handleCloseCouponModal = () => {
    if (registerCouponMutation.isPending) return;
    setIsCouponModalOpen(false);
    setLookedUpCoupon(null);
    setLookedUpCouponCode("");
  };

  const handleLookupCoupon = () => {
    if (!trimmedCouponCode || lookupCouponMutation.isPending) return;

    lookupCouponMutation.mutate(trimmedCouponCode, {
      onSuccess: (coupon) => {
        if (!coupon.isExist) {
          setCouponAlertType("notFound");
          return;
        }
        if (coupon.isUsed) {
          setCouponAlertType("alreadyUsed");
          return;
        }
        setLookedUpCouponCode(trimmedCouponCode);
        setLookedUpCoupon(coupon);
        setIsCouponModalOpen(true);
      },
      onError: () => {
        setCouponAlertType("lookupFailed");
      },
    });
  };

  const handleRegisterCoupon = () => {
    if (!lookedUpCoupon || registerCouponMutation.isPending) return;

    registerCouponMutation.mutate(lookedUpCoupon.couponId, {
      onSuccess: () => {
        setIsCouponModalOpen(false);
        setLookedUpCoupon(null);
        setLookedUpCouponCode("");
        setCouponCode("");
        setIsCouponSuccessModalOpen(true);
      },
      onError: () => {
        setIsCouponModalOpen(false);
        setLookedUpCoupon(null);
        setLookedUpCouponCode("");
        setCouponAlertType("registerFailed");
      },
    });
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
              onClick={handleStartSubscription}
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
                이용권이 지급돼요.
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
                onClick={handleLookupCoupon}
                disabled={!canLookupCoupon}
                className="flex h-12 w-20 shrink-0 items-center justify-center rounded-[12px] text-16px font-semibold text-neutral-white transition-colors enabled:cursor-pointer enabled:bg-primary enabled:hover:bg-secondary-2 disabled:cursor-not-allowed disabled:bg-neutral-gray-4"
              >
                {lookupCouponMutation.isPending ? "조회중" : "등록"}
              </button>
            </div>
          </div>
        </section>
      </div>

      <CouponRegistrationModal
        isOpen={isCouponModalOpen}
        couponCode={lookedUpCouponCode}
        coupon={lookedUpCoupon}
        isRegistering={registerCouponMutation.isPending}
        onClose={handleCloseCouponModal}
        onRegister={handleRegisterCoupon}
      />

      <CouponAlertModal
        isOpen={couponAlertType !== null}
        message={
          couponAlertType ? COUPON_ALERT_MESSAGES[couponAlertType] : ""
        }
        onClose={() => setCouponAlertType(null)}
      />

      <CouponSuccessModal
        isOpen={isCouponSuccessModalOpen}
        onClose={() => setIsCouponSuccessModalOpen(false)}
      />
    </Layout>
  );
};

export default MembershipPage;
