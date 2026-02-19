import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestPage from "./pages/TestPage";
import LoginPage from "./pages/admin/LoginPage";
import HomePage from "./pages/admin/HomePage";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 랜딩 페이지 */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Routes>
        {/* 랜딩 페이지 */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Routes>
        {/* 홈 페이지 */}
        <Route path="/home" element={<HomePage />} />
      </Routes>
      <Routes>
        {/* 테스트 페이지 */}
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
