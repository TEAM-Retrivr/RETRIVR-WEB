import styled from "@emotion/styled";
import { theme } from "../../../../../common/styles/theme";
import checkboxChecked from "../../assets/checkbox-checked.svg";
import checkboxUnchecked from "../../assets/checkbox-unchecked.svg";

export const Wrapper = styled.div`
  width: 350px;
  min- height: 120px;
  display: flex;
  gap: 11px;
  padding: 16px;
  background-color: ${theme.colors.sky[50]};
  border: 1px solid;
  border-color: ${theme.colors.sky[100]};
  border-radius: 12px;
`;

export const CheckBox = styled.input`
  appearance: none;
  -webkit-appearance: none;
  display: block;
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  margin: 2px 0;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: url(${checkboxUnchecked}) center / 20px 20px no-repeat;
  cursor: pointer;

  &:checked {
    background-image: url(${checkboxChecked});
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.sky[500]};
    outline-offset: 3px;
  }

  @media (forced-colors: active) {
    appearance: auto;
    -webkit-appearance: auto;

    &,
    &:checked {
      background-image: none;
    }
  }
`;

export const DescriptionSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 4px;
`;

export const Title = styled.span`
  ${theme.typography.label1}
  color: ${theme.colors.gray[900]}
`;

export const Description = styled.span`
  ${theme.typography.body2}
  color: ${theme.colors.gray[700]};
  overflow-wrap: anywhere;
  white-space: pre-line;
`;
