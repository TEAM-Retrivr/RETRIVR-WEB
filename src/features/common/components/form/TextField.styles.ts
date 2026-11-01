import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { theme } from "../../styles/theme";

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 0;
  font-family: ${theme.fontFamily.primary};
`;

export const FieldHeader = styled.div<{ $hidden: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 20px;

  ${({ $hidden }) =>
    $hidden &&
    css`
      position: absolute;
      width: 1px;
      height: 1px;
      min-height: 0;
      padding: 0;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    `};
`;

export const FieldLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: ${theme.colors.gray[900]};
  ${theme.typography.label2};
`;

export const RequiredMark = styled.span`
  color: ${theme.colors.sky[500]};
`;

export const Hint = styled.span`
  color: ${theme.colors.gray[700]};
  ${theme.typography.body3};
`;

export const Control = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  min-height: 48px;
  border-radius: 12px;
  background-color: ${theme.colors.gray[100]};

  &:focus-within {
    outline: 1px solid ${theme.colors.gray[200]};
  }
`;

const controlStyles = css`
  box-sizing: border-box;
  display: block;
  flex: 1;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 12px 16px;
  border: 0;
  border-radius: 12px;
  outline: none;
  background: transparent;
  font-family: ${theme.fontFamily.primary};
  color: ${theme.colors.gray[900]};
  ${theme.typography.body1};

  &::placeholder {
    color: ${theme.colors.gray[500]};
    opacity: 1;
  }

  &:disabled {
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  ${controlStyles};
  height: 48px;
`;

export const Textarea = styled.textarea`
  ${controlStyles};
  min-height: 48px;
  resize: none;
`;

export const Adornment = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding-right: 6px;
`;
