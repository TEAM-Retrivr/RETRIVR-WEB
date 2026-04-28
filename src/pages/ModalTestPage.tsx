import { useMemo, useState } from "react";
import Button from "../components/Button";
import ConfirmModal from "../components/modals/ConfirmModal";
import ErrorModal from "../components/modals/ErrorModal";
import QRCodeDisplay from "../components/qr/QRCodeDisplay";
import QRcodeModal from "../components/modals/admin/QRcodeModal";
import AdminCodeInputModal from "../components/modals/AdminCodeInputModal";

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
          <QRCodeDisplay value={`${publicWebOrigin}/client-home?organizationId=1`} />
          <div className="mt-4 flex justify-center">
            <Button variant="primary" size="lg" onClick={() => setIsQROpen(true)}>
              QRcodeModal 열기
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
    </div>
  );
};
