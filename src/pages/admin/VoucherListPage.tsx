import { useState } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import CouponVoucherPanel from "../../components/membership/CouponVoucherPanel";
import SubscriptionVoucherPanel from "../../components/membership/SubscriptionVoucherPanel";
import UsageHistoryPanel from "../../components/membership/UsageHistoryPanel";
import VoucherListTabs from "../../components/membership/VoucherListTabs";
import type { VoucherListTab } from "../../types/voucherList";

const VoucherListPage = () => {
  const [activeTab, setActiveTab] = useState<VoucherListTab>("subscription");

  return (
    <Layout>
      <Header name="Retrivr 프로" pageName="이용권 목록" backTo="/membership" />

      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-8 pb-10 font-[Pretendard]">
        <VoucherListTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-8 flex flex-col gap-4">
          {activeTab === "subscription" ? (
            <SubscriptionVoucherPanel
              onCancelSubscription={() => alert("개발 예정입니다.")}
            />
          ) : null}
          {activeTab === "coupon" ? <CouponVoucherPanel /> : null}
          {activeTab === "history" ? <UsageHistoryPanel /> : null}
        </div>
      </div>
    </Layout>
  );
};

export default VoucherListPage;
