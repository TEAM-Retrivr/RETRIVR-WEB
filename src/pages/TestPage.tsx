import Button from "../components/Button";
import { MenuCard } from "../components/cards/home/MenuCard";
import { RentRequestCard } from "../components/cards/home/RentRequestCard";
import { HOME_MENUS } from "../types/menu";
import CommonInput from "../components/CommonInput";

const TestPage = () => {
  return (
    <div className="p-10 flex flex-col gap-5">
      <h1 className="text-xl font-bold">버튼 컴포넌트 테스트</h1>

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

      <h1 className="text-xl font-bold">홈화면 카드 컴포넌트 테스트</h1>
      <RentRequestCard
        itemName="8핀 충전기"
        count="(2/5)"
        applicant="조윤아 | 동물자원학과"
        time="2026-01-21 17:00"
      />
      <MenuCard menu={HOME_MENUS[0]} />

      <h1 className="text-xl font-bold">입력창 컴포넌트 테스트</h1>
      {/* 1. 일반 텍스트 입력 */}
      <CommonInput
        placeholder="이름을 입력하세요"
        isRequired={true} // 불리언은 중괄호 필수!
        type="text"
      />

      {/* 2. 비밀번호 입력 */}
      <CommonInput
        placeholder="비밀번호를 입력하세요"
        isRequired // 속성 이름만 쓰면 자동으로 true입니다.
        type="password"
      />

      {/* 3. 이메일 입력 */}
      <CommonInput placeholder="example@gmail.com" type="email" />
    </div>
  );
};

export default TestPage;
