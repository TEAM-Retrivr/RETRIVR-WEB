import styled from "@emotion/styled";
import { theme } from "../../../../common/styles/theme";

export const Wrapper = styled.div`
  width: 100%;
  min-width: 0;
`;

export const VerificationButton = styled.button<{
  $variant: "outline" | "solid";
}>`
  box-sizing: border-box;
  flex-shrink: 0;
  min-width: 95px;
  height: 36px;
  padding: 8px 11px;
  border: 1px solid
    ${({ $variant }) =>
      $variant === "outline" ? theme.colors.sky[500] : "transparent"};
  border-radius: 6px;
  background-color: ${({ $variant }) =>
    $variant === "solid" ? theme.colors.sky[500] : theme.colors.gray[0]};
  font-family: ${theme.fontFamily.primary};
  color: ${({ $variant }) =>
    $variant === "solid" ? theme.colors.gray[0] : theme.colors.sky[500]};
  white-space: nowrap;
  cursor: pointer;
  ${theme.typography.label3};

  &:disabled {
    border-color: transparent;
    background-color: ${theme.colors.gray[0]};
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.sky[500]};
    outline-offset: 2px;
  }
`;

export const CodeReveal = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition:
    grid-template-rows 280ms ease-out,
    opacity 280ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const RevealClip = styled.div`
  min-height: 0;
  overflow: hidden;
`;

export const CodeContent = styled.div<{ $open: boolean }>`
  padding-top: 10px;
  transform: translateY(${({ $open }) => ($open ? "0" : "-8px")});
  transition: transform 280ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transform: none;
    transition: none;
  }
`;

export const Feedback = styled.p<{ $error?: boolean }>`
  margin: 8px 0 0;
  font-family: ${theme.fontFamily.primary};
  color: ${({ $error }) => ($error ? theme.colors.red : theme.colors.sky[500])};
  ${theme.typography.body3};
`;
