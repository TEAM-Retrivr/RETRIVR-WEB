import styled from "@emotion/styled";
import { theme } from "../../styles/theme";

export const Wrapper = styled.button<{
  $variant: "primary" | "white";
  $size: number | string;
}>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => (typeof $size === "number" ? `${$size}px` : $size)};
  height: 52px;
  padding: 12px 20px;
  border: 1px solid
    ${({ $variant }) =>
      $variant === "white" ? theme.colors.gray[200] : "transparent"};
  border-radius: 99px;
  background-color: ${({ $variant }) =>
    $variant === "primary" ? theme.colors.sky[500] : theme.colors.gray[0]};
  color: ${({ $variant }) =>
    $variant === "primary" ? theme.colors.gray[0] : theme.colors.gray[900]};
  font-family: ${theme.fontFamily.primary};
  ${theme.typography.button.large};
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:disabled {
    border-color: transparent;
    background-color: ${theme.colors.gray[200]};
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.sky[500]};
    outline-offset: 2px;
  }
`;
