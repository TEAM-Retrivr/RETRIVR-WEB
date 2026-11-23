import { useCallback, useRef, useState } from "react";
import type { RentalVerificationCredentials } from "../../rent/submit/hooks/useRentalVerification";
import type { LockerBorrowerValues } from "../components/LockerBorrowerFields";
import type { LockerSelection, SubmitLockerRental } from "../types";

export const useLockerRequest = (
  selection: LockerSelection,
  onSubmit?: SubmitLockerRental,
) => {
  const [values, setValues] = useState<LockerBorrowerValues>({
    name: "",
    department: "",
    studentNumber: "",
    requestNote: "",
  });
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
  const verified =
    credentials &&
    ("phone" in credentials
      ? Boolean(
          credentials.phone.trim() &&
          credentials.tokenId.trim() &&
          credentials.rawToken.trim(),
        )
      : Boolean(
          credentials.email.trim() && credentials.emailVerificationToken.trim(),
        ));
  const canSubmit = Boolean(
    onSubmit &&
    verified &&
    values.name.trim() &&
    values.department.trim() &&
    /^\d+$/.test(values.studentNumber) &&
    consented &&
    selection.locker.status === "available" &&
    !isSubmitting &&
    !isRequested,
  );

  const submit = async () => {
    if (!canSubmit || !onSubmit || !credentials || lock.current) return;
    lock.current = true;
    setIsSubmitting(true);
    setError("");
    try {
      await onSubmit({
        zoneId: selection.zone.id,
        lockerId: selection.locker.id,
        name: values.name.trim(),
        department: values.department.trim(),
        studentNumber: values.studentNumber,
        requestNote: values.requestNote.trim(),
        credentials,
      });
      setIsRequested(true);
    } catch {
      setError("대여 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
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
    isRequested,
    error,
    canSubmit,
    submit,
  };
};
