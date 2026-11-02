import styled from "@emotion/styled";
import { theme } from "../../styles/theme";
export const OrganizationSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  font-family: ${theme.fontFamily.primary};
`;
export const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 52px;
`;
export const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 52px;
  width: 52px;
  height: 52px;
  overflow: hidden;
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: 50%;
  background: ${theme.colors.gray[0]};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
export const Name = styled.h1`
  min-width: 0;
  margin: 0;
  ${theme.typography.heading2};
  color: ${theme.colors.gray[900]};
  overflow-wrap: anywhere;
`;
export const Description = styled.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${theme.colors.gray[50]};
  ${theme.typography.body2};
  color: ${theme.colors.gray[900]};
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;
