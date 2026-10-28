import styled from "@emotion/styled";
import { theme } from "../../../../common/styles/theme";

export const Description = styled.section`
  width: 350px;
  min-height: 124px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const AdminInfoSection = styled.div`
  display: flex;
  gap: 16px;
  width: full;
  height: 52px;
  align-items: center;
`;
export const IconSection = styled.div`
  display: flex;
  justify-content: center;
  align-tiems: center;
  cover: object-fit;
  width: 52px;
  height: 52px;

  border: 1px solid;
  border-radius: 100%;
  border-color: #e5e8eb;
`;

export const NameSection = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.heading2.fontSize};
  font-weight: ${theme.typography.heading2.fontWeight};
  line-height: ${theme.typography.heading2.lineHeight};
  color: ${theme.colors.gray[900]}
  white-space: nowrap;
`;

export const DescriptionSection = styled.div`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.body2.fontSize};
  font-weight: ${theme.typography.body2.fontWeight};
  line-height: ${theme.typography.body2.lineHeight};
  color: ${theme.colors.gray[900]}
  white-space: nowrap;
  background-color: ${theme.colors.gray[50]};
  width: full;
  height: auto;
  padding: 10px 12px;
  border: none;
  border-radius: 12px;
  
`;
