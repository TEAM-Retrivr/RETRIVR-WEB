import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import Button from "../../components/Button";
import { useNavigate, useSearchParams } from "react-router-dom";

const RentalConfirmationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // 완료 페이지 URL 쿼리에서 organizationId를 읽어, 확인 시 원래 대여지 홈으로 복귀하는 데 사용함
  const organizationIdParam = searchParams.get("organizationId");
  const organizationId = organizationIdParam
    ? Number(organizationIdParam)
    : NaN;

  // 상단 뒤로가기/하단 확인 버튼 공통 핸들러:
  // organizationId가 유효하면 해당 대여지 홈으로, 없으면 검색 페이지로 이동함
  const handleConfirmClick = () => {
    if (Number.isFinite(organizationId) && organizationId > 0) {
      navigate(`/client-home?organizationId=${organizationId}`);
      return;
    }
    navigate("/client-search");
  };

  return (
    <Layout>
      {/* 상단 헤더 영역: 브랜드 로고 + 뒤로가기(확인 버튼과 동일 동작) */}
      <Header
        pageIconSrc="/icons/retrivr_text_primary.svg"
        onBackClick={handleConfirmClick}
      ></Header>

      {/* 본문 안내 영역: 요청 완료 상태와 후속 안내 문구를 표시함 */}
      <div className="w-full flex flex-col items-center pt-50 ">
        {/* 완료 메시지 영역 : 리트리버 캐릭터 로고 & 안내 메시지 */}
        <img className="w-42" src="/icons/symbol.svg" alt="리트리버 로고" />

        {/* 텍스트 안내 영역: 완료 안내 메시지 + 승인/알림 안내 */}
        <div className="flex flex-col gap-2.25">
          <p className="text-16px text-center text-neutral-gray-1 align-stretch font-[600]">
            요청이 완료되었어요.
          </p>
          <div className="text-14px text-center text-primary">
            <p>승인/거절 여부는 관리자 확인 후</p>
            <p>카카오톡으로 전달해드릴게요!</p>
          </div>
        </div>
      </div>

      {/* 하단 액션 영역: 확인 클릭 시 원래 대여지 홈(또는 검색 페이지)으로 이동 */}
      <div className="flex justify-center mt-auto mb-12">
        <Button variant="primary" size="lg" onClick={handleConfirmClick}>
          확인
        </Button>
      </div>
    </Layout>
  );
};

export default RentalConfirmationPage;
