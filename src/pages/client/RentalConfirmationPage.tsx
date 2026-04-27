import { useMemo, useState } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import { useNavigate, useSearchParams } from "react-router-dom";
import LongRentalApprovalModal from "../../components/modals/admin/rentalApprovalModal/LongRentalApprovalModal";
import AdminCodeInputModal from "../../components/modals/AdminCodeInputModal";
import { useRentalDetail } from "../../hooks/queries/useClientQueries";

const RentalConfirmationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isAdminCodeModalOpen, setIsAdminCodeModalOpen] = useState(false);
  const [isLongApprovalModalOpen, setIsLongApprovalModalOpen] = useState(false);
  const [approvalToken, setApprovalToken] = useState("");
  // 완료 페이지 URL 쿼리에서 organizationId를 읽어, 확인 시 원래 대여지 홈으로 복귀하는 데 사용함
  const organizationIdParam = searchParams.get("organizationId");
  const organizationId = organizationIdParam
    ? Number(organizationIdParam)
    : NaN;
  const rentalIdParam = searchParams.get("rentalId");
  const rentalId = rentalIdParam ? Number(rentalIdParam) : 0;

  // 상단 뒤로가기/하단 확인 버튼 공통 핸들러:
  // organizationId가 유효하면 해당 대여지 홈으로, 없으면 검색 페이지로 이동함
  const handleConfirmClick = () => {
    if (Number.isFinite(organizationId) && organizationId > 0) {
      navigate(`/client-home?organizationId=${organizationId}`);
      return;
    }
    navigate("/client-search");
  };

  const handleOpenAdminCodeModal = () => {
    setIsAdminCodeModalOpen(true);
  };

  const handleAdminCodeSuccess = (rowToken: string) => {
    setApprovalToken(rowToken);
    setIsAdminCodeModalOpen(false);
    setIsLongApprovalModalOpen(true);
  };

  const { data: rentalDetail } = useRentalDetail(
    rentalId,
    approvalToken,
    isLongApprovalModalOpen,
  );
  const requestTime = useMemo(() => {
    if (!rentalDetail?.requestedAt) return "";
    return rentalDetail.requestedAt.replace("T", " ").replace("Z", "");
  }, [rentalDetail?.requestedAt]);
  const applicantSummary = useMemo(() => {
    if (!rentalDetail?.borrowerField) return "대여자 정보";
    const values = Object.values(rentalDetail.borrowerField).filter(Boolean);
    return values.length > 0 ? values.join(" | ") : "대여자 정보";
  }, [rentalDetail?.borrowerField]);

  return (
    <Layout>
      {/* 상단 헤더 영역: 브랜드 로고 + 뒤로가기(확인 버튼과 동일 동작) */}
      <Header
        pageIconSrc="/icons/retrivr_text_primary.svg"
        onBackClick={handleConfirmClick}
      ></Header>

      {/* 본문 안내 영역: 요청 완료 상태와 후속 안내 문구를 표시함 */}
      <div className="w-full flex flex-col items-center pt-36.25 gap-10">
        <div className="flex flex-col gap-0.75">
          <p className="text-24px text-center text-primary font-bold">
            요청 승인 중
          </p>
          <p className="text-12px text-center text-neutral-gray-2 font-normal leading-[140%]">
            관리자 확인 후 카카오톡으로 전달해드릴게요!
          </p>
        </div>
        {/* 완료 메시지 영역 : 리트리버 캐릭터 로고 & 안내 메시지 */}
        <img className="w-42" src="/icons/symbol.svg" alt="리트리버 로고" />

        {/* 텍스트 안내 영역: 완료 안내 메시지 + 승인/알림 안내 */}
      </div>
      <div className="w-full flex justify-center pt-7.5">
        <button type="button" onClick={handleConfirmClick}>
          <div className="text-center text-14px text-neutral-gray-3 font-bold border-b">
            홈으로 돌아가기
          </div>
        </button>
      </div>
      {/* 하단 액션 영역: 확인 클릭 시 원래 대여지 홈(또는 검색 페이지)으로 이동 */}
      <div className="w-full mt-auto mb-12 flex flex-col items-center text-center text-12px text-secondary-2 font-normal leading-[140%] gap-5">
        <div className="w-84.5 border-t border-dashed border-secondary-5" />
        <div className="pt-2.5">
          <p>현장 이용 중이라면 홈으로 돌아가지 말고,</p>
          <p>관리자에게 화면을 보여주세요.</p>
        </div>

        <button
          className="w-84.5 h-16.5 text-center text-18px text-secondary-5 bg-secondary-4 font-bold border border-secondary-5 rounded-[14px]"
          onClick={handleOpenAdminCodeModal}
        >
          현장 승인 (관리자 전용)
        </button>
      </div>

      <AdminCodeInputModal
        isOpen={isAdminCodeModalOpen}
        onClose={() => setIsAdminCodeModalOpen(false)}
        onSuccess={handleAdminCodeSuccess}
      />

      <LongRentalApprovalModal
        isOpen={isLongApprovalModalOpen}
        onClose={() => setIsLongApprovalModalOpen(false)}
        rentalId={Number.isFinite(rentalId) && rentalId > 0 ? rentalId : 0}
        itemName={rentalDetail?.itemName ?? "대여 물품"}
        count={rentalDetail?.itemUnitLabel ? `(${rentalDetail.itemUnitLabel})` : "(1/1)"}
        applicant={applicantSummary}
        time={requestTime || "요청 시각 정보 없음"}
      />
    </Layout>
  );
};

export default RentalConfirmationPage;
