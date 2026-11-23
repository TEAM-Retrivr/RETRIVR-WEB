export type RentalType = "item" | "locker";

export const getRentalType = (params: URLSearchParams): RentalType | null => {
  const item = params.has("item") && params.get("item") === "";
  const locker = params.has("locker") && params.get("locker") === "";
  if (item && locker) return null;
  if (locker) return "locker";
  if (item) return "item";
  return params.get("type") === "locker" ? "locker" : "item";
};

export const getSelectedLockerId = (params: URLSearchParams) =>
  params.get("lockerId") ||
  (params.get("type") === "locker" ? params.get("locker") : null) ||
  "";

export const rentalRoutePath = (
  pathname: string,
  params: URLSearchParams,
  type: RentalType,
  placeName = params.get("place") ?? "",
) => {
  const next = new URLSearchParams();
  if (placeName.trim()) next.set("place", placeName.trim());
  next.set(type, "");
  const omitted = new Set([
    "organizationId",
    "place",
    "type",
    "item",
    "locker",
    "preview",
    "step",
  ]);
  for (const [key, value] of params) {
    if (!omitted.has(key)) next.append(key, value);
  }
  const lockerId = getSelectedLockerId(params);
  if (lockerId) next.set("lockerId", lockerId);
  if (type === "item") {
    next.delete("zone");
    next.delete("lockerId");
    next.delete("publicId");
  }
  const query = next.toString().replace(/(^|&)(item|locker)=(?=&|$)/g, "$1$2");
  return `${pathname}?${query}`;
};

export const rentalHomePath = (
  params: URLSearchParams,
  type: RentalType,
  placeName?: string,
) => {
  const next = new URLSearchParams(params);
  next.delete("publicId");
  return rentalRoutePath("/renewal/rental-home/", next, type, placeName);
};
export const rentalSubmitPath = (params: URLSearchParams) =>
  rentalRoutePath("/renewal/rental-submit", params, "locker");
