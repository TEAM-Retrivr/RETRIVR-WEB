import styled from "@emotion/styled";
import { theme } from "../../../../common/styles/theme";

export const CardButton = styled.button`
  display: flex;
  width: 112px;
  height: 82px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  background-color: ${theme.colors.gray[50]};
  color: ${theme.colors.gray[900]};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: ${theme.colors.gray[200]};
  }
`;

export const IconSlot = styled.span`
  display: flex;
  width: 32px;
  height: 32px;
  flex: none;
  align-items: center;
  justify-content: center;

  & > img,
  & > svg {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
`;

export const CardLabel = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.button.medium.fontSize};
  font-weight: ${theme.typography.button.medium.fontWeight};
  line-height: ${theme.typography.button.medium.lineHeight};
  white-space: nowrap;
`;
