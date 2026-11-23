import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LockerRequestPendingPage } from "../../locker-rental/pages/LockerRequestPendingPage";
import { LockerManagerApprovalDialog } from "../components/LockerManagerApprovalDialog";
import { LockerFeedback } from "../components/LockerFeedback";
import { lockerErrorMessage } from "../model/locker.errors";
import {
  useApproveLockerRental,
  useLockerRentalStatus,
} from "../hooks/useLockerQueries";
import { rentalHomePath } from "../routes";
import type { LockerRentalStatus } from "../api/locker.types";

export const LockerRentalStatusRoute = ({ publicId }: { publicId: string }) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [processed, setProcessed] = useState<LockerRentalStatus | null>(null);
  const approval = useApproveLockerRental(publicId);
  const status = useLockerRentalStatus(publicId, processed !== null);
  const onHome = () => {
    const next = new URLSearchParams(params);
    next.delete("publicId");
    next.delete("locker");
    navigate(rentalHomePath(next, "locker"), { replace: true });
  };
  if (status.isPending)
    return (
      <LockerFeedback
        message="대여 요청 상태를 확인하고 있습니다."
        onBack={onHome}
      />
    );
  if (status.isError && !processed)
    return (
      <LockerFeedback
        message={lockerErrorMessage(
          status.error,
          "대여 요청 상태를 불러오지 못했습니다.",
        )}
        onBack={onHome}
        onRetry={() => void status.refetch()}
      />
    );
  const current = processed ?? status.data?.status ?? "REQUESTED";
  return (
    <>
      <LockerRequestPendingPage
        status={current}
        onHome={onHome}
        onApprove={() => setOpen(true)}
      />
      {open && current === "REQUESTED" && (
        <LockerManagerApprovalDialog
          onClose={() => {
            if (!approval.isPending) setOpen(false);
          }}
          onSubmit={async (input) => {
            const organizationId = Number(params.get("organizationId"));
            try {
              const result = await approval.mutateAsync({
                ...input,
                organizationId:
                  Number.isSafeInteger(organizationId) && organizationId > 0
                    ? organizationId
                    : undefined,
              });
              setProcessed(result.status);
              setOpen(false);
            } finally {
              // 완료/실패 후 로그인 입력값을 mutation observer/cache에 남기지 않는다.
              approval.reset();
            }
          }}
        />
      )}
    </>
  );
};
