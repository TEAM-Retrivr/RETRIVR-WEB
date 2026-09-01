import {
  VOUCHER_LIST_TAB_LABELS,
  VOUCHER_LIST_TAB_ORDER,
  type VoucherListTab,
} from "../../types/voucherList";

type VoucherListTabsProps = {
  activeTab: VoucherListTab;
  onChange: (tab: VoucherListTab) => void;
};

const VoucherListTabs = ({ activeTab, onChange }: VoucherListTabsProps) => (
  <div className="relative mt-5">
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-neutral-gray-5"
      aria-hidden
    />
    <div
      className="relative z-10 flex w-full items-end justify-between px-5"
      role="tablist"
      aria-label="이용권 목록"
    >
      {VOUCHER_LIST_TAB_ORDER.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className="relative flex w-20 flex-col items-center gap-2.5 cursor-pointer"
          >
            <span
              className={`text-14px font-semibold leading-5 ${
                isActive ? "text-primary" : "text-neutral-gray-4"
              }`}
            >
              {VOUCHER_LIST_TAB_LABELS[tab]}
            </span>
            <span
              className={`h-[3px] w-full rounded-[1.5px] ${
                isActive ? "bg-primary" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  </div>
);

export default VoucherListTabs;
