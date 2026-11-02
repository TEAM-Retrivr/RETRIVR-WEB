import styled from "@emotion/styled";
import { theme } from "../../styles/theme";

export const HeaderWrapper = styled.header`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: start;
  gap: 12px;
  padding: 8px 52px 8px 16px;
`;

export const IconSlot = styled.button`
  cursor: pointer;
`;

export const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

export const InformationSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export const PlaceName = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.label3.fontSize};
  font-weight: ${theme.typography.label3.fontWeight};
  line-height: ${theme.typography.label3.lineHeight};
  white-space: nowrap;
  color: ${theme.colors.gray[700]};
`;

export const PageName = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.heading3.fontSize};
  font-weight: ${theme.typography.heading3.fontWeight};
  line-height: ${theme.typography.heading3.lineHeight};
  white-space: nowrap;
  color: ${theme.colors.gray[900]};
`;
