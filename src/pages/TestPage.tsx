import { useRef, useState, type TouchEvent } from "react";
import Button from "../components/Button";
import { MenuCard } from "../components/cards/home/MenuCard";
import { RentRequestCard } from "../components/cards/home/RentRequestCard";
import { HOME_MENUS } from "../types/menu";
import CommonInput from "../components/CommonInput";
import RentalStatusToggle from "../components/RentalStatusToggle";
import RentalConfirmCard from "../components/cards/RentalConfirmCard";
import type { RentalRequest } from "../types/rental";
const TestPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartYRef = useRef<number | null>(null);
  const touchCurrentYRef = useRef<number | null>(null);

  const SWIPE_THRESHOLD = 40; // 스와이프 최소 거리(px)

  const requests = Array.from({ length: 5 }).map((_, index) => ({
    itemName: "8핀 충전기",
    count: "(2/5)",
    applicant: "조윤아 | 동물자원학과",
    time: `2026-01-21 17:0${index}`,
  }));

  const CARD_BLOCK_HEIGHT = 120; // 카드 한 장 + 간격 높이(px)

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touchY = e.touches[0]?.clientY ?? 0;
    touchStartYRef.current = touchY;
    touchCurrentYRef.current = touchY;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) return;
    touchCurrentYRef.current = e.touches[0]?.clientY ?? 0;
  };

  const handleTouchEnd = () => {
    if (touchStartYRef.current === null || touchCurrentYRef.current === null) {
      touchStartYRef.current = null;
      touchCurrentYRef.current = null;
      return;
    }

    const diffY = touchCurrentYRef.current - touchStartYRef.current;

    if (Math.abs(diffY) > SWIPE_THRESHOLD) {
      if (diffY < 0 && currentIndex < requests.length - 1) {
        // 위로 스와이프 -> 다음 카드
        setCurrentIndex((prev) => Math.min(prev + 1, requests.length - 1));
      } else if (diffY > 0 && currentIndex > 0) {
        // 아래로 스와이프 -> 이전 카드
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }

    touchStartYRef.current = null;
    touchCurrentYRef.current = null;
  };

  const sampleRental: RentalRequest = {
    requestedAt: "2026-01-21 17:00",
    itemName: "c타입 충전기",
    itemId: "c타입 충전기 (1)",
    itemCount: "(2/5)",
    applicantInfo: {
      name: "조윤아",
      major: "동물자원학과",
      id: "202312690",
    },
  };

  return (
    <div className="p-10 flex flex-col gap-5">
      <h1 className="text-xl font-bold">대여 확인 컴포넌트 테스트</h1>
      <RentalConfirmCard rental={sampleRental}></RentalConfirmCard>
      <h1 className="text-xl font-bold">버튼 컴포넌트 테스트</h1>
      {/* 1. 기본 버튼 확인 */}
      <Button variant="primary" size="sm">
        확인하기
      </Button>
      <Button variant="outline" size="sm">
        확인하기
      </Button>
      {/* 2. 중간 버튼 확인 */}
      <Button variant="primary" size="md">
        승인
      </Button>
      <Button variant="gray" size="md">
        거부
      </Button>
      <Button variant="outline" size="md">
        거부
      </Button>
      {/* 3. 큰 버튼 확인 */}
      <Button variant="primary" size="lg">
        하단 버튼 블루
      </Button>
      <Button variant="gray" size="lg">
        하단 버튼 회색
      </Button>
      <Button variant="outline" size="lg">
        하단 버튼 라인 블루
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
      <h1 className="text-xl font-bold">토글 컴포넌트 테스트</h1>
      <RentalStatusToggle />

      <h1 className="text-xl font-bold">캐러셀 카드 테스트</h1>
      <div className="flex justify-center">
        {/* 프레임 영역 (기기 틀 느낌) */}
        <div className="relative w-full max-w-[360px] rounded-[32px] bg-neutral-white shadow-md border border-neutral-gray-2/30 px-4 py-6">
          {/* 실제 캐러셀 영역 */}
          <div
            className="h-[360px] overflow-hidden pr-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex flex-col transition-transform duration-500 ease-out"
              style={{
                transform: `translateY(-${currentIndex * CARD_BLOCK_HEIGHT}px)`,
              }}
            >
              {requests.map((req, index) => (
                <div
                  key={index}
                  className="flex justify-center mb-4"
                  style={{ height: CARD_BLOCK_HEIGHT }}
                >
                  <div className="flex items-center justify-center w-full">
                    <RentRequestCard
                      itemName={req.itemName}
                      count={req.count}
                      applicant={req.applicant}
                      time={req.time}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 페이지 인디케이터 (오른쪽 점) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {requests.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full border border-neutral-gray-3 transition-colors ${
                  currentIndex === index
                    ? "bg-neutral-gray-3"
                    : "bg-neutral-gray-2/30"
                }`}
                aria-label={`${index + 1}번 카드로 이동`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
