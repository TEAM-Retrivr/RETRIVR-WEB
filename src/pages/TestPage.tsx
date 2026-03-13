import { useRef, useState, type TouchEvent } from "react";
import { MenuCard } from "../components/cards/home/MenuCard";
import { HOME_MENUS } from "../types/menu";
import CommonInput from "../components/CommonInput";
import RentalStatusToggle from "../components/RentalStatusToggle";
import RentalAvailableItemCard from "../components/cards/client/RentalAvailableItemCard";
import Header from "../components/Header";
import type { ItemRequest } from "../types/item";
import ItemStatusCard from "../components/cards/admin/management/ItemStatusCard";
import ItemManagementCard from "../components/cards/admin/management/ItemManagementCard";
import RentalConfirmCard from "../components/cards/admin/rental/RentalConfirmCard";
export const DUMMY_ITEM_REQUESTS: ItemRequest[] = [
  {
    item: {
      itemId: 1,
      name: "C타입 충전기",
      availableQuantity: 3,
      totalQuantity: 5,
      isActive: true,
      rentalDuration: 3,
      description: "어댑터 미포함",
      guaranteedGoods: "학생증 또는 신분증",
    },
    nextCursor: 2,
  },
  {
    item: {
      itemId: 2,
      name: "멀티탭 (4구)",
      availableQuantity: 5,
      totalQuantity: 10,
      isActive: true,
      rentalDuration: 2,
      description: "최대 2200W 사용 가능",
      guaranteedGoods: "학생증",
    },
    nextCursor: 3,
  },
  {
    item: {
      itemId: 3,
      name: "보조 배터리",
      availableQuantity: 1,
      totalQuantity: 8,
      isActive: true,
      rentalDuration: 1,
      description: "케이블 별도 지참",
      guaranteedGoods: "학생증 또는 신분증",
    },
    nextCursor: 4,
  },
  {
    item: {
      itemId: 4,
      name: "우산",
      availableQuantity: 7,
      totalQuantity: 20,
      isActive: true,
      rentalDuration: 1,
      description: "반납 시 상태 확인",
      guaranteedGoods: "학생증",
    },
    nextCursor: 5,
  },
  {
    item: {
      itemId: 5,
      name: "노트북 거치대",
      availableQuantity: 2,
      totalQuantity: 4,
      isActive: true,
      rentalDuration: 7,
      description: "알루미늄 재질",
      guaranteedGoods: "학생증 또는 신분증",
    },
    nextCursor: 6,
  },
];

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

  return (
    <div className=" bg-neutral-white p-10 flex flex-col gap-5">
      <ItemManagementCard></ItemManagementCard>
      <ItemStatusCard
        status="rentalAvailable"
        itemName="c타입 충전기 (1)"
        itemCode="345ss2"
      ></ItemStatusCard>
      <ItemStatusCard
        status="rentedOut"
        itemName="c타입 충전기 (2)"
        itemCode="345ss2"
      ></ItemStatusCard>
      <ItemStatusCard
        status="rentalUnavailable"
        itemName="실험복"
        itemCode=""
      ></ItemStatusCard>
      <h1 className="text-xl font-bold">대여 가능 물품 컴포넌트 테스트</h1>
      <RentalAvailableItemCard itemInfo={DUMMY_ITEM_REQUESTS[0]} />
      <h1 className="text-xl font-bold">헤더 컴포넌트 테스트</h1>
      <div className="flex flex-col bg-neutral-gray-4 opacity-90 w-[700px] h-[500px] items-center p-10 gap-30">
        <Header name="" pageName="회원가입"></Header>
        <Header
          name="건국대학교 도서관자치위원회"
          pageName="대여 요청"
        ></Header>
      </div>
      <h1 className="text-xl font-bold">홈화면 카드 컴포넌트 테스트</h1>
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
                  <div className="flex items-center justify-center w-full"></div>
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
      <h1 className="text-xl font-bold">대여 요청 확인 카드 + 모달 테스트</h1>
      <div className="flex justify-center">
        <RentalConfirmCard
          rental={{
            requestedAt: "2026-01-21 17:05",
            itemName: "C타입 충전기",
            itemId: "1",
            itemCount: "(2/5)",
            applicantInfo: {
              name: "홍길동",
              major: "소프트웨어융합학과",
              id: "202012345",
            },
          }}
        />
      </div>
    </div>
  );
};

export default TestPage;
