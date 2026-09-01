import { useEffect, useRef, useState, type ReactNode } from "react";
import CouponVoucherPanel from "./CouponVoucherPanel";
import SubscriptionVoucherPanel from "./SubscriptionVoucherPanel";
import UsageHistoryPanel from "./UsageHistoryPanel";
import {
  VOUCHER_LIST_TAB_ORDER,
  type VoucherListTab,
} from "../../types/voucherList";

const SLIDE_DURATION_MS = 300;

const TAB_PANELS: Record<VoucherListTab, ReactNode> = {
  subscription: <SubscriptionVoucherPanel />,
  coupon: <CouponVoucherPanel />,
  history: <UsageHistoryPanel />,
};

type VoucherListTabPanelsProps = {
  activeTab: VoucherListTab;
};

const VoucherListTabPanels = ({ activeTab }: VoucherListTabPanelsProps) => {
  const activeIndex = VOUCHER_LIST_TAB_ORDER.indexOf(activeTab);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [trackHeight, setTrackHeight] = useState<number | undefined>(undefined);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const panel = panelRefs.current[activeIndex];
    if (!panel) return;

    const syncHeight = () => {
      setTrackHeight(panel.getBoundingClientRect().height);
    };

    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [activeIndex]);

  const transitionMs = reduceMotion ? 0 : SLIDE_DURATION_MS;

  return (
    <div
      className="mt-8 overflow-x-hidden touch-pan-y"
      style={{
        height: trackHeight,
        transition:
          transitionMs > 0 ? `height ${transitionMs}ms ease-out` : undefined,
      }}
    >
      <div
        className="flex will-change-transform"
        style={{
          transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
          transition:
            transitionMs > 0
              ? `transform ${transitionMs}ms ease-out`
              : undefined,
        }}
      >
        {VOUCHER_LIST_TAB_ORDER.map((tab, index) => {
          const isActive = tab === activeTab;

          return (
            <div
              key={tab}
              ref={(element) => {
                panelRefs.current[index] = element;
              }}
              className="flex w-full shrink-0 flex-col gap-4"
              aria-hidden={!isActive}
              inert={isActive ? undefined : true}
            >
              {TAB_PANELS[tab]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoucherListTabPanels;
