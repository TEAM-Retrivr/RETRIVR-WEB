import styled from "@emotion/styled";
import { theme } from "../../../../common/styles/theme";

export const Wrapper = styled.div`
  width: 350px;
  height: 191px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 16px 20px 16px;
  background-color: ${theme.colors.sky[50]};
  border: 1px solid;
  border-color: ${theme.colors.sky[100]};
  border-radius: 16px;
`;

export const ItemInformationSection = styled.div`
  height: 56px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ItemName = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.heading2.fontSize};
  font-weight: ${theme.typography.heading2.fontWeight};
  line-height: ${theme.typography.heading2.lineHeight};
  color: ${theme.colors.gray[900]};
`;

export const ItemDescription = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.body2.fontSize};
  font-weight: ${theme.typography.body2.fontWeight};
  line-height: ${theme.typography.body2.lineHeight};
  color: ${theme.colors.gray[700]};
`;

export const Border = styled.div`
  width: 100%;
  height: 1px;
  border: 0.5px solid;
  border-color: ${theme.colors.sky[100]};
`;

export const RentalInformationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const LabelSection = styled.div`
  display: flex;
  gap: 12px;
`;

export const Label = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.label2.fontSize};
  font-weight: ${theme.typography.label2.fontWeight};
  line-height: ${theme.typography.label2.lineHeight};
  color: ${theme.colors.gray[700]};
`;
export const Key = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.label2.fontSize};
  font-weight: ${theme.typography.label2.fontWeight};
  line-height: ${theme.typography.label2.lineHeight};
  color: ${theme.colors.gray[900]};
`;

export const KeyWrapper = styled.div`
  display: flex;
  gap: 4px;
`;
export const DurationRange = styled.span`
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.label2.fontSize};
  font-weight: ${theme.typography.label2.fontWeight};
  line-height: ${theme.typography.label2.lineHeight};
  color: ${theme.colors.gray[500]};
`;
