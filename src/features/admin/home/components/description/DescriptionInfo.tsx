import type { ReactNode } from "react";
import {
  Description,
  AdminInfoSection,
  IconSection,
  NameSection,
  DescriptionSection,
} from "./DescriptionInfo.styles";

type DescriptionInfoProps = {
  icon: ReactNode;
  name: string;
  description: string;
};

export const DescriptionInfo = ({
  icon,
  name,
  description,
}: DescriptionInfoProps) => {
  return (
    <Description>
      <AdminInfoSection>
        <IconSection>{icon}</IconSection>
        <NameSection>{name}</NameSection>
      </AdminInfoSection>
      <DescriptionSection>{description}</DescriptionSection>
    </Description>
  );
};
