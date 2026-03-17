import { Layout } from "../../../components/Layout";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
const ReturnCheckPage = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <Header
        name="건국대학교 도서관자치위원회"
        pageName="물품별 관리"
        onBackClick={() => navigate("/return-manage")}
      ></Header>
      {/* 전체 영역 */}
      <div className="w-full h-screen items-center bg-secondary-4">
        {/* 물품 정보 영역 - 물품 이름, 총 개수, 대여기간, 보증 물품, 현재 대여 중인 개수 */}
        <div></div>
        {/* 반납 확인 컴포넌트 영역 */}
        <div></div>
      </div>
    </Layout>
  );
};

export default ReturnCheckPage;
