import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const ANIMATION_MS = 420;
/** 주소창 등 작은 뷰포트 변화는 키보드로 보지 않음 */
const KEYBOARD_THRESHOLD_PX = 80;

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  /** 시트 패널 커스텀 클래스 */
  sheetClassName?: string;
  /** 배경 클릭 시 닫기 (기본 true) */
  closeOnOverlayClick?: boolean;
  /** 우측 상단 닫기 버튼 표시 (기본 true) */
  showCloseButton?: boolean;
};

const isTouchEnvironment = () => {
  if (typeof window === "undefined") return false;
  return navigator.maxTouchPoints > 0 || "ontouchstart" in window;
};

const isTextField = (target: EventTarget | null) =>
  target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

const getKeyboardOffset = () => {
  const visualViewport = window.visualViewport;
  if (!visualViewport) return 0;

  const covered = Math.max(
    0,
    window.innerHeight - visualViewport.height - visualViewport.offsetTop,
  );
  return covered > KEYBOARD_THRESHOLD_PX ? covered : 0;
};

/**
 * 화면 하단에서 올라오는 공통 바텀시트.
 * 이메일 변경, 비밀번호 인증 등 다양한 콘텐츠를 children으로 조합해 사용한다.
 */
const BottomSheet = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  sheetClassName = "",
  closeOnOverlayClick = true,
  showCloseButton = true,
}: BottomSheetProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [hasInputFocus, setHasInputFocus] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const frameId = window.requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    setIsVisible(false);
    setKeyboardOffset(0);
    setHasInputFocus(false);
    const timerId = window.setTimeout(() => {
      setShouldRender(false);
    }, ANIMATION_MS);
    return () => window.clearTimeout(timerId);
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;

    const sheet = sheetRef.current;
    if (!sheet) return;

    const handleFocusIn = (event: FocusEvent) => {
      if (!isTextField(event.target)) return;

      setHasInputFocus(true);

      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      window.setTimeout(() => {
        target.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }, 100);
    };

    const handleFocusOut = (event: FocusEvent) => {
      if (!isTextField(event.target)) return;

      // 시트 안 다른 입력으로 포커스가 이동하는 경우는 유지
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && sheet.contains(nextTarget)) {
        return;
      }
      setHasInputFocus(false);
      setKeyboardOffset(0);
    };

    sheet.addEventListener("focusin", handleFocusIn);
    sheet.addEventListener("focusout", handleFocusOut);
    return () => {
      sheet.removeEventListener("focusin", handleFocusIn);
      sheet.removeEventListener("focusout", handleFocusOut);
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender || !isVisible) return;
    if (!isTouchEnvironment() || !hasInputFocus) {
      setKeyboardOffset(0);
      return;
    }

    const updateKeyboardOffset = () => {
      if (!isTouchEnvironment() || !hasInputFocus) {
        setKeyboardOffset(0);
        return;
      }
      setKeyboardOffset(getKeyboardOffset());
    };

    updateKeyboardOffset();

    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", updateKeyboardOffset);
    visualViewport?.addEventListener("scroll", updateKeyboardOffset);
    window.addEventListener("resize", updateKeyboardOffset);

    return () => {
      visualViewport?.removeEventListener("resize", updateKeyboardOffset);
      visualViewport?.removeEventListener("scroll", updateKeyboardOffset);
      window.removeEventListener("resize", updateKeyboardOffset);
    };
  }, [shouldRender, isVisible, hasInputFocus]);

  if (!shouldRender) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const maxHeight =
    keyboardOffset > 0
      ? `calc(100dvh - ${keyboardOffset}px)`
      : "100dvh";

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-end justify-center">
      <div
        className={`absolute inset-0 bg-[#919191] transition-opacity duration-420 ${
          isVisible ? "opacity-[0.38]" : "opacity-0"
        }`}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          marginBottom: keyboardOffset,
          maxHeight,
        }}
        className={`relative z-[1000] flex w-full max-w-[402px] flex-col overflow-hidden rounded-t-[24px] bg-neutral-white shadow-card transition-[margin-bottom,max-height] duration-200 ease-out ${
          isVisible
            ? "animate-bottom-sheet-up"
            : isOpen
              ? "translate-y-full"
              : "animate-bottom-sheet-down"
        } ${sheetClassName}`}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-[22px] z-[1] flex size-3 cursor-pointer items-center justify-center"
            aria-label="닫기"
          >
            <img src="/icons/X.svg" alt="" className="size-3" />
          </button>
        )}

        {(title || description) && (
          <div className="flex shrink-0 flex-col items-center gap-1 px-8 pt-9 font-[Pretendard]">
            {title && (
              <p className="text-center text-20px font-semibold leading-[140%] text-secondary-1">
                {title}
              </p>
            )}
            {description && (
              <div className="text-center text-12px font-normal leading-[130%] text-primary">
                {description}
              </div>
            )}
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-8 pt-9 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>,
    modalRoot,
  );
};

export default BottomSheet;
