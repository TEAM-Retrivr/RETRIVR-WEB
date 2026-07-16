export type EmailVerificationPurpose =
  | "SIGNUP"
  | "PASSWORD_RESET"
  | "LOGIN"
  | "EMAIL_CHANGE";

// 휴대폰 인증 코드 발송/검증 목적
// (현재 클라이언트 대여 요청에만 사용)
export type PhoneVerificationPurpose = "BORROW" | string;

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
  tokenType: "SIGNUP"; // 토큰 용도 (회원가입용)
  token: string; // 인증 성공 시 발급되는 토큰 (일회성/단기만료)
  expiresInSeconds: number; // 인증 코드 유효 시간 (코드가 일치하더라도 유효 시간 이후에 인증 받으면 실패)
}

// 2. 휴대폰 인증 코드 발송

export interface SendPhoneVerificationCodeRequest {
  phoneNumber: string; // 예: 010-1234-5678
  purpose: PhoneVerificationPurpose; // 인증 코드 발송 목적
}

export interface SendPhoneVerificationCodeResponse {
  verificationId: string;
}

// 2-2. 휴대폰 인증 코드 검증
export interface VerifyPhoneVerificationCodeRequest {
  verificationId: string; // send-code 응답의 verificationId
  purpose: PhoneVerificationPurpose; // 예: BORROW
  rawCode: string; // 입력한 인증번호 (숫자 6자리)
}

export interface VerifyPhoneVerificationCodeResponse {
  // 서버 응답 스펙이 버전/구현에 따라 달라질 수 있어 둘 다 optional로 지원
  // (UI에서는 Borrow 요청 생성 API로 verificationToken/verificationTokenId가 필요)
  verificationToken?: string;
  verificationTokenId?: string;
  rawToken?: string;
  tokenId?: string;
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
// organizationId가 우선이며, 구응답의 orgId도 허용한다.
export interface LoginResponse {
  organizationId?: number; // 서버에서 식별자로 쓰이는 key (신규)
  orgId?: number; // 레거시 필드 (하위 호환)
  email: string; // 사용자 이메일
  accessToken: string; // 엑세스 토큰
  refreshToken?: string; // 리프레시 토큰 (현재 서버는 HttpOnly 쿠키로 내려주어 바디에 없음)
}

// 5. 로그아웃 요청
// 로그아웃 요청 바디 없음

// 5-1. 로그아웃 응답 바디
export interface LogoutResponse {
  success: boolean;
}

// 5-2. 회원 탈퇴 요청
// 엔드포인트: "/api/admin/v1/account/withdraw"

// 탈퇴 사유 코드 (서버 enum)
// 확인된 값 외에도 추가될 수 있어 string 유니언으로 열어둔다
export type WithdrawReasonCode = "ORG_CLOSED" | (string & {});

// 5-2-1. 회원 탈퇴 요청 바디
export interface WithdrawRequest {
  password: string; // 본인 확인용 비밀번호
  reasonCodes: WithdrawReasonCode[]; // 탈퇴 사유 코드 목록
  otherReason?: string; // 기타 사유 (직접 입력)
  agreedToWarning: boolean; // 탈퇴 경고 동의 여부
}

// 5-2-2. 회원 탈퇴 응답 바디
export interface WithdrawResponse {
  success: boolean;
}

// 5-2-3. 회원 탈퇴 에러 응답 바디 (400/403/404 공통 스펙)
export interface WithdrawErrorResponse {
  status: string; // 예: "400 BAD_REQUEST"
  code: number; // 서버 에러 코드
  message: string; // 사용자에게 보여줄 수 있는 메시지
  detail?: string;
}

// 회원 탈퇴 에러 코드 상수
export const WITHDRAW_ERROR_CODE = {
  PASSWORD_MISMATCH: 6007, // 400: 비밀번호가 일치하지 않습니다.
  ALREADY_WITHDRAWN: 6004, // 403: 탈퇴한 계정입니다.
  ACCOUNT_NOT_FOUND: 6002, // 404: 계정을 찾을 수 없습니다.
} as const;

// 6. 관리자 프로필 조회
export interface AdminProfileResponse {
  organizationId: number; // 관리자 고유 번호
  organizationName: string; // 관리자 이름 (단체명)
  profileImageUrl?: string; // 프로필 사진 URL
  email: string; // 관리자 이메일
}

// 6-1. 관리자 이메일 인증 코드 발송
// 엔드포인트: "/api/admin/v1/email/verification" (POST)
// 요청/응답 바디는 public 이메일 인증과 동일 형태 (purpose: EMAIL_CHANGE)

export type SendAdminEmailCodeRequest = SendEmailCodeRequest;
export type SendAdminEmailCodeResponse = SendEmailCodeResponse;

// 6-2. 관리자 이메일 인증 코드 검증
// 엔드포인트: "/api/admin/v1/email/verification/verify" (POST)
export interface VerifyAdminEmailCodeRequest {
  email: string;
  purpose: EmailVerificationPurpose; // 이메일 변경: EMAIL_CHANGE
  code: string;
}

export interface VerifyAdminEmailCodeResponse {
  tokenType: string;
  token: string;
  expiresInSeconds: number;
}

// 관리자 이메일 인증 공통 에러 응답 (400/429 등)
export interface AdminEmailVerificationErrorResponse {
  status: string; // 예: "400 BAD_REQUEST", "429 TOO_MANY_REQUESTS"
  code: number;
  message: string;
  detail?: string;
}

export const ADMIN_EMAIL_VERIFICATION_ERROR_CODE = {
  INVALID_REQUEST: 2002, // 400: 올바르지 않은 요청 값입니다.
  TOO_MANY_REQUESTS: 7104, // 429: 인증 코드는 60초 후 재요청 가능합니다.
  REQUEST_NOT_FOUND: 7000, // 400: 인증 요청이 존재하지 않습니다.
} as const;

// 6-3. 관리자 프로필 수정
// 엔드포인트: "/api/admin/v1/profile" (PATCH)
export interface UpdateAdminProfileRequest {
  newEmail: string;
  newPassword: string;
  confirmPassword: string;
  newOrganizationName: string;
  newAdminCode: string;
  /** 이메일 변경 인증 토큰 등 검증 토큰 (변경 시에만 전달) */
  adminCodeVerificationToken?: string;
}

export type UpdateAdminProfileResponse = AdminProfileResponse;

export interface UpdateAdminProfileErrorResponse {
  status: string; // 예: "400 BAD_REQUEST", "404 NOT_FOUND"
  code: number;
  message: string;
  detail?: string;
}

export const UPDATE_ADMIN_PROFILE_ERROR_CODE = {
  INVALID_REQUEST: 2002, // 400: 올바르지 않은 요청 값입니다.
  ORGANIZATION_NOT_FOUND: 3004, // 404: 존재하지 않는 단체입니다.
} as const;

// 7. 홈 화면 출력 요청
// 홈 화면 출력 요청 바디 없음

// 7-1. 홈 화면 출력 응답 바디
export interface LoadHomeResponse {
  organizationId: number; // 관리자 아이디
  organizationName: string; // 관리자 이름 (단체명)
  profileImageUrl?: string; // 프로필 사진 URL (없는 경우 기본 아이콘 사용됨)
  requestCount: number; // 대여 요청 개수

  // 최근 요청 -> RentalRequsetCard에 쓰일 값
  recentRequests: {
    rentalId: number; // 대여번호
    itemName: string; // 대여 품목 이름
    availableQuantity: number; // 대여 가능한 수량
    totalQuantity: number; // 총 수량
    borrowerName: string; // 대여자 이름
    borrowerMajor?: string; // 대여자 전공 (선택사항)
    requestedAt: string; // 요청 일자 (언제 요청을 보냈는지, 가장 오래된 요청부터 화면에 보일 것)
  }[];
}
