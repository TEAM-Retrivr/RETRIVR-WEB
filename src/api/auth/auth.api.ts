import { apiClient } from "../core";
import type {
  SendEmailCodeRequest,
  VerifyEmailCodeRequest,
  SendEmailCodeResponse,
  VerifyEmailCodeResponse,
  SendPhoneVerificationCodeRequest,
  SendPhoneVerificationCodeResponse,
  VerifyPhoneVerificationCodeRequest,
  VerifyPhoneVerificationCodeResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  AdminProfileResponse,
  SendAdminEmailCodeRequest,
  SendAdminEmailCodeResponse,
  VerifyAdminEmailCodeRequest,
  VerifyAdminEmailCodeResponse,
  UpdateAdminProfileRequest,
  UpdateAdminProfileResponse,
  LoadHomeResponse,
  LogoutResponse,
  WithdrawRequest,
  WithdrawResponse,
} from "./auth.type";

//
// 1. 회원가입용 이메일 인증 코드 전송 API (POST)
// 엔드포인트 : "/api/public/v1/email/verification"
export const sendEmailCode = async (
  data: SendEmailCodeRequest,
): Promise<SendEmailCodeResponse> => {
  const response = await apiClient.post<SendEmailCodeResponse>(
    "/api/public/v1/email/verification",
    data,
  );
  return response.data;
};

//
// 2. 회원가입용 이메일 인증 코드 전송 API (POST)
// 엔드포인트 : "/api/public/v1/email/verification/verify"
export const verifyEmailCode = async (
  data: VerifyEmailCodeRequest,
): Promise<VerifyEmailCodeResponse> => {
  const response = await apiClient.post<VerifyEmailCodeResponse>(
    "/api/public/v1/email/verification/verify",
    data,
  );
  return response.data;
};

// 2-1. 휴대폰 인증 코드 발송
// 엔드포인트: "/api/public/v1/auth/phone-verification/send-code"
export const sendPhoneVerificationCode = async (
  data: SendPhoneVerificationCodeRequest,
): Promise<SendPhoneVerificationCodeResponse> => {
  const response = await apiClient.post<SendPhoneVerificationCodeResponse>(
    "/api/public/v1/auth/phone-verification/send-code",
    data,
  );
  return response.data;
};

// 2-2. 휴대폰 인증 코드 검증
// 엔드포인트: "/api/public/v1/auth/phone-verification/verify-code"
export const verifyPhoneVerificationCode = async (
  data: VerifyPhoneVerificationCodeRequest,
): Promise<VerifyPhoneVerificationCodeResponse> => {
  const response = await apiClient.post<VerifyPhoneVerificationCodeResponse>(
    "/api/public/v1/auth/phone-verification/verify-code",
    data,
  );
  return response.data;
};

//
// 3. 회원가입 요청 API (POST)
// 엔드포인트 : "/api/admin/v1/auth/signup"
export const requestRegisteration = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    "/api/admin/v1/auth/signup",
    {
      email: data.email,
      password: data.password,
      organizationName: data.organizationName,
      adminCode: data.adminCode,
      signupToken: data.signupToken,
    },
  );
  return response.data;
};

//
// 4. 로그인 요청 API (POST)
// 엔드포인트 : "/api/admin/v1/auth/login"
export const requestLogin = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/api/admin/v1/auth/login",
    data,
  );
  return response.data;
};

//
// 5. 로그아웃 요청 API (POST)
// 엔드포인트: "/api/admin/v1/auth/logout"
export const requestLogout = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>(
    "/api/admin/v1/auth/logout",
  );
  return response.data;
};

//
// 5-1. 회원 탈퇴 요청 API (POST)
// 엔드포인트: "/api/admin/v1/account/withdraw"
// 요청 바디: password, reasonCodes, otherReason?, agreedToWarning
// 비밀번호는 별도 확인 API 없이 탈퇴 요청에 포함해 서버에서 검증한다.
export const requestWithdraw = async (
  data: WithdrawRequest,
): Promise<WithdrawResponse> => {
  const response = await apiClient.post<WithdrawResponse>(
    "/api/admin/v1/account/withdraw",
    {
      password: data.password,
      reasonCodes: data.reasonCodes,
      ...(data.otherReason ? { otherReason: data.otherReason } : {}),
      agreedToWarning: data.agreedToWarning,
    },
  );
  return response.data;
};

//
// 6. 홈 화면 출력 API (GET)
// 엔드포인트 : "/api/admin/v1/home"
export const requestLoadHome = async (): Promise<LoadHomeResponse> => {
  const response = await apiClient.get<LoadHomeResponse>("/api/admin/v1/home");
  return response.data;
};

//
// 7. 관리자 프로필 조회 API (GET)
// 엔드포인트 : "/api/admin/v1/profile"
export const requestAdminProfile = async (): Promise<AdminProfileResponse> => {
  const response = await apiClient.get<AdminProfileResponse>(
    "/api/admin/v1/profile",
  );
  return response.data;
};

//
// 7-1. 관리자 이메일 인증 코드 발송 API (POST)
// 엔드포인트 : "/api/admin/v1/email/verification"
export const sendAdminEmailCode = async (
  data: SendAdminEmailCodeRequest,
): Promise<SendAdminEmailCodeResponse> => {
  const response = await apiClient.post<SendAdminEmailCodeResponse>(
    "/api/admin/v1/email/verification",
    data,
  );
  return response.data;
};

//
// 7-2. 관리자 이메일 인증 코드 검증 API (POST)
// 엔드포인트 : "/api/admin/v1/email/verification/verify"
export const verifyAdminEmailCode = async (
  data: VerifyAdminEmailCodeRequest,
): Promise<VerifyAdminEmailCodeResponse> => {
  const response = await apiClient.post<VerifyAdminEmailCodeResponse>(
    "/api/admin/v1/email/verification/verify",
    data,
  );
  return response.data;
};

//
// 7-3. 관리자 프로필 수정 API (PATCH)
// 엔드포인트 : "/api/admin/v1/profile"
export const updateAdminProfile = async (
  data: UpdateAdminProfileRequest,
): Promise<UpdateAdminProfileResponse> => {
  const response = await apiClient.patch<UpdateAdminProfileResponse>(
    "/api/admin/v1/profile",
    data,
  );
  return response.data;
};
