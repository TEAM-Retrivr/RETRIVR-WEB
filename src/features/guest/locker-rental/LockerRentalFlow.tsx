import { LockerRentalHomeRoute } from "../rental-home/pages/LockerRentalHomeRoute";
import { LockerRentalSubmitRoute } from "../rental-home/pages/LockerRentalSubmitRoute";

export const LockerRentalFlow = ({ screen }: { screen: "home" | "request" }) =>
  screen === "home" ? <LockerRentalHomeRoute /> : <LockerRentalSubmitRoute />;
