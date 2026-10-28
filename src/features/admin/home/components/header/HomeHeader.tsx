import type { ReactNode } from "react";
import { Header } from "./HomeHeader.styles";

type HeaderProps = {
  icon: ReactNode;
};
export const HomeHeader = ({ icon }: HeaderProps) => {
  return <Header>{icon}</Header>;
};
