import type { RentalVerificationCredentials } from "../rent/submit/hooks/useRentalVerification";

export type Locker = {
  id: string;
  number: string;
  status: "available" | "rented" | "unavailable";
  row: number;
  column: number;
};

export type LockerZone = {
  id: string;
  name: string;
  columns: number;
  lockers: Locker[];
};

export type LockerRentalPlace = {
  name: string;
  rentalDays: number;
  guaranteedGoods: string;
};

export type LockerSelection = { zone: LockerZone; locker: Locker };
export type LockerView = "layout" | "list";

export type LockerRentalRequest = {
  zoneId: string;
  lockerId: string;
  name: string;
  department: string;
  studentNumber: string;
  requestNote: string;
  credentials: RentalVerificationCredentials;
};

// API 연결 시 성공한 요청에 대해서만 대기 화면으로 전환한다.
export type SubmitLockerRental = (
  request: LockerRentalRequest,
) => Promise<void>;
