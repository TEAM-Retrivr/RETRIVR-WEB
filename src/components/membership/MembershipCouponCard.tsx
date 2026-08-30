import MembershipStatusBadge, {
  type MembershipCouponStatus,
} from "./MembershipStatusBadge";

export type MembershipCouponCardSize = "home" | "list";

export type MembershipCouponCardProps = {
  /** 1·3) 사용 여부. 좌측 강조바 색과 사용중/사용 전 칩을 함께 결정한다. */
  status: MembershipCouponStatus;
  /** 2) 이용권 이름. 예: 연간 구독 이용권, 2개월 이용권 쿠폰 */
  title: string;
  /** 4) 이름 하단 텍스트. 구독은 요금, 쿠폰은 이벤트명 */
  detail?: string;
  /** 4) 구독 요금 단위. 예: /월, /년 */
  detailUnit?: string;
  /** 5) 다음 결제일 또는 사용 기간 */
  footerText?: string;
  /** 멤버십 홈 306px / 이용권 목록 338px 안쪽 여백 */
  size?: MembershipCouponCardSize;
};

const SIZE_STYLES: Record<MembershipCouponCardSize, string> = {
  home: "min-h-[88px] pt-[22px] pb-[14px] pl-[30px] pr-[22px]",
  list: "min-h-[88px] pt-[22px] pb-[16px] pl-[30px] pr-[26px]",
};

const ACCENT_STYLES: Record<MembershipCouponStatus, string> = {
  active: "bg-secondary-5",
  pending: "bg-secondary-4",
  completed: "bg-neutral-gray-4",
};

const BORDER_STYLES: Record<MembershipCouponStatus, string> = {
  active: "border-primary",
  pending: "border-primary",
  completed: "border-neutral-gray-4",
};

const TITLE_STYLES: Record<MembershipCouponStatus, string> = {
  active: "text-[#133e7e]",
  pending: "text-[#133e7e]",
  completed: "text-neutral-gray-3",
};

const DETAIL_STYLES: Record<MembershipCouponStatus, string> = {
  active: "text-neutral-gray-2",
  pending: "text-neutral-gray-2",
  completed: "text-neutral-gray-4",
};

const FOOTER_STYLES: Record<MembershipCouponStatus, string> = {
  active: "text-secondary-2",
  pending: "text-neutral-gray-3",
  completed: "text-neutral-gray-4",
};

const MembershipCouponCard = ({
  status,
  title,
  detail,
  detailUnit,
  footerText,
  size = "list",
}: MembershipCouponCardProps) => {
  return (
    <article
      className={`relative flex w-full overflow-hidden rounded-[7.5px] border bg-neutral-white ${SIZE_STYLES[size]} ${BORDER_STYLES[status]}`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-3 rounded-bl-[7px] rounded-tl-[7px] ${ACCENT_STYLES[status]}`}
        aria-hidden
      />

      <div className="relative z-10 flex w-full flex-col gap-0.5">
        <div className="flex min-w-0 flex-wrap items-center gap-[5px]">
          <p
            className={`text-16px font-bold leading-none whitespace-nowrap ${TITLE_STYLES[status]}`}
          >
            {title}
          </p>
          <MembershipStatusBadge status={status} />
        </div>

        {detail ? (
          <p
            className={`text-10px font-semibold leading-[1.4] ${DETAIL_STYLES[status]}`}
          >
            <span>{detail}</span>
            {detailUnit ? (
              <span className="text-neutral-gray-3">{detailUnit}</span>
            ) : null}
          </p>
        ) : null}

        {footerText ? (
          <p
            className={`mt-auto self-end text-[8px] font-semibold leading-[1.3] whitespace-nowrap ${FOOTER_STYLES[status]}`}
          >
            {footerText}
          </p>
        ) : null}
      </div>
    </article>
  );
};

export default MembershipCouponCard;
