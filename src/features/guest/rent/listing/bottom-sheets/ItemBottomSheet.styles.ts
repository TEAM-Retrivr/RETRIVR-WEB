import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { theme } from "../../../../common/styles/theme";
export const enter = keyframes`from { transform: translateY(100%); } to { transform: translateY(0); }`;
export const exit = keyframes`from { transform: var(--sheet-exit-start, translateY(0)); } to { transform: translateY(100%); }`;
export const SHEET_ANIMATION_MS = 320;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeOut = keyframes`from { opacity: 1; } to { opacity: 0; }`;
export const Dialog = styled.dialog<{
  $openingHeight: number | null;
  $exitStartTransform: string;
}>`
  --sheet-exit-start: ${({ $exitStartTransform }) => $exitStartTransform};
  position: fixed;
  inset: auto 0 max(0px, calc((100dvh - 844px) / 2));
  box-sizing: border-box;
  width: min(390px, 100%);
  max-width: 390px;
  max-height: min(784px, 90dvh);
  height: ${({ $openingHeight }) =>
    $openingHeight === null ? "auto" : `${$openingHeight}px`};
  margin: 0 auto;
  padding: 8px 20px max(20px, env(safe-area-inset-bottom));
  overflow-y: auto;
  border: 0;
  border-radius: 24px 24px 0 0;
  background: ${theme.colors.gray[0]};
  color: ${theme.colors.gray[900]};
  overscroll-behavior: contain;
  opacity: 0;
  transform: translateY(100%);
  &[open][data-ready="true"] {
    opacity: 1;
    transform: translateY(0);
    animation: ${enter} ${SHEET_ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  &[open][data-closing="true"] {
    opacity: 1;
    transform: translateY(100%);
    animation: ${exit} ${SHEET_ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1);
    animation-fill-mode: both;
  }
  &::backdrop {
    background: rgb(0 0 0 / 30%);
    opacity: 0;
  }
  &[data-ready="true"]::backdrop {
    opacity: 1;
    animation: ${fadeIn} 180ms ease-out;
  }
  &[data-closing="true"]::backdrop {
    opacity: 0;
    animation: ${fadeOut} 180ms ease-out both;
  }
  @media (prefers-reduced-motion: reduce) {
    &[open][data-ready="true"],
    &[open][data-closing="true"],
    &[data-ready="true"]::backdrop,
    &[data-closing="true"]::backdrop {
      animation: none;
    }
  }
`;
export const Body = styled.div`
  width: 100%;
`;
export const Handle = styled.button`
  display: block;
  width: 50px;
  height: 6px;
  min-height: 6px;
  padding: 0;
  margin: 0 auto 16px;
  border: 0;
  border-radius: 3px;
  background: ${theme.colors.gray[200]};
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid ${theme.colors.sky[500]};
    outline-offset: 4px;
  }
`;
export const Feedback = styled.div`
  padding: 20px 0;
  font-family: ${theme.fontFamily.primary};
  ${theme.typography.body2};
  text-align: center;
  button {
    display: block;
    margin: 12px auto 0;
    color: ${theme.colors.sky[700]};
    cursor: pointer;
  }
`;
