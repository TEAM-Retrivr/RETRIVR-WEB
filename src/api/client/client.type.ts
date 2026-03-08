// 1. 대여지 소유 물품 목록 조회 정보
// 1-1. 전체 응답 바디
export interface ItemResponse {
  items: {
    itemId: number; // 물품 번호
    name: string; // 물품 이름
    availableQuantity: number; // 대여 가능한 수량
    totalQuantity: number; // 전체 수량
    isActive: boolean; // 대여 상태 (가능/불가능)
    rentalDuration: number; // 대여 기간
    description: string; // 물품 설명
    guaranteedGoods?: string; // 보증 물품 (있을 수도, 없을 수도)
  }[];
  nextCursor?: number; // (무한스크롤) 사용자에게 보여줄 페이지 단위. nextCursor가 null이면 다음 페이지가 없음.
}

// 2. 대여 요청 생성
// 2-1. 대여 요청 생성 요청 바디
export interface BorrowerInformationRequest {
  itemUnitId?: number; // Long, nullable. 개별 코드형 물품일 경우에만 사용
  name: string; // String, 필수. 대여자 이름
  phone?: string; // String, nullable. 대여자 전화번호
  rentalFields: {
    // JSON Object, 필수. 추가 대여자 정보 (자유 key-value, 입력값 그대로 전달)
    학과: string;
    학번: string;
    보증물품: string;
    [key: string]: string | undefined; // 요청사항 등 자유 필드
  };
}

// 2-2. 대여 요청 생성 응답 바디
export interface BorrowerInformationResponse {
  rentalId: number; // 생성된 대여 요청 ID
  itemId: number; // 대여 요청한 물품 ID
  itemUnitId: number; // 요청에 연결된 물품 고유번호 ID (선택사항)
  requestedAt: string; // 대여 요청 생성 시각
}
