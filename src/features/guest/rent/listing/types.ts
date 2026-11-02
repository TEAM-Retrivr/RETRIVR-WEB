import type {
  ItemDetailResponse,
  ItemResponse,
} from "../../../../api/client/client.type";

export type RentalItem = ItemResponse["items"][number];
export type RentalUnit = NonNullable<ItemDetailResponse["itemUnits"]>[number];
export type RentalTab = "items" | "lockers";

export type RentalListingState = {
  organizationId?: number;
  orgId?: number;
  organizationName?: string;
  profileImageUrl?: string | null;
  description?: string;
};

export const getOrganizationId = (state: RentalListingState | null): number => {
  const id = state?.organizationId ?? state?.orgId;
  return typeof id === "number" && Number.isSafeInteger(id) && id > 0 ? id : 0;
};

export const isUnitAvailable = (unit: RentalUnit) =>
  Number.isSafeInteger(unit.itemUnitId) &&
  unit.itemUnitId > 0 &&
  unit.status === "AVAILABLE";
