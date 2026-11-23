import styled from "@emotion/styled";
import { theme } from "../../../common/styles/theme";

export const RentalTabs = styled.nav`
  display: flex;
  height: 47px;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  background: ${theme.colors.gray[0]};
`;
export const RentalTab = styled.button<{ $active?: boolean }>`
  flex: 1;
  border-bottom: 1px solid
    ${({ $active }) => ($active ? theme.colors.sky[500] : "transparent")};
  color: ${({ $active }) =>
    $active ? theme.colors.sky[500] : theme.colors.gray[500]};
  ${theme.typography.heading3};
  cursor: pointer;
`;
export const Toolbar = styled.section`
  padding: 16px 0 12px;
  background: ${theme.colors.gray[0]};
`;
export const ToolbarTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 16px 0 20px;
  h1 {
    margin: 0;
    ${theme.typography.heading2};
  }
  @media (max-width: 370px) {
    h1 {
      ${theme.typography.label1};
      font-weight: ${theme.fontWeight.bold};
    }
  }
`;
export const ViewSwitch = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 2px;
  height: 40px;
  padding: 4px;
  border-radius: 10px;
  background: ${theme.colors.gray[100]};
`;
export const ViewButton = styled.button<{ $active: boolean }>`
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 6px;
  background: ${({ $active }) =>
    $active ? theme.colors.gray[0] : "transparent"};
  cursor: pointer;
  img {
    display: block;
  }
`;
export const ZoneList = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 16px 20px 0;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
export const ZoneButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 8px 12px;
  border: 1px solid
    ${({ $active }) =>
      $active ? theme.colors.gray[900] : theme.colors.gray[200]};
  border-radius: 20px;
  background: ${({ $active }) =>
    $active ? theme.colors.gray[900] : theme.colors.gray[0]};
  color: ${({ $active }) =>
    $active ? theme.colors.gray[0] : theme.colors.gray[700]};
  white-space: nowrap;
  ${theme.typography.label1};
  cursor: pointer;
`;
export const AvailableCount = styled.span<{ $empty: boolean }>`
  color: ${({ $empty }) =>
    $empty ? theme.colors.gray[500] : theme.colors.sky[500]};
`;
export const TotalCount = styled.span`
  color: ${theme.colors.gray[700]};
`;
export const BoardViewport = styled.section`
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 12px 20px 20px;
  background: ${theme.colors.gray[50]};
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
export const Board = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 90px);
  grid-auto-rows: 100px;
  gap: 8px;
  width: max-content;
`;
export const LockerButton = styled.button<{
  $selected: boolean;
  $status: "available" | "rented" | "unavailable";
  $row?: number;
  $column?: number;
}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  grid-row: ${({ $row }) => $row ?? "auto"};
  grid-column: ${({ $column }) => $column ?? "auto"};
  width: 90px;
  height: 100px;
  padding: 8px 12px 12px;
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: 8px;
  background: ${({ $selected, $status }) =>
    $selected
      ? theme.colors.sky[50]
      : $status === "available"
        ? theme.colors.gray[0]
        : theme.colors.gray[100]};
  color: ${({ $selected, $status }) =>
    $selected
      ? theme.colors.sky[500]
      : $status === "available"
        ? theme.colors.gray[900]
        : theme.colors.gray[700]};
  box-shadow: ${({ $selected }) =>
    $selected ? `inset 0 0 0 1px ${theme.colors.sky[500]}` : "none"};
  border-color: ${({ $selected }) =>
    $selected ? theme.colors.sky[500] : theme.colors.gray[200]};
  text-align: left;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.sky[700]};
    outline-offset: 2px;
  }
`;
export const LockerNumber = styled.span`
  ${theme.typography.heading1};
`;
export const LockerStatus = styled.span<{ $available: boolean }>`
  color: ${({ $available }) =>
    $available ? theme.colors.sky[500] : theme.colors.gray[500]};
  white-space: nowrap;
  ${theme.typography.label3};
`;
export const EmptyMessage = styled.p`
  padding: 48px 0;
  color: ${theme.colors.gray[700]};
  text-align: center;
  ${theme.typography.body2};
`;
