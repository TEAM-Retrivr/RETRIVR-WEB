export type EmailVerificationPurpose = "SIGNUP" | "PASSWORD_RESET" | "LOGIN";

// 1. 회원가입용 이메일 인증 코드 전송
// 1-1. 이메일 인증 코드 전송 요청 바디
export interface SendEmailCodeRequest {
  email: string; // 여기로 인증 코드가 전송될 것
  purpose: EmailVerificationPurpose; // 인증 코드 발송 목적
}

// 1-2. 이메일 인증 코드 전송 응답 바디
export interface SendEmailCodeResponse {
  email: string; // 인증 코드를 받은 이메일
  purpose: EmailVerificationPurpose; // 인증 코드 발송 목적
  expiresInSeconds: number; // 인증 코드 유효시간
}

// 2. 회원가입용 이메일 인증 코드 검증

// 2-1. 이메일 인증 코드 검증 요청 바디
export interface VerifyEmailCodeRequest {
  email: string; // 인증 코드 받았던 이메일
  purpose: "SIGNUP"; // API 요청 목적
  code: string; // 이메일로 왔던 인증코드
}

// 2-2. 이메일 인증 코드 검증 응답 바디
export interface VerifyEmailCodeResponse {
  signupToken: string; // 인증 성공 시 발급되는 토큰 (일회성/단기만료)
  expiresInSeconds: number; // 인증 코드 유효 시간 (코드가 일치하더라도 유효 시간 이후에 인증 받으면 실패)
}

// 3. 회원가입 요청

// 3-1. 회원가입 요청 바디
export interface RegisterRequest {
  email: string;
  password: string;
  organizationName: string;
  adminCode: string;
  signupToken: string;
}

// 3-2. 회원가입 응답 바디
export interface RegisterResponse {
  orgId: number; // 가입 번호
  organizationName: string; // 관리자명 (혹은 단체명)
  email: string; // 관리자 이메일
  status: string;
}

// 4. 로그인 요청

// 4-1. 로그인 요청 바디
export interface LoginRequest {
  email: string;
  password: string;
}

// 4-2. 로그인 응답 바디
export interface LoginResponse {
  orgId: number; // 서버에서 식별자로 쓰이는 key
  email: string; // 사용자 이메일
  accessToken: string; // 엑세스 토큰
  refreshToken: string; // 리프레시 토큰
}

// 5. 홈 화면 출력 요청
// 홈 화면 출력 요청 바디 없음

// 5-1. 홈 화면 출력 응답 바디
export interface LoadHomeResponse {
  organizationName: string; // 관리자 이름 (단체명)
  profileImageUrl: string; // 프로필 사진 URL
  requestCount: number; // 대여 요청 개수

  // 최근 요청 -> RentalRequsetCard에 쓰일 값
  recentRequests: [
    {
      rentalId: number; // 대여번호
      itemName: string; // 대여 품목 이름
      availableQuantity: number; // 대여 가능한 수량
      totalQuantity: number; // 총 수량
      borrowerName: string; // 대여자 이름
      borrowerMajor: string; // 대여자 전공
      requestedAt: string; // 요청 일자 (언제 요청을 보냈는지, 가장 오래된 요청부터 화면에 보일 것)
    },
  ];
}
