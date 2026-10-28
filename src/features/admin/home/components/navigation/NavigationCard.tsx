import type { ReactNode } from "react";
import { CardButton, CardLabel, IconSlot } from "./NavigationCard.styles";

type NavigationCardProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
};

export const NavigationCard = ({
  icon,
  label,
  onClick,
}: NavigationCardProps) => (
  <CardButton type="button" onClick={onClick}>
    <IconSlot aria-hidden="true">{icon}</IconSlot>
    <CardLabel>{label}</CardLabel>
  </CardButton>
);
