export type RentalType = "item" | "locker";

export const rentalHomePath = (params: URLSearchParams, type: RentalType) => {
  const next = new URLSearchParams(params);
  next.set("type", type);
  next.delete("step");
  if (type === "item") {
    next.delete("zone");
    next.delete("locker");
  }
  return `/renewal/rental-home/?${next}`;
};
