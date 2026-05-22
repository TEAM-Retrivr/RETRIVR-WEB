import MembershipStatusBadge, {
  type MembershipCouponStatus,
} from "./MembershipStatusBadge";

export type MembershipCouponCardProps = {
  title: string;
  eventName: string;
  period: string;
  status: MembershipCouponStatus;
  periodLabel?: "사용 기간" | "유효 기간";
  compact?: boolean;
  preview?: boolean;
};

const ACCENT_STYLES: Record<MembershipCouponStatus, string> = {
  active: "bg-secondary-5",
  pending: "bg-secondary-4",
  completed: "bg-secondary-5",
};

const TITLE_STYLES: Record<MembershipCouponStatus, string> = {
  active: "text-[#133e7e]",
  pending: "text-[#133e7e]",
  completed: "text-neutral-gray-3",
};

const EVENT_STYLES: Record<MembershipCouponStatus, string> = {
  active: "text-neutral-gray-2",
  pending: "text-neutral-gray-2",
  completed: "text-neutral-gray-4",
};

const PERIOD_STYLES: Record<MembershipCouponStatus, string> = {
  active: "text-secondary-2",
  pending: "text-secondary-2",
  completed: "text-neutral-gray-4",
};

const MembershipCouponCard = ({
  title,
  eventName,
  period,
  status,
  periodLabel = status === "pending" ? "유효 기간" : "사용 기간",
  compact = false,
  preview = false,
}: MembershipCouponCardProps) => {
  const isCompleted = status === "completed";
  const accentClass = preview ? "bg-secondary-5" : ACCENT_STYLES[status];

  return (
    <article
      className={`relative flex w-full overflow-hidden rounded-[8px] border border-[#e6eaed] bg-neutral-white ${
        compact || preview
          ? "min-h-[92px] px-[31px] py-[18px]"
          : isCompleted
            ? "min-h-[94px] px-6 py-5"
            : "min-h-[102px] px-[34px] py-5"
      }`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-[14px] rounded-bl-[8px] rounded-tl-[8px] ${accentClass}`}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute right-0 top-1/2 flex -translate-y-1/2 flex-col gap-[5px]"
        aria-hidden
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className="size-[10px] -mr-[5px] rounded-full bg-secondary-4"
          />
        ))}
      </div>

      <div className="relative z-10 flex w-full flex-col gap-1 pr-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <p
            className={`font-bold leading-[1.4] whitespace-nowrap ${
              compact ? "text-[18px]" : "text-20px"
            } ${TITLE_STYLES[status]}`}
          >
            {title}
          </p>
          <MembershipStatusBadge status={status} />
        </div>
        <p
          className={`font-semibold leading-[1.4] ${
            compact ? "text-[11px]" : "text-12px"
          } ${EVENT_STYLES[status]}`}
        >
          {eventName}
        </p>
        <p
          className={`self-end font-semibold leading-normal whitespace-nowrap ${
            compact ? "text-10px" : "text-10px"
          } ${PERIOD_STYLES[status]}`}
        >
          {periodLabel}: {period}
        </p>
      </div>
    </article>
  );
};

export default MembershipCouponCard;
