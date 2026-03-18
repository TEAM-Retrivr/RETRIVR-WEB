import { Layout } from "../../components/Layout";
import Header from "../../components/Header";
import StockCheckCard from "../../components/cards/admin/management/StockCheckCard";
import ReturnConfirmCard from "../../components/cards/admin/return/ReturnConfirmCard";
import {
  useAdminRentalItemSummaryList,
  useAdminOverdueRentalList,
} from "../../hooks/queries/useAdminQueries";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReturnManagementPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 반납 화면 하단 "물품별 관리" 영역 데이터 조회
  const {
    data: rentalItemSummaryData,
    isLoading: isRentalItemsLoading,
    error: rentalItemsError,
  } = useAdminRentalItemSummaryList();
  // 반납 화면 상단 "반납 연체 확인" 영역 데이터 조회
  const {
    data: overdueRentalData,
    isLoading: isOverdueLoading,
    error: overdueError,
  } = useAdminOverdueRentalList();

  const items = rentalItemSummaryData?.items ?? [];
  const overdueRentals = overdueRentalData?.rentals ?? [];

  const closeSearch = () => {
    setIsSearchOpen(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(inputValue.trim());
    setIsSearchOpen(true);
  };

  return (
    <Layout>
      <Header
        name="건국대학교 도서관자치위원회"
        pageName="반납 관리"
        backTo="/home"
      ></Header>
      <div className="w-full h-screen relative flex flex-col font-[Pretendard] mt-6.5 mb-0 px-7 items-center gap-7.5">
        {isSearchOpen && (
          <button
            type="button"
            aria-label="검색 닫기"
            className="absolute inset-0 z-10 "
            onClick={closeSearch}
          />
        )}
        {/* 검색 영역 - 대여자 정보로 찾기 */}
        <form
          onSubmit={handleSubmit}
          className="z-20 w-84.5 h-11 flex items-center justify-between rounded-small border border-primary "
        >
          <input
            ref={inputRef}
            className="flex-1 text-14px text-neutral-gray-1 font-[600] border-none outline-none pl-3 py-3 placeholder:text-neutral-gray-3 placeholder:text-14px"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="대여자 정보로 찾기"
            onFocus={() => setIsSearchOpen(true)}
          />
          <button type="submit" className="pr-3">
            <img src="/icons/search.svg" alt="검색" />
          </button>
        </form>
        {isSearchOpen && (
          <div className="z-20 w-full bg-neutral-gray-6 min-h-40 font-[Pretendard] rounded-[14px] py-6.5 px-5.5 -mt-4">
            <p className="text-16px text-secondary-2 opacity-[0.9] font-[600]">
              {keyword ? "검색 결과" : "입력 예시"}
            </p>
            <div className="w-full flex flex-col px-0.25 pt-4.5">
              {!keyword && (
                <div className="flex flex-col text-14px font-[600] leading-[20px] gap-1">
                  <p className="text-neutral-gray-3">이름</p>
                  <p className="text-[#444]">이리버</p>
                  <p className="text-neutral-gray-3 mt-3">학번</p>
                  <p className="text-[#444]">202410384</p>
                  <p className="text-neutral-gray-3 mt-3">학과</p>
                  <p className="text-[#444]">동물자원과학과</p>
                  <p className="text-neutral-gray-3 mt-3">대여 물품</p>
                  <p className="text-[#444]">c타입 충전기</p>
                </div>
              )}
              {keyword && (
                <div className="flex flex-col gap-2.5">
                  <p className="text-14px text-neutral-gray-3">
                    검색 API 연동 예정입니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* 반납 연체 확인 영역 - 가로로 스크롤 */}
        <div className="flex flex-col w-full">
          <p className="text-neutral-gray-1 text-16px font-bold px-1">
            반납 연체 확인
          </p>
          <div className="flex mt-4 overflow-x-auto no-scrollbar gap-3">
            {isOverdueLoading && (
              <p className="text-neutral-gray-3 text-14px">로딩 중...</p>
            )}
            {overdueError && (
              <p className="text-red text-14px">
                연체된 물품 목록을 불러오지 못했습니다.
              </p>
            )}
            {!isOverdueLoading &&
              !overdueError &&
              overdueRentals.length === 0 && (
                <div className="w-full text-center text-neutral-gray-3 text-14px py-10">
                  <p>연체된 물품이 없습니다.</p>
                </div>
              )}
            {!isOverdueLoading &&
              !overdueError &&
              overdueRentals.map((rental) => {
                const lastSent =
                  rental.sendOverdueSmsDates[
                    rental.sendOverdueSmsDates.length - 1
                  ];
                const lastSmsSentDateLabel = lastSent
                  ? `${lastSent} 문자 발송됨`
                  : "문자 발송 이력이 없습니다.";

                // TODO: itemName 뒤 괄호 안 수량은 백엔드 명세에 맞게 수정 필요
                const itemNameWithCount = `${rental.itemName}`;

                return (
                  <ReturnConfirmCard
                    key={rental.rentalId}
                    overdueDays={rental.overdueDays}
                    lastSmsSentDateLabel={lastSmsSentDateLabel}
                    itemNameWithCount={itemNameWithCount}
                    borrowerName={rental.borrowerName}
                    borrowerStudentNumber={rental.borrowerStudentNumber}
                    canSendOverdueSms={
                      overdueRentalData?.canSendOverdueSms ?? false
                    }
                  />
                );
              })}
          </div>
        </div>
        {/* 물품별 관리 영역 - 세로로 스크롤 */}
        <div className="flex flex-col w-full">
          <p className="text-neutral-gray-1 text-16px font-bold px-1">
            물품별 관리
          </p>
          <p className="text-neutral-gray-3 text-12px mt-1.5 px-1 font-normal leading-[130%] ">
            물품별 잔여 수량을 확인하고 반납 관리를 해보세요.
          </p>
          <div className="w-full flex flex-col pt-4 px-1 overflow-y-auto gap-3 no-scrollbar">
            {isRentalItemsLoading && (
              <p className="text-neutral-gray-3 text-14px">로딩 중...</p>
            )}
            {rentalItemsError && (
              <p className="text-red text-14px">목록을 불러오지 못했습니다.</p>
            )}
            {!isRentalItemsLoading &&
              !rentalItemsError &&
              items.length === 0 && (
                <div className="pt-20 text-center text-neutral-gray-3 text-14px">
                  <p>등록된 물품이 없습니다.</p>
                  <p>물품 관리 페이지에서 물품을 등록해주세요.</p>
                </div>
              )}
            {!isRentalItemsLoading &&
              !rentalItemsError &&
              items.map((item) => (
                <StockCheckCard
                  key={item.itemId}
                  itemName={item.itemName}
                  availableQuantity={item.availableQuantity}
                  totalQuantity={item.totalQuantity}
                  isRentalAvailable={item.isRentalAvailable}
                  onClick={() => navigate(`/return-check/${item.itemId}`)}
                />
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnManagementPage;
