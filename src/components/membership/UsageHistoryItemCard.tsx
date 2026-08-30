import type { UsageHistoryItem } from "../../types/voucherList";

type UsageHistoryItemCardProps = {
  item: UsageHistoryItem;
};

const UsageHistoryItemCard = ({ item }: UsageHistoryItemCardProps) => (
  <article className="flex items-center justify-between rounded-[7.5px] border border-[#e6eaed] bg-neutral-white px-[18px] py-4">
    <div className="flex flex-col">
      <p className="text-12px font-bold leading-[1.5] text-neutral-gray-2">
        {item.title}
      </p>
      <p className="text-10px font-normal leading-[1.3] text-neutral-gray-3">
        {item.datetimeLabel}
      </p>
    </div>
    {item.kind === "payment" ? (
      <p className="text-14px font-semibold leading-5 text-neutral-gray-1">
        {item.amountLabel}
      </p>
    ) : (
      <p className="text-10px font-semibold leading-normal text-secondary-2">
        쿠폰 사용
      </p>
    )}
  </article>
);

export default UsageHistoryItemCard;
