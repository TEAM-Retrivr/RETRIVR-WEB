/** PortOne 정식 채널키 심사 전, 결제·구독 CTA 클릭 시 안내 */
export const PAYMENT_SYSTEM_PREPARING_MESSAGE =
  "현재 안전한 결제 처리를 위해 결제 시스템을 준비하고 있어요.\n심사가 완료되는 대로 프로 구독을 시작할 수 있도록 빠르게 안내해 드릴게요!";

export const notifyPaymentSystemPreparing = () => {
  alert(PAYMENT_SYSTEM_PREPARING_MESSAGE);
};
