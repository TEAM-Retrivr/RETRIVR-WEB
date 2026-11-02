import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { theme } from "../../../../../common/styles/theme";
export const Card = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 88px;
  padding: 16px 20px;
  border: 0;
  border-radius: 20px;
  text-align: left;
  background: ${theme.colors.gray[0]};
  color: ${theme.colors.gray[900]};
  cursor: pointer;
  &[aria-busy="true"] {
    cursor: progress;
  }
  &:disabled {
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.sky[500]};
    outline-offset: 2px;
  }
`;
export const ItemText = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  gap: 1px;
  font-family: ${theme.fontFamily.primary};
`;
export const Name = styled.span`
  ${theme.typography.heading2};
  overflow-wrap: anywhere;
`;
export const Description = styled.span`
  ${theme.typography.body2};
  color: ${theme.colors.gray[700]};
  overflow-wrap: anywhere;
`;
export const Unavailable = styled.span`
  ${theme.typography.body2};
  color: ${theme.colors.gray[500]};
`;
const spin = keyframes`to { transform: rotate(360deg); }`;
export const LoadingSlot = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 56px;
  width: 56px;
  height: 56px;
`;
export const Spinner = styled.span`
  width: 24px;
  height: 24px;
  border: 3px solid ${theme.colors.gray[200]};
  border-top-color: ${theme.colors.sky[500]};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
