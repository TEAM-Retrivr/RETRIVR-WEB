import styled from "@emotion/styled";
import { theme } from "../../../common/styles/theme";

export const Padding = styled.div`
  padding: 12px 20px 0 20px;
`;

export const Border = styled.div`
  width: 100%;
  height: 8px;
  flex-shrink: 0;
  background-color: ${theme.colors.gray[100]};
`;

export const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 30px 20px 32px;
`;

export const FormTitleSection = styled.div`
  width: 350px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.span`
  font-family: ${theme.fontFamily.primary};
  color: ${theme.colors.gray[900]};
  ${theme.typography.heading3};
`;

export const RequiredMessage = styled.span`
  color: ${theme.colors.sky[500]};
  ${theme.typography.label3};
`;
export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const MembershipNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 78px;
  font-family: ${theme.fontFamily.primary};
  color: ${theme.colors.gray[700]};
  ${theme.typography.body3};

  button {
    border: 0;
    padding: 4px;
    background: transparent;
    color: ${theme.colors.sky[700]};
    cursor: pointer;
  }
`;

export const ConsentSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
`;

export const Message = styled.span`
  width: 100%;
  text-align: center;
  padding-top: 8px;
  ${theme.typography.label1}
  color: ${theme.colors.sky[500]}
`;
export const ButtonSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 20px 20px 20px;
`;

export const SubmitFeedback = styled.p`
  margin: 0 0 12px;
  color: ${theme.colors.red};
  font-family: ${theme.fontFamily.primary};
  ${theme.typography.body2};
`;
