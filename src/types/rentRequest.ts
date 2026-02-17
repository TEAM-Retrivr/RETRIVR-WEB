// 대여 요청 데이터 타입 정의
export interface RentRequest {
  id: string; // 대여 요청 고유 ID
  itemName: string; // 대여 요청한 기자재명
  count: string; // 남은 수량 / 전체 수량 (예: "(2/5)")
  applicant: string; // 대여 요청자 | 소속 (예: "조윤아 | 동물자원학과")
  time: string; // 대여 요청이 들어온 시각 (예: "2026-01-21 17:00")
}
