import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestPage from "./pages/TestPage";
import { ModalTestPage } from "./pages/ModalTestPage";
import LoginPage from "./pages/admin/LoginPage";
import HomePage from "./pages/admin/HomePage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/admin/RegisterPage";
import RentalRequestPage from "./pages/admin/RentalRequestPage";
import ItemManagementPage from "./pages/admin/ItemManagementPage";
import ItemRegisterationPage from "./pages/admin/ItemRegisterationPage";
import ReturnManagementPage from "./pages/admin/ReturnManagementPage";
import ClientHomePage from "./pages/client/ClientHomePage";
import RentalInformationSubmitPage from "./pages/client/RentalInformationSubmitPage";
import RenterSearchPage from "./pages/client/RenterSearchPage";
function App() {
  return (
    <Router>
      <Routes>
        {/* 랜딩 페이지 */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Routes>
        {/* 회원가입 페이지 */}
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Routes>
        {/* 관리자 홈 페이지 */}
        <Route path="/home" element={<HomePage />} />
      </Routes>
      <Routes>
        {/* 대여자 물품 관리 페이지 */}
        <Route path="/item-manage" element={<ItemManagementPage />} />
      </Routes>
      <Routes>
        {/* 대여자 물품 신규 등록 페이지 */}
        <Route path="/item-register" element={<ItemRegisterationPage />} />
      </Routes>
      <Routes>
        {/* 대여자 반납 관리 페이지 */}
        <Route path="/return-manage" element={<ReturnManagementPage />} />
      </Routes>
      <Routes>
        {/* 대여 요청 확인 페이지 */}
        <Route path="/rental-request" element={<RentalRequestPage />} />
      </Routes>
      <Routes>
        {/* 대여자 대여지 검색 페이지 */}
        <Route path="/client-search" element={<RenterSearchPage />} />
      </Routes>
      <Routes>
        {/* 대여자 홈 페이지 */}
        <Route path="/client-home" element={<ClientHomePage />} />
      </Routes>
      <Routes>
        {/* 대여자 대여 신청 페이지 */}
        <Route
          path="/client-rental-information-submit"
          element={<RentalInformationSubmitPage />}
        />
      </Routes>
      <Routes>
        {/* 테스트 페이지 */}
        <Route path="/test" element={<TestPage />} />
      </Routes>
      <Routes>
        {/* 테스트 페이지 */}
        <Route path="/modal-test" element={<ModalTestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
