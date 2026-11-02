import styled from "@emotion/styled";
import { theme } from "../../../../../common/styles/theme";
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
export const Selection = styled.div`
  overflow: hidden;
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: 12px;
`;
export const Select = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 20px;
  border: 0;
  background: ${theme.colors.gray[0]};
  color: ${theme.colors.gray[900]};
  font-family: ${theme.fontFamily.primary};
  ${theme.typography.label1};
  cursor: pointer;
  span {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;
export const Chevron = styled.img<{ $open: boolean }>`
  display: block;
  flex-shrink: 0;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform 0.2s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
export const Collapse = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $expanded }) => ($expanded ? "1fr" : "0fr")};
  opacity: ${({ $expanded }) => ($expanded ? 1 : 0)};
  transition:
    grid-template-rows 240ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 180ms ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
export const CollapseBody = styled.div`
  min-height: 0;
  overflow: hidden;
`;
export const UnitList = styled.div`
  max-height: 280px;
  overflow-y: auto;
  border-top: 1px solid ${theme.colors.gray[200]};
`;
export const UnitOption = styled.div<{ $selected: boolean }>`
  background: ${({ $selected }) =>
    $selected ? theme.colors.sky[50] : theme.colors.gray[0]};
  & + & {
    border-top: 1px solid ${theme.colors.gray[200]};
  }
`;
