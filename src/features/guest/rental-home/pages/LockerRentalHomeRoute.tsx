import { useNavigate, useSearchParams } from "react-router-dom";
import { LockerHomePage } from "../../locker-rental/pages/LockerHomePage";
import { LockerFeedback } from "../components/LockerFeedback";
import { lockerErrorMessage } from "../model/locker.errors";
import { useLockerLayout, useLockerZones } from "../hooks/useLockerQueries";
import { mapLockerLayout, mapLockerZone } from "../model/locker.mappers";
import {
  getSelectedLockerId,
  rentalHomePath,
  rentalSubmitPath,
} from "../routes";
import { useRentalPlace } from "../model/rental-place.context";

export const LockerRentalHomeRoute = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { place, navigationState } = useRentalPlace();
  const organizationId = place.id;
  const zones = useLockerZones(organizationId);
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
      placeName={place.name}
      zones={mappedZones}
      zoneId={zoneId}
      lockerId={getSelectedLockerId(params)}
      loading={Boolean(zoneId) && layout.isPending}
      error={
        layout.isError
          ? lockerErrorMessage(layout.error, "사물함을 불러오지 못했습니다.")
          : undefined
      }
      onRetry={() => void layout.refetch()}
      onBack={onBack}
      onItems={() =>
        navigate(rentalHomePath(params, "item"), { state: navigationState })
      }
      onZoneChange={(id) => {
        const next = new URLSearchParams(params);
        next.set("zone", id);
        next.delete("lockerId");
        navigate(rentalHomePath(next, "locker"), {
          replace: true,
          state: navigationState,
        });
      }}
      onSelectLocker={(id) => {
        const next = new URLSearchParams(params);
        next.set("zone", zoneId);
        if (id) next.set("lockerId", id);
        else next.delete("lockerId");
        navigate(rentalHomePath(next, "locker"), {
          replace: true,
          state: navigationState,
        });
      }}
      onRequest={({ zone, locker }) => {
        const next = new URLSearchParams(params);
        next.set("zone", zone.id);
        next.set("lockerId", locker.id);
        next.delete("publicId");
        next.delete("preview");
        navigate(rentalSubmitPath(next), { state: navigationState });
      }}
    />
  );
};
