import { Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { LockerHomePage } from "./pages/LockerHomePage";
import { LockerRequestPage } from "./pages/LockerRequestPage";
import { LockerRequestPendingPage } from "./pages/LockerRequestPendingPage";
import { previewPlace, previewZones } from "./data/preview";
import { rentalHomePath } from "../rental-home/routes";
import type {
  LockerRentalPlace,
  LockerSelection,
  LockerZone,
  SubmitLockerRental,
} from "./types";

export type LockerRentalFlowProps = {
  screen: "home" | "request";
  place?: LockerRentalPlace;
  zones?: LockerZone[];
  onSubmit?: SubmitLockerRental;
};

export const LockerRentalFlow = ({
  screen,
  place: suppliedPlace,
  zones: suppliedZones,
  onSubmit,
}: LockerRentalFlowProps) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preview = import.meta.env.DEV && params.get("preview") === "1";
  const place =
    suppliedPlace ??
    (preview
      ? previewPlace
      : { name: "사물함 대여", rentalDays: 0, guaranteedGoods: "" });
  const zones = suppliedZones ?? (preview ? previewZones : []);
  const zone = zones.find((candidate) => candidate.id === params.get("zone"));
  const locker = zone?.lockers.find(
    (candidate) =>
      candidate.id === params.get("locker") && candidate.status === "available",
  );
  const selection = zone && locker ? { zone, locker } : undefined;
  const openRequest = ({ zone, locker }: LockerSelection) => {
    const next = new URLSearchParams(params);
    next.delete("step");
    next.set("zone", zone.id);
    next.set("locker", locker.id);
    next.set("type", "locker");
    navigate(`/renewal/rental-submit?${next}`);
  };
  const openHome = () => {
    const next = new URLSearchParams(params);
    next.delete("step");
    navigate(rentalHomePath(next, "locker"), { replace: true });
  };
  const openItems = () => {
    navigate(rentalHomePath(params, "item"));
  };

  if (screen === "request" && preview && params.get("step") === "pending")
    return <LockerRequestPendingPage />;
  if (screen === "request" && !selection) {
    return <Navigate to={rentalHomePath(params, "locker")} replace />;
  }
  if (screen === "request" && selection) {
    return (
      <LockerRequestPage
        key={selection.locker.id}
        place={place}
        selection={selection}
        onBack={openHome}
        onSubmit={onSubmit}
        startsAt={preview ? new Date(2026, 9, 17) : undefined}
      />
    );
  }
  return (
    <LockerHomePage
      place={place}
      zones={zones}
      initialZoneId={zone?.id}
      initialLockerId={locker?.id}
      onBack={() => navigate("/renewal/place-search")}
      onItems={openItems}
      onRequest={openRequest}
    />
  );
};
