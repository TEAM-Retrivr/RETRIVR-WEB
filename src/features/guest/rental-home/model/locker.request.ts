import type { LockerRentalRequest } from "../../locker-rental/types";
import type { LockerRentalCreateRequest } from "../api/locker.types";

export const lockerRequestBody = (
  request: LockerRentalRequest,
): LockerRentalCreateRequest => ({
  borrower: {
    name: request.name.trim(),
    phone: request.credentials.phone.replace(/\D/g, ""),
    additionalInfo: request.additionalInfo,
    requestNote: request.requestNote.trim() || undefined,
    phoneVerificationToken: request.credentials.rawToken,
  },
  termsAgreed: true,
  termsVersion: request.termsVersion,
});
