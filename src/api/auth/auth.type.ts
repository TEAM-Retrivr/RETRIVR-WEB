// 1. 회원가입용 이메일 인증 코드 전송

// 1-1. 이메일 인증 코드 전송 요청 바디
export interface SendEmailCodeRequest {
  email: string; // 여기로 인증 코드가 전송될 것
}

// 1-2. 이메일 인증 코드 전송 응답 바디
export interface SendEmailCodeResponse {
  success: boolean; // 이메일 전송 여부
  expiresInSeconds: number; // 인증 코드 유효시간
  message: string; // "인증 코드가 이메일로 발송되었습니다."
}

// 2. 회원가입용 이메일 인증 코드 검증

// 2-1. 이메일 인증 코드 검증 요청 바디
export interface VerifyEmailCodeRequest {
  email: string; // 인증 코드 받았던 이메일
  code: string; // 이메일로 왔던 인증코드
}

// 2-2. 이메일 인증 코드 검증 응답 바디
export interface VerifyEmailCodeResponse {
  signupToken: string; // 인증 성공 시 발급되는 토큰 (일회성/단기만료)
  expiresInSeconds: number; // 인증 코드 유효 시간 (코드가 일치하더라도 유효 시간 이후에 인증 받으면 실패)
}
