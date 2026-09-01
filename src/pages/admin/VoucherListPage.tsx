import { useState } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import VoucherListTabPanels from "../../components/membership/VoucherListTabPanels";
import VoucherListTabs from "../../components/membership/VoucherListTabs";
import type { VoucherListTab } from "../../types/voucherList";

const VoucherListPage = () => {
  const [activeTab, setActiveTab] = useState<VoucherListTab>("subscription");

  return (
    <Layout>
      <Header name="Retrivr 프로" pageName="이용권 목록" backTo="/membership" />

      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-8 pb-10 font-[Pretendard]">
        <VoucherListTabs activeTab={activeTab} onChange={setActiveTab} />
        <VoucherListTabPanels activeTab={activeTab} />
      </div>
    </Layout>
  );
};

export default VoucherListPage;
