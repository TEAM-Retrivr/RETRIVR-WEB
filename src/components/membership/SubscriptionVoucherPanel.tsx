import {
  SUBSCRIPTION_USAGE_GUIDE,
  SUBSCRIPTION_VOUCHER,
} from "../../types/voucherList";
import UsageGuideCard from "./UsageGuideCard";

type SubscriptionVoucherPanelProps = {
  onCancelSubscription?: () => void;
};

const SubscriptionVoucherPanel = ({
  onCancelSubscription,
}: SubscriptionVoucherPanelProps) => (
  <div className="flex flex-col gap-4">
    <article className="flex flex-col rounded-2xl bg-neutral-white px-[26px] py-6 shadow-[0px_0px_16px_-6px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-[5px]">
        <h2 className="text-16px font-bold leading-normal text-neutral-gray-1">
          {SUBSCRIPTION_VOUCHER.title}
        </h2>
        <span className="inline-flex h-[18px] items-center justify-center rounded-[9px] border-[0.5px] border-secondary-2 bg-neutral-gray-5 px-[7px]">
          <span className="text-10px font-bold leading-[1.3] text-secondary-2">
            {SUBSCRIPTION_VOUCHER.statusLabel}
          </span>
        </span>
      </div>

      <p className="mt-2 whitespace-pre-line text-12px font-normal leading-[1.4] text-neutral-gray-3">
        {SUBSCRIPTION_VOUCHER.description}
      </p>

      <div className="mt-4 flex h-[61px] w-full items-center justify-between rounded-[7.5px] border border-primary bg-secondary-4 pl-5 pr-[18px]">
        <span className="text-18px font-bold leading-normal text-primary">
          {SUBSCRIPTION_VOUCHER.durationLabel}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-12px font-normal leading-[1.4] text-neutral-gray-4 line-through">
            {SUBSCRIPTION_VOUCHER.originalPrice}
          </span>
          <p className="text-14px font-bold leading-5 text-primary">
            <span className="font-semibold text-neutral-gray-1">
              {SUBSCRIPTION_VOUCHER.priceAmount}
            </span>
            <span className="font-medium text-neutral-gray-3">
              {SUBSCRIPTION_VOUCHER.priceUnit}
            </span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCancelSubscription}
        className="mt-4 self-end text-12px font-medium leading-[1.5] text-neutral-gray-3 underline cursor-pointer"
      >
        구독 해지
      </button>
    </article>

    <UsageGuideCard items={SUBSCRIPTION_USAGE_GUIDE} />
  </div>
);

export default SubscriptionVoucherPanel;
