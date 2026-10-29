import styled from "@emotion/styled";
import { theme } from "../../../common/styles/theme";

export const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 24px;
`;

export const ResultItem = styled.button<{ searching: boolean }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border: 0;
  border-radius: 12px;
  background: ${({ searching }) =>
    searching ? theme.colors.gray[50] : theme.colors.sky[50]};
  color: ${({ searching }) =>
    searching ? theme.colors.gray[700] : theme.colors.sky[500]};
  text-align: left;
  cursor: pointer;
  transition:
    background-color 200ms ease,
    color 200ms ease;
`;

export const ResultIcon = styled.img`
  display: block;
  width: 20px;
  height: 20px;
  flex: none;
`;

export const ResultName = styled.span`
  min-width: 0;
  overflow: hidden;
  font-size: ${theme.typography.label1.fontSize};
  font-weight: ${theme.typography.label1.fontWeight};
  line-height: ${theme.typography.label1.lineHeight};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MatchText = styled.span`
  color: ${theme.colors.sky[500]};
`;
