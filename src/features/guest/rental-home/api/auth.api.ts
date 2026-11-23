import { rentalHomeClient } from "./client";

export type RenewalManagerLogin = { email: string; password: string };
export type RenewalManagerSession = {
  organizationId: number;
  email: string;
  accessToken: string;
};

export const sendLockerPhoneCode = async (body: {
  phoneNumber: string;
  purpose: "BORROW";
}) => {
  const { data } = await rentalHomeClient.post<{ verificationId: string }>(
    "/api/public/v1/auth/phone-verification/send-code",
    body,
  );
  return data;
};
export const verifyLockerPhoneCode = async (body: {
  verificationId: string;
  purpose: "BORROW";
  rawCode: string;
}) => {
  const { data } = await rentalHomeClient.post<{
    rawToken: string;
    tokenId: string;
  }>("/api/public/v1/auth/phone-verification/verify-code", body);
  return data;
};
export const lockerPhoneVerificationApi = {
  sendPhone: sendLockerPhoneCode,
  verifyPhone: verifyLockerPhoneCode,
};

export const loginLockerManager = async (body: RenewalManagerLogin) => {
  const { data } = await rentalHomeClient.post<RenewalManagerSession>(
    "/api/admin/v1/auth/login",
    body,
    { withCredentials: true },
  );
  if (
    !data.accessToken?.trim() ||
    !Number.isSafeInteger(data.organizationId) ||
    data.organizationId <= 0
  )
    throw new Error("관리자 로그인 정보를 확인할 수 없습니다.");
  return data;
};

export const verifyLockerManagerCode = async (
  adminCode: string,
  accessToken: string,
) => {
  if (!/^\d{6}$/.test(adminCode) || !accessToken.trim())
    throw new Error("관리자 코드 6자리를 입력해주세요.");
  const { data } = await rentalHomeClient.post<{ rawToken: string }>(
    "/api/admin/v1/admin-code/verification",
    { adminCode, purpose: "IMMEDIATE_APPROVAL" },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!data.rawToken?.trim())
    throw new Error("관리자 코드 검증이 완료되지 않았습니다.");
  return data.rawToken;
};
