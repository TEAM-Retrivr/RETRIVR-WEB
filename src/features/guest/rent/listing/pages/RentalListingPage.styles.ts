import styled from "@emotion/styled";
import { theme } from "../../../../common/styles/theme";
export const Surface = styled.div`
  flex: 1;
  min-height: 100%;
  background: ${theme.colors.gray[100]};
`;
export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  background: ${theme.colors.gray[0]};
`;
export const OrganizationSection = styled.div`
  padding: 8px 20px 20px;
  background: ${theme.colors.gray[0]};
`;
export const StickyTabs = styled.div`
  position: sticky;
  top: 60px;
  z-index: 2;
`;
export const PanelViewport = styled.div`
  overflow: hidden;
  background: ${theme.colors.gray[100]};
`;
export const PanelTrack = styled.div<{ $index: number }>`
  display: flex;
  align-items: flex-start;
  width: 200%;
  transform: translateX(${({ $index }) => -$index * 50}%);
  transition: transform 0.5s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
export const Panel = styled.section`
  flex: 0 0 50%;
  width: 50%;
  min-width: 0;
  padding: 20px;
`;
export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const Message = styled.div`
  padding: 32px 0;
  text-align: center;
  font-family: ${theme.fontFamily.primary};
  ${theme.typography.body2};
  color: ${theme.colors.gray[700]};
  p {
    margin: 0 0 12px;
  }
`;
export const Retry = styled.button`
  padding: 8px 12px;
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: 12px;
  background: ${theme.colors.gray[0]};
  color: ${theme.colors.sky[700]};
  font-family: ${theme.fontFamily.primary};
  ${theme.typography.label2};
  cursor: pointer;
  &:disabled {
    cursor: wait;
  }
`;
