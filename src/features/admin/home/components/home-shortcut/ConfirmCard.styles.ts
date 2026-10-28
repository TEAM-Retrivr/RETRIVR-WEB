import styled from "@emotion/styled";
import { theme } from "../../../../common/styles/theme";

export const ConfirmCardSection = styled.div`
  width: 350px;
  height: 108px;
  padding: 20px 20px 16px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  background-color: ${theme.colors.gray[0]};
`;

export const Information = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ItemDetails = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  padding-bottom: 6px;
  gap: 8px;
`;

export const ItemType = styled.span`
  padding: 3px 6px 3px 6px;
  border-radius: 6px;
  text-align: center;
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.label3.fontSize};
  font-weight: ${theme.typography.label3.fontWeight};
  line-height: ${theme.typography.label3.lineHeight};
  color: ${theme.colors.sky[500]};
  background-color: ${theme.colors.sky[50]};
`;

export const ExpiredAt = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.label3.fontSize};
  font-weight: ${theme.typography.label3.fontWeight};
  line-height: ${theme.typography.label3.lineHeight};
  color: ${theme.colors.sky[700]};
`;

export const ItemName = styled.span`
  text-align: start;
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.heading3.fontSize};
  font-weight: ${theme.typography.heading3.fontWeight};
  line-height: ${theme.typography.heading3.lineHeight};
  color: ${theme.colors.gray[900]};
`;

export const ContactDetails = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Name = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.label2.fontSize};
  font-weight: ${theme.typography.label2.fontWeight};
  line-height: ${theme.typography.label2.lineHeight};
  color: ${theme.colors.gray[700]};
`;

export const Dot = styled.div`
  width: 3px;
  height: 3px;
  background-color: #e5e8eb;
  border-radius: 100%;
`;

export const Contact = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.label2.fontSize};
  font-weight: ${theme.typography.label2.fontWeight};
  line-height: ${theme.typography.label2.lineHeight};
  color: ${theme.colors.gray[700]};
`;

export const ConfirmButton = styled.button`
  width: 88px;
  height: 40px;
  text-align: center;
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.button.medium.fontSize};
  font-weight: ${theme.typography.button.medium.fontWeight};
  line-height: ${theme.typography.button.medium.lineHeight};
  color: ${theme.colors.gray[0]};
  background-color: ${theme.colors.sky[500]};
  border-radius: 20px;
  cursor: pointer;
`;
