import styled from "@emotion/styled";
import { theme } from "../../styles/theme";

export const Wrapper = styled.div`
  position: relative;
  flex: 0 0 56px;
  width: 56px;
  height: 56px;

  svg {
    display: block;
  }
`;

export const Label = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.fontFamily.primary};
  ${theme.typography.label3};
  color: ${theme.colors.gray[500]};

  strong {
    font-weight: inherit;
    color: ${theme.colors.sky[500]};
  }
`;

export const Track = styled.circle`
  fill: none;
  stroke: ${theme.colors.gray[100]};
  stroke-width: 6;
`;

export const Progress = styled.circle<{ $ratio: number }>`
  fill: none;
  stroke: ${theme.colors.sky[500]};
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 100 100;
  /* 12시부터 시계방향으로 빈 구간이 늘어나도록 시작점을 이동한다. */
  stroke-dashoffset: ${({ $ratio }) => -100 * (1 - $ratio)};
`;
