import { Button, ButtonLabel } from "./NavigationButton.styles";
type NavigationButtonProps = {
  label: string;
  onClick: () => void;
};

export const NavigationButton = ({ label, onClick }: NavigationButtonProps) => (
  <Button type="button" onClick={onClick}>
    <ButtonLabel>{label}</ButtonLabel>
  </Button>
);
