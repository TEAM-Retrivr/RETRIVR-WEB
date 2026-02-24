import { apiClient } from "../core";
import type {
  SendEmailCodeRequest,
  VerifyEmailCodeRequest,
  SendEmailCodeResponse,
  VerifyEmailCodeResponse,
} from "./auth.type";

//
// 1. 회원가입용 이메일 인증 코드 전송 API (POST)
// 엔드포인트 : "/api/public/v1/auth/signup/email-code/send"
export const sendEmailCode = async (
  data: SendEmailCodeRequest,
): Promise<SendEmailCodeResponse> => {
  const response = await apiClient.post<SendEmailCodeResponse>(
    "/api/public/v1/auth/signup/email-code/send",
    data,
  );
  return response.data;
};

//
// 2. 회원가입용 이메일 인증 코드 전송 API (POST)
// 엔드포인트 : "/api/public/v1/auth/signup/email-code/verify"
export const verifyEmailCode = async (
  data: VerifyEmailCodeRequest,
): Promise<VerifyEmailCodeResponse> => {
  const response = await apiClient.post<VerifyEmailCodeResponse>(
    "/api/public/v1/auth/signup/email-code/verify",
    data,
  );
  return response.data;
};
