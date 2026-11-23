import type { Dispatch, SetStateAction } from "react";
import TextField from "../../../common/components/form/TextField";
import ContactVerificationField from "../../rent/submit/components/form/ContactVerificationField";
import type { RentalVerificationCredentials } from "../../rent/submit/hooks/useRentalVerification";
import type { LockerBorrowerField } from "../types";
import { lockerPhoneVerificationApi } from "../../rental-home/api/auth.api";
import {
  BorrowerSection,
  Fields,
  SectionHeading,
} from "./LockerRequest.styles";

export type LockerBorrowerValues = {
  name: string;
  additionalInfo: Record<string, string>;
  requestNote: string;
};
export const LockerBorrowerFields = ({
  values,
  fields,
  onChange,
  onVerificationChange,
  disabled,
}: {
  values: LockerBorrowerValues;
  fields: LockerBorrowerField[];
  onChange: Dispatch<SetStateAction<LockerBorrowerValues>>;
  onVerificationChange: (
    credentials: RentalVerificationCredentials | null,
  ) => void;
  disabled: boolean;
}) => (
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
        maxLength={255}
        required
        value={values.name}
        onChange={(event) =>
          onChange((current) => ({ ...current, name: event.target.value }))
        }
      />
      <ContactVerificationField
        api={lockerPhoneVerificationApi}
        method="phone"
        onVerificationChange={onVerificationChange}
      />
      {[...fields]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((field) => {
          const numeric =
            field.fieldKey === "studentId" || field.label === "학번";
          const value = values.additionalInfo[field.fieldKey];
          return (
            <TextField
              key={field.fieldKey}
              label={field.label}
              name={field.fieldKey}
              placeholder={
                field.label === "학과"
                  ? "경영학과"
                  : numeric
                    ? "202600000"
                    : `${field.label} 입력`
              }
              inputMode={numeric ? "numeric" : undefined}
              required={field.required}
              value={typeof value === "string" ? value : ""}
              onChange={(event) => {
                const next = numeric
                  ? event.target.value.replace(/\D/g, "")
                  : event.target.value;
                onChange((current) => ({
                  ...current,
                  additionalInfo: {
                    ...current.additionalInfo,
                    [field.fieldKey]: next,
                  },
                }));
              }}
            />
          );
        })}
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
          onChange((current) => ({
            ...current,
            requestNote: event.target.value.slice(0, 30),
          }))
        }
      />
    </Fields>
  </BorrowerSection>
);
