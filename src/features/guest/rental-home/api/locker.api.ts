import { rentalHomeClient } from "./client";
import type {
  LockerActionResponse,
  LockerApprovalRequest,
  LockerLayoutResponse,
  LockerRentalCreateRequest,
  LockerRentalFormResponse,
  LockerRentalResponse,
  LockerZonesResponse,
} from "./locker.types";

export const isLockerId = (value: string | null | undefined): value is string =>
  Boolean(
    value && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value),
  );

const lockerIdPath = (id: string) => {
  if (!isLockerId(id)) throw new Error("사물함 식별자가 올바르지 않습니다.");
  return encodeURIComponent(id);
};
const publicIdPath = (id: string) => {
  if (!id.trim()) throw new Error("대여 요청 식별자가 없습니다.");
  return encodeURIComponent(id);
};
const validRentalResponse = (data: LockerRentalResponse) =>
  Boolean(
    data.publicId?.trim() &&
    isLockerId(data.rentalId) &&
    ["REQUESTED", "APPROVED", "REJECTED", "RETURNED"].includes(data.status),
  );

export const getLockerZones = async (
  organizationId: number,
  signal?: AbortSignal,
) => {
  if (!Number.isSafeInteger(organizationId) || organizationId <= 0)
    throw new Error("대여지를 먼저 선택해주세요.");
  const { data } = await rentalHomeClient.get<LockerZonesResponse>(
    `/api/public/v1/organizations/${organizationId}/locker-zones`,
    { signal },
  );
  if (!Array.isArray(data.zones))
    throw new Error("사물함 구역 정보를 확인할 수 없습니다.");
  return data;
};

export const getLockerLayout = async (zoneId: string, signal?: AbortSignal) => {
  const { data } = await rentalHomeClient.get<LockerLayoutResponse>(
    `/api/public/v1/locker-zones/${lockerIdPath(zoneId)}/lockers`,
    { signal },
  );
  // 서버 MOCK은 식별자를 반영하지 않는 고정 응답이다. 다른 구역의 사물함을 섞어 표시하지 않는다.
  if (
    data.zone?.zoneId?.toLowerCase() !== zoneId.toLowerCase() ||
    !Array.isArray(data.lockers)
  )
    throw new Error("선택한 구역과 응답의 사물함 정보가 일치하지 않습니다.");
  return data;
};

export const getLockerRentalForm = async (
  lockerId: string,
  signal?: AbortSignal,
) => {
  const { data } = await rentalHomeClient.get<LockerRentalFormResponse>(
    `/api/public/v1/lockers/${lockerIdPath(lockerId)}/rental-form`,
    { signal },
  );
  if (data.locker?.lockerId?.toLowerCase() !== lockerId.toLowerCase())
    throw new Error(
      "선택한 사물함과 신청 정보가 일치하지 않습니다. 목록에서 다시 선택해주세요.",
    );
  if (
    !data.policy ||
    !Number.isSafeInteger(data.policy.termsVersion) ||
    data.policy.termsVersion <= 0 ||
    !Array.isArray(data.policy.borrowerFields)
  )
    throw new Error("대여 약관과 입력 정보를 확인할 수 없습니다.");
  return data;
};

export const createLockerRental = async (
  lockerId: string,
  body: LockerRentalCreateRequest,
) => {
  const { data } = await rentalHomeClient.post<LockerRentalResponse>(
    `/api/public/v1/lockers/${lockerIdPath(lockerId)}/rentals`,
    body,
  );
  if (!validRentalResponse(data))
    throw new Error(
      "대여 요청 결과를 확인할 수 없습니다. 다시 신청하기 전에 관리자에게 확인해주세요.",
    );
  return data;
};

export const getLockerRentalStatus = async (
  publicId: string,
  signal?: AbortSignal,
) => {
  const { data } = await rentalHomeClient.get<LockerRentalResponse>(
    `/api/public/v1/locker-rentals/${publicIdPath(publicId)}`,
    { signal },
  );
  if (!validRentalResponse(data) || data.publicId !== publicId)
    throw new Error("대여 요청 상태를 확인할 수 없습니다.");
  return data;
};

export const approveLockerRental = async (
  publicId: string,
  body: LockerApprovalRequest,
) => {
  const { data } = await rentalHomeClient.post<LockerActionResponse>(
    `/api/public/v1/locker-rentals/${publicIdPath(publicId)}/approve`,
    body,
  );
  if (data.status !== "APPROVED")
    throw new Error("대여 승인 결과를 확인할 수 없습니다.");
  return data;
};
