import type { RentalVerificationCredentials } from "../rent/submit/hooks/useRentalVerification";
import type {
  LockerBorrowerFieldResponse,
  LockerRentalResponse,
} from "../rental-home/api/locker.types";

export type Locker = {
  id: string;
  number: string;
  status: "available" | "rented" | "unavailable" | "pending" | "disabled";
  row: number;
  column: number;
  rowSpan?: number;
  columnSpan?: number;
};

export type LockerZone = {
  id: string;
  name: string;
  columns: number;
  availableCount: number;
  totalCount: number;
  lockers: Locker[];
};

export type LockerRentalPlace = {
  name: string;
  rentalDays: number;
  guaranteedGoods: string;
  startDate?: string;
  dueDate?: string;
};

export type LockerSelection = { zone: LockerZone; locker: Locker };
export type LockerView = "layout" | "list";

export type LockerRentalRequest = {
  zoneId: string;
  lockerId: string;
  name: string;
  additionalInfo: Record<string, string>;
  requestNote: string;
  credentials: Extract<RentalVerificationCredentials, { phone: string }>;
  termsVersion: number;
};
export type LockerBorrowerField = LockerBorrowerFieldResponse;

// API 연결 시 성공한 요청에 대해서만 대기 화면으로 전환한다.
export type SubmitLockerRental = (
  request: LockerRentalRequest,
) => Promise<LockerRentalResponse>;
