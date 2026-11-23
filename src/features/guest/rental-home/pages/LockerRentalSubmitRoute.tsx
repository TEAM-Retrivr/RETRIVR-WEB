import { useNavigate, useSearchParams } from "react-router-dom";
import { LockerRequestPage } from "../../locker-rental/pages/LockerRequestPage";
import { isLockerId } from "../api/locker.api";
import { LockerFeedback } from "../components/LockerFeedback";
import { lockerErrorMessage } from "../model/locker.errors";
import {
  useCreateLockerRental,
  useLockerRentalForm,
} from "../hooks/useLockerQueries";
import { mapLocker, mapLockerZone } from "../model/locker.mappers";
import { lockerRequestBody } from "../model/locker.request";
import { rentalHomePath } from "../routes";
import { LockerRentalStatusRoute } from "./LockerRentalStatusRoute";

export const LockerRentalSubmitRoute = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const publicId = params.get("publicId") ?? "";
  const lockerId = params.get("locker") ?? "";
  const form = useLockerRentalForm(publicId ? "" : lockerId);
  const createRental = useCreateLockerRental();
  const onBack = () =>
    navigate(rentalHomePath(params, "locker"), { replace: true });

  if (publicId)
    return <LockerRentalStatusRoute key={publicId} publicId={publicId} />;
  if (!isLockerId(lockerId))
    return (
      <LockerFeedback
        message="목록에서 대여할 사물함을 선택해주세요."
        onBack={onBack}
      />
    );
  if (form.isPending)
    return (
      <LockerFeedback
        message="대여 신청 정보를 불러오고 있습니다."
        onBack={onBack}
      />
    );
  if (form.isError)
    return (
      <LockerFeedback
        message={lockerErrorMessage(
          form.error,
          "대여 신청 정보를 불러오지 못했습니다.",
        )}
        onBack={onBack}
        onRetry={() => void form.refetch()}
      />
    );
  const data = form.data;
  return (
    <LockerRequestPage
      key={`${lockerId}:${data.policy.termsVersion}`}
      place={{
        name: data.organizationName,
        rentalDays: data.policy.rentalDays,
        guaranteedGoods: data.policy.collateral,
        startDate: data.startDate,
        dueDate: data.dueDate,
      }}
      selection={{
        zone: mapLockerZone(data.zone),
        locker: mapLocker(data.locker),
      }}
      fields={data.policy.borrowerFields}
      terms={data.policy.terms}
      termsVersion={data.policy.termsVersion}
      onBack={onBack}
      onSubmit={(request) =>
        createRental.mutateAsync({
          lockerId: request.lockerId,
          body: lockerRequestBody(request),
        })
      }
      onRequested={(result) => {
        const next = new URLSearchParams(params);
        next.set("publicId", result.publicId);
        next.delete("preview");
        next.delete("step");
        navigate(`/renewal/rental-submit?${next}`, { replace: true });
      }}
    />
  );
};
