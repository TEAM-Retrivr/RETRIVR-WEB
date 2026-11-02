import styled from "@emotion/styled";
import { theme } from "../../../../../common/styles/theme";
export const Bar = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  background: ${theme.colors.gray[0]};
`;
export const Indicator = styled.span<{ $index: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 1px;
  background: ${theme.colors.sky[500]};
  transform: translateX(${({ $index }) => $index * 100}%);
  transition: transform 0.5s ease;
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
