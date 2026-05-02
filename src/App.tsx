import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import TestPage from "./pages/TestPage";
import { ModalTestPage } from "./pages/ModalTestPage";
import LoginPage from "./pages/admin/LoginPage";
import HomePage from "./pages/admin/HomePage";
import AccountPage from "./pages/admin/AccountPage";
import ProfileEditPage from "./pages/admin/ProfileEditPage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/admin/RegisterPage";
import TermsConsentPage from "./pages/TermsConsentPage";
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
import { GA_CONSENT_STORAGE_KEY, trackPageView } from "./lib/analytics";

const hasTermsConsent = () =>
  typeof window !== "undefined" &&
  localStorage.getItem(GA_CONSENT_STORAGE_KEY) === "true";

const isAuthenticated = () =>
  typeof window !== "undefined" && Boolean(localStorage.getItem("accessToken"));

const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
};

const TermsGate = () => {
  const location = useLocation();

  // 이미 로그인된 세션은 `/home` 등으로 진입할 때 `/terms`로 되돌리지 않음.
  if (hasTermsConsent() || isAuthenticated()) return <Outlet />;

  const nextPath = `${location.pathname}${location.search}`;
  const userType = location.pathname.startsWith("/client") ? "client" : "admin";
  const nextState = location.state;

  return (
    <Navigate
      to="/terms"
      replace
      state={{
        userType,
        nextPath,
        nextState,
      }}
    />
  );
};

const AuthGate = () => {
  const location = useLocation();

  if (isAuthenticated()) return <Outlet />;

  const nextPath = `${location.pathname}${location.search}`;
  return <Navigate to="/login" replace state={{ nextPath }} />;
};

function App() {
  return (
    <Router>
      <RouteChangeTracker />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/terms" element={<TermsConsentPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/modal-test" element={<ModalTestPage />} />
        <Route path="/client-search" element={<RenterSearchPage />} />
        <Route path="/client-home" element={<ClientHomePage />} />
        <Route
          path="/client-rental-confirmation"
          element={<RentalConfirmationPage />}
        />

        {/* Post-terms */}
        <Route element={<TermsGate />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/client-rental-information-submit"
            element={<RentalInformationSubmitPage />}
          />

          {/* Auth-required */}
          <Route element={<AuthGate />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/profile" element={<ProfileEditPage />} />
            <Route path="/item-manage" element={<ItemManagementPage />} />
            <Route path="/item-register" element={<ItemRegisterationPage />} />
            <Route path="/item-edit/:itemId" element={<ItemEditPage />} />
            <Route path="/return-manage" element={<ReturnManagementPage />} />
            <Route path="/return-check/:itemId" element={<ReturnCheckPage />} />
            <Route path="/rental-request" element={<RentalRequestPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
