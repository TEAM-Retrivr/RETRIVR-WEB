import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import MembershipCouponCard from "../../membership/MembershipCouponCard";

export type CouponPreview = {
  title: string;
  eventName: string;
  validityPeriod: string;
  benefitPeriod: string;
};

const DEFAULT_PREVIEW: CouponPreview = {
  title: "2달 이용권",
  eventName: "Retrivr 출시 이벤트",
  validityPeriod: "26. 05. 01 ~ 26. 06. 30",
  benefitPeriod: "등록일로부터 60일 간",
};

const NOTICE_ITEMS = [
  "이미 프로 멤버십을 이용 중인 경우, 현재 이용권 종료 후 혜택이 시작됩니다.",
  "관련 문의: 인스타그램 DM (@Retrivr_official)",
];

export const lookupCouponPreview = (code: string): CouponPreview | null => {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  if (normalized.length < 4) return null;
  return DEFAULT_PREVIEW;
};

type CouponRegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (code: string, preview: CouponPreview) => void;
};

const CouponRegistrationModal = ({
  isOpen,
  onClose,
  onRegister,
}: CouponRegistrationModalProps) => {
  const [couponCode, setCouponCode] = useState("");
  const preview = lookupCouponPreview(couponCode);

  useEffect(() => {
    if (!isOpen) return;
    setCouponCode("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegister = () => {
    if (!preview) return;
    onRegister(couponCode.trim().toUpperCase(), preview);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-8 font-[Pretendard]">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(217,217,217,0.48)] cursor-default"
        aria-label="모달 닫기"
        onClick={onClose}
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
            onChange={(event) =>
              setCouponCode(event.target.value.toUpperCase())
            }
            placeholder="쿠폰 코드를 입력해주세요"
            className="h-12 w-full rounded-[12px] bg-neutral-gray-5 px-3.5 text-14px font-normal leading-[1.4] text-neutral-gray-2 outline-none placeholder:text-neutral-gray-3 focus:ring-2 focus:ring-primary/30"
            autoFocus
          />

          <div className="-mx-6 flex flex-col gap-6 bg-secondary-4 px-6 py-6">
            {preview ? (
              <MembershipCouponCard
                title={preview.title}
                eventName={preview.eventName}
                period={preview.validityPeriod}
                status="pending"
                periodLabel="유효 기간"
                compact
                preview
              />
            ) : (
              <p className="py-4 text-center text-14px font-normal leading-[1.4] text-neutral-gray-3">
                쿠폰 코드를 입력하면 미리보기가 표시됩니다
              </p>
            )}

            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-0.5">
                <p className="text-14px font-semibold leading-5 text-secondary-1">
                  혜택 기간
                </p>
                <p className="text-14px font-normal leading-[1.4] text-neutral-gray-2">
                  {preview?.benefitPeriod ?? "등록일로부터 60일 간"}
                </p>
              </div>

              <div className="flex flex-col gap-0.5">
                <p className="text-14px font-semibold leading-5 text-secondary-1">
                  유효 기간
                </p>
                <p className="text-14px font-normal leading-[1.4] text-neutral-gray-2">
                  {preview?.validityPeriod ?? "-"}
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
            onClick={handleRegister}
            disabled={!preview}
            className="flex h-12 w-full items-center justify-center rounded-[12px] bg-primary text-18px font-bold text-neutral-white shadow-primary transition-colors enabled:cursor-pointer enabled:hover:bg-secondary-2 disabled:cursor-not-allowed disabled:bg-neutral-gray-4"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!,
  );
};

export default CouponRegistrationModal;
