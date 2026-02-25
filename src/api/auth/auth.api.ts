import { apiClient } from "../core";
import type {
  SendEmailCodeRequest,
  VerifyEmailCodeRequest,
  SendEmailCodeResponse,
  VerifyEmailCodeResponse,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  LoadHomeResponse,
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

//
// 3. 회원가입 요청 API (POST)
// 엔드포인트 : "/api/admin/v1/auth/signup"
export const requestRegisteration = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    "/api/admin/v1/auth/signup",
    data,
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
// 5. 홈 화면 출력 API (GET)
// 엔드포인트 : "/api/admin/v1/home"
export const requestLoadHome = async (): Promise<LoadHomeResponse> => {
  const response = await apiClient.get<LoadHomeResponse>("/api/admin/v1/home");
  return response.data;
};
