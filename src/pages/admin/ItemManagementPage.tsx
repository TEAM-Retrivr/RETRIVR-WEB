import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import { useAdminItemList } from "../../hooks/queries/useAdminQueries";

const ItemManagementPage = () => {
  const { data, isLoading, error } = useAdminItemList();

  const items = data?.items ?? [];
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
          name=" 건국대학교 도서관자치위원회"
          pageName="물품 관리"
        ></Header>
        <div className="flex flex-col w-full mt-48 items-center font-[Pretendard] font-normal">
          <img className="w-42" src="/icons/symbol.svg" alt="심볼 로고" />
          <p className="text-[#000] opacity-[0.39] text-16px ">
            물품을 등록해주세요
          </p>
          <p className="text-primary text-12px">
            오른쪽 하단 버튼을 눌러 물품을 추가하세요
          </p>
        </div>
      </Layout>
    );
  }

  // 등록된 물품이 있을 때: 물품 목록 렌더링
  return (
    <Layout>
      <div> 로딩 중...</div>
    </Layout>
  );
};

export default ItemManagementPage;
