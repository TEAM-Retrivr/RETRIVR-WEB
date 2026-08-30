import { useMemo, useState } from "react";
import Button from "../components/Button";
import ConfirmModal from "../components/modals/ConfirmModal";
import ErrorModal from "../components/modals/ErrorModal";
import QRCodeDisplay from "../components/qr/QRCodeDisplay";
import QRcodeModal from "../components/modals/admin/QRcodeModal";
import AdminCodeInputModal from "../components/modals/AdminCodeInputModal";
import { ShortRentalApprovalModal } from "../components/modals/admin/rentalApprovalModal/ShortRentalApprovalModal";
import LongRentalApprovalModal from "../components/modals/admin/rentalApprovalModal/LongRentalApprovalModal";
import ReturnApprovalModal from "../components/modals/admin/return/ReturnApprovalModal";
import WithdrawExitConfirmModal from "../components/modals/admin/account/WithdrawExitConfirmModal";
import WithdrawPasswordMismatchModal from "../components/modals/admin/account/WithdrawPasswordMismatchModal";
import WithdrawCompleteModal from "../components/modals/admin/account/WithdrawCompleteModal";

const PRODUCTION_WEB_ORIGIN = "https://www.retrivr.kr";
const PREVIEW_WEB_ORIGIN = "https://retrivr-web.vercel.app";

const getPublicWebOrigin = () => {
  if (typeof window === "undefined") return PREVIEW_WEB_ORIGIN;
  const { hostname } = window.location;
  if (hostname === "www.retrivr.kr" || hostname === "retrivr.kr") {
    return PRODUCTION_WEB_ORIGIN;
  }
  return PREVIEW_WEB_ORIGIN;
};

export const ModalTestPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isAdminCodeOpen, setIsAdminCodeOpen] = useState(false);
  const [isShortApprovalOpen, setIsShortApprovalOpen] = useState(false);
  const [isLongApprovalOpen, setIsLongApprovalOpen] = useState(false);
  const [isReturnApprovalOpen, setIsReturnApprovalOpen] = useState(false);
  const [isReturnOverdue, setIsReturnOverdue] = useState(true);
  const [isWithdrawExitOpen, setIsWithdrawExitOpen] = useState(false);
  const [isWithdrawPasswordMismatchOpen, setIsWithdrawPasswordMismatchOpen] =
    useState(false);
  const [isWithdrawCompleteOpen, setIsWithdrawCompleteOpen] = useState(false);
  const [modalType, setModalType] = useState<"confirm" | "error">("confirm");
  const [selectedKey, setSelectedKey] = useState<
    "noAuth" | "signupDone" | "approveDone" | "editDone"
  >("noAuth");
  const publicWebOrigin = getPublicWebOrigin();

  const preset = useMemo(() => {
    switch (selectedKey) {
      case "signupDone":
        return {
          title: "완료",
          message: "회원 가입이 완료되었어요.",
        };
      case "approveDone":
        return {
          title: "완료",
          message: "대여 요청 승인이 완료되었어요.",
        };
      case "editDone":
        return {
          title: "완료",
          message: "수정이 완료되었어요.",
        };
      case "noAuth":
      default:
        return {
          title: "안내",
          message: "로그인 정보가 없습니다.\n다시 확인해주세요.",
        };
    }
  }, [selectedKey]);

  return (
    <div className="p-10 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">컴포넌트 테스트 페이지</h1>

      <div className="w-full max-w-[520px] flex flex-col gap-3">
        <div className="rounded-[20px] border border-neutral-gray-5 p-5">
          <p className="mb-3 text-center text-16px font-[700] text-secondary-1">
            QR 컴포넌트 미리보기
          </p>
          <QRCodeDisplay
            value={`${publicWebOrigin}/client-home?organizationId=1`}
          />
          <div className="mt-4 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsQROpen(true)}
            >
              QRcodeModal 열기
            </Button>
          </div>
        </div>

        <div className="rounded-[20px] border border-neutral-gray-5 p-5">
          <p className="mb-3 text-center text-16px font-[700] text-secondary-1">
            요청 승인 모달 미리보기
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsShortApprovalOpen(true)}
            >
              Short 승인 모달
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsLongApprovalOpen(true)}
            >
              Long 승인 모달
            </Button>
          </div>
        </div>

        <div className="rounded-[20px] border border-neutral-gray-5 p-5">
          <p className="mb-3 text-center text-16px font-[700] text-secondary-1">
            회원 탈퇴 모달 미리보기
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsWithdrawExitOpen(true)}
            >
              탈퇴 종료 확인
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsWithdrawPasswordMismatchOpen(true)}
            >
              비밀번호 불일치
            </Button>
            <Button
              variant="gray"
              size="lg"
              onClick={() => setIsWithdrawCompleteOpen(true)}
            >
              탈퇴 완료
            </Button>
          </div>
        </div>

        <div className="rounded-[20px] border border-neutral-gray-5 p-5">
          <p className="mb-3 text-center text-16px font-[700] text-secondary-1">
            반납 승인 모달 미리보기
          </p>
          <div className="mb-3 flex justify-center gap-2">
            <Button
              variant={isReturnOverdue ? "primary" : "outline"}
              size="sm"
              onClick={() => setIsReturnOverdue(true)}
            >
              연체 중
            </Button>
            <Button
              variant={!isReturnOverdue ? "primary" : "outline"}
              size="sm"
              onClick={() => setIsReturnOverdue(false)}
            >
              대여 중
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsReturnApprovalOpen(true)}
            >
              반납 상세 모달 열기
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={selectedKey === "noAuth" ? "primary" : "outline"}
            size="sm"
            onClick={() => setSelectedKey("noAuth")}
          >
            로그인 정보 없음
          </Button>
          <Button
            variant={selectedKey === "signupDone" ? "primary" : "outline"}
            size="sm"
            onClick={() => setSelectedKey("signupDone")}
          >
            회원가입 완료
          </Button>
          <Button
            variant={selectedKey === "approveDone" ? "primary" : "outline"}
            size="sm"
            onClick={() => setSelectedKey("approveDone")}
          >
            승인 완료
          </Button>
          <Button
            variant={selectedKey === "editDone" ? "primary" : "outline"}
            size="sm"
            onClick={() => setSelectedKey("editDone")}
          >
            수정 완료
          </Button>
        </div>

        <div className="flex justify-center mt-2">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={modalType === "confirm" ? "primary" : "outline"}
              size="lg"
              onClick={() => setModalType("confirm")}
            >
              ConfirmModal
            </Button>
            <Button
              variant={modalType === "error" ? "primary" : "outline"}
              size="lg"
              onClick={() => setModalType("error")}
            >
              ErrorModal
            </Button>
            <Button variant="gray" size="lg" onClick={() => setIsOpen(true)}>
              열기
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsAdminCodeOpen(true)}
            >
              AdminCodeInputModal
            </Button>
          </div>
        </div>
      </div>

      {modalType === "confirm" ? (
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={preset.title}
          message={preset.message}
          confirmText={
            selectedKey === "signupDone" ? "로그인 하기" : "확인하기"
          }
        />
      ) : (
        <ErrorModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={preset.title}
          message1={preset.message}
          confirmText="확인하기"
        />
      )}

      <QRcodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        managerName="건국대학교 도서관자치위원회"
        rentalPageUrl={`${publicWebOrigin}/client-home?organizationId=1`}
      />
      <AdminCodeInputModal
        isOpen={isAdminCodeOpen}
        onClose={() => setIsAdminCodeOpen(false)}
        onSuccess={() => {
          setIsAdminCodeOpen(false);
        }}
        rentalId={1}
      />
      <ShortRentalApprovalModal
        isOpen={isShortApprovalOpen}
        onClose={() => setIsShortApprovalOpen(false)}
        rentalId={1}
        itemData={{
          name: "우산",
          borrower: "홍길동",
          duration: "3일",
          guaranteedGoods: "학생증",
        }}
      />
      <LongRentalApprovalModal
        isOpen={isLongApprovalOpen}
        onClose={() => setIsLongApprovalOpen(false)}
        rentalId={1}
        approvalApiMode="admin"
        itemName="c타입 충전기"
        count="(3/5)"
        itemUnitLabel="c타입 충전기(1)"
        applicant="이리버"
        contact="01033385583"
        time="2026-02-17 16:20:03"
        rentalDurationDays={3}
        guaranteedGoodsProp="신분증 or 학생증"
        requestNote="읽을읽을읽을읽을읽을읽을읽을읽을읽을읽을읽을읽을읽을읽을"
        expiresAt={new Date(
          Date.now() + 14 * 60 * 60 * 1000 + 49 * 60 * 1000,
        ).toISOString()}
        borrowerFields={{
          이름: "이리버",
          연락처: "01033385583",
          학과: "컴퓨터공학과",
          학번: "202312019",
        }}
      />
      <ReturnApprovalModal
        isOpen={isReturnApprovalOpen}
        onClose={() => setIsReturnApprovalOpen(false)}
        isOverdue={isReturnOverdue}
        itemName="c타입 충전기"
        itemUnitLabel="c타입 충전기(1)"
        borrowerName="이리버"
        borrowerPhone="01033385583"
        borrowerFields={{
          additionalProp1: "컴퓨터공학과",
          additionalProp2: "202312019",
        }}
        rentalDate="2026-01-19"
        expectedReturnDueDate="2026-01-23"
        requestNote="반납기한 연장 요청드립니다"
        approvalAdminName="조조슈"
        onEdit={() => {
          setIsReturnApprovalOpen(false);
          alert("수정하기 클릭됨");
        }}
        onSendOverdueMessage={() => {
          setIsReturnApprovalOpen(false);
          alert("연체 문자 전송 클릭됨");
        }}
        onConfirm={(adminName) => {
          alert(`반납 확정: ${adminName}`);
          setIsReturnApprovalOpen(false);
        }}
      />
      <WithdrawExitConfirmModal
        isOpen={isWithdrawExitOpen}
        onClose={() => setIsWithdrawExitOpen(false)}
        onConfirmExit={() => setIsWithdrawExitOpen(false)}
      />
      <WithdrawPasswordMismatchModal
        isOpen={isWithdrawPasswordMismatchOpen}
        onClose={() => setIsWithdrawPasswordMismatchOpen(false)}
      />
      <WithdrawCompleteModal
        isOpen={isWithdrawCompleteOpen}
        onClose={() => setIsWithdrawCompleteOpen(false)}
      />
    </div>
  );
};
