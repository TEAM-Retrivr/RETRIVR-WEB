import { createPortal } from "react-dom";
import type { AdminCouponLookupResponse } from "../../../api/admin/admin.type";
import MembershipCouponCard from "../../membership/MembershipCouponCard";
import { toCouponModalViewModel } from "../../../utils/couponDisplay";

const NOTICE_ITEMS = [
  "이미 프로 멤버십을 이용 중인 경우, 현재 이용권 종료 후 혜택이 시작됩니다.",
  "관련 문의: 인스타그램 DM (@Retrivr_official)",
];

type CouponRegistrationModalProps = {
  isOpen: boolean;
  couponCode: string;
  coupon: AdminCouponLookupResponse | null;
  isRegistering?: boolean;
  onClose: () => void;
  onRegister: () => void;
};

const CouponRegistrationModal = ({
  isOpen,
  couponCode,
  coupon,
  isRegistering = false,
  onClose,
  onRegister,
}: CouponRegistrationModalProps) => {
  if (!isOpen || !coupon) return null;

  const preview = toCouponModalViewModel(coupon);

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-8 font-[Pretendard]">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(217,217,217,0.48)] cursor-default"
        aria-label="모달 닫기"
        onClick={onClose}
        disabled={isRegistering}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-registration-title"
        className="relative z-[1000] flex max-h-[min(588px,90vh)] w-full max-w-[338px] flex-col overflow-hidden rounded-[24px] bg-neutral-white shadow-16-gray"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-5 overflow-y-auto no-scrollbar px-6 pt-8">
          <h2
            id="coupon-registration-title"
            className="text-20px font-semibold leading-[1.4] text-secondary-1"
          >
            쿠폰 등록하기
          </h2>

          <input
            type="text"
            value={couponCode}
            readOnly
            aria-readonly="true"
            className="h-12 w-full rounded-[12px] bg-neutral-gray-5 px-3.5 text-14px font-normal leading-[1.4] text-neutral-gray-2 outline-none"
          />

          <div className="-mx-6 flex flex-col gap-6 bg-secondary-4 px-6 py-6">
            <MembershipCouponCard
              title={preview.title}
              eventName={preview.eventName}
              period={preview.validityPeriod}
              status="pending"
              periodLabel="유효 기간"
              compact
              preview
            />

            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-0.5">
                <p className="text-14px font-semibold leading-5 text-secondary-1">
                  혜택 기간
                </p>
                <p className="text-14px font-normal leading-[1.4] text-neutral-gray-2">
                  {preview.benefitPeriod}
                </p>
              </div>

              <div className="flex flex-col gap-0.5">
                <p className="text-14px font-semibold leading-5 text-secondary-1">
                  유효 기간
                </p>
                <p className="text-14px font-normal leading-[1.4] text-neutral-gray-2">
                  {preview.validityPeriod}
                </p>
              </div>

              <div className="flex flex-col gap-[3px]">
                <p className="text-14px font-semibold leading-5 text-secondary-1">
                  안내 사항
                </p>
                <ul className="flex flex-col gap-2">
                  {NOTICE_ITEMS.map((notice) => (
                    <li key={notice} className="flex gap-0.5">
                      <span
                        className="mt-[7px] size-[17px] shrink-0 flex items-center justify-center"
                        aria-hidden
                      >
                        <span className="size-[2px] rounded-full bg-neutral-gray-2" />
                      </span>
                      <p className="text-14px font-normal leading-[1.4] text-neutral-gray-2">
                        {notice}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-6 pb-6 pt-4">
          <button
            type="button"
            onClick={onRegister}
            disabled={isRegistering}
            className="flex h-12 w-full items-center justify-center rounded-[12px] bg-primary text-18px font-bold text-neutral-white shadow-primary transition-colors enabled:cursor-pointer enabled:hover:bg-secondary-2 disabled:cursor-not-allowed disabled:bg-neutral-gray-4"
          >
            {isRegistering ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!,
  );
};

export default CouponRegistrationModal;
