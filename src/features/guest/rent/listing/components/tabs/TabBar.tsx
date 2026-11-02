import { useRef } from "react";
import type { RentalTab } from "../../types";
import Tab from "./Tab";
import { Bar, Indicator } from "./TabBar.styles";
const tabs = [
  { id: "items", label: "물품 대여" },
  { id: "lockers", label: "사물함 대여" },
] as const;
type TabBarProps = { value: RentalTab; onChange: (tab: RentalTab) => void };
const TabBar = ({ value, onChange }: TabBarProps) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = tabs.findIndex((tab) => tab.id === value);
  return (
    <Bar role="tablist" aria-label="대여 종류">
      {tabs.map((tab, index) => (
        <Tab
          key={tab.id}
          id={`rental-tab-${tab.id}`}
          aria-controls={`rental-panel-${tab.id}`}
          active={value === tab.id}
          ref={(element) => {
            refs.current[index] = element;
          }}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => {
            let next: number;
            if (event.key === "ArrowRight" || event.key === "ArrowLeft")
              next = 1 - index;
            else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = 1;
            else return;
            event.preventDefault();
            onChange(tabs[next].id);
            refs.current[next]?.focus();
          }}
        >
          {tab.label}
        </Tab>
      ))}
      <Indicator aria-hidden="true" $index={activeIndex} />
    </Bar>
  );
};
export default TabBar;
