import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import { useAdminItemList } from "../../hooks/queries/useAdminQueries";
import { useLoadHome } from "../../hooks/queries/useAuthQueries";
import BlueButton from "../../components/BlueButton";
import { useNavigate } from "react-router-dom";
import ItemManagementCard from "../../components/cards/admin/management/ItemManagementCard";
import type { AdminItemListResponse } from "../../api/admin/admin.type";
import { requestAdminLedgerExcelDownload } from "../../api/admin/admin.api";

const getFileNameFromDisposition = (contentDisposition?: string) => {
  if (!contentDisposition) return "ledger.xlsx";

  const utf8FileNameMatch = contentDisposition.match(
    /filename\*=UTF-8''([^;]+)/i,
  );
  if (utf8FileNameMatch?.[1]) {
    return decodeURIComponent(utf8FileNameMatch[1]);
  }

  const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  if (fileNameMatch?.[1]) {
    return fileNameMatch[1];
  }

  return "ledger.xlsx";
};

const ItemManagementPage = () => {
  const navigate = useNavigate();
  const handleExcelDownload = async () => {
    try {
      const response = await requestAdminLedgerExcelDownload();
      const fileName = getFileNameFromDisposition(
        response.headers["content-disposition"],
      );

      const downloadUrl = window.URL.createObjectURL(response.data);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("엑셀 다운로드에 실패했습니다.", error);
      alert("엑셀 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const { data, isLoading, error } = useAdminItemList();
  const { data: homeData } = useLoadHome();
  const organizationName = homeData?.organizationName;

  const items: AdminItemListResponse["items"] = data?.items ?? [];
  const hasItems = items.length > 0;

  // 로딩 화면
  if (isLoading) {
    return (
      <Layout>
        <div> 로딩 중...</div>
      </Layout>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <Layout>
        <div>에러가 발생했습니다.</div>
      </Layout>
    );
  }

  // 등록된 물품 없을 때: 초기 화면 렌더링
  if (!hasItems) {
    return (
      <Layout>
        <Header
          name={organizationName}
          pageName="물품 관리"
          backTo="/home"
          rightAction={
            <button
              type="button"
              onClick={handleExcelDownload}
              className="h-10 cursor-pointer"
              aria-label="엑셀 다운로드"
            >
              <img
                src="/icons/excel-download.svg"
                alt="엑셀 다운로드"
                className="h-full w-auto object-contain"
              />
            </button>
          }
        />
        <div className="flex flex-col w-full mt-48 items-center font-[Pretendard] font-normal">
          <img className="w-42" src="/icons/symbol.svg" alt="심볼 로고" />
          <p className="text-[#000] opacity-[0.39] text-16px ">
            물품을 등록해주세요
          </p>
          <p className="text-primary text-12px">
            오른쪽 하단 버튼을 눌러 물품을 추가하세요
          </p>
        </div>
        {/* 물품 추가 버튼 */}
        <BlueButton
          option="addItem"
          onClick={() => navigate("/item-register")}
        ></BlueButton>
      </Layout>
    );
  }

  // 등록된 물품이 있을 때: 물품 목록 렌더링
  return (
    <Layout>
      <Header
        name={organizationName}
        pageName="물품 관리"
        backTo="/home"
        rightAction={
          <button
            type="button"
            onClick={handleExcelDownload}
            className="h-10 cursor-pointer"
            aria-label="엑셀 다운로드"
          >
            <img
              src="/icons/excel-download.svg"
              alt="엑셀 다운로드"
              className="h-full w-auto object-contain"
            />
          </button>
        }
      ></Header>
      <div className="flex flex-col items-center mx-6.5 my-8.5 gap-4">
        {items.map((item) => (
          <ItemManagementCard
            key={item.itemId}
            itemId={item.itemId}
            name={item.name}
            totalQuantity={item.totalQuantity}
            availableQuantity={item.availableQuantity}
            isActive={item.isActive}
            rentalDuration={item.rentalDuration}
            description={item.description}
            guaranteedGoods={item.guaranteedGoods}
            borrowerRequirements={item.borrowerRequirements}
            itemManagementType={item.itemManagementType}
          />
        ))}
      </div>
      {/* 물품 추가 버튼 */}
      <BlueButton option="addItem" onClick={() => navigate("/item-register")} />
    </Layout>
  );
};

export default ItemManagementPage;
