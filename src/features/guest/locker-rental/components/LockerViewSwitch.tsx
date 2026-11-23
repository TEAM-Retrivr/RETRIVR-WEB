import gridIcon from "../assets/grid.png";
import listIcon from "../assets/list.svg";
import type { LockerView } from "../types";
import { ViewButton, ViewSwitch } from "./LockerHome.styles";

export const LockerViewSwitch = ({
  value,
  onChange,
}: {
  value: LockerView;
  onChange: (view: LockerView) => void;
}) => (
  <ViewSwitch role="group" aria-label="사물함 보기 방식">
    <ViewButton
      type="button"
      $active={value === "layout"}
      aria-pressed={value === "layout"}
      aria-label="배치도 보기"
      onClick={() => onChange("layout")}
    >
      <img src={gridIcon} alt="" width={20} height={20} />
    </ViewButton>
    <ViewButton
      type="button"
      $active={value === "list"}
      aria-pressed={value === "list"}
      aria-label="목록 보기"
      onClick={() => onChange("list")}
    >
      <img src={listIcon} alt="" width={20} height={20} />
    </ViewButton>
  </ViewSwitch>
);
