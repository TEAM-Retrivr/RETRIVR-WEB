import styled from "@emotion/styled";
import ButtonBar from "../../../common/components/buttons/ButtonBar";
import { theme } from "../../../common/styles/theme";

const Footer = styled.div<{ $floating: boolean }>`
  z-index: 1;
  padding: 12px 20px max(20px, env(safe-area-inset-bottom));
  background: ${theme.colors.gray[0]};
  box-shadow: ${({ $floating }) =>
    $floating ? "0 4px 16px rgb(0 0 0 / 8%)" : "none"};
`;

const Action = styled(ButtonBar)`
  font-weight: ${theme.fontWeight.semibold};
  &:disabled {
    background: ${theme.colors.gray[100]};
  }
`;

export const LockerActionBar = ({
  label,
  disabled,
  onClick,
  submit = false,
  floating = false,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  submit?: boolean;
  floating?: boolean;
}) => (
  <Footer $floating={floating}>
    <Action
      label={label}
      disabled={disabled}
      onClick={onClick}
      type={submit ? "submit" : "button"}
    />
  </Footer>
);
