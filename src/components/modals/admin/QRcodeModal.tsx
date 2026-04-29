import { useEffect, useRef, useState } from "react";
import { Modal } from "../../Modal";
import QRCodeDisplay from "../../qr/QRCodeDisplay";

interface QRcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  managerName: string;
  rentalPageUrl: string;
}

const QRcodeModal = ({
  isOpen,
  onClose,
  managerName,
  rentalPageUrl,
}: QRcodeModalProps) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const copyToastTimerRef = useRef<number | null>(null);
  const [isCopyToastOpen, setIsCopyToastOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (copyToastTimerRef.current) {
        window.clearTimeout(copyToastTimerRef.current);
      }
    };
  }, []);

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
          <h1>${managerName}</h1>
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
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rentalPageUrl);
      setIsCopyToastOpen(true);

      if (copyToastTimerRef.current) {
        window.clearTimeout(copyToastTimerRef.current);
      }

      copyToastTimerRef.current = window.setTimeout(() => {
        setIsCopyToastOpen(false);
      }, 1300);
    } catch (error) {
      console.error("URL 복사 실패:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showTitle={false}
      showCloseButton={false}
      modalClassName="h-131.75"
    >
      <div className="relative flex flex-col items-center gap-6.5 px-3 font-[Pretendard]">
        <img
          src="/icons/client/qr/retrivr.svg"
          alt="Retrivr 로고"
          className="w-21.5 h-7.5"
        />

        <QRCodeDisplay
          value={rentalPageUrl}
          size={200}
          mode="canvas"
          canvasRef={qrCanvasRef}
          className="w-50 h-50"
          centerLogoSrc="/icons/symbol.svg"
          centerLogoSize={24}
        />

        <div className="flex flex-col items-center gap-1">
          <p className="text-center text-32px font-[700] text-[#6FA5EE]">
            {managerName || "대여 관리자"}
          </p>
          <p className="text-center text-12px text-secondary-1 font-normal leading-[130%]">
            대여자에게 QR을 공유하세요
          </p>
        </div>

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
            className="shrink-0 cursor-pointer "
          >
            <img src="/icons/client/qr/copy-link.svg" alt="링크 복사하기" />
          </button>
        </div>

        <div className="flex w-full justify-between items-center pt-2 gap-1.5">
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
            <img src="/icons/client/qr/download.svg" className="" />
            사진 다운로드
          </button>
        </div>

        {isCopyToastOpen && (
          <div className="absolute inset-0 z-20 ">
            <div className="flex w-full h-10 items-center justify-center rounded-[26px] bg-neutral-white">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/modal-check.svg"
                  alt="복사 완료"
                  className="h-8.5 w-7"
                />
                <p className="text-20px font-[Pretendard] font-[600] text-neutral-gray-1 leading-[140%]">
                  복사되었어요
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QRcodeModal;
