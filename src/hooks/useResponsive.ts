import { useMediaQuery } from "react-responsive";
import { BREAKPOINTS } from "../constants/breakpoints";

/* 화면 크기 변화를 감지하여 현재 디바이스 상태를 반환하는 훅 */
export const useResponsive = () => {
  // 1. 모바일: 0px ~ 태블릿 기준점 미만
  const isMobile = useMediaQuery({
    query: `(max-width: ${BREAKPOINTS.TABLET - 1}px)`,
  });

  // 2. 태블릿: 태블릿 기준점 이상 ~ 데스크탑 기준점 미만
  const isTablet = useMediaQuery({
    query: `(min-width: ${BREAKPOINTS.TABLET}px) and (max-width: ${BREAKPOINTS.DESKTOP - 1}px)`,
  });

  // 3. 데스크탑: 데스크탑 기준점 이상
  const isDesktop = useMediaQuery({
    query: `(min-width: ${BREAKPOINTS.DESKTOP}px)`,
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};
