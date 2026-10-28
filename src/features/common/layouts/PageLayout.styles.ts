import styled from "@emotion/styled";
import { theme } from "../styles/theme";

export const PageViewport = styled.div`
  display: grid;
  min-height: 100vh;
  min-height: 100dvh;
  place-items: center;
  background-color: ${theme.colors.gray[100]};
`;

export const PageFrame = styled.main`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(390px, 100%);
  height: min(844px, 100vh);
  height: min(844px, 100dvh);
  overflow-y: auto;
  background-color: ${theme.colors.gray[0]};
  border: 0.5px solid;
  border-color: ${theme.colors.gray[200]};
`;
