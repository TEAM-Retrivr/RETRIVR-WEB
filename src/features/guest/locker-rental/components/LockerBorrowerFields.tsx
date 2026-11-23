import type { Dispatch, SetStateAction } from "react";
import TextField from "../../../common/components/form/TextField";
import ContactVerificationField from "../../rent/submit/components/form/ContactVerificationField";
import type {
  RentalVerificationCredentials,
  VerificationMethod,
} from "../../rent/submit/hooks/useRentalVerification";
import {
  BorrowerSection,
  Fields,
  SectionHeading,
} from "./LockerRequest.styles";

export type LockerBorrowerValues = {
  name: string;
  department: string;
  studentNumber: string;
  requestNote: string;
};

export const LockerBorrowerFields = ({
  values,
  onChange,
  onVerificationChange,
  verificationMethod,
  disabled,
}: {
  values: LockerBorrowerValues;
  onChange: Dispatch<SetStateAction<LockerBorrowerValues>>;
  onVerificationChange: (
    credentials: RentalVerificationCredentials | null,
  ) => void;
  verificationMethod: VerificationMethod;
  disabled: boolean;
}) => {
  const update = (field: keyof LockerBorrowerValues, value: string) =>
    onChange((current) => ({ ...current, [field]: value }));
  return (
    <BorrowerSection aria-labelledby="locker-borrower-title">
      <SectionHeading>
        <h2 id="locker-borrower-title">대여자 정보 입력</h2>
        <span>*답변 필수</span>
      </SectionHeading>
      <Fields disabled={disabled}>
        <TextField
          label="이름"
          name="name"
          placeholder="홍길동"
          autoComplete="name"
          maxLength={50}
          required
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
        />
        <ContactVerificationField
          method={verificationMethod}
          onVerificationChange={onVerificationChange}
        />
        <TextField
          label="학과"
          name="department"
          placeholder="경영학과"
          maxLength={100}
          required
          value={values.department}
          onChange={(event) => update("department", event.target.value)}
        />
        <TextField
          label="학번"
          name="studentNumber"
          placeholder="202600000"
          inputMode="numeric"
          maxLength={20}
          required
          value={values.studentNumber}
          onChange={(event) =>
            update("studentNumber", event.target.value.replace(/\D/g, ""))
          }
        />
        <TextField
          label="요청사항"
          name="requestNote"
          placeholder="ex. 반납기한 연장"
          hint={`${values.requestNote.length}/30자`}
          multiline
          rows={1}
          maxLength={30}
          value={values.requestNote}
          onChange={(event) =>
            update("requestNote", event.target.value.slice(0, 30))
          }
        />
      </Fields>
    </BorrowerSection>
  );
};
