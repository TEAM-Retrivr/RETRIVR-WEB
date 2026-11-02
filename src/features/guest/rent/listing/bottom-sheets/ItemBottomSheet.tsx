import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Body,
  Dialog,
  Handle,
  enter,
  exit,
  SHEET_ANIMATION_MS,
} from "./ItemBottomSheet.styles";

import {
  ItemBottomSheetCloseContext,
  type RequestClose,
} from "./ItemBottomSheet.context";
type Props = {
  label: string;
  onClose: () => void;
  children: ReactNode;
};

const ItemBottomSheet = ({ label, onClose, children }: Props) => {
  const ref = useRef<HTMLDialogElement>(null);
  const closingRef = useRef(false);
  const finishedRef = useRef(false);
  const afterCloseRef = useRef<(() => void) | undefined>(undefined);
  const openingTimer = useRef(0);
  const closingTimer = useRef(0);
  const [ready, setReady] = useState(false);
  const [closing, setClosing] = useState(false);
  const [openingHeight, setOpeningHeight] = useState<number | null>(null);
  const [exitStartTransform, setExitStartTransform] = useState("translateY(0)");

  const finishClose = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    window.clearTimeout(closingTimer.current);
    onClose();
    afterCloseRef.current?.();
  }, [onClose]);

  const requestClose = useCallback<RequestClose>(
    (afterClose) => {
      if (closingRef.current) return;
      closingRef.current = true;
      afterCloseRef.current = afterClose;
      window.clearTimeout(openingTimer.current);
      const dialog = ref.current;
      if (
        !dialog ||
        !ready ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        finishClose();
        return;
      }
      setOpeningHeight(dialog.getBoundingClientRect().height);
      setExitStartTransform(window.getComputedStyle(dialog).transform);
      setClosing(true);
      // animationend가 발생하지 않는 환경에서도 모달이 남지 않도록 한다.
      closingTimer.current = window.setTimeout(
        finishClose,
        SHEET_ANIMATION_MS + 80,
      );
    },
    [finishClose, ready],
  );

  useLayoutEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    if (!dialog) return;
    let disposed = false;
    let frame = 0;
    if (!dialog.open) dialog.showModal();
    const prepare = () => {
      if (disposed || closingRef.current) return;
      setOpeningHeight(dialog.getBoundingClientRect().height);
      frame = window.requestAnimationFrame(() => {
        if (disposed || closingRef.current) return;
        setReady(true);
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setOpeningHeight(null);
        } else {
          openingTimer.current = window.setTimeout(
            () => setOpeningHeight(null),
            SHEET_ANIMATION_MS + 80,
          );
        }
      });
    };
    if (document.fonts) void document.fonts.ready.then(prepare, prepare);
    else prepare();
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(openingTimer.current);
      window.clearTimeout(closingTimer.current);
      dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <Dialog
      ref={ref}
      data-ready={ready}
      data-closing={closing}
      $openingHeight={openingHeight}
      $exitStartTransform={exitStartTransform}
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.animationName === exit.name) finishClose();
        else if (event.animationName === enter.name && !closingRef.current)
          setOpeningHeight(null);
      }}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          requestClose();
      }}
    >
      <Handle
        type="button"
        disabled={closing}
        onClick={() => requestClose()}
        aria-label="물품 정보 닫기"
      />
      <ItemBottomSheetCloseContext.Provider value={requestClose}>
        <Body inert={closing}>{children}</Body>
      </ItemBottomSheetCloseContext.Provider>
    </Dialog>
  );
};
export default ItemBottomSheet;
