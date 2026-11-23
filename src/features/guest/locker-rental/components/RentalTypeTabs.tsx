import { RentalTab, RentalTabs } from "./LockerHome.styles";

export const RentalTypeTabs = ({ onItems }: { onItems: () => void }) => (
  <RentalTabs aria-label="대여 종류">
    <RentalTab type="button" onClick={onItems}>
      물품 대여
    </RentalTab>
    <RentalTab type="button" $active aria-current="page">
      사물함 대여
    </RentalTab>
  </RentalTabs>
);
