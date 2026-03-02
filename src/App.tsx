import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestPage from "./pages/TestPage";
import LoginPage from "./pages/admin/LoginPage";
import HomePage from "./pages/admin/HomePage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/admin/RegisterPage";
import RentalRequestPage from "./pages/admin/RentalRequestPage";
import ClientHomePage from "./pages/client/ClientHomePage";

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
        {/* 대여 요청 확인 페이지 */}
        <Route path="/rental-request" element={<RentalRequestPage />} />
      </Routes>
      <Routes>
        {/* 대여자 홈 페이지 */}
        <Route path="/client-home" element={<ClientHomePage />} />
      </Routes>
      <Routes>
        {/* 테스트 페이지 */}
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
