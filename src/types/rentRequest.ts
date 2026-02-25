// 대여 요청 데이터 타입 정의
export interface RentRequest {
  id: string; // 대여 요청 고유 ID
  itemName: string; // 대여 요청한 기자재명
  count: string; // 남은 수량 / 전체 수량 (예: "(2/5)")
  applicant: string; // 대여 요청자 | 소속 (예: "조윤아 | 동물자원학과")
  time: string; // 대여 요청이 들어온 시각 (예: "2026-01-21 17:00")
}

// 최근 요청 -> RentalRequsetCard에 쓰일 값
export interface recentRequests {
  rentalId: number; // 대여번호
  itemName: string; // 대여 품목 이름
  availableQuantity: number; // 대여 가능한 수량
  totalQuantity: number; // 총 수량
  borrowerName: string; // 대여자 이름
  borrowerMajor: string; // 대여자 전공
  requestedAt: string; // 요청 일자 (언제 요청을 보냈는지, 가장 오래된 요청부터 화면에 보일 것)
}
