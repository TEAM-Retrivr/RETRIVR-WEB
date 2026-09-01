import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import CouponAlertModal from "../../components/modals/membership/CouponAlertModal";
import CouponRegistrationModal from "../../components/modals/membership/CouponRegistrationModal";
import CouponSuccessModal from "../../components/modals/membership/CouponSuccessModal";
import MembershipCouponCard from "../../components/membership/MembershipCouponCard";
import MembershipProBadge from "../../components/membership/MembershipProBadge";
import MembershipSubscribeCard, {
  MEMBERSHIP_MONTHLY_PLAN,
} from "../../components/membership/MembershipSubscribeCard";
import {
  useAdminMembership,
  useRegisterAdminCoupon,
  useRequestAdminCoupon,
} from "../../hooks/queries/useAdminQueries";
import type {
  AdminCouponLookupResponse,
  AdminMembershipResponse,
} from "../../api/admin/admin.type";
import {
  formatCouponValidityPeriod,
  formatFullDotDay,
  isValidCouponCode,
} from "../../utils/couponDisplay";

type CouponAlertType =
  | "notFound"
  | "alreadyUsed"
  | "lookupFailed"
  | "registerFailed";

const EMPTY_MEMBERSHIP_GUIDE =
  "현재 이용 중인 이용권이 없습니다.\n하단의 '구독 시작하기' 버튼을 눌러 이용권을 구독해보세요.";

const MEMBERSHIP_PASS = {
  monthly: "월간 구독",
  yearly: "연간 구독",
  coupon: "쿠폰 사용",
} as const;

const SUBSCRIPTION_UNIT_BY_PASS_TYPE: Record<string, string> = {
  [MEMBERSHIP_PASS.monthly]: "/월",
  [MEMBERSHIP_PASS.yearly]: "/년",
};

const isCouponPassType = (passType?: string | null): boolean =>
  passType === MEMBERSHIP_PASS.coupon;

const isCouponMembership = (data: AdminMembershipResponse): boolean =>
  isCouponPassType(data.passType) || Boolean(data.couponInfo);

const resolveActivePassTitle = (
  data: AdminMembershipResponse,
): string | undefined =>
  data.subscriptionInfo?.subscriptionName?.trim() ||
  data.couponInfo?.couponName?.trim() ||
  undefined;

const resolveActivePassFooter = (
  data: AdminMembershipResponse,
): string | undefined => {
  if (data.nextBillingAt) {
    return `다음 결제일 ${formatFullDotDay(data.nextBillingAt)}`;
  }
  if (data.startAt && data.endAt) {
    return `사용 기간: ${formatCouponValidityPeriod(data.startAt, data.endAt)}`;
  }
  return undefined;
};

const COUPON_ALERT_MESSAGES: Record<CouponAlertType, string> = {
  notFound: "쿠폰 번호를\n다시 확인해주세요.",
  alreadyUsed: "이미 사용된 쿠폰이예요.",
  lookupFailed: "쿠폰 조회에 실패했습니다.\n다시 시도해주세요.",
  registerFailed: "쿠폰 등록에 실패했습니다.\n다시 시도해주세요.",
};

const MENU_ITEMS = [
  {
    id: "voucher-manage",
    title: "구독 및 쿠폰 관리",
    description: "구독 이용권, 쿠폰 이용권, 결제 내역",
  },
  {
    id: "payment-manage",
    title: "결제 수단 관리",
    description: "이용권 결제수단 관리 및 등록",
  },
] as const;

const formatPaidAmount = (amount?: number) =>
  typeof amount === "number" ? `${amount.toLocaleString("ko-KR")}₩` : undefined;

const MembershipPage = () => {
  const navigate = useNavigate();
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
  const {
    data: membership,
    isLoading: isMembershipLoading,
    isError: isMembershipError,
    isSuccess: isMembershipSuccess,
  } = useAdminMembership();

  const trimmedCouponCode = couponCode.trim();
  const canLookupCoupon =
    trimmedCouponCode.length > 0 && !lookupCouponMutation.isPending;

  const activePassTitle = membership
    ? resolveActivePassTitle(membership)
    : undefined;
  const hasActivePass =
    isMembershipSuccess &&
    Boolean(
      membership?.subscriptionPlan ||
        activePassTitle ||
        membership?.subscriptionInfo?.subscriptionName ||
        membership?.couponInfo?.couponName ||
        membership?.subscribed,
    );
  const showEmptyMembership =
    !isMembershipLoading && (isMembershipError || !hasActivePass);
  const hasChangeableSubscription =
    isMembershipSuccess && Boolean(membership?.subscriptionPlan);
  const subscriptionCtaLabel = hasChangeableSubscription
    ? "현재 이용 중"
    : "구독 시작하기";

  const handleStartSubscription = () => {
    if (isMembershipLoading || hasChangeableSubscription) return;
    navigate("/membership/subscribe?cycle=monthly");
  };

  const handleMenuClick = (menuId: (typeof MENU_ITEMS)[number]["id"]) => {
    if (menuId === "payment-manage") {
      navigate("/membership/payment-methods");
      return;
    }
    if (menuId === "voucher-manage") {
      navigate("/membership/vouchers");
    }
  };

  const handleCloseCouponModal = () => {
    if (registerCouponMutation.isPending) return;
    setIsCouponModalOpen(false);
    setLookedUpCoupon(null);
    setLookedUpCouponCode("");
  };

  const handleLookupCoupon = () => {
    if (!trimmedCouponCode || lookupCouponMutation.isPending) return;

    if (!isValidCouponCode(trimmedCouponCode)) {
      setCouponAlertType("notFound");
      return;
    }

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
        <section
          className={`flex flex-col px-12 pb-6 pt-10 ${
            showEmptyMembership ? "gap-5" : "gap-3"
          }`}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-18px font-bold leading-normal text-neutral-gray-1">
                이용 현황
              </h2>
              {hasActivePass ? <MembershipProBadge /> : null}
            </div>
            {isMembershipLoading ? null : showEmptyMembership ? (
              <p className="whitespace-pre-line text-12px font-bold leading-[1.5] text-secondary-2">
                {EMPTY_MEMBERSHIP_GUIDE}
              </p>
            ) : (
              <p className="text-12px font-bold leading-[1.5] text-secondary-2">
                이용 방식: {activePassTitle ?? "이용권"}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {hasActivePass && membership ? (
              <MembershipCouponCard
                size="home"
                status="active"
                title={activePassTitle ?? "이용권"}
                detail={
                  isCouponMembership(membership)
                    ? membership.couponInfo?.couponDescription
                    : formatPaidAmount(membership.payedAmount)
                }
                detailUnit={
                  isCouponMembership(membership)
                    ? undefined
                    : membership.passType
                      ? SUBSCRIPTION_UNIT_BY_PASS_TYPE[membership.passType]
                      : MEMBERSHIP_MONTHLY_PLAN.unit
                }
                footerText={resolveActivePassFooter(membership)}
              />
            ) : null}

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
          <MembershipSubscribeCard
            ctaLabel={subscriptionCtaLabel}
            onCtaClick={handleStartSubscription}
            ctaDisabled={isMembershipLoading}
            ctaLocked={hasChangeableSubscription}
          />

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
        message={couponAlertType ? COUPON_ALERT_MESSAGES[couponAlertType] : ""}
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
