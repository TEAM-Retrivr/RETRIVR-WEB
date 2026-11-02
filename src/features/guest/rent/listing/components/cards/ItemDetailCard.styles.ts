import styled from "@emotion/styled";
import { theme } from "../../../../../common/styles/theme";
export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;
export const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
export const Text = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
`;
export const Name = styled.h1`
  margin: 0;
  font-family: ${theme.fontFamily.primary};
  ${theme.typography.heading1};
  color: ${theme.colors.gray[900]};
  overflow-wrap: anywhere;
`;
export const Description = styled.p`
  margin: 0;
  font-family: ${theme.fontFamily.primary};
  ${theme.typography.body2};
  color: ${theme.colors.gray[700]};
  overflow-wrap: anywhere;
`;
export const Divider = styled.img`
  display: block;
  max-width: 100%;
`;
export const Information = styled.dl`
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 4px 12px;
  margin: 0;
  font-family: ${theme.fontFamily.primary};
  ${theme.typography.label1};
  dt {
    color: ${theme.colors.gray[700]};
  }
  dd {
    margin: 0;
    color: ${theme.colors.gray[900]};
    overflow-wrap: anywhere;
  }
`;
