type GuidePhonePreviewProps = {
  src: string;
  alt: string;
  className?: string;
};

export const GuidePhonePreview = ({
  src,
  alt,
  className,
}: GuidePhonePreviewProps) => (
  <div
    className={`relative mx-auto w-[min(100%,220px)] overflow-hidden rounded-[28px] border-[6px] border-neutral-white shadow-card ${className ?? ""}`}
  >
    <img
      src={src}
      alt={alt}
      width={368}
      height={800}
      className="block h-auto w-full"
    />
  </div>
);
