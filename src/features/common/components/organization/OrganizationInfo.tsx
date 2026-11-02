import type { ReactNode } from "react";
import {
  OrganizationSection,
  Identity,
  Icon,
  Name,
  Description,
} from "./OrganizationInfo.styles";
type Props = { icon: ReactNode; name: string; description?: string };
export const OrganizationInfo = ({ icon, name, description }: Props) => (
  <OrganizationSection aria-label="대여지 정보">
    <Identity>
      <Icon>{icon}</Icon>
      <Name>{name}</Name>
    </Identity>
    {description?.trim() && <Description>{description}</Description>}
  </OrganizationSection>
);
