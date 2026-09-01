export const MEMBERSHIP_MONTHLY_PLAN = {
  durationLabel: "월간 구독",
  amount: "4,900₩",
  unit: "/월",
} as const;

type MembershipSubscribeCardProps = {
  ctaLabel: string;
  onCtaClick: () => void;
  ctaDisabled?: boolean;
  ctaLocked?: boolean;
};

const MembershipSubscribeCard = ({
  ctaLabel,
  onCtaClick,
  ctaDisabled = false,
  ctaLocked = false,
}: MembershipSubscribeCardProps) => (
  <div className="flex w-full flex-col gap-4 rounded-2xl bg-neutral-white px-[26px] py-6 shadow-[0px_0px_16px_-6px_rgba(0,0,0,0.2)]">
    <div className="flex flex-col gap-2">
      <h3 className="text-18px font-bold leading-normal text-secondary-1">
        Retrivr 프로 구독
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

    <div className="flex h-[61px] w-full items-center justify-between rounded-[7.5px] border border-primary bg-secondary-4 px-5">
      <span className="text-16px font-semibold leading-normal text-primary">
        {MEMBERSHIP_MONTHLY_PLAN.durationLabel}
      </span>
      <p className="flex items-center justify-end gap-1 text-14px leading-5 text-neutral-gray-1">
        <span>
          <span className="font-semibold">{MEMBERSHIP_MONTHLY_PLAN.amount}</span>
          <span className="font-medium text-neutral-gray-3">
            {MEMBERSHIP_MONTHLY_PLAN.unit}
          </span>
        </span>
      </p>
    </div>

    <button
      type="button"
      onClick={onCtaClick}
      disabled={ctaDisabled || ctaLocked}
      className={`flex h-12 w-full items-center justify-center rounded-[12px] text-18px ${
        ctaLocked
          ? "cursor-not-allowed bg-neutral-gray-5 font-semibold text-neutral-gray-3"
          : "cursor-pointer bg-primary font-bold text-neutral-white shadow-primary disabled:cursor-not-allowed disabled:opacity-60"
      }`}
    >
      {ctaLabel}
    </button>
  </div>
);

export default MembershipSubscribeCard;
