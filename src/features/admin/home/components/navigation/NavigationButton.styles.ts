import styled from "@emotion/styled";
import { theme } from "../../../../common/styles/theme";

export const Button = styled.button`
  width: 171px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  border-color: ${theme.colors.gray[200]};
  border-radius: 20px;
  cursor: pointer;
`;

export const ButtonLabel = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.button.medium.fontSize};
  font-weight: ${theme.typography.button.medium.fontWeight};
  line-height: ${theme.typography.button.medium.lineHeight};
  white-space: nowrap;
`;
