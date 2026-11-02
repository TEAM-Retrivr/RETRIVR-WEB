import styled from "@emotion/styled";
import { theme } from "../../../../../common/styles/theme";

export const TabButton = styled.button<{ $active: boolean }>`
  min-width: 0;
  padding: 12px;
  border: 0;
  background: transparent;
  color: ${({ $active }) =>
    $active ? theme.colors.sky[500] : theme.colors.gray[500]};
  font-family: ${theme.fontFamily.primary};
  ${theme.typography.heading3};
  cursor: pointer;
  transition: color 0.5s ease;
  &:focus-visible {
    outline: 2px solid ${theme.colors.sky[500]};
    outline-offset: -4px;
  }
`;
