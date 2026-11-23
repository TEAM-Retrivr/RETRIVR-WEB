import { useNavigate, useSearchParams } from "react-router-dom";
import { LockerHomePage } from "../../locker-rental/pages/LockerHomePage";
import { LockerFeedback } from "../components/LockerFeedback";
import { lockerErrorMessage } from "../model/locker.errors";
import {
  useLockerLayout,
  useLockerOrganization,
  useLockerZones,
} from "../hooks/useLockerQueries";
import { mapLockerLayout, mapLockerZone } from "../model/locker.mappers";
import { rentalHomePath } from "../routes";

export const LockerRentalHomeRoute = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const organizationId = Number(params.get("organizationId"));
  const validOrganization =
    Number.isSafeInteger(organizationId) && organizationId > 0;
  const zones = useLockerZones(organizationId);
  const organization = useLockerOrganization(organizationId);
  const summaries = zones.data?.zones ?? [];
  const selectedZone =
    summaries.find((zone) => zone.zoneId === params.get("zone")) ??
    summaries[0];
  const zoneId = selectedZone?.zoneId ?? "";
  const layout = useLockerLayout(zoneId);
  const mappedZones = summaries.map((zone) =>
    zone.zoneId === layout.data?.zone.zoneId
      ? mapLockerLayout(layout.data)
      : mapLockerZone(zone),
  );
  const onBack = () => navigate("/renewal/place-search");

  if (!validOrganization)
    return (
      <LockerFeedback message="대여지를 먼저 선택해주세요." onBack={onBack} />
    );
  if (zones.isPending)
    return (
      <LockerFeedback
        message="사물함 구역을 불러오고 있습니다."
        onBack={onBack}
      />
    );
  if (zones.isError)
    return (
      <LockerFeedback
        message={lockerErrorMessage(
          zones.error,
          "사물함 구역을 불러오지 못했습니다.",
        )}
        onBack={onBack}
        onRetry={() => void zones.refetch()}
      />
    );

  return (
    <LockerHomePage
      placeName={organization.data?.name || "사물함 대여"}
      zones={mappedZones}
      zoneId={zoneId}
      lockerId={params.get("locker") ?? undefined}
      loading={Boolean(zoneId) && layout.isPending}
      error={
        layout.isError
          ? lockerErrorMessage(layout.error, "사물함을 불러오지 못했습니다.")
          : undefined
      }
      onRetry={() => void layout.refetch()}
      onBack={onBack}
      onItems={() => navigate(rentalHomePath(params, "item"))}
      onZoneChange={(id) => {
        const next = new URLSearchParams(params);
        next.set("zone", id);
        next.delete("locker");
        setParams(next, { replace: true });
      }}
      onSelectLocker={(id) => {
        const next = new URLSearchParams(params);
        next.set("zone", zoneId);
        if (id) next.set("locker", id);
        else next.delete("locker");
        setParams(next, { replace: true });
      }}
      onRequest={({ zone, locker }) => {
        const next = new URLSearchParams(params);
        next.set("zone", zone.id);
        next.set("locker", locker.id);
        next.set("type", "locker");
        next.delete("publicId");
        next.delete("preview");
        navigate(`/renewal/rental-submit?${next}`);
      }}
    />
  );
};
