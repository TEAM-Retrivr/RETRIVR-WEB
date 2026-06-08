export type MembershipCouponStatus = "active" | "pending" | "completed";

const STATUS_LABEL: Record<MembershipCouponStatus, string> = {
  active: "사용중",
  pending: "사용 전",
  completed: "사용 완료",
};

const STATUS_STYLES: Record<
  MembershipCouponStatus,
  { container: string; text: string }
> = {
  active: {
    container: "border-primary",
    text: "text-primary",
  },
  pending: {
    container: "border-neutral-gray-3",
    text: "text-neutral-gray-3",
  },
  completed: {
    container: "border-neutral-gray-4",
    text: "text-neutral-gray-4",
  },
};

type MembershipStatusBadgeProps = {
  status: MembershipCouponStatus;
};

const MembershipStatusBadge = ({ status }: MembershipStatusBadgeProps) => {
  const styles = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex h-[18px] items-center justify-center rounded-[9px] border-[0.5px] border-solid bg-neutral-white px-[7px] py-px ${styles.container}`}
    >
      <span
        className={`text-10px font-bold leading-[1.3] whitespace-nowrap ${styles.text}`}
      >
        {STATUS_LABEL[status]}
      </span>
    </span>
  );
};

export default MembershipStatusBadge;
