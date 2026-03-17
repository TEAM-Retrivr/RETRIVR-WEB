import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import RentalConfirmCard from "../../components/cards/admin/rental/RentalConfirmCard";
import type { RentalRequest } from "../../types/rental";
import { useAdminRentalRequestList } from "../../hooks/queries/useAdminQueries";

const RentalRequestPage = () => {
  // 관리자 대여 요청 목록 조회
  const { data, isLoading, error } = useAdminRentalRequestList();

  const requests = data?.requests ?? [];

  return (
    <Layout>
      <Header
        name="건국대학교 도서관자치위원회"
        pageName="대여요청"
        backTo="/home"
      ></Header>
      <div className="flex flex-col w-full h-screen items-center my-6.5 gap-5 overflow-y-auto no-scrollbar">
        {isLoading && (
          <p className="text-neutral-gray-3 text-14px">로딩 중...</p>
        )}
        {error && (
          <p className="text-red text-14px">
            대여 요청 목록을 불러오지 못했습니다.
          </p>
        )}
        {!isLoading && !error && requests.length === 0 && (
          <p className="pt-50 text-neutral-gray-3 text-14px">
            대여 요청이 아직 없습니다.
          </p>
        )}
        {!isLoading &&
          !error &&
          requests.map((request) => {
            const rental: RentalRequest = {
              rentalId: request.rentalId,
              requestedAt: request.requestedAt,
              itemName: request.itemName,
              // 개별 코드형 물품 코드 표시 (예: "C-001")
              itemId: request.itemUnitCode,
              // 남은 수량/전체 수량 형식으로 가공
              itemCount: `(${request.availableQuantity}/${request.totalQuantity})`,
              applicantInfo: {
                name: request.borrowerName,
                major: request.borrowerMajor,
                id: request.borrowerStudentNumber,
              },
            };

            return (
              <RentalConfirmCard
                key={request.rentalId}
                rental={rental}
              ></RentalConfirmCard>
            );
          })}
      </div>
    </Layout>
  );
};

export default RentalRequestPage;
