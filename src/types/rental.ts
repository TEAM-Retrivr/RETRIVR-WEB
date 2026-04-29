// 대여자 정보
export interface ApplicantInfo {
  name: string; // 대여자 이름
  phone: string; // 대여자 전화번호
}

// 대여 전체 정보
export interface RentalRequest {
  rentalId: number; // 대여 요청 ID
  requestedAt: string; // 대여 요청 시각
  itemName: string; // 대여 물품 이름
  itemId?: string; // 물품 고유 번호
  itemCount: string; // 대여 물품 수량 (남은 수량/ 총 수량)
  rentalDuration?: number; // 대여 기간(일)
  guaranteedGoods?: string; // 보증 물품
  applicantInfo: ApplicantInfo; // 대여자 정보
}
