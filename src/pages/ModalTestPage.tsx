// import { useState } from "react";
// import { ShortRentalApprovalModal } from "../components/modals/admin/rentalApprovalModal/ShortRentalApprovalModal";

export const ModalTestPage = () => {
  // 1. 모달의 상태 관리 (초기값은 닫힘: false)
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // 테스트용 더미 데이터
  // const testItem = {
  //   name: "c타입 충전기",
  //   borrower: "202112345 조한형",
  //   duration: "3일",
  // };

  return (
    <div className="p-10 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">컴포넌트 테스트 페이지</h1>

      {/* 2. 클릭 시 모달을 여는 테스트 버튼 */}
      {/* <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
      >
        승인 모달 열기
      </button> */}

      {/* 3. 모달 컴포넌트 배치 */}
      {/* <ShortRentalApprovalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemData={testItem}
      /> */}
    </div>
  );
};
