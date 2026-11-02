import styled from "@emotion/styled";
import { theme } from "../../../../features/common/styles/theme";

export type ManagementStatus =
  | "rentalAvailable"
  | "rentedOut"
  | "rentalUnavailable";

// 기존 관리자 화면의 색상과 크기는 유지하고 스타일 정의만 Emotion으로 이관한다.
const managementColors = {
  white: "#FFFFFF",
  text: "#4F4F4F",
  muted: "#CDD6DE",
  primary: "#76ADFF",
} as const;

export const ManagementCard = styled.div<{ $status: ManagementStatus }>`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 302px;
  height: 54px;
  padding: 16px 20px;
  border-radius: 20px;
  background-color: ${({ $status }) =>
    $status === "rentedOut" ? managementColors.muted : managementColors.white};
  opacity: ${({ $status }) => ($status === "rentedOut" ? 0.4 : 1)};
  box-shadow: 0 0 6px 0 rgb(0 0 0 / 14%);
  font-family: ${theme.fontFamily.primary};
  cursor: pointer;
`;

export const ManagementItemText = styled.div`
  min-width: 0;
  flex: 1;
`;

export const ManagementItemName = styled.p<{ $status: ManagementStatus }>`
  width: 160px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: ${({ $status }) =>
    $status === "rentedOut" ? managementColors.white : managementColors.text};
`;

export const ManagementStatusButton = styled.button<{
  $status: ManagementStatus;
}>`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 34px;
  padding: 12px 10px;
  border: 0;
  border-radius: 15px;
  background-color: ${({ $status }) =>
    $status === "rentalAvailable"
      ? managementColors.primary
      : $status === "rentedOut"
        ? managementColors.white
        : managementColors.muted};
  cursor: ${({ $status }) => ($status === "rentedOut" ? "inherit" : "pointer")};
`;

export const ManagementStatusLabel = styled.p<{ $status: ManagementStatus }>`
  width: 160px;
  margin: 0;
  font-family: ${theme.fontFamily.primary};
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  color: ${({ $status }) =>
    $status === "rentedOut" ? managementColors.muted : managementColors.white};
`;

export const RentalOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  border: 0;
  background: ${({ $selected }) =>
    $selected ? theme.colors.sky[50] : theme.colors.gray[0]};
  color: ${({ $selected }) =>
    $selected ? theme.colors.sky[500] : theme.colors.gray[900]};
  font-family: ${theme.fontFamily.primary};
  text-align: left;
  cursor: pointer;
  &:disabled {
    background: ${theme.colors.gray[50]};
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.sky[500]};
    outline-offset: -2px;
  }
`;
export const RentalOptionName = styled.span<{ $selected: boolean }>`
  min-width: 0;
  flex: 1;
  overflow-wrap: anywhere;
  ${theme.typography.body1};
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
`;
export const RentalOptionStatus = styled.span<{ $unavailable: boolean }>`
  flex-shrink: 0;
  ${theme.typography.label2};
  color: ${({ $unavailable }) =>
    $unavailable ? theme.colors.gray[500] : theme.colors.sky[500]};
`;
