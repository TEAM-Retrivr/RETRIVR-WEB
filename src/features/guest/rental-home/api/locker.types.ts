export type LockerStatus =
  | "PENDING"
  | "AVAILABLE"
  | "RENTED"
  | "UNAVAILABLE"
  | "DISABLED";
export type LockerRentalStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "RETURNED";

export type LockerZoneResponse = {
  zoneId: string;
  name: string;
  rows: number;
  columns: number;
  totalCount: number;
  availableCount: number;
};

export type PublicLockerResponse = {
  lockerId: string;
  label: string;
  rowIndex: number;
  columnIndex: number;
  parentId: string | null;
  status: LockerStatus;
  extensionAvailable: boolean;
};

export type LockerZonesResponse = { zones: LockerZoneResponse[] };
export type LockerLayoutResponse = {
  zone: LockerZoneResponse;
  lockers: PublicLockerResponse[];
};
export type LockerBorrowerFieldResponse = {
  fieldKey: string;
  label: string;
  required: boolean;
  sortOrder: number;
};
export type LockerPolicyResponse = {
  rentalDays: number;
  maxExtensionCount: number;
  extensionDays: number;
  terms: string;
  termsVersion: number;
  collateral: string;
  borrowerFields: LockerBorrowerFieldResponse[];
};
export type LockerRentalFormResponse = {
  organizationName: string;
  zone: LockerZoneResponse;
  locker: PublicLockerResponse;
  policy: LockerPolicyResponse;
  startDate: string;
  dueDate: string;
};

export type LockerRentalCreateRequest = {
  borrower: {
    name: string;
    phone: string;
    email?: string;
    additionalInfo: Record<string, string>;
    requestNote?: string;
    phoneVerificationToken: string;
  };
  termsAgreed: true;
  termsVersion: number;
};
export type LockerRentalResponse = {
  rentalId: string;
  publicId: string;
  status: LockerRentalStatus;
  requestedAt: string;
  expiresAt: string;
};
export type LockerApprovalRequest = {
  adminNameToApprove: string;
  adminCodeVerificationToken: string;
};
export type LockerActionResponse = {
  id: string;
  status: LockerRentalStatus;
  processedAt: string;
};
