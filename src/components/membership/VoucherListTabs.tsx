import type { VoucherListTab } from "../../types/voucherList";

const TABS: { id: VoucherListTab; label: string }[] = [
  { id: "subscription", label: "구독 이용권" },
  { id: "coupon", label: "쿠폰 이용권" },
  { id: "history", label: "이용 내역" },
];

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
    <div className="relative z-10 flex w-full items-end justify-between px-5">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="relative flex w-20 flex-col items-center gap-2.5 cursor-pointer"
          >
            <span
              className={`text-14px font-semibold leading-5 ${
                isActive ? "text-primary" : "text-neutral-gray-4"
              }`}
            >
              {tab.label}
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
