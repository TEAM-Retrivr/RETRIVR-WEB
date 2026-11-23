import type { ReactNode } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  findRentalOrganizationByName,
  getRentalOrganization,
  type RentalPlace,
} from "../api/organization.api";
import { RentalPlaceContext } from "../model/rental-place.context";
import { lockerErrorMessage } from "../model/locker.errors";
import { getRentalType, rentalRoutePath } from "../routes";
import { LockerFeedback } from "./LockerFeedback";

const isPlace = (value: unknown): value is RentalPlace => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as RentalPlace;
  return (
    Number.isSafeInteger(candidate.id) &&
    candidate.id > 0 &&
    typeof candidate.name === "string" &&
    Boolean(candidate.name.trim())
  );
};

export const RentalPlaceProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = getRentalType(params);
  const name = params.get("place")?.trim().normalize("NFC") ?? "";
  const legacyId = Number(params.get("organizationId"));
  const validLegacyId = Number.isSafeInteger(legacyId) && legacyId > 0;
  const state: Record<string, unknown> =
    location.state && typeof location.state === "object" ? location.state : {};
  const selected =
    isPlace(state.rentalPlace) &&
    state.rentalPlace.name.trim().normalize("NFC") === name
      ? state.rentalPlace
      : undefined;
  const resolution = useQuery({
    queryKey: [
      "renewal",
      "rental-place",
      name,
      name ? (selected?.id ?? null) : legacyId,
    ],
    queryFn: ({ signal }) =>
      selected
        ? getRentalOrganization(selected.id, signal)
        : name
          ? findRentalOrganizationByName(name, signal)
          : getRentalOrganization(legacyId, signal),
    initialData: selected,
    staleTime: 5 * 60_000,
    enabled: type !== null && Boolean(name || validLegacyId),
    retry: false,
  });
  const onBack = () => navigate("/renewal/place-search");
  if (!type)
    return (
      <LockerFeedback
        message="물품 대여와 사물함 대여 중 하나만 선택해주세요."
        onBack={onBack}
      />
    );
  if (!name && !validLegacyId)
    return (
      <LockerFeedback message="대여지를 먼저 선택해주세요." onBack={onBack} />
    );
  if (resolution.isPending)
    return (
      <LockerFeedback
        message="대여지 정보를 확인하고 있습니다."
        onBack={onBack}
      />
    );
  if (resolution.isError)
    return (
      <LockerFeedback
        message={lockerErrorMessage(
          resolution.error,
          "대여지 정보를 확인하지 못했습니다.",
        )}
        onBack={onBack}
        onRetry={() => void resolution.refetch()}
      />
    );
  const place = resolution.data;
  const navigationState = { ...state, rentalPlace: place };
  const target = rentalRoutePath(location.pathname, params, type, place.name);
  if (
    target !== `${location.pathname}${location.search}` ||
    !selected ||
    selected.id !== place.id
  )
    return <Navigate to={target} state={navigationState} replace />;
  return (
    <RentalPlaceContext.Provider value={{ place, navigationState }}>
      {children}
    </RentalPlaceContext.Provider>
  );
};
