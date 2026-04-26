import type { RefObject } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  mode?: "svg" | "canvas";
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  centerLogoSrc?: string;
  centerLogoSize?: number;
}

const QRCodeDisplay = ({
  value,
  size = 200,
  className = "",
  mode = "svg",
  canvasRef,
  centerLogoSrc,
  centerLogoSize = 28,
}: QRCodeDisplayProps) => {
  if (!value) {
    return (
      <div
        className={`flex h-[220px] w-full items-center justify-center rounded-[20px] bg-neutral-gray-5 px-4 text-center text-14px text-neutral-gray-3 ${className}`}
      >
        생성할 QR 정보가 없습니다.
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-[20px] bg-neutral-white shadow-item-card ${className}`}
    >
      {mode === "canvas" ? (
        <QRCodeCanvas
          value={value}
          size={size}
          includeMargin
          bgColor="#FFFFFF"
          fgColor="#1A1A1A"
          ref={canvasRef}
          imageSettings={
            centerLogoSrc
              ? {
                  src: centerLogoSrc,
                  width: centerLogoSize,
                  height: centerLogoSize,
                  excavate: true,
                }
              : undefined
          }
        />
      ) : (
        <QRCodeSVG
          value={value}
          size={size}
          includeMargin
          bgColor="#FFFFFF"
          fgColor="#1A1A1A"
          imageSettings={
            centerLogoSrc
              ? {
                  src: centerLogoSrc,
                  width: centerLogoSize,
                  height: centerLogoSize,
                  excavate: true,
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default QRCodeDisplay;
