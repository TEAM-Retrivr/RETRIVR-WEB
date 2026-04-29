import { useMemo, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import ConfirmModal from "../../components/modals/ConfirmModal";
import QRCodeDisplay from "../../components/qr/QRCodeDisplay";
import { useAdminProfile } from "../../hooks/queries/useAuthQueries";

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

const AccountPage = () => {
  const { data } = useAdminProfile();
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [confirmModalMessage, setConfirmModalMessage] = useState<string | null>(
    null,
  );
  const organizationId =
    typeof window === "undefined"
      ? null
      : Number(localStorage.getItem("orgId") ?? "");

  const userProfile = {
    organizationId: data?.organizationId,
    organizationName: data?.organizationName,
    profileImageUrl: data?.profileImageUrl ?? "/icons/profile-default-icon.svg",
    email: data?.email,
  };

  const rentalPageUrl = useMemo(() => {
    const publicWebOrigin = getPublicWebOrigin();
    if (!Number.isFinite(organizationId) || (organizationId ?? 0) <= 0) {
      return `${publicWebOrigin}/client-search`;
    }
    return `${publicWebOrigin}/client-home?organizationId=${encodeURIComponent(
      String(userProfile.organizationId),
    )}`;
  }, [organizationId]);

  const getQRDataUrl = () => qrCanvasRef.current?.toDataURL("image/png");

  const handlePrint = () => {
    const qrDataUrl = getQRDataUrl();
    if (!qrDataUrl) return;

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    printFrame.setAttribute("aria-hidden", "true");

    printFrame.srcdoc = `
      <html>
        <head>
          <title>대여 QR 코드</title>
          <style>
            body { font-family: Pretendard, sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; }
            img { width: 260px; height: 260px; }
            h1 { margin: 16px 0 8px; font-size: 20px; color: #5B8FDF; }
            p { margin: 0; color: #5A6272; font-size: 14px; word-break: break-all; text-align: center; }
          </style>
        </head>
        <body>
          <img src="${qrDataUrl}" alt="대여 QR 코드" />
          <h1>${userProfile.organizationName ?? "대여 관리자"}</h1>
          <p>${rentalPageUrl}</p>
        </body>
      </html>
    `;

    printFrame.onload = () => {
      const frameWindow = printFrame.contentWindow;
      if (!frameWindow) return;

      frameWindow.focus();
      frameWindow.print();

      window.setTimeout(() => {
        if (printFrame.parentNode) {
          printFrame.parentNode.removeChild(printFrame);
        }
      }, 500);
    };

    document.body.appendChild(printFrame);
  };

  const handleDownload = () => {
    const qrDataUrl = getQRDataUrl();
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "retrivr-rental-qr.png";
    link.click();
    setConfirmModalMessage("사진이 다운로드되었어요");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rentalPageUrl);
      setConfirmModalMessage("URL이 복사되었어요");
    } catch (error) {
      console.error("URL 복사 실패:", error);
    }
  };

  return (
    <Layout>
      <Header pageName="계정 관리" backTo="/home" />
      <div className="w-full font-[Pretendard] text-neutral-gray-1 px-7.75">
        {/* 프로필 영역 - 프로필 사진, 대여지명, 이메일, 개인정보 수정하기 버튼 */}
        <div className="flex flex-col items-center pt-11.5 gap-3.5">
          <div className="relative flex items-center justify-center w-25 h-25 rounded-[50%] shadow-account-profile">
            <img
              className="object-cover"
              src={userProfile.profileImageUrl}
              alt="프로필 이미지"
            />
            <button
              type="button"
              onClick={() => alert("개발 예정입니다.")}
              className="absolute right-0 bottom-0 flex items-center bg-neutral-white justify-center w-7 h-7 rounded-[50%] shadow-camera cursor-pointer"
            >
              <img src="/icons/camera.svg" alt="프로필 이미지 변경하기" />
            </button>
          </div>
          <div className="flex flex-col mt-1.5">
            <p className="text-center text-16px font-bold">
              {userProfile.organizationName}
            </p>
            <p className="text-center text-12px font-normal leading-[140%]">
              {userProfile.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert("개발 예정입니다.")}
            className="w-45 h-9.75 border border-primary shadow-primary rounded-[23.164px] hover:bg-bg-pale cursor-pointer"
          >
            <p className="text-center text-14px text-primary font-bold">
              개인정보 수정하기
            </p>
          </button>
        </div>
        {/* 카드 영역 */}
        <div className="flex flex-col items-center pt-11.5 pb-27.5 gap-6">
          {/* QR 코드 */}
          <div className="relative flex w-full flex-col items-center gap-4 rounded-[33px] bg-neutral-white p-7 shadow-16-gray font-[Pretendard]">
            <div className="w-full pb-1">
              <p className="text-start text-18px font-bold">QR 코드</p>
              <p className="text-start text-10px font-normal leading-[130%]">
                대여자가 대여 물품을 확인할 수 있어요
              </p>
            </div>
            <QRCodeDisplay
              value={rentalPageUrl}
              size={160}
              mode="canvas"
              canvasRef={qrCanvasRef}
              className="w-40 h-40"
              centerLogoSrc="/icons/symbol.svg"
              centerLogoSize={24}
            />

            <div className="flex w-full items-center justify-between gap-2 rounded-[14px] bg-[#F6F8FB] px-4 py-3">
              <p className="w-full truncate font-normal text-14px text-neutral-gray-3 leading-[140%]">
                <span className="font-bold text-14px text-neutral-gray-2 leading-normal">
                  URL:
                </span>{" "}
                {rentalPageUrl}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 cursor-pointer"
              >
                <img src="/icons/client/qr/copy-link.svg" alt="링크 복사하기" />
              </button>
            </div>

            <div className="flex w-full items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={handlePrint}
                className="flex h-9.5 w-33.75 items-center justify-center gap-1 rounded-[6px] bg-neutral-gray-4 text-14px font-[700] text-neutral-white cursor-pointer"
              >
                <img src="/icons/client/qr/print.svg" alt="" />
                프린트 하기
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex h-9.5 w-33.75 items-center justify-center gap-1 rounded-[6px] bg-primary text-14px font-[700] text-neutral-white cursor-pointer"
              >
                <img src="/icons/client/qr/download.svg" alt="" />
                사진 다운로드
              </button>
            </div>
          </div>
          {/* 이용약관, 개인정보 처리 방침 */}
          <div className="flex flex-col w-full h-26.5 text-14px font-bold shadow-16-gray rounded-2xl">
            <button
              type="button"
              onClick={() => alert("개발 예정입니다.")}
              className="flex items-center justify-between h-13.25 px-7.5 rounded-t-2xl cursor-pointer hover:bg-neutral-gray-4/50"
            >
              <p className="text-start">이용약관</p>
              <img src="/icons/right-arrow2.svg" alt="" />
            </button>
            <p className="mx-2.5 border border-neutral-gray-4 opacity-[0.3]"></p>
            <button
              type="button"
              onClick={() => alert("개발 예정입니다.")}
              className="flex items-center justify-between h-13.25 px-7.5 rounded-b-2xl cursor-pointer hover:bg-neutral-gray-4/50"
            >
              <p className="text-start">개인정보 처리방침</p>
              <img src="/icons/right-arrow2.svg" alt="" />
            </button>
          </div>
          {/* 로그아웃, 탈퇴하기 */}
          <div className="flex flex-col w-full h-26.5 text-14px font-bold shadow-16-gray rounded-2xl">
            <button
              type="button"
              onClick={() => alert("개발 예정입니다.")}
              className="h-13.25 px-7.5 rounded-t-2xl cursor-pointer hover:bg-neutral-gray-4/50"
            >
              <p className="text-start">로그아웃</p>
            </button>
            <p className="mx-2.5 border border-neutral-gray-4 opacity-[0.3]"></p>
            <button
              type="button"
              onClick={() => alert("개발 예정입니다.")}
              className="h-13.25 px-7.5 rounded-b-2xl cursor-pointer hover:bg-neutral-gray-4/50"
            >
              <p className="text-start">탈퇴하기</p>
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={confirmModalMessage !== null}
        onClose={() => setConfirmModalMessage(null)}
        message={confirmModalMessage ?? ""}
        confirmText="확인"
      />
    </Layout>
  );
};

export default AccountPage;
