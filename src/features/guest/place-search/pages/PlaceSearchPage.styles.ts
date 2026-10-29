import styled from "@emotion/styled";
import { theme } from "../../../common/styles/theme";

export const SearchSurface = styled.div`
  position: relative;
  flex: 1;
  min-height: 100%;
  overflow: hidden;
  background: linear-gradient(
    155deg,
    ${theme.colors.gray[0]} 1%,
    ${theme.colors.sky[50]} 99%
  );
  font-family: ${theme.fontFamily.primary};

  @media (prefers-reduced-motion: reduce) {
    & * {
      transition: none !important;
    }
  }
`;

export const Intro = styled.div<{ searching: boolean }>`
  position: relative;
  z-index: 1;
  height: ${({ searching }) => (searching ? "0" : "176px")};
  overflow: hidden;
  opacity: ${({ searching }) => (searching ? 0 : 1)};
  transition:
    height 320ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 180ms ease;
`;

export const Heading = styled.h1`
  margin: 24px 20px 0;
  color: ${theme.colors.gray[900]};
  font-size: ${theme.typography.heading1.fontSize};
  font-weight: ${theme.typography.heading1.fontWeight};
  line-height: ${theme.typography.heading1.lineHeight};
`;

const searchField = `
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  border: 0;
  border-radius: 99px;
  background: ${theme.colors.gray[100]};
`;

export const Mascot = styled.img`
  position: absolute;
  right: 0;
  bottom: -5px;
  width: 293px;
  height: 283px;
  pointer-events: none;
`;

export const SearchContent = styled.div<{ searching: boolean }>`
  position: relative;
  z-index: 1;
  padding: ${({ searching }) => (searching ? "24px" : "0")} 20px 0;
  transition: padding-top 320ms cubic-bezier(0.22, 1, 0.36, 1);
`;

export const SearchBar = styled.div`
  ${searchField}
  gap: 8px;
  cursor: text;
`;

export const SearchToolButton = styled.button<{ searching: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ searching }) => (searching ? "24px" : "20px")};
  height: 24px;
  flex: none;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  transition: width 320ms cubic-bezier(0.22, 1, 0.36, 1);

  img {
    position: absolute;
    display: block;
    transition: opacity 160ms ease;
  }

  .search-icon {
    width: 20px;
    height: 20px;
    opacity: ${({ searching }) => (searching ? 0 : 1)};
  }

  .back-icon {
    width: 24px;
    height: 24px;
    opacity: ${({ searching }) => (searching ? 1 : 0)};
  }
`;

export const SearchInput = styled.input`
  min-width: 0;
  height: 24px;
  flex: 1;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${theme.colors.gray[900]};
  font-family: ${theme.fontFamily.primary};
  font-size: ${theme.typography.body1.fontSize};
  font-weight: ${theme.typography.body1.fontWeight};
  line-height: ${theme.typography.body1.lineHeight};

  &::placeholder {
    color: ${theme.colors.gray[700]};
    opacity: 1;
  }

  &::-webkit-search-cancel-button {
    display: none;
  }
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex: none;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;

  img {
    display: block;
    width: 20px;
    height: 20px;
  }
`;

export const SearchMessage = styled.p`
  margin: 36px 0 0;
  color: ${theme.colors.gray[700]};
  font-size: ${theme.typography.label1.fontSize};
  font-weight: ${theme.typography.label1.fontWeight};
  line-height: ${theme.typography.label1.lineHeight};
  text-align: center;
`;
