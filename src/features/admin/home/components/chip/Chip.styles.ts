import styled from "@emotion/styled";
import { theme } from "../../../../common/styles/theme";

export const ChipButton = styled.button`
  width: 111px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  background-color: ${theme.colors.gray[0]};
  color: ${theme.colors.gray[700]};
  border: 1px solid;
  border-color: ${theme.colors.gray[200]};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:focus {
    background-color: ${theme.colors.gray[900]};
    color: ${theme.colors.gray[0]};
    border: none;
  }
`;

export const ChipTitle = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.label1.fontSize};
  font-weight: ${theme.typography.label1.fontWeight};
  line-height: ${theme.typography.label1.lineHeight};
  white-space: nowrap;
  color: inherit;
`;

export const ChipCount = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.label1.fontSize};
  font-weight: ${theme.typography.label1.fontWeight};
  line-height: ${theme.typography.label1.lineHeight};
  white-space: nowrap;
  color: ${theme.colors.sky[500]};
`;

export const ChipNoCount = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.label1.fontSize};
  font-weight: ${theme.typography.label1.fontWeight};
  line-height: ${theme.typography.label1.lineHeight};
  white-space: nowrap;
  color: ${theme.colors.gray[500]};
`;
