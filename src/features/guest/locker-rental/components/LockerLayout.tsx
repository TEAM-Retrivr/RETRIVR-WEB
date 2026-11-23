import type { ReactNode } from "react";
import styled from "@emotion/styled";
import {
  PageFrame,
  PageViewport,
} from "../../../common/layouts/PageLayout.styles";
import { theme } from "../../../common/styles/theme";

const Frame = styled(PageFrame)<{ $scrollable: boolean }>`
  border: 0;
  overflow: ${({ $scrollable }) => ($scrollable ? "auto" : "hidden")};
  font-family: ${theme.fontFamily.primary};
  color: ${theme.colors.gray[900]};
  letter-spacing: 0;
  & > * {
    flex-shrink: 0;
  }
`;

export const LockerLayout = ({
  children,
  scrollable = false,
}: {
  children: ReactNode;
  scrollable?: boolean;
}) => (
  <PageViewport>
    <Frame $scrollable={scrollable}>{children}</Frame>
  </PageViewport>
);
