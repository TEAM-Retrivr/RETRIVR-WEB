import { useCallback, useRef, useState } from "react";
import type { RentalVerificationCredentials } from "../../rent/submit/hooks/useRentalVerification";
import type { LockerRentalResponse } from "../../rental-home/api/locker.types";
import { lockerErrorMessage } from "../../rental-home/model/locker.errors";
import type { LockerBorrowerValues } from "../components/LockerBorrowerFields";
import type {
  LockerBorrowerField,
  LockerSelection,
  SubmitLockerRental,
} from "../types";

export const useLockerRequest = (
  selection: LockerSelection,
  fields: LockerBorrowerField[],
  termsVersion: number,
  onSubmit: SubmitLockerRental,
  onRequested: (result: LockerRentalResponse) => void,
) => {
  const [values, setValues] = useState<LockerBorrowerValues>(() => ({
    name: "",
    additionalInfo: Object.fromEntries(
      fields.map((field) => [field.fieldKey, ""]),
    ),
    requestNote: "",
  }));
  const [credentials, setCredentials] =
    useState<RentalVerificationCredentials | null>(null);
  const [consented, setConsented] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const updateCredentials = useCallback(
    (next: RentalVerificationCredentials | null) => setCredentials(next),
    [],
  );
  const phoneCredentials =
    credentials && "phone" in credentials ? credentials : null;
  const verified =
    phoneCredentials &&
    Boolean(
      phoneCredentials.phone.trim() &&
      phoneCredentials.rawToken.trim() &&
      phoneCredentials.tokenId.trim(),
    );
  const hasRequired = fields.every(
    ({ fieldKey, required }) =>
      !required ||
      (typeof values.additionalInfo[fieldKey] === "string" &&
        Boolean(values.additionalInfo[fieldKey].trim())),
  );
  const canSubmit = Boolean(
    verified &&
    values.name.trim() &&
    hasRequired &&
    consented &&
    termsVersion > 0 &&
    selection.locker.status === "available" &&
    !isSubmitting &&
    !isRequested,
  );

  const submit = async () => {
    if (!canSubmit || !phoneCredentials || lock.current) return;
    lock.current = true;
    setIsSubmitting(true);
    setError("");
    try {
      const additionalInfo = Object.fromEntries(
        fields
          .map(({ fieldKey }) => {
            const value = values.additionalInfo[fieldKey];
            return [fieldKey, typeof value === "string" ? value.trim() : ""];
          })
          .filter(([, value]) => value !== ""),
      );
      const result = await onSubmit({
        zoneId: selection.zone.id,
        lockerId: selection.locker.id,
        name: values.name.trim(),
        additionalInfo,
        requestNote: values.requestNote.trim(),
        credentials: phoneCredentials,
        termsVersion,
      });
      setIsRequested(true);
      onRequested(result);
    } catch (cause) {
      setError(
        lockerErrorMessage(
          cause,
          "대여 요청에 실패했습니다. 잠시 후 다시 시도해주세요.",
        ),
      );
    } finally {
      lock.current = false;
      setIsSubmitting(false);
    }
  };
  return {
    values,
    setValues,
    updateCredentials,
    consented,
    setConsented,
    isSubmitting,
    error,
    canSubmit,
    submit,
  };
};
