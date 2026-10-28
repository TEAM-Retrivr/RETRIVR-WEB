import styled from "@emotion/styled";
import { theme } from "../../../../common/styles/theme";

export const Title = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.heading2.fontSize};
  font-weight: ${theme.typography.heading2.fontWeight};
  line-height: ${theme.typography.heading2.lineHeight};
  white-space: nowrap;
`;

export const ChipGroup = styled.div`
  display: flex;
  gap: 6px;
`;

export const ShortcutSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  padding-top: 9px;
  background-color: ${theme.colors.gray[100]};
`;

export const ShortcutChipSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 20px 16px 20px;
  background-color: ${theme.colors.gray[0]};
`;

export const ShortcutResult = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  padding-top: 16px;
  gap: 12px;
  background-color: ${theme.colors.gray[100]};
`;

export const NoShortcutResult = styled.span`
  padding-top: 64px;
  text-align: center;
  color: ${theme.colors.gray[500]};
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.heading2.fontSize};
  font-weight: ${theme.typography.heading2.fontWeight};
  line-height: ${theme.typography.heading2.lineHeight};
`;
