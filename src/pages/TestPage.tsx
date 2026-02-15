import Button from "../components/Button";
// import Input from '../components/Input';

const TestPage = () => {
  return (
    <div className="p-10 flex flex-col gap-5">
      <h1 className="text-xl font-bold">컴포넌트 테스트</h1>

      {/* 1. 기본 버튼 확인 */}
      <Button variant="primary" size="small">
        확인하기
      </Button>
      <Button variant="outline" size="small">
        확인하기
      </Button>

      {/* 2. 중간 버튼 확인 */}
      <Button variant="primary" size="medium">
        승인
      </Button>
      <Button variant="outline" size="medium">
        거부
      </Button>

      {/* 3. 큰 버튼 확인 */}
      <Button variant="primary" size="large">
        로그인
      </Button>
      <Button variant="outline" size="large">
        회원가입
      </Button>
    </div>
  );
};

export default TestPage;
