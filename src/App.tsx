import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestPage from "./pages/TestPage";
import HomePage from "./pages/admin/HomePage";

function App() {
  return (
    <Router>
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
