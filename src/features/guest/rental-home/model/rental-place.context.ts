import { createContext, useContext } from "react";
import type { RentalPlace } from "../api/organization.api";

export const RentalPlaceContext = createContext<{
  place: RentalPlace;
  navigationState: Record<string, unknown>;
} | null>(null);
export const useRentalPlace = () => {
  const context = useContext(RentalPlaceContext);
  if (!context) throw new Error("대여지 정보를 확인할 수 없습니다.");
  return context;
};
