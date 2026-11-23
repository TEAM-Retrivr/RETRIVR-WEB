import { RentalTab, RentalTabs } from "./LockerHome.styles";

export const RentalTypeTabs = ({
  onItems,
  onLockers,
  type = "locker",
}: {
  onItems?: () => void;
  onLockers?: () => void;
  type?: "item" | "locker";
}) => (
  <RentalTabs aria-label="대여 종류">
    <RentalTab
      type="button"
      onClick={onItems}
      $active={type === "item"}
      aria-current={type === "item" ? "page" : undefined}
    >
      물품 대여
    </RentalTab>
    <RentalTab
      type="button"
      onClick={onLockers}
      $active={type === "locker"}
      aria-current={type === "locker" ? "page" : undefined}
    >
      사물함 대여
    </RentalTab>
  </RentalTabs>
);
