import { useState } from "react";
import { LockerActionBar } from "../components/LockerActionBar";
import { LockerBorrowerFields } from "../components/LockerBorrowerFields";
import { LockerHeader } from "../components/LockerHeader";
import { LockerLayout } from "../components/LockerLayout";
import { LockerSummaryCard } from "../components/LockerSummaryCard";
import {
  ApprovalNotice,
  ConsentCard,
  ConsentSection,
  RequestForm,
  SubmitError,
  SummaryArea,
} from "../components/LockerRequest.styles";
import { useLockerRequest } from "../hooks/useLockerRequest";
import type {
  LockerBorrowerField,
  LockerRentalPlace,
  LockerSelection,
  SubmitLockerRental,
} from "../types";
import type { LockerRentalResponse } from "../../rental-home/api/locker.types";

export type LockerRequestPageProps = {
  place: LockerRentalPlace;
  selection: LockerSelection;
  fields: LockerBorrowerField[];
  terms: string;
  termsVersion: number;
  onBack: () => void;
  onSubmit: SubmitLockerRental;
  onRequested: (result: LockerRentalResponse) => void;
};

export const LockerRequestPage = ({
  place,
  selection,
  fields,
  terms,
  termsVersion,
  onBack,
  onSubmit,
  onRequested,
}: LockerRequestPageProps) => {
  const [startDate] = useState(() => new Date());
  const form = useLockerRequest(
    selection,
    fields,
    termsVersion,
    onSubmit,
    onRequested,
  );
  const consentTitle = "대여 및 반납 안내를 확인하고 동의합니다.";
  const consentDescription = terms.startsWith(consentTitle)
    ? terms.slice(consentTitle.length).trim()
    : terms;
  return (
    <LockerLayout scrollable>
      <LockerHeader placeName={place.name} request onBack={onBack} />
      <RequestForm
        onSubmit={(event) => {
          event.preventDefault();
          void form.submit();
        }}
        aria-busy={form.isSubmitting}
      >
        <SummaryArea>
          <LockerSummaryCard
            selection={selection}
            place={place}
            startsAt={startDate}
          />
        </SummaryArea>
        <LockerBorrowerFields
          values={form.values}
          fields={fields}
          onChange={form.setValues}
          onVerificationChange={form.updateCredentials}
          disabled={form.isSubmitting}
        />
        <ConsentSection aria-labelledby="locker-consent-title">
          <h2 id="locker-consent-title">대여 유의사항</h2>
          <ConsentCard
            description={consentDescription}
            checked={form.consented}
            disabled={form.isSubmitting}
            onChange={form.setConsented}
          />
          <ApprovalNotice>관리자 승인 후 대여가 완료됩니다</ApprovalNotice>
        </ConsentSection>
        {selection.locker.status !== "available" && (
          <SubmitError role="alert">
            현재 대여할 수 없는 사물함입니다. 목록에서 다시 선택해주세요.
          </SubmitError>
        )}
        {form.error && <SubmitError role="alert">{form.error}</SubmitError>}
        <LockerActionBar
          submit
          label={form.isSubmitting ? "요청 중" : "대여하기"}
          disabled={!form.canSubmit}
        />
      </RequestForm>
    </LockerLayout>
  );
};
