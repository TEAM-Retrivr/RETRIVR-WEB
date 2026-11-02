import type { ComponentProps } from "react";
import { TabButton } from "./Tab.styles";

type TabProps = ComponentProps<"button"> & { active: boolean };

const Tab = ({ active, children, ...props }: TabProps) => (
  <TabButton
    {...props}
    type="button"
    role="tab"
    aria-selected={active}
    tabIndex={active ? 0 : -1}
    $active={active}
  >
    {children}
  </TabButton>
);
export default Tab;
