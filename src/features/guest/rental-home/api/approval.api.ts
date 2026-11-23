import { loginLockerManager, verifyLockerManagerCode } from "./auth.api";
import { approveLockerRental } from "./locker.api";

export type LockerManagerApproval = {
  email: string;
  password: string;
  adminCode: string;
  managerName: string;
  organizationId?: number;
};

export const completeLockerApproval = async (
  publicId: string,
  input: LockerManagerApproval,
) => {
  const session = await loginLockerManager({
    email: input.email.trim(),
    password: input.password,
  });
  if (input.organizationId && session.organizationId !== input.organizationId)
    throw new Error("이 대여지의 관리자 계정으로 로그인해주세요.");
  const codeToken = await verifyLockerManagerCode(
    input.adminCode,
    session.accessToken,
  );
  // 로그인 accessToken은 관리자 코드 검증의 Bearer 헤더에만 사용한다.
  // 공개 승인 본문에는 별도로 발급된 관리자 코드 검증 rawToken을 전달한다.
  return approveLockerRental(publicId, {
    adminNameToApprove: input.managerName.trim(),
    adminCodeVerificationToken: codeToken,
  });
};
