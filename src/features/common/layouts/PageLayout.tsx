import type { ReactNode } from "react";
import { PageFrame, PageViewport } from "./PageLayout.styles";

type PageLayoutProps = {
  children: ReactNode;
};

export const PageLayout = ({ children }: PageLayoutProps) => (
  <PageViewport>
    <PageFrame>{children}</PageFrame>
  </PageViewport>
);
