import { useState } from "react";
import type { VerificationMethod } from "../../rent/submit/hooks/useRentalVerification";
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
  LockerRentalPlace,
  LockerSelection,
  SubmitLockerRental,
} from "../types";
import { LockerRequestPendingPage } from "./LockerRequestPendingPage";

export type LockerRequestPageProps = {
  place: LockerRentalPlace;
  selection: LockerSelection;
  onBack: () => void;
  onSubmit?: SubmitLockerRental;
  onApprove?: () => void;
  verificationMethod?: VerificationMethod;
  startsAt?: Date;
};

export const LockerRequestPage = ({
  place,
  selection,
  onBack,
  onSubmit,
  onApprove,
  verificationMethod = "phone",
  startsAt,
}: LockerRequestPageProps) => {
  const [startDate] = useState(() => startsAt ?? new Date());
  const form = useLockerRequest(selection, onSubmit);
  const hasCollateral =
    place.guaranteedGoods && place.guaranteedGoods !== "없음";
  const description = `대여 물품 연체 시 ${verificationMethod === "phone" ? "카카오톡" : "이메일"}으로 반납 안내가 발송됩니다.${hasCollateral ? " 대여 시 보증물품을 맡겨야하며, 맡기신 물품은 대여 물품 반납 시 돌려드립니다." : ""}`;

  if (form.isRequested)
    return (
      <LockerRequestPendingPage
        onApprove={onApprove}
        verificationMethod={verificationMethod}
      />
    );
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
          onChange={form.setValues}
          verificationMethod={verificationMethod}
          onVerificationChange={form.updateCredentials}
          disabled={form.isSubmitting}
        />
        <ConsentSection aria-labelledby="locker-consent-title">
          <h2 id="locker-consent-title">대여 유의사항</h2>
          <ConsentCard
            description={description}
            checked={form.consented}
            disabled={form.isSubmitting}
            onChange={form.setConsented}
          />
          <ApprovalNotice>관리자 승인 후 대여가 완료됩니다</ApprovalNotice>
        </ConsentSection>
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
