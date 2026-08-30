import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  EMPTY_SUBSCRIPTION_USAGE_GUIDE,
  SUBSCRIPTION_USAGE_GUIDE,
  SUBSCRIPTION_USAGE_GUIDE_TITLE,
} from "../../types/voucherList";
import {
  useAdminMembership,
  useCancelAdminSubscription,
  useChangeAdminSubscriptionPlan,
} from "../../hooks/queries/useAdminQueries";
import type {
  AdminSubscriptionErrorResponse,
  AdminSubscriptionPlan,
} from "../../api/admin/admin.type";
import {
  formatCouponDay,
  formatFullDotDay,
  formatKoreanDate,
} from "../../utils/couponDisplay";
import {
  toAdminSubscriptionPlan,
  toVoucherBillingCycle,
  type VoucherBillingCycle,
} from "../../types/voucherPayment";
import ConfirmModal from "../modals/ConfirmModal";
import MembershipCouponCard from "./MembershipCouponCard";
import MembershipSubscribeCard, {
  MEMBERSHIP_SUBSCRIBE_PLANS,
} from "./MembershipSubscribeCard";
import UsageGuideCard from "./UsageGuideCard";
import PlanChangeConfirmModal from "../modals/membership/PlanChangeConfirmModal";
import PlanChangeSuccessModal from "../modals/membership/PlanChangeSuccessModal";
import SubscriptionCancelModal from "../modals/membership/SubscriptionCancelModal";
import CouponAlertModal from "../modals/membership/CouponAlertModal";

const EMPTY_MEMBERSHIP_MESSAGE = "Retrivr 프로를 이용하고 있지 않아요!";

const COUPON_PASS_TYPE = "쿠폰 사용";

const SUBSCRIPTION_PLAN_LABEL: Record<AdminSubscriptionPlan, string> = {
  MONTHLY: "월간 구독 이용권",
  YEARLY: "연간 구독 이용권",
};

const SUBSCRIPTION_PLAN_UNIT: Record<AdminSubscriptionPlan, string> = {
  MONTHLY: "/월",
  YEARLY: "/년",
};

const PLAN_CHANGE_LABEL: Record<AdminSubscriptionPlan, string> = {
  MONTHLY: "연간 구독으로 변경",
  YEARLY: "월간 구독으로 변경",
};

const isCouponPassType = (passType?: string | null): boolean =>
  passType === COUPON_PASS_TYPE;

const getSubscriptionErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | AdminSubscriptionErrorResponse
      | undefined;
    if (data?.message) return data.message;
  }
  return fallback;
};

const formatPaidAmount = (amount?: number) =>
  typeof amount === "number" ? `${amount.toLocaleString("ko-KR")}₩` : undefined;

const ACTION_BUTTON_CLASS =
  "flex h-[42px] min-w-0 flex-1 items-center justify-center rounded-[7.5px] bg-neutral-white px-2 text-center text-12px font-bold leading-[1.5] text-neutral-gray-2 shadow-[0px_0px_2px_rgba(0,0,0,0.14)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";

type VoucherActionButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
};

const VoucherActionButton = ({
  label,
  disabled,
  onClick,
}: VoucherActionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={ACTION_BUTTON_CLASS}
  >
    {label}
  </button>
);

const oppositeCycle = (plan: AdminSubscriptionPlan): VoucherBillingCycle =>
  plan === "MONTHLY" ? "yearly" : "monthly";

type CouponPrioritySubscriptionNoticeProps = {
  nextBillingAt: string;
};

const CouponPrioritySubscriptionNotice = ({
  nextBillingAt,
}: CouponPrioritySubscriptionNoticeProps) => (
  <div className="w-full rounded-[7.5px] border border-[#e6eaed] bg-neutral-gray-5 px-[18px] py-3">
    <p className="whitespace-pre-line text-14px font-bold leading-[1.5] text-neutral-gray-3">
      {"현재 쿠폰 이용권이 우선 적용 중입니다.\n"}
      {"모든 쿠폰 소진 후 "}
      <span className="font-bold text-secondary-1">{nextBillingAt}</span>
      {"에\n 구독 이용권이 결제됩니다."}
    </p>
  </div>
);

const SubscriptionVoucherPanel = () => {
  const navigate = useNavigate();
  // GET /api/admin/v1/memberships/current
  const { data: membership, isLoading, isError } = useAdminMembership();
  const cancelMutation = useCancelAdminSubscription();
  const changePlanMutation = useChangeAdminSubscriptionPlan();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [hasCanceled, setHasCanceled] = useState(false);
  const [billingCycle, setBillingCycle] =
    useState<VoucherBillingCycle>("monthly");
  const [isPlanChangeConfirmOpen, setIsPlanChangeConfirmOpen] = useState(false);
  const [isPlanChangeSuccessOpen, setIsPlanChangeSuccessOpen] = useState(false);
  const [planChangeTargetCycle, setPlanChangeTargetCycle] =
    useState<VoucherBillingCycle>("yearly");
  const [planChangeSuccessDate, setPlanChangeSuccessDate] = useState<
    string | null
  >(null);
  const [planChangeMessage, setPlanChangeMessage] = useState<string | null>(
    null,
  );
  const [scheduledCycle, setScheduledCycle] =
    useState<VoucherBillingCycle | null>(null);

  const goToSubscribe = (cycle: VoucherBillingCycle) => {
    navigate(`/membership/subscribe?cycle=${cycle}`);
  };

  const subscriptionPlan = membership?.subscriptionPlan ?? null;
  const hasSubscription = Boolean(subscriptionPlan);
  const showCouponPriorityNotice = Boolean(
    membership &&
    subscriptionPlan &&
    isCouponPassType(membership.passType) &&
    membership.nextBillingAt,
  );
  const showEmptyState = !isLoading && (isError || !hasSubscription);
  const nextBillingAt = membership?.nextBillingAt ?? undefined;
  const endAt = membership?.endAt;
  const paidAmount = membership?.payedAmount;
  const isCanceledPass =
    hasCanceled || Boolean(hasSubscription && !nextBillingAt);
  const passLabel = subscriptionPlan
    ? SUBSCRIPTION_PLAN_LABEL[subscriptionPlan]
    : undefined;
  const expireAtLabel = nextBillingAt
    ? formatKoreanDate(nextBillingAt)
    : undefined;
  const nextBillingLabel = nextBillingAt
    ? `다음 결제일 ${formatFullDotDay(nextBillingAt)}`
    : isCanceledPass && endAt
      ? `혜택 종료일 ${formatFullDotDay(endAt)}`
      : undefined;
  const formattedNextBillingAt = nextBillingAt
    ? formatFullDotDay(nextBillingAt)
    : "";
  const isPlanChangeScheduled =
    subscriptionPlan != null &&
    scheduledCycle === oppositeCycle(subscriptionPlan);

  useEffect(() => {
    if (
      scheduledCycle &&
      subscriptionPlan &&
      toVoucherBillingCycle(subscriptionPlan) === scheduledCycle
    ) {
      setScheduledCycle(null);
    }
  }, [scheduledCycle, subscriptionPlan]);

  const handleOpenPlanChange = () => {
    if (
      !subscriptionPlan ||
      changePlanMutation.isPending ||
      isPlanChangeScheduled
    ) {
      return;
    }
    setPlanChangeTargetCycle(oppositeCycle(subscriptionPlan));
    setIsPlanChangeConfirmOpen(true);
  };

  const handleConfirmPlanChange = () => {
    if (!subscriptionPlan || changePlanMutation.isPending) return;
    if (toVoucherBillingCycle(subscriptionPlan) === planChangeTargetCycle) {
      return;
    }
    if (scheduledCycle === planChangeTargetCycle) return;

    changePlanMutation.mutate(
      { plan: toAdminSubscriptionPlan(planChangeTargetCycle) },
      {
        onSuccess: (response) => {
          setIsPlanChangeConfirmOpen(false);
          setScheduledCycle(planChangeTargetCycle);
          setPlanChangeSuccessDate(
            response.nextBillingAt
              ? formatKoreanDate(response.nextBillingAt)
              : null,
          );
          setIsPlanChangeSuccessOpen(true);
        },
        onError: (error) => {
          setIsPlanChangeConfirmOpen(false);
          setPlanChangeMessage(
            getSubscriptionErrorMessage(
              error,
              "플랜 변경에 실패했습니다. 다시 시도해주세요.",
            ),
          );
        },
      },
    );
  };

  const handleConfirmCancel = async () => {
    if (cancelMutation.isPending) return;
    try {
      const response = await cancelMutation.mutateAsync();
      setHasCanceled(true);
      setIsCancelOpen(false);
      const expireDay = response.currentPassExpireAt
        ? formatCouponDay(response.currentPassExpireAt)
        : undefined;
      setResultMessage(
        expireDay
          ? `구독이 해지되었어요.\n이용권은 ${expireDay}까지 유지됩니다.`
          : "구독이 해지되었어요.",
      );
    } catch (error) {
      setIsCancelOpen(false);
      setResultMessage(
        getSubscriptionErrorMessage(
          error,
          "구독 해지에 실패했습니다. 다시 시도해주세요.",
        ),
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <div className="flex min-h-[180px] items-center justify-center">
          <p className="text-14px font-normal leading-[1.4] text-neutral-gray-3">
            이용권을 불러오는 중이에요
          </p>
        </div>
      ) : null}

      {showEmptyState ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex h-[42px] w-full items-center justify-center rounded-[7.5px] border border-[#e6eaed] bg-neutral-gray-5 px-[18px]">
            <p className="text-12px font-bold leading-[1.5] text-neutral-gray-3">
              {EMPTY_MEMBERSHIP_MESSAGE}
            </p>
          </div>
          <MembershipSubscribeCard
            billingCycle={billingCycle}
            onBillingCycleChange={setBillingCycle}
            ctaLabel="구독 시작하기"
            onCtaClick={() => goToSubscribe(billingCycle)}
          />
        </div>
      ) : null}

      {hasSubscription && subscriptionPlan ? (
        <div className="flex flex-col gap-1.5">
          {showCouponPriorityNotice ? (
            <CouponPrioritySubscriptionNotice
              nextBillingAt={formattedNextBillingAt}
            />
          ) : (
            <MembershipCouponCard
              status="active"
              title={passLabel ?? "구독 이용권"}
              detail={formatPaidAmount(paidAmount)}
              detailUnit={
                subscriptionPlan
                  ? SUBSCRIPTION_PLAN_UNIT[subscriptionPlan]
                  : undefined
              }
              footerText={nextBillingLabel}
            />
          )}

          {isCanceledPass ? (
            <div className="flex gap-1.5">
              <VoucherActionButton
                label="월간 구독 시작하기"
                onClick={() => goToSubscribe("monthly")}
              />
              <VoucherActionButton
                label="연간 구독 시작하기"
                onClick={() => goToSubscribe("yearly")}
              />
            </div>
          ) : (
            <div className="flex gap-1.5">
              <VoucherActionButton
                label={
                  isPlanChangeScheduled
                    ? "변경 예약됨"
                    : PLAN_CHANGE_LABEL[subscriptionPlan]
                }
                disabled={changePlanMutation.isPending || isPlanChangeScheduled}
                onClick={handleOpenPlanChange}
              />
              <VoucherActionButton
                label="구독 해지"
                disabled={cancelMutation.isPending}
                onClick={() => setIsCancelOpen(true)}
              />
            </div>
          )}
        </div>
      ) : null}

      <UsageGuideCard
        title={SUBSCRIPTION_USAGE_GUIDE_TITLE}
        items={
          showEmptyState
            ? EMPTY_SUBSCRIPTION_USAGE_GUIDE
            : SUBSCRIPTION_USAGE_GUIDE
        }
      />

      <SubscriptionCancelModal
        isOpen={isCancelOpen}
        isPending={cancelMutation.isPending}
        expireAtLabel={expireAtLabel}
        onClose={() => {
          if (cancelMutation.isPending) return;
          setIsCancelOpen(false);
        }}
        onConfirm={handleConfirmCancel}
      />

      <PlanChangeConfirmModal
        isOpen={isPlanChangeConfirmOpen}
        isPending={changePlanMutation.isPending}
        targetCycle={planChangeTargetCycle}
        amountLabel={MEMBERSHIP_SUBSCRIBE_PLANS[
          planChangeTargetCycle
        ].amount.replace("₩", "원")}
        onClose={() => {
          if (changePlanMutation.isPending) return;
          setIsPlanChangeConfirmOpen(false);
        }}
        onConfirm={handleConfirmPlanChange}
      />

      <PlanChangeSuccessModal
        isOpen={isPlanChangeSuccessOpen}
        targetCycle={planChangeTargetCycle}
        startDateLabel={planChangeSuccessDate ?? undefined}
        onClose={() => {
          setIsPlanChangeSuccessOpen(false);
          setPlanChangeSuccessDate(null);
        }}
      />

      <CouponAlertModal
        isOpen={resultMessage !== null}
        message={resultMessage ?? ""}
        onClose={() => setResultMessage(null)}
      />

      <ConfirmModal
        isOpen={planChangeMessage !== null}
        onClose={() => setPlanChangeMessage(null)}
        message={planChangeMessage ?? ""}
        confirmText="확인"
      />
    </div>
  );
};

export default SubscriptionVoucherPanel;
