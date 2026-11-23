import styled from "@emotion/styled";
import { theme } from "../../../common/styles/theme";
import RentalConsentCard from "../../rent/submit/components/cards/RentalConsentCard";

export const RequestForm = styled.form`
  width: 100%;
`;
export const SummaryArea = styled.div`
  padding: 8px 20px 0;
`;
export const Summary = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid ${theme.colors.sky[100]};
  border-radius: 16px;
  background: ${theme.colors.sky[50]};
  h2 {
    margin: 0;
    opacity: 0.9;
    ${theme.typography.heading2};
  }
`;
export const SummaryDetails = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding-top: 16px;
  border-top: 1px solid ${theme.colors.sky[100]};
  ${theme.typography.label2};
  div {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
  dt {
    flex-shrink: 0;
    color: ${theme.colors.gray[700]};
    opacity: 0.9;
  }
  dd {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin: 0;
  }
  span {
    color: ${theme.colors.gray[500]};
  }
`;
export const BorrowerSection = styled.section`
  padding: 30px 20px 28px;
`;
export const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  h2 {
    margin: 0;
    ${theme.typography.heading3};
  }
  span {
    color: ${theme.colors.sky[500]};
    ${theme.typography.label3};
  }
`;
export const Fields = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
`;
export const ConsentSection = styled.section`
  padding: 12px 20px 8px;
  border-top: 8px solid ${theme.colors.gray[200]};
  h2 {
    margin: 0 0 12px;
    ${theme.typography.heading3};
  }
`;
export const ConsentCard = styled(RentalConsentCard)`
  width: 100%;
`;
export const ApprovalNotice = styled.p`
  margin: 16px 0 0;
  color: ${theme.colors.sky[500]};
  text-align: center;
  ${theme.typography.label1};
`;
export const SubmitError = styled.p`
  margin: 12px 20px 0;
  color: ${theme.colors.red};
  ${theme.typography.body2};
`;
