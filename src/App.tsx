import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import TestPage from "./pages/TestPage";
import { ModalTestPage } from "./pages/ModalTestPage";
import LoginPage from "./pages/admin/LoginPage";
import HomePage from "./pages/admin/HomePage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/admin/RegisterPage";
import RentalRequestPage from "./pages/admin/RentalRequestPage";
import ItemManagementPage from "./pages/admin/ItemManagementPage";
import ItemRegisterationPage from "./pages/admin/ItemRegisterationPage";
import ItemEditPage from "./pages/admin/ItemEditPage";
import ReturnManagementPage from "./pages/admin/ReturnManagementPage";
import ReturnCheckPage from "./pages/admin/return/ReturnCheckPage";
import ClientHomePage from "./pages/client/ClientHomePage";
import RentalInformationSubmitPage from "./pages/client/RentalInformationSubmitPage";
import RenterSearchPage from "./pages/client/RenterSearchPage";
import RentalConfirmationPage from "./pages/client/RentalConfirmationPage";

// Google Analytics 측정 ID (Vercel 환경변수: VITE_GA_ID)
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID as string | undefined;

const GAEventTracker = () => {
  const location = useLocation();

  // 앱 최초 진입 시 gtag 스크립트/초기화 1회 수행
  useEffect(() => {
    // ID가 기본값이면 추적 비활성화
    if (!GA_MEASUREMENT_ID?.trim()) return;

    // 중복 삽입 방지: 이미 로딩된 스크립트가 있으면 건너뜀
    const existingScript = document.querySelector(
      `script[src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`,
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }

    // gtag 초기화 (dataLayer/gtag 함수 등록)
    const w = window as typeof window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };

    w.dataLayer = w.dataLayer || [];
    if (!w.gtag) {
      w.gtag = (...args: unknown[]) => {
        w.dataLayer?.push(args);
      };
    }

    w.gtag("js", new Date());
    // SPA에서는 라우트 변경마다 별도 전송할 것이므로 초기 자동 page_view는 비활성화
    w.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
  }, []);

  // 라우트 변경 시 page_view 전송
  useEffect(() => {
    if (!GA_MEASUREMENT_ID?.trim()) return;

    const w = window as typeof window & {
      gtag?: (...args: unknown[]) => void;
    };
    if (!w.gtag) return;

    w.gtag("config", GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <GAEventTracker />
      <Routes>
        {/* 랜딩 페이지 */}
        <Route path="/" element={<LandingPage />} />

        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 회원가입 페이지 */}
        <Route path="/register" element={<RegisterPage />} />

        {/* 관리자 홈 페이지 */}
        <Route path="/home" element={<HomePage />} />

        {/* 대여자 물품 관리 페이지 */}
        <Route path="/item-manage" element={<ItemManagementPage />} />

        {/* 대여자 물품 신규 등록 페이지 */}
        <Route path="/item-register" element={<ItemRegisterationPage />} />

        {/* 대여자 물품 수정 페이지 */}
        <Route path="/item-edit/:itemId" element={<ItemEditPage />} />

        {/* 대여자 반납 관리 페이지 */}
        <Route path="/return-manage" element={<ReturnManagementPage />} />

        {/* 대여자 물품별 관리 페이지 */}
        <Route path="/return-check/:itemId" element={<ReturnCheckPage />} />

        {/* 대여 요청 확인 페이지 */}
        <Route path="/rental-request" element={<RentalRequestPage />} />

        {/* 대여자 대여지 검색 페이지 */}
        <Route path="/client-search" element={<RenterSearchPage />} />

        {/* 대여자 홈 페이지 */}
        <Route path="/client-home" element={<ClientHomePage />} />

        {/* 대여자 대여 신청 페이지 */}
        <Route
          path="/client-rental-information-submit"
          element={<RentalInformationSubmitPage />}
        />
        {/* 대여요청 완료 페이지 */}
        <Route
          path="/client-rental-confirmation"
          element={<RentalConfirmationPage />}
        />
        {/* 테스트 페이지 */}
        <Route path="/test" element={<TestPage />} />

        {/* 테스트 페이지 */}
        <Route path="/modal-test" element={<ModalTestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
