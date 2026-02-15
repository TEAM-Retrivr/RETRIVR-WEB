import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestPage from "./pages/TestPage";

function App() {
  return (
    <Router>
      {/* 전체 배경색을 주고(bg-gray-100), 
        콘텐츠는 중앙에 정렬(flex justify-center)합니다.
      */}
      <div className="min-h-screen bg-gray-100 flex justify-center">
        {/* 실제 앱 화면 영역:
          - 기본적으로 너비는 100%(w-full)
          - 데스크탑에서도 시안 너비인 402px 유지(max-w-[402px])
          - 배경은 흰색, 그림자로 입체감 부여
        */}
        <main className="w-full max-w-[402px] min-h-screen bg-white shadow-2xl overflow-x-hidden">
          <Routes>
            {/* 테스트 페이지 */}
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
