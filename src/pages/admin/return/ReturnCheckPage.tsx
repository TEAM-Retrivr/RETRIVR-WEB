import { Layout } from "../../../components/Layout";
import Header from "../../../components/Header";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReturnCheckCard, {
  type ReturnCheckCardRentalInfo,
} from "../../../components/cards/admin/return/ReturnCheckCard";
import { useAdminActiveRentalsByItem } from "../../../hooks/queries/useAdminQueries";
import { useLoadHome } from "../../../hooks/queries/useAuthQueries";

const ReturnCheckPage = () => {
  const navigate = useNavigate();
  const { itemId: itemIdParam } = useParams();
  const itemId = Number(itemIdParam);

  const { data: homeData } = useLoadHome();
  const organizationName = homeData?.organizationName;

  const { data, isLoading, error } = useAdminActiveRentalsByItem(itemId);

  const rentals: ReturnCheckCardRentalInfo[] = useMemo(() => {
    if (!data) return [];
    return (
      data.borrowedItems?.map((unit) => ({
        rentalId: unit.rentalId,
        isOverdue: unit.isOverdue,
        itemId: data.itemId,
        itemName: data.itemName,
        unitId: unit.unitId,
        borrowedItemName: unit.borrowedItemName,
        borrowerName: unit.borrowerName,
        borrowerPhone: unit.borrowerPhone,
        borrowerFields: unit.borrowerFields
          ? {
              additionalProp1: unit.borrowerFields.additionalProp1,
              additionalProp2: unit.borrowerFields.additionalProp2,
              additionalProp3: unit.borrowerFields.additionalProp3,
            }
          : undefined,
        rentalDate: unit.rentalDate,
        expectedReturnDueDate: unit.expectedReturnDueDate,
      })) ?? []
    );
  }, [data]);

  return (
    <Layout>
      <Header
        name={organizationName}
        pageName="물품별 관리"
        onBackClick={() => navigate("/return-manage")}
      ></Header>
      {/* 전체 영역 */}
      <div className="w-full h-screen items-center bg-secondary-4">
        {/* 물품 정보 영역 - 물품 이름, 총 개수, 대여기간, 보증 물품, 현재 대여 중인 개수 */}
        <div className="w-full h-auto px-7 pt-7 pb-10 font-[Pretendard]">
          {isLoading && (
            <p className="text-14px text-neutral-gray-3">로딩 중...</p>
          )}
          {error && (
            <p className="text-14px text-red">
              물품별 대여 현황을 불러오지 못했습니다.
            </p>
          )}
          {data && (
            <div className="w-79.25 flex justify-between items-center pl-2.75 gap-1.5">
              <div className="flex flex-col items-start gap-0.5 ">
                <p className="text-10px text-primary font-normal leading-[130%]">
                  {data.totalQuantity - data.availableQuantity}개 대여 중
                </p>
                <p className="text-28px text-neutral-gray-1 font-bold">
                  {data.itemName}
                </p>
              </div>
              <div className="text-10px text-neutral-gray-3 font-normal leading-[130%] mt-auto mb-1.5">
                <p>• 총 개수: {data.totalQuantity}개</p>
                <p>• 대여 기간: {data.rentalDuration}일</p>
                <p>
                  • 보증물품:{" "}
                  {data.guaranteedGoods === null
                    ? "없음"
                    : data.guaranteedGoods}
                </p>
              </div>
            </div>
          )}
        </div>
        {/* 반납 확인 컴포넌트 영역 */}
        <div className=" flex flex-col items-center overflow-y-auto no-scrollbar">
          {!isLoading && !error && rentals.length === 0 && (
            <p className="text-14px text-neutral-gray-3 pt-40">
              현재 대여 중인 물품이 없습니다.
            </p>
          )}
          <div className="flex flex-col gap-4 pb-10">
            {rentals.map((rental, idx) => (
              <ReturnCheckCard
                key={`${rental.rentalId ?? "no-rentalId"}-${idx}`}
                rental={rental}
                organizationName={organizationName}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnCheckPage;
