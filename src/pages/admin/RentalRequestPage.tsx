import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import RentalConfirmCard from "../../components/cards/admin/rental/RentalConfirmCard";
import type { RentalRequest } from "../../types/rental";

const sampleRental: RentalRequest = {
  requestedAt: "2026-01-21 17:00",
  itemName: "c타입 충전기",
  itemId: "c타입 충전기 (1)",
  itemCount: "(2/5)",
  applicantInfo: {
    name: "조윤아",
    major: "동물자원학과",
    id: "202312690",
  },
};

const RentalRequestPage = () => {
  return (
    <Layout>
      <Header name="건국대학교 도서관자치위원회" pageName="대여요청"></Header>
      <div className="flex flex-col w-full items-center my-8.5 gap-5 overflow-y-scroll overscroll-none scrollbar-hide">
        <RentalConfirmCard rental={sampleRental}></RentalConfirmCard>
        <RentalConfirmCard rental={sampleRental}></RentalConfirmCard>
        <RentalConfirmCard rental={sampleRental}></RentalConfirmCard>
        <RentalConfirmCard rental={sampleRental}></RentalConfirmCard>
      </div>
    </Layout>
  );
};

export default RentalRequestPage;
